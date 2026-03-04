// ════════════════════════════════════════════════
// STAGE PAGEshared logic for stage2~5
// ════════════════════════════════════════════════

function initStage(stageId) {
  const m = MODULES.find(x => x.id === stageId);
  if (!m) {
    document.getElementById('stage-content').innerHTML = '<p style="color:var(--text-muted)">콘텐츠를 찾을 수 없습니다.</p>';
    return;
  }

  // Mark done state in header title
  const progress = load('ps_progress') || {};
  const done = !!progress[stageId];

  // Render section header
  const numEl = document.getElementById('stage-num');
  const titleEl = document.getElementById('stage-title');
  const subtitleEl = document.getElementById('stage-subtitle');
  if (numEl) numEl.textContent = `${m.step}단계`;
  if (titleEl) titleEl.textContent = m.title;
  if (subtitleEl) subtitleEl.textContent = m.desc;

  // Page title
  document.title = `${m.step}단계: ${m.shortTitle} | AI-Native 문제해결력`;

  // Render main content
  document.getElementById('stage-content').innerHTML = buildStageHTML(m, done);

  // Render navigation
  renderStageNav(stageId);

  // Scroll progress bar
  initScrollProgress();

  // Stepper active state via IntersectionObserver
  initStepperObserver();
}

function initScrollProgress() {
  const bar = document.getElementById('stage-scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.round(scrollTop / docHeight * 100) : 0;
    bar.style.width = pct + '%';
  }, {passive: true});
}

function initStepperObserver() {
  const stepper = document.querySelector('.stage-stepper');
  if (!stepper || !window.IntersectionObserver) return;
  const sections = document.querySelectorAll('[id^="s-"], #stage-complete-section');
  if (!sections.length) return;

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        stepper.querySelectorAll('.stepper-step').forEach(function(link) {
          const target = link.getAttribute('href');
          const dot = link.querySelector('.stepper-dot');
          if (target === '#' + id) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    });
  }, {rootMargin: '-20% 0px -60% 0px'});

  sections.forEach(function(s) { observer.observe(s); });
}

