// ════════════════════════════════════════════════
// RESULT PAGE
// ════════════════════════════════════════════════
let radarChart = null;

// 점수 스케일링: 원점수 0~9 → 표시 0~10
function toDisplay(raw) { return Math.round((raw / 9) * 10); }

// 영역별 고유 색상
var AREA_COLORS = {
  mindset: '#8b5cf6',
  env:     '#3b82f6',
  hypo:    '#f59e0b',
  valid:   '#10b981',
  output:  '#f97316'
};

const AREA_META = {
  mindset: {
    icon:'🧠', name:'AI에게 위임하기', step: 1,
    oneLiner:'AI에게 뭘 맡기고, 뭘 직접 할지 나누는 능력',
    weak:'일을 통째로 AI에게 던지거나, 반대로 전부 혼자 하려다 시간이 부족해집니다.',
    link:'diagnosis.html', btnLabel:'진단하기'
  },
  env: {
    icon:'🔭', name:'AI로 정보 탐색', step: 2,
    oneLiner:'필요한 정보를 AI로 빠르게 모으고 구조화하는 능력',
    weak:'리서치에 반나절을 쓰거나, "대충 감으로" 넘어가는 일이 반복됩니다.',
    link:'stage2.html', btnLabel:'훈련하기'
  },
  hypo: {
    icon:'💡', name:'방향 설정', step: 3,
    oneLiner:'가능한 답을 여러 개 만들고, 진짜 해볼 만한 것을 고르는 능력',
    weak:'경험에만 의존해 한 가지 답에 꽂히거나, 10개를 벌려놓고 추리지 못합니다.',
    link:'stage3.html', btnLabel:'훈련하기'
  },
  valid: {
    icon:'⚖️', name:'팩트 확인', step: 4,
    oneLiner:'내 판단이 맞는지 데이터로 검증하고, 반대 증거도 확인하는 능력',
    weak:'"느낌상 맞을 것 같다"로 밀어붙이다가 경영진 앞에서 반박당합니다.',
    link:'stage4.html', btnLabel:'훈련하기'
  },
  output: {
    icon:'🚀', name:'결과물 완성', step: 5,
    oneLiner:'분석을 보고서·슬라이드·모델로 빠르게 만들어내는 능력',
    weak:'분석은 잘했는데 정리에 하루를 쓰거나, AI 초안을 그대로 내서 퀄리티가 떨어집니다.',
    link:'stage5.html', btnLabel:'훈련하기'
  }
};

// 점수 등급 판정
function getScoreGrade(total) {
  if (total >= 45) return { label: 'AI 마스터', cls: 'grade-master', emoji: '⚡' };
  if (total >= 38) return { label: '잘하고 있어요!', cls: 'grade-great', emoji: '🔥' };
  if (total >= 30) return { label: '성장 중', cls: 'grade-growing', emoji: '🌱' };
  if (total >= 20) return { label: '가능성 충분', cls: 'grade-potential', emoji: '💪' };
  return { label: '시작이 반!', cls: 'grade-start', emoji: '🚀' };
}

function initResult() {
  var params = new URLSearchParams(location.search);

  // Shared link: ?result=<base64>
  var encoded = params.get('result');
  if (encoded) {
    try {
      var scores = JSON.parse(atob(encoded));
      store('ps_diagnosis', scores);
    } catch(e) {}
  }

  var scores = load('ps_diagnosis');

  if (!scores) {
    showNoDiagView();
    return;
  }

  var isRediag = params.get('rediag') === '1';
  showResultsView(scores, isRediag);
}

// ════════════════════════════════════════════════
// NO DIAGNOSIS VIEW
// ════════════════════════════════════════════════
function showNoDiagView() {
  document.getElementById('view-no-diag').classList.remove('section-hidden');
  renderPrinciples('principles-content-nodx', false);
}

