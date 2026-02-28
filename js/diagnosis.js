// ════════════════════════════════════════════════
// DIAGNOSIS PAGE STATE
// ════════════════════════════════════════════════
const D = {
  mode: 'initial', // 'initial' | 'rediag'
  answers: [],
  index: 0,
};

// ════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════
function initDiagnosis() {
  const params = new URLSearchParams(location.search);
  D.mode = params.get('mode') === 'rediag' ? 'rediag' : 'initial';

  if (D.mode === 'rediag') {
    document.getElementById('diag-section-num').textContent = '재진단';
    document.getElementById('diag-section-title').textContent = '학습 후 나는 얼마나 성장했을까?';
    document.getElementById('diag-subtitle').textContent = '같은 15문항에 다시 답해보세요.';
    document.getElementById('rediag-intro').classList.remove('section-hidden');
  }

  D.answers = [];
  D.index = 0;
  renderQuestion(D.index);
}

// ════════════════════════════════════════════════
// RENDER
// ════════════════════════════════════════════════
function renderQuestion(idx) {
  const q = QUESTIONS[idx];

  const areaEl = document.getElementById('quiz-area-label');
  const fillEl = document.getElementById('quiz-progress-fill');
  const textEl = document.getElementById('quiz-progress-text');
  const prevBtn = document.getElementById('quiz-prev-btn');
  const qArea = document.getElementById('quiz-question-area');

  if (areaEl) areaEl.textContent = q.areaName;
  if (fillEl) fillEl.style.width = `${(idx / QUESTIONS.length) * 100}%`;
  if (textEl) textEl.textContent = `${idx} / ${QUESTIONS.length} 완료`;
  if (prevBtn) prevBtn.style.display = idx > 0 ? 'inline-flex' : 'none';

  if (qArea) {
    qArea.innerHTML = `
      <div class="quiz-q-card">
        <div class="quiz-q-num">문항 ${idx + 1} / ${QUESTIONS.length}</div>
        <div class="quiz-q-title">${q.title}</div>
        <p class="quiz-q-scenario">${q.scenario}</p>
        <div class="quiz-options">
          ${q.options.map((opt, i) => `
            <button class="quiz-opt" onclick="selectAnswer(${i})"
              aria-label="선택지 ${i+1}: ${opt.text}">
              ${opt.text}
            </button>
          `).join('')}
        </div>
      </div>`;
  }
}

// ════════════════════════════════════════════════
// INTERACTION
// ════════════════════════════════════════════════
function selectAnswer(optIdx) {
  const q = QUESTIONS[D.index];
  const score = q.options[optIdx].score;
  D.answers[D.index] = {questionId: q.id, area: q.area, score};

  // highlight selected
  const opts = document.querySelectorAll('#quiz-question-area .quiz-opt');
  opts.forEach((el, i) => el.classList.toggle('selected', i === optIdx));

  // auto-advance
  setTimeout(() => {
    if (D.index < QUESTIONS.length - 1) {
      D.index++;
      renderQuestion(D.index);
    } else {
      finishQuiz();
    }
  }, 350);
}

function quizPrev() {
  if (D.index > 0) {
    D.index--;
    renderQuestion(D.index);
  }
}

// ════════════════════════════════════════════════
// FINISH
// ════════════════════════════════════════════════
function finishQuiz() {
  const fillEl = document.getElementById('quiz-progress-fill');
  const textEl = document.getElementById('quiz-progress-text');
  if (fillEl) fillEl.style.width = '100%';
  if (textEl) textEl.textContent = `${QUESTIONS.length} / ${QUESTIONS.length} 완료`;

  const scores = calcScores(D.answers);

  if (D.mode === 'rediag') {
    // Save previous score to history
    const prev = load('ps_diagnosis');
    if (prev) {
      const hist = load('ps_diagnosis_history') || [];
      hist.push(prev);
      store('ps_diagnosis_history', hist);
    }
    store('ps_diagnosis', scores);
    window.location.href = 'result.html?rediag=1';
  } else {
    // Initial diagnosis
    const existing = load('ps_diagnosis');
    if (existing) {
      const hist = load('ps_diagnosis_history') || [];
      hist.push(existing);
      store('ps_diagnosis_history', hist);
    }
    store('ps_diagnosis', scores);
    window.location.href = 'result.html';
  }
}

// ════════════════════════════════════════════════
// SCORING
// ════════════════════════════════════════════════
function calcScores(answers) {
  const sc = {mindset:0, env:0, hypo:0, valid:0, output:0};
  answers.forEach(a => { if (a && sc[a.area] !== undefined) sc[a.area] += a.score; });
  return sc;
}