// ════════════════════════════════════════════════
// BUILD STAGE HTML
// ════════════════════════════════════════════════
function buildStageHTML(m, done) {
  const stepperItems = [
    {label:'역할 비율', id:'s-ratio'},
    {label:'시나리오', id:'s-scenario'},
    ...(m.researchInsights ? [{label:'AI 원리', id:'s-research'}] : []),
    {label:'시간 비교', id:'s-compare'},
    {label:'실습', id:'s-prompts'},
    ...(m.quiz ? [{label:'퀴즈', id:'s-quiz'}] : []),
    {label:'함정', id:'s-pitfalls'},
    {label:'도전', id:'s-template'},
    {label:'완료', id:'stage-complete-section'}
  ];

  return `

  ${m.learningObjective ? `
  <div class="stage-objective">
    <div class="stage-objective-icon">🎯</div>
    <div class="stage-objective-body">
      <div class="stage-objective-label">이 단계를 마치면</div>
      <div class="stage-objective-text">${m.learningObjective}</div>
    </div>
  </div>` : ''}

  ${!m.hideStepper ? `<!-- Section Stepper -->
  <div class="stage-stepper">
    ${stepperItems.map((s, i) => `
      <div class="stepper-item">
        ${i > 0 ? '<div class="stepper-line"></div>' : ''}
        <a class="stepper-step" href="#${s.id}" data-section="${s.id}">
          <div class="stepper-dot">${i + 1}</div>
          <div class="stepper-label">${s.label}</div>
        </a>
      </div>`).join('')}
  </div>` : ''}

  <!-- 0. 학습 목표 -->
  ${m.learningGoals ? `
  <div class="learning-goals-box">
    <div class="learning-goals-header">
      <span class="learning-goals-icon">🎯</span>
      <strong>이 단계를 마치면</strong>
      ${m.difficulty ? `<span class="difficulty-badge">${m.difficulty}</span>` : ''}
    </div>
    <ul class="learning-goals-list">
      ${m.learningGoals.map(g => `<li>${g}</li>`).join('')}
    </ul>
  </div>` : ''}

  <!-- Ratio -->
  <div class="stage-section" id="s-ratio">
    <div class="stage-ratio-wrap">
      <div class="stage-ratio-header">
        <span class="stage-ratio-title">이 단계에서 AI와 나의 역할 비율</span>
      </div>
      <div class="stage-ratio-bar">
        <div class="stage-ratio-ai" style="width:${m.ratio.ai}%">
          <span class="stage-ratio-bar-label">${m.ratio.ai > 15 ? '🤖 AI ' + m.ratio.ai + '%' : ''}</span>
        </div>
        <div class="stage-ratio-human" style="width:${m.ratio.human}%">
          <span class="stage-ratio-bar-label">${m.ratio.human > 15 ? '🧠 나 ' + m.ratio.human + '%' : ''}</span>
        </div>
      </div>
      <div class="stage-ratio-desc">
        <span class="ratio-ai-label">🤖 AI : 정보 수집·정리·초안 생성</span>
        <span class="ratio-human-label">🧠 나 : 질문 설계·팩트 검증·최종 판단</span>
      </div>
    </div>
  </div>

  <!-- 1. 시나리오 -->
  <div class="stage-section" id="s-scenario">
    <div class="stage-section-title">이런 상황을 상상해보세요</div>
    <div class="scenario-box">${m.scenario}</div>
    ${m.prerequisite ? `<div class="prerequisite-note">${m.prerequisite}</div>` : ''}
    <div class="scenario-industry-hint">💡 <strong>다른 업종이라면?</strong> 화장품 → 내 업종·내 상황으로 바꿔 읽어보세요. 구조는 동일하게 적용됩니다.</div>
  </div>

  <!-- Research Insights (optional) -->
  ${m.researchInsights ? `
  <div class="stage-section" id="s-research">
    <div class="stage-section-title">${m.researchInsights.title}</div>
    <div class="research-intro">
      <div class="research-source">${m.researchInsights.source}</div>
      <p class="research-desc">${m.researchInsights.desc}</p>
    </div>
    <div class="research-cards">
      ${m.researchInsights.items.map((item, ri) => `
      <div class="research-card">
        ${item.simpleTitle ? `<div class="research-simple">${item.simpleTitle}</div>` : ''}
        <div class="research-card-header">
          <span class="research-card-icon">${item.icon}</span>
          <strong>${item.title}</strong>
        </div>
        <div class="research-detail-body" id="rdb-${m.id}-${ri}">
          <div class="research-finding">
            <span class="research-label">연구 발견</span>
            ${item.finding}
          </div>
          <div class="research-implication">
            <span class="research-label">이 단계에서의 의미</span>
            ${item.implication}
          </div>
          <div class="research-action">${item.action}</div>
        </div>
        ${item.simpleTitle ? `<button class="research-detail-toggle" onclick="toggleResearchDetail('rdb-${m.id}-${ri}', this)">▾ 자세히 보기</button>` : ''}
      </div>`).join('')}
    </div>
  </div>` : ''}

  <!-- 2. Before/After -->
  <div class="stage-section" id="s-compare">
    <div class="stage-section-title">AI 없이 vs AI와 함께</div>
    ${m.timeNote ? `<div class="time-note">📌 ${m.timeNote}</div>` : ''}
    ${m.beforeMinutes && m.afterMinutes ? `
    <div class="time-visual">
      <div class="time-visual-col">
        <div class="time-visual-label">기존 방식</div>
        <div class="time-visual-bar-wrap"><div class="time-visual-bar-fill before-fill"></div></div>
        <div class="time-visual-value before-val">${m.before.total}</div>
      </div>
      <div class="time-speedup-badge">
        <div class="time-speedup-num">⚡${Math.round(m.beforeMinutes / m.afterMinutes)}배</div>
        <div class="time-speedup-txt">더 빠름</div>
      </div>
      <div class="time-visual-col">
        <div class="time-visual-label">AI 활용</div>
        <div class="time-visual-bar-wrap"><div class="time-visual-bar-fill after-fill" style="width:${Math.round(m.afterMinutes / m.beforeMinutes * 100)}%"></div></div>
        <div class="time-visual-value after-val">${m.after.total}</div>
      </div>
    </div>` : ''}
    <div class="timeline-compare">
      <div class="timeline-col before">
        <h4>기존 방식 (${m.before.total})</h4>
        ${m.before.items.map(it => `
          <div class="timeline-item-row">
            <div class="timeline-time">${it.time} · ${it.dur}</div>
            <div>${it.task}</div>
          </div>`).join('')}
        <div class="timeline-total">${m.before.total}</div>
      </div>
      <div class="timeline-col after">
        <h4>AI 활용 (${m.after.total})</h4>
        ${m.after.items.map(it => `
          <div class="timeline-item-row">
            <div class="timeline-time">${it.time} · ${it.dur}</div>
            <div>${it.task}</div>
          </div>`).join('')}
        <div class="timeline-total">${m.after.total}</div>
      </div>
    </div>
  </div>

  <!-- 2.5. 선택 가이드 (선택적) -->
  ${m.selectionGuide ? `
  <div class="stage-section">
    <div class="stage-section-title">${m.selectionGuide.title}</div>
    <div class="selection-guide-grid">
      ${m.selectionGuide.items.map(item => `
      <div class="selection-guide-item">
        <div class="selection-guide-icon">${item.icon}</div>
        <div class="selection-guide-label">${item.label}</div>
        <div class="selection-guide-desc">${item.desc}</div>
      </div>`).join('')}
    </div>
    <p class="selection-guide-tip">💡 ${m.selectionGuide.tip}</p>
  </div>` : ''}

  <!-- 3. Prompt Chain -->
  <div class="stage-section" id="s-prompts">
    <div class="stage-section-title">프롬프트 실습</div>
    <div class="prompt-explainer">
      <span class="prompt-explainer-icon">💬</span>
      <div><strong>프롬프트(Prompt)란?</strong> AI에게 보내는 지시문이에요. 아래 <strong>📋 복사</strong> 버튼을 누른 뒤 ChatGPT · Claude 등에 그대로 붙여넣으면 됩니다.</div>
    </div>
    <div class="encouragement-toast">이제 위 시나리오를 직접 해볼 차례예요.<br><span style="font-size:13px;opacity:0.85;font-weight:500">ChatGPT · Claude · Gemini 등 어떤 AI도 괜찮습니다</span></div>
    ${m.prompts.map((p, i) => `
      ${i === 1 && m.counterMetaphor ? `<div class="metaphor-box"><span class="metaphor-icon">🪞</span><p class="metaphor-text">${m.counterMetaphor}</p></div>` : ''}
      <div class="prompt-block">
        <div class="prompt-step-label">
          <span><span class="prompt-step-num">STEP ${i+1}</span>${p.step}</span>
          <span class="prompt-step-right">
            ${p.dur ? `<span class="prompt-dur">⏱ ${p.dur}</span>` : ''}
            <button class="prompt-copy-btn" onclick="copyPromptText(this, ${JSON.stringify(p.text)})">📋 복사</button>
          </span>
        </div>
        <div class="prompt-text-wrap" id="ptw-${i}">
          <div class="prompt-text prompt-preview-text">${escHtml(p.text.split('\n').slice(0, 4).join('\n'))}…</div>
          <div class="prompt-text prompt-full-text" style="display:none">${escHtml(p.text)}</div>
          <button class="prompt-toggle-btn" onclick="togglePrompt('ptw-${i}', this)">▼ 전체 프롬프트 보기</button>
        </div>
        ${p.why ? `<div class="prompt-why">💡 <strong>왜 이렇게 쓸까?</strong> : ${p.why}</div>` : ''}
        <div class="prompt-ai-btns">
          <button class="btn-open-ai btn-open-chatgpt" onclick="openInAI(${JSON.stringify(p.text)}, 'chatgpt')">ChatGPT에서 열기 ↗</button>
          <button class="btn-open-ai btn-open-claude" onclick="openInAI(${JSON.stringify(p.text)}, 'claude')">Claude에서 열기 ↗</button>
        </div>
      </div>
      <p class="prompt-hint">→ 버튼 클릭 시 프롬프트가 클립보드에 복사되고 AI 창이 열립니다</p>
    `).join('')}
  </div>

  <!-- 3.5. 퀴즈 (선택적, 실습 직후) -->
  ${m.quiz ? `
  <div class="stage-section" id="s-quiz">
    <div class="stage-section-title">✔ 이해도 확인</div>
    <p class="stage-section-subtitle">실습을 해봤다면, 핵심 개념을 잘 이해했는지 확인해보세요.</p>
    ${buildQuizHTML(m.quiz, m.id)}
  </div>` : ''}

  <!-- 4. 반복 수정 가이드 -->
  <div class="stage-section">
    <div class="stage-section-title">결과가 아쉬울 때 이렇게 수정하세요</div>
    ${m.iterations.map(it => `
      <div class="iteration-item">
        <div class="iteration-when">${it.when}</div>
        <div class="iteration-prompt-row">
          <div class="iteration-prompt">${escHtml(it.prompt)}</div>
          <button class="iteration-copy-btn" onclick="copyPromptText(this, ${JSON.stringify(it.prompt)})">📋 복사</button>
        </div>
      </div>`).join('')}
  </div>

  <!-- 5. 이것만 주의하세요 -->
  <div class="stage-section" id="s-pitfalls">
    <div class="stage-section-title">이것만 주의하세요</div>
    <div class="encouragement-toast" style="background:linear-gradient(135deg,#7c3aed,#a855f7)">AI 결과를 그대로 쓰면 안 되는 이유, 꼭 읽어보세요.</div>
    ${m.pitfalls.map(p => `
      <div class="pitfall-item">
        <span class="pitfall-icon">${p.icon}</span>
        <div class="pitfall-content">
          <strong>${p.title}</strong>
          <p>${p.desc}</p>
        </div>
      </div>`).join('')}
  </div>

  <!-- 6. 빈칸 템플릿 -->
  <!-- 학습 가이드 (Stage5 전용) -->
  ${m.storyTuningGuide ? `
  <div class="stage-section">
    <div class="stage-section-title">📝 스토리 다듬기 가이드</div>
    <p class="stage-section-subtitle">${m.storyTuningGuide.desc}</p>
    <div class="guide-cards">
      ${m.storyTuningGuide.items.map(item => `
        <div class="guide-card">
          <div class="guide-card-icon">${item.icon}</div>
          <div class="guide-card-content">
            <strong>${item.name}</strong>
            <p>${item.action}</p>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}

  ${m.assumptionGuide ? `
  <div class="stage-section">
    <div class="stage-section-title">💰 가정값 결정 기준</div>
    <p class="stage-section-subtitle">${m.assumptionGuide.desc}</p>
    <div class="assumption-table">
      ${m.assumptionGuide.items.map(item => `
        <div class="assumption-row">
          <strong>${item.metric}</strong>
          <p class="question">❓ ${item.question}</p>
          <p class="examples">📊 예시: ${item.examples}</p>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}

  <div class="stage-section" id="s-template">
    <div class="stage-section-title">실전 도전: 내 상황에 맞게 채우기</div>
    <p class="stage-section-subtitle">위 실습이 "연습"이었다면, 이번엔 내 실제 업무에 맞게 직접 채워 나만의 프롬프트를 완성해보세요.</p>
    ${buildTemplateHTML(m)}
  </div>

  <!-- 7. 학습 완료 -->
  <div class="stage-complete-section" id="stage-complete-section">
    ${buildCompleteSectionHTML(m.id, done)}
  </div>

  `;
}

// ════════════════════════════════════════════════
// GRADUATION SCREEN (stage5 완료 후)
// ════════════════════════════════════════════════
function buildGraduationHTML() {
  var progress = load('ps_progress') || {};
  var hasPD = !!load('pd_diagnosis');
  var stagesDone = ['stage1','stage2','stage3','stage4','stage5'].filter(function(s){ return !!progress[s]; }).length;
  var totalDone = hasPD ? stagesDone + 1 : stagesDone;

  return `
    <div class="graduation-screen">
      <div class="graduation-confetti" aria-hidden="true">🎉🏆🎊🚀✨</div>
      <h2 class="graduation-title">전 과정 수료!</h2>
      <p class="graduation-sub">AI 퍼스트로 일하는 5단계 훈련을 모두 완주했습니다.</p>

      <div class="graduation-stats">
        <div class="graduation-stat">
          <span class="graduation-stat-num">${totalDone}</span>
          <span class="graduation-stat-label">완료한 단계</span>
        </div>
        <div class="graduation-stat">
          <span class="graduation-stat-num">5대</span>
          <span class="graduation-stat-label">습득 역량</span>
        </div>
        <div class="graduation-stat">
          <span class="graduation-stat-num">약 2.5h</span>
          <span class="graduation-stat-label">투자한 시간</span>
        </div>
      </div>

      <div class="graduation-recap">
        <div class="graduation-recap-title">당신이 습득한 것</div>
        <ul class="graduation-recap-list">
          <li>AI에게 역할·맥락을 설계해 원하는 결과물을 1회에 뽑아내는 법</li>
          <li>시장·경쟁·기술 변화를 AI로 10분 안에 구조화하는 법</li>
          <li>가설 10개 중 근거 있는 3개를 골라 반대 논거까지 정리하는 법</li>
          <li>AI 결과물의 신뢰도를 수치로 평가하고 검증하는 법</li>
          <li>경영진 보고용 슬라이드와 수익 모델을 AI와 함께 완성하는 법</li>
        </ul>
      </div>

      <div class="graduation-actions">
        <a href="pd-diagnosis.html" class="btn-graduation-primary">📊 4주 후 재진단으로 성장 확인하기</a>
        <div class="graduation-share-row">
          <span class="graduation-share-label">🎉 수료를 주변에 알리세요</span>
          <div class="graduation-share-btns">
            <button class="btn-graduation-share" onclick="shareGraduation('copy')">🔗 링크 복사</button>
            <button class="btn-graduation-share" onclick="shareGraduation('twitter')">𝕏 트위터 공유</button>
            <button class="btn-graduation-share" onclick="shareGraduation('linkedin')">💼 LinkedIn 공유</button>
          </div>
        </div>
        <a href="index.html" class="btn-graduation-back">처음으로 돌아가기</a>
      </div>
    </div>`;
}

function shareGraduation(type) {
  var shareText = 'AI 퍼스트로 일하는 5단계 훈련을 완주했습니다! 🏆\n문제 정의력부터 결과물 완성까지 — AI와 함께 일하는 방법을 체계적으로 훈련했습니다.';
  var shareUrl = 'https://airoasting.github.io/ai-first/';
  if (type === 'linkedin') {
    window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(shareUrl), '_blank');
  } else if (type === 'twitter') {
    var tweetText = 'AI 퍼스트로 일하는 5단계 훈련 완주! 🏆 문제 정의력부터 결과물 완성까지 체계적으로 배웠습니다. #AI활용 #업무생산성';
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetText) + '&url=' + encodeURIComponent(shareUrl), '_blank');
  } else {
    navigator.clipboard.writeText(shareText + '\n' + shareUrl).then(function() {
      showToast('🔗 수료 메시지가 복사되었습니다!');
    });
  }
}

// ════════════════════════════════════════════════
// TEMPLATE
// ════════════════════════════════════════════════
function buildTemplateHTML(m) {
  const t = m.template;
  const parts = t.text.split('[____________]');
  let displayHtml = '';
  parts.forEach((part, i) => {
    displayHtml += escHtml(part);
    if (i < parts.length - 1) {
      displayHtml += `<span class="blank" id="tpl-blank-${m.id}-${i}" contenteditable="false">[____________]</span>`;
    }
  });
  return `
    <div class="template-display" id="tpl-display-${m.id}">${displayHtml}</div>
    <div class="template-inputs">
      ${t.hints.map((hint, i) => `
        <div class="template-input-row">
          <label>빈칸 ${i+1}: ${hint}</label>
          <input type="text" class="template-input" placeholder="${hint}"
            oninput="updateBlank('${m.id}', ${i}, this.value)">
        </div>`).join('')}
    </div>
    <button class="btn-copy-template" onclick="copyTemplate('${m.id}', ${JSON.stringify(t.text)}, ${t.hints.length})">
      📋 완성된 프롬프트 복사하기
    </button>`;
}

function updateBlank(moduleId, idx, value) {
  const blank = document.getElementById(`tpl-blank-${moduleId}-${idx}`);
  if (!blank) return;
  blank.textContent = value || '[____________]';
  blank.classList.toggle('filled', !!value);
  if (value) {
    blank.style.animation = 'none';
    blank.offsetHeight;
    blank.style.animation = 'blankPulse 0.4s ease';
  }
}

function copyTemplate(moduleId, templateText, blankCount) {
  const inputs = document.querySelectorAll('.template-input');
  let result = templateText;
  inputs.forEach(input => {
    if (input.value) result = result.replace('[____________]', input.value);
  });
  navigator.clipboard.writeText(result).then(() => showToast('📋 프롬프트가 복사되었습니다!'));
}

function togglePrompt(wrapId, btn) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  const preview = wrap.querySelector('.prompt-preview-text');
  const full = wrap.querySelector('.prompt-full-text');
  const expanded = full.style.display !== 'none';
  preview.style.display = expanded ? '' : 'none';
  full.style.display = expanded ? 'none' : '';
  btn.textContent = expanded ? '▼ 전체 프롬프트 보기' : '▲ 접기';
}