// ════════════════════════════════════════════════
// RESULTS VIEW — 새 순서: 진단결과 → 병목 → 5영역흐름 → 액션
// ════════════════════════════════════════════════
function showResultsView(scores, isRediag) {
  document.getElementById('view-results').classList.remove('section-hidden');

  var profileKey = determineProfile(scores);
  var profile = PROFILES[profileKey];
  var bottleneckStep = profile.bottleneckStep;

  // ① 진단 결과 (가장 먼저)
  // Hero
  document.getElementById('hero-emoji').textContent = profile.emoji;
  document.getElementById('hero-name').textContent = profile.name;
  document.getElementById('hero-message').textContent = profile.message;
  document.getElementById('hero-tags').innerHTML =
    '<span class="profile-tag super">\uD83D\uDCAA ' + profile.super + '</span>' +
    '<span class="profile-tag achilles">\uD83D\uDCCC ' + profile.achilles + '</span>';

  // Radar chart
  var prevScores = isRediag ? getPrevScores() : null;
  renderRadar(scores, prevScores, isRediag);

  // Score summary + grade
  renderScoreSummary(scores, profileKey);

  // ② Bottleneck
  renderBottleneck(profile, scores);

  // ③ 5개 영역 흐름 (간소화)
  renderAreaExplain(scores, profile);

  // ④ 액션
  renderActions(profileKey, bottleneckStep);


  // Rediag toast
  if (isRediag && prevScores) {
    var prevTotal = Object.values(prevScores).reduce(function(s,v){return s+v;},0);
    var curTotal = Object.values(scores).reduce(function(s,v){return s+v;},0);
    var diff = toDisplay(curTotal) - toDisplay(prevTotal);
    setTimeout(function() {
      if (diff > 0) showToast('\uD83C\uDF89 총점이 ' + diff + '점 올랐습니다!');
      else if (diff === 0) showToast('이전과 같은 점수입니다. 계속 성장 중!');
    }, 500);
  }
}

function getPrevScores() {
  var hist = load('ps_diagnosis_history') || [];
  return hist.length > 0 ? hist[hist.length - 1] : null;
}

// ════════════════════════════════════════════════
// 5개 영역 설명 플로우 — 간소화 (점수·약점·CTA 제거)
// ════════════════════════════════════════════════
function renderAreaExplain(scores, profile) {
  var container = document.getElementById('area-explain-flow');
  if (!container) return;

  var stepMap = {2:'env', 3:'hypo', 4:'valid', 5:'output'};
  var bnKey = profile.bottleneckStep ? stepMap[profile.bottleneckStep] : null;
  if (!bnKey && profile === PROFILES.analog_fighter) bnKey = 'mindset';

  var areas = ['mindset','env','hypo','valid','output'];
  var html = '';
  for (var i = 0; i < areas.length; i++) {
    var a = areas[i];
    var meta = AREA_META[a];
    var val = toDisplay(scores[a]);
    var isBn = (a === bnKey);
    var color = AREA_COLORS[a];
    var scoreClass = val >= 8 ? 'score-high' : val >= 5 ? 'score-mid' : 'score-low';

    html += '<a class="area-explain-card' + (isBn ? ' is-bottleneck' : '') + '" href="' + meta.link + '" style="--area-color:' + color + '">' +
      '<div class="area-explain-step">' + meta.step + '단계</div>' +
      '<span class="area-explain-icon">' + meta.icon + '</span>' +
      '<div class="area-explain-name">' + meta.name + '</div>' +
      '<div class="area-explain-one">' + meta.oneLiner + '</div>' +
      '<div class="area-explain-score-wrap">' +
        '<span class="area-explain-score ' + scoreClass + '">' + val + '/10</span>' +
      '</div>' +
      '</a>';

    if (i < areas.length - 1) {
      html += '<div class="area-explain-arrow">→</div>';
    }
  }
  container.innerHTML = html;
}

// ════════════════════════════════════════════════
// RADAR CHART (5-axis pentagon) — 영역별 색상
// ════════════════════════════════════════════════
function renderRadar(scores, prevScores, isRediag) {
  setTimeout(function() {
    var ctx = document.getElementById('result-radar');
    if (!ctx) return;
    if (radarChart) { radarChart.destroy(); radarChart = null; }

    var areas = ['mindset','env','hypo','valid','output'];
    var labels = areas.map(function(a) { return AREA_META[a].name; });
    var data = areas.map(function(a) { return toDisplay(scores[a]); });
    var pointColors = areas.map(function(a) { return AREA_COLORS[a]; });

    var datasets = [{
      label: isRediag ? '이번 진단' : '내 점수',
      data: data,
      backgroundColor: 'rgba(249,115,22,0.15)',
      borderColor: '#f97316',
      borderWidth: 2.5,
      pointBackgroundColor: pointColors,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8
    }];

    if (isRediag && prevScores) {
      datasets.unshift({
        label: '이전 진단',
        data: areas.map(function(a) { return toDisplay(prevScores[a]); }),
        backgroundColor: 'rgba(209,213,219,0.15)',
        borderColor: '#d1d5db',
        borderWidth: 1.5,
        pointBackgroundColor: '#d1d5db',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 4
      });
    }

    radarChart = new Chart(ctx, {
      type: 'radar',
      data: {labels: labels, datasets: datasets},
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {display: !!isRediag, position: 'bottom'},
          tooltip: {
            callbacks: {
              label: function(c) { return c.dataset.label + ': ' + c.raw + '점 / 10점'; }
            }
          }
        },
        scales: {
          r: {
            min: 0,
            max: 10,
            ticks: {stepSize: 2, font: {size: 11}, backdropColor: 'transparent', color: '#999'},
            grid: {color: 'rgba(0,0,0,0.06)'},
            angleLines: {color: 'rgba(0,0,0,0.08)'},
            pointLabels: {font: {size: 12, weight: '700'}, color: '#333'}
          }
        }
      }
    });
  }, 100);
}

