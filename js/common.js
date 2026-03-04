// ════════════════════════════════════════════════
// STORAGE
// ════════════════════════════════════════════════
function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {} }
function load(key) { try { return JSON.parse(localStorage.getItem(key)); } catch(e) { return null; } }

// ════════════════════════════════════════════════
// HEADER / FOOTER INJECTION
// ════════════════════════════════════════════════
function injectHeader() {
  const el = document.getElementById('app-header');
  if (!el) return;
  const page = location.pathname.split('/').pop() || 'index.html';
  el.outerHTML = `
<header>
  <p class="brand">AI Roasting</p>
  <h1>AI 퍼스트로 일한다는 것</h1>
  <p class="header-sub">5단계 실전 훈련</p>
  <div class="mobile-notice">
    <span class="mobile-notice-icon">🖥️</span>
    이 가이드는 데스크탑에 최적화되어 있습니다
  </div>
</header>`;
}

function injectFooter() {
  const el = document.getElementById('app-footer');
  if (!el) return;
  el.outerHTML = `
<footer>
  <p class="footer-brand">AI Roasting</p>
  <p class="footer-text">AI 퍼스트로 일한다는 것 · 5단계 실전 훈련</p>
</footer>`;
}

function injectToast() {
  if (!document.getElementById('toast')) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.id = 'toast';
    document.body.appendChild(t);
  }
}

function injectBadgePopup() {
  if (!document.getElementById('badge-popup')) {
    const el = document.createElement('div');
    el.className = 'badge-popup section-hidden';
    el.id = 'badge-popup';
    el.innerHTML = `
      <div class="badge-popup-inner" id="badge-popup-inner">
        <span class="badge-popup-emoji" id="badge-popup-emoji"></span>
        <div class="badge-popup-label">새 뱃지 획득!</div>
        <div class="badge-popup-name" id="badge-popup-name"></div>
        <div class="badge-popup-desc" id="badge-popup-desc"></div>
        <button class="badge-popup-close" onclick="closeBadgePopup()">계속하기</button>
      </div>`;
    document.body.appendChild(el);
  }
}