function copyPromptText(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✓ 복사됨';
    btn.style.background = 'rgba(34,197,94,0.2)';
    btn.style.color = '#16a34a';
    setTimeout(() => { btn.textContent = orig; btn.style.background=''; btn.style.color=''; }, 1500);
  }).catch(() => showToast('복사에 실패했습니다.'));
}

// ════════════════════════════════════════════════
// COMPLETE SECTION HTML
// ════════════════════════════════════════════════
function buildCompleteSectionHTML(stageId, done) {
  const m = MODULES.find(x => x.id === stageId);
  const nextId = NEXT_STAGE[stageId];
  const nextM = nextId ? MODULES.find(x => x.id === nextId) : null;
  if (done) {
    if (!nextM) {
      // Stage5 완료 → 진단 + 1~4단계 모두 완료 여부 확인 후 수료 화면
      var progress = load('ps_progress') || {};
      var hasPD = !!load('pd_diagnosis');
      var allDone = hasPD
        && !!progress.stage1
        && !!progress.stage2
        && !!progress.stage3
        && !!progress.stage4
        && !!progress.stage5;
      if (allDone) {
        return buildGraduationHTML();
      }
      // 미완료 단계 목록 생성
      var remaining = [];
      if (!hasPD)          remaining.push({ href: 'pd-diagnosis.html', label: '문제 정의력 진단' });
      if (!progress.stage1) remaining.push({ href: 'stage1.html',      label: '1단계' });
      if (!progress.stage2) remaining.push({ href: 'stage2.html',      label: '2단계' });
      if (!progress.stage3) remaining.push({ href: 'stage3.html',      label: '3단계' });
      if (!progress.stage4) remaining.push({ href: 'stage4.html',      label: '4단계' });
      var remainingHtml = remaining.map(function(r) {
        return '<a href="' + r.href + '" class="btn-complete-next" style="font-size:14px;padding:10px 20px;">' + r.label + ' 완료하기 →</a>';
      }).join('');
      return `
        <div class="stage-complete-done">
          <span class="complete-check-icon">✅</span>
          <div class="complete-done-text">5단계 완료!</div>
          <p style="font-size:14px;color:var(--text-secondary);margin:8px 0 16px;line-height:1.6;">
            전 과정 수료까지 아직 완료하지 않은 단계가 있어요.<br>
            모든 단계를 마쳐야 수료 화면이 표시됩니다.
          </p>
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">${remainingHtml}</div>
        </div>`;
    }
    return `
      <div class="stage-complete-done">
        <span class="complete-check-icon">✅</span>
        <div class="complete-done-text">이 단계 완료!</div>
        <a href="${nextId}.html" class="btn-complete-next">다음 단계: ${nextM.step}단계 ${nextM.shortTitle} →</a>
      </div>`;
  }
  const hasChecklist = m && m.checklist && m.checklist.length > 0;
  const checklistTotal = hasChecklist ? m.checklist.length : 0;
  const checklistHtml = hasChecklist ? `
    <div class="self-checklist">
      <div class="checklist-title">
        배운 내용을 실제로 해보셨나요?
        <span class="checklist-counter" id="checklist-counter-${stageId}">0 / ${checklistTotal}</span>
      </div>
      ${m.checklist.map((item, i) => {
        const itemText = typeof item === 'string' ? item : item.text;
        const itemHint = typeof item === 'string' ? '' : item.hint;
        return `
        <label class="checklist-item">
          <input type="checkbox" class="checklist-cb" id="chk-${stageId}-${i}" onchange="updateCompleteBtn('${stageId}', ${checklistTotal})">
          <div class="checklist-text">
            <strong>${itemText}</strong>
            ${itemHint ? `<span class="checklist-hint">${itemHint}</span>` : ''}
          </div>
        </label>`;
      }).join('')}
      <p class="checklist-hint">모두 체크하면 완료 버튼이 활성화됩니다.</p>
    </div>` : '';
  const nextPreviewHtml = nextM ? `
    <div class="next-stage-preview">
      <div class="next-stage-preview-icon">${nextM.icon || '→'}</div>
      <div class="next-stage-preview-body">
        <div class="next-stage-preview-label">완료 후 다음 단계</div>
        <div class="next-stage-preview-title">${nextM.step}단계: ${nextM.shortTitle}</div>
        <div class="next-stage-preview-desc">${nextM.desc || ''}</div>
      </div>
      <div class="next-stage-preview-arrow">→</div>
    </div>` : '';
  return `
    ${checklistHtml}
    <p class="stage-complete-hint">프롬프트 실습과 실전 도전까지 마쳤나요?<br>아래 버튼을 눌러 완료를 기록하세요.</p>
    <button class="btn-stage-complete" id="btn-complete-${stageId}" onclick="completeStage('${stageId}')"${hasChecklist ? ' disabled style="opacity:0.45;cursor:not-allowed;box-shadow:none;"' : ''}>✅ 학습 완료</button>
    ${nextPreviewHtml}`;
}