// ════════════════════════════════════════════════
// SCORE SUMMARY — 50점 만점 + 등급 라벨
// ════════════════════════════════════════════════
function renderScoreSummary(scores, profileKey) {
  var areas = ['mindset','env','hypo','valid','output'];
  var displayScores = {};
  var displayTotal = 0;
  for (var i = 0; i < areas.length; i++) {
    displayScores[areas[i]] = toDisplay(scores[areas[i]]);
    displayTotal += displayScores[areas[i]];
  }
  var pct = Math.round((displayTotal / 50) * 100);

  document.getElementById('total-score').textContent = displayTotal;
  document.getElementById('score-bar').style.width = pct + '%';

  // 등급 라벨
  var grade = getScoreGrade(displayTotal);
  var gradeEl = document.getElementById('score-grade-label');
  if (gradeEl) {
    gradeEl.innerHTML = '<span class="' + grade.cls + '">' + grade.emoji + ' ' + grade.label + '</span>';
  }

  // 히어로 등급
  var heroGrade = document.getElementById('hero-grade');
  if (heroGrade) {
    heroGrade.innerHTML = '<span class="hero-grade-badge ' + grade.cls + '">' + displayTotal + '점 · ' + grade.label + '</span>';
  }

  var bd = document.getElementById('score-breakdown');
  var html = '';
  for (var i = 0; i < areas.length; i++) {
    var a = areas[i];
    var val = displayScores[a];
    var w = val * 10;
    var color = AREA_COLORS[a];
    html += '<div class="score-row">' +
      '<span class="score-row-label">' + AREA_META[a].name + '</span>' +
      '<div class="score-row-bar"><div class="score-row-fill" style="width:' + w + '%;background:' + color + ';"></div></div>' +
      '<span class="score-row-val">' + val + '/10</span>' +
      '</div>';
  }
  bd.innerHTML = html;
}

// ════════════════════════════════════════════════
// BOTTLENECK — 강화된 시각
// ════════════════════════════════════════════════
function renderBottleneck(profile, scores) {
  var btArea = document.getElementById('result-bottleneck-area');
  if (profile.bottleneckStep) {
    var stepMap = {2:'env', 3:'hypo', 4:'valid', 5:'output'};
    var bnKey = stepMap[profile.bottleneckStep];
    var bnMeta = AREA_META[bnKey];
    var bnScore = toDisplay(scores[bnKey]);
    var bnColor = AREA_COLORS[bnKey];
    btArea.innerHTML = '<div class="result-bottleneck" style="--bn-color:' + bnColor + '">' +
      '<div class="bottleneck-header-row">' +
        '<span class="bottleneck-badge">집중 영역</span>' +
      '</div>' +
      '<div class="bottleneck-main">' +
        '<span class="bottleneck-icon">' + bnMeta.icon + '</span>' +
        '<div class="bottleneck-text">' +
          '<strong>' + profile.bottleneckStep + '단계 · ' + bnMeta.name + '</strong>' +
          '<span class="bottleneck-score">' + bnScore + '/10점</span>' +
        '</div>' +
      '</div>' +
      '<p class="bottleneck-weak">' + bnMeta.weak + '</p>' +
      '<a class="btn-bottleneck" href="' + bnMeta.link + '">' + bnMeta.name + ' 훈련 시작 →</a>' +
      '</div>';
  } else {
    btArea.innerHTML = '';
  }
}