// ════════════════════════════════════════════════
// THEME
// ════════════════════════════════════════════════
function restoreTheme() {
  const saved = load('ps_theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

// ════════════════════════════════════════════════
// TOAST
// ════════════════════════════════════════════════
function showToast(msg, dur) {
  dur = dur || 1800;
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

// ════════════════════════════════════════════════
// BADGES
// ════════════════════════════════════════════════
const BADGE_COLORS = ['#f97316','#8b5cf6','#0ea5e9','#10b981','#ec4899','#f59e0b','#fbbf24'];

function awardBadge(badgeId) {
  const badges = load('ps_badges') || [];
  if (badges.includes(badgeId)) return;
  badges.push(badgeId);
  store('ps_badges', badges);
  const def = BADGES_DEF[badgeId];
  if (def) showBadgePopup(def);
}

function showBadgePopup(badge) {
  const popup = document.getElementById('badge-popup');
  if (!popup) return;
  document.getElementById('badge-popup-emoji').textContent = badge.emoji;
  document.getElementById('badge-popup-name').textContent = badge.name;
  document.getElementById('badge-popup-desc').textContent = badge.desc;
  popup.classList.remove('section-hidden');
  // particles
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `left:${10+Math.random()*80}%;top:${10+Math.random()*80}%;background:${BADGE_COLORS[i % BADGE_COLORS.length]};animation-delay:${Math.random()*0.3}s;animation-duration:${0.8+Math.random()*0.6}s;`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1500);
  }
}

function closeBadgePopup() {
  const popup = document.getElementById('badge-popup');
  if (popup) popup.classList.add('section-hidden');
}

function renderBadgesRow(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const earned = load('ps_badges') || [];
  el.innerHTML = Object.values(BADGES_DEF).map(b => `
    <span class="badge-chip ${earned.includes(b.id) ? 'earned' : ''}" title="${b.desc}">
      ${b.emoji} ${b.name}
    </span>`).join('');
}

// ════════════════════════════════════════════════
// STAGE: PD 진단 연동 배너
// ════════════════════════════════════════════════
var _PD_BANNER_COMP = {
  selfdirect:     { name: '자기주도성',      icon: '🧭', color: '#8b5cf6' },
  limitless:      { name: 'Limitless Mindset', icon: '🌐', color: '#3b82f6' },
  unlearnrelearn: { name: 'Unlearn-Relearn', icon: '🔄', color: '#f59e0b' },
  fastloop:       { name: '빠른 검증·반복',  icon: '🔍', color: '#ef4444' },
  deadline:       { name: '1/10 데드라인',   icon: '⏱️', color: '#10b981' }
};
var _PD_BANNER_REASON = {
  selfdirect:     '"무엇을, 왜 시킬지" 직접 정의하는 것이 프롬프트의 본질입니다.',
  limitless:      '모르는 영역을 AI로 탐색하는 것이 Limitless Mindset의 실전입니다.',
  unlearnrelearn: '제로베이스로 방향을 재설계하는 훈련이 Unlearn-Relearn의 핵심입니다.',
  fastloop:       'AI 산출물 교차검증·반복 루프를 실전에서 훈련합니다.',
  deadline:       '1시간 안에 완성하는 것 자체가 1/10 데드라인 훈련입니다.'
};

function injectStagePDBanner() {
  var el = document.getElementById('pd-stage-banner');
  if (!el) return;
  var compKey = el.getAttribute('data-competency');
  if (!compKey) return;
  var rawScores = load('pd_diagnosis');
  if (!rawScores || !rawScores[compKey]) return;

  var comp = _PD_BANNER_COMP[compKey];
  if (!comp) return;

  var rawTotal = rawScores[compKey].total || 0;
  var scaled = Math.round(rawTotal / 12 * 10);
  var pct = Math.round(scaled / 10 * 100);
  var reason = _PD_BANNER_REASON[compKey] || '';

  var levelText, levelColor;
  if (scaled <= 3)      { levelText = '집중 성장 구간'; levelColor = '#f59e0b'; }
  else if (scaled <= 7) { levelText = '성장 중';       levelColor = '#f59e0b'; }
  else                  { levelText = '높은 수준';     levelColor = '#10b981'; }

  el.innerHTML =
    '<div class="pd-stage-banner">' +
      '<div class="pd-stage-banner-wrap">' +
        '<div class="pd-stage-banner-inner">' +
          '<div class="pd-stage-banner-left">' +
            '<span class="pd-stage-banner-icon">' + comp.icon + '</span>' +
            '<div class="pd-stage-banner-text">' +
              '<div class="pd-stage-banner-title">진단 결과 연동 · <strong>' + comp.name + '</strong></div>' +
              '<div class="pd-stage-banner-reason">' + reason + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="pd-stage-banner-right">' +
            '<div class="pd-stage-banner-score" style="color:' + comp.color + '">' + scaled + '<span>/10</span></div>' +
            '<div class="pd-stage-banner-bar"><div class="pd-stage-banner-fill" style="width:' + pct + '%;background:' + comp.color + '"></div></div>' +
            '<div class="pd-stage-banner-level" style="color:' + levelColor + '">' + levelText + '</div>' +
          '</div>' +
        '</div>' +
        '<a class="pd-stage-banner-link" href="pd-result.html">전체 진단 결과 보기 →</a>' +
      '</div>' +
    '</div>';
}

// ════════════════════════════════════════════════
// OPEN IN AI (딥링크 버튼)
// ════════════════════════════════════════════════
function openInAI(text, tool) {
  var urls = {
    chatgpt: 'https://chatgpt.com/',
    claude: 'https://claude.ai/new'
  };
  navigator.clipboard.writeText(text).then(function() {
    showToast('📋 복사 완료! 열리는 창에 붙여넣으세요 (Ctrl+V)', 2800);
    window.open(urls[tool] || urls.chatgpt, '_blank');
  }).catch(function() {
    window.open(urls[tool] || urls.chatgpt, '_blank');
  });
}

// ════════════════════════════════════════════════
// UTILS
// ════════════════════════════════════════════════
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ════════════════════════════════════════════════
// INIT COMMON (call on every page)
// ════════════════════════════════════════════════
function initCommon() {
  injectHeader();
  injectFooter();
  injectToast();
  injectBadgePopup();
  restoreTheme();
}