function updateCompleteBtn(stageId, total) {
  let checked = 0;
  for (let i = 0; i < total; i++) {
    const cb = document.getElementById(`chk-${stageId}-${i}`);
    if (cb && cb.checked) checked++;
  }
  const counter = document.getElementById(`checklist-counter-${stageId}`);
  if (counter) {
    counter.textContent = `${checked} / ${total}`;
    counter.classList.toggle('complete', checked === total);
  }
  const btn = document.getElementById(`btn-complete-${stageId}`);
  if (!btn) return;
  const allDone = checked === total;
  btn.disabled = !allDone;
  btn.style.opacity = allDone ? '1' : '0.45';
  btn.style.cursor = allDone ? 'pointer' : 'not-allowed';
  btn.style.transform = '';
  btn.style.boxShadow = allDone ? '' : 'none';
}

// ════════════════════════════════════════════════
// COMPLETE
// ════════════════════════════════════════════════
function completeStage(stageId) {
  const progress = load('ps_progress') || {};
  progress[stageId] = true;
  store('ps_progress', progress);
  const m = MODULES.find(x => x.id === stageId);
  if (m) awardBadge(m.badgeId);
  showToast('🎉 학습 완료! 메인 페이지에서 진도를 확인하세요.');

  // Update complete section in-place
  const sectionEl = document.getElementById('stage-complete-section');
  if (sectionEl) {
    sectionEl.innerHTML = buildCompleteSectionHTML(stageId, true);
  }

  // Re-render nav to reflect completion
  renderStageNav(stageId);
}