// ════════════════════════════════════════════════
// AREA ACTION CARDS — 10점 만점
// ════════════════════════════════════════════════
function renderAreaActions(scores, profile) {
  var grid = document.getElementById('area-actions-grid');
  var areas = ['mindset','env','hypo','valid','output'];
  var bottleneckArea = null;
  if (profile.bottleneckStep) {
    var stepMap = {2:'env', 3:'hypo', 4:'valid', 5:'output'};
    bottleneckArea = stepMap[profile.bottleneckStep];
  }
  if (!bottleneckArea && profile === PROFILES.analog_fighter) {
    bottleneckArea = 'mindset';
  }

  var html = '';
  for (var i = 0; i < areas.length; i++) {
    var a = areas[i];
    var meta = AREA_META[a];
    var val = toDisplay(scores[a]);
    var isBn = (a === bottleneckArea);
    var scoreClass = val >= 8 ? 'score-high' : val >= 5 ? 'score-mid' : 'score-low';

    html += '<a class="area-action-card' + (isBn ? ' is-bottleneck' : '') + '" href="' + meta.link + '">' +
      '<span class="area-action-icon">' + meta.icon + '</span>' +
      '<span class="area-action-name">' + meta.name + '</span>' +
      '<span class="area-action-desc">' + meta.oneLiner + '</span>' +
      '<span class="area-action-score ' + scoreClass + '">' + val + '<span style="font-size:12px;font-weight:600;color:var(--text-muted);">/10</span></span>' +
      '<span class="area-action-btn">' + meta.btnLabel + '</span>' +
      '</a>';
  }
  grid.innerHTML = html;
}

// ════════════════════════════════════════════════
// ACTIONS
// ════════════════════════════════════════════════
function renderActions(profileKey, bottleneckStep) {
  var actArea = document.getElementById('result-actions');

  if (bottleneckStep) {
    actArea.innerHTML =
      '<a class="btn-primary" href="stage' + bottleneckStep + '.html">' + bottleneckStep + '단계부터 학습 시작하기 →</a>' +
      '<a class="btn-secondary" href="stage2.html">처음부터 학습하기</a>';
  } else {
    actArea.innerHTML =
      '<a class="btn-primary" href="stage2.html">학습 시작하기 →</a>';
  }
}

// ════════════════════════════════════════════════
// PRINCIPLES (no-diag view에서만 사용)
// ════════════════════════════════════════════════
function renderPrinciples(containerId, showCompleteBtn) {
  var content = document.getElementById(containerId);
  if (!content) return;
  var html = '';
  html += PRINCIPLES.map(function(p) {
    return '<div class="principle-card">' +
      '<div class="principle-header">' +
      '<div class="principle-num">' + p.num + '</div>' +
      '<div class="principle-title">' + p.title + '</div>' +
      '</div>' +
      '<div class="principle-body">' + p.body + '</div>' +
      '</div>';
  }).join('');
  content.innerHTML = html;
}

// ════════════════════════════════════════════════
// PROFILE / SCORING (원점수 기반 — 변경 없음)
// ════════════════════════════════════════════════
function determineProfile(scores) {
  var total = Object.values(scores).reduce(function(s,v){return s+v;}, 0);
  if (total <= 15) return 'analog_fighter';
  var areas = ['mindset','env','hypo','valid','output'];
  var bottleneck = areas.reduce(function(min, a) { return scores[a] < scores[min] ? a : min; }, areas[0]);
  return {
    mindset:'analog_fighter',
    env:'scope_expert',
    hypo:'action_commander',
    valid:'intuition_strategist',
    output:'analysis_researcher'
  }[bottleneck];
}

// ════════════════════════════════════════════════
// SHARE / EXPORT
// ════════════════════════════════════════════════
function shareResultLink() {
  var scores = load('ps_diagnosis');
  if (!scores) return;
  try {
    var encoded = btoa(JSON.stringify(scores));
    var url = location.origin + location.pathname + '?result=' + encoded;
    navigator.clipboard.writeText(url).then(function() { showToast('\uD83D\uDD17 링크가 복사되었습니다!'); });
  } catch(e) { showToast('링크 복사에 실패했습니다.'); }
}

function saveResultImage() {
  var card = document.getElementById('result-card-for-image');
  if (!card || typeof domtoimage === 'undefined') { showToast('저장 기능을 사용할 수 없습니다.'); return; }
  showToast('이미지 생성 중...');
  domtoimage.toPng(card, {bgcolor: '#ffffff', scale: 2})
    .then(function(dataUrl) {
      var a = document.createElement('a');
      a.download = 'ai-native-result.png';
      a.href = dataUrl;
      a.click();
    }).catch(function() { showToast('이미지 저장에 실패했습니다.'); });
}