// ════════════════════════════════════════════════
// RESEARCH / QUIZ HELPERS
// ════════════════════════════════════════════════
function toggleResearchDetail(bodyId, btn) {
  const body = document.getElementById(bodyId);
  if (!body) return;
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open');
  btn.textContent = isOpen ? '▾ 자세히 보기' : '▴ 접기';
}

function buildQuizHTML(quiz, stageId) {
  return `
  <div class="quiz-wrap" id="quiz-${stageId}">
    <div class="quiz-question">🧠 ${quiz.question}</div>
    <div class="quiz-options">
      ${quiz.options.map((opt, i) => `
        <button class="quiz-option" onclick="answerQuiz('${stageId}', ${i}, ${opt.correct}, ${JSON.stringify(opt.feedback)})">
          ${opt.text}
        </button>`).join('')}
    </div>
    <div class="quiz-feedback" id="qf-${stageId}" style="display:none"></div>
    <button class="quiz-reset" id="qr-${stageId}" style="display:none" onclick="resetQuiz('${stageId}')">↺ 다시 풀기</button>
  </div>`;
}

function answerQuiz(stageId, idx, correct, feedback) {
  const wrap = document.getElementById(`quiz-${stageId}`);
  if (!wrap) return;
  const btns = wrap.querySelectorAll('.quiz-option');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === idx) btn.classList.add(correct ? 'correct' : 'wrong');
  });
  const fb = document.getElementById(`qf-${stageId}`);
  if (fb) {
    fb.textContent = feedback;
    fb.style.display = 'block';
    fb.className = `quiz-feedback ${correct ? 'correct' : 'wrong'}`;
  }
  const reset = document.getElementById(`qr-${stageId}`);
  if (reset) reset.style.display = 'inline-block';
}

function resetQuiz(stageId) {
  const wrap = document.getElementById(`quiz-${stageId}`);
  if (!wrap) return;
  const btns = wrap.querySelectorAll('.quiz-option');
  btns.forEach(btn => { btn.disabled = false; btn.classList.remove('correct', 'wrong'); });
  const fb = document.getElementById(`qf-${stageId}`);
  if (fb) { fb.style.display = 'none'; fb.textContent = ''; }
  const reset = document.getElementById(`qr-${stageId}`);
  if (reset) reset.style.display = 'none';
}

// ════════════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════════════
function renderStageNav(stageId) {
  const navEl = document.getElementById('stage-nav');
  if (!navEl) return;
  const prev = PREV_STAGE[stageId];
  const next = NEXT_STAGE[stageId];
  let html = '<div style="flex:1">';
  if (prev) html += `<a href="${prev}.html" class="btn-secondary">← 이전 단계</a>`;
  html += '</div>';
  if (next) {
    html += `<a href="${next}.html" class="btn-primary">다음 단계 →</a>`;
  } else {
    html += `<a href="diagnosis.html?mode=rediag" class="btn-primary">📊 재진단하기</a>`;
  }
  navEl.innerHTML = html;
}
