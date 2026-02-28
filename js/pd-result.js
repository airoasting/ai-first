// ════════════════════════════════════════════════
// PD RESULT PAGE
// ════════════════════════════════════════════════
var pdCharts = [];

function initPDResult() {
  var params = new URLSearchParams(location.search);

  // Shared link: ?result=<base64>
  var encoded = params.get('result');
  if (encoded) {
    try {
      var scores = JSON.parse(atob(encoded));
      store('pd_diagnosis', scores);
    } catch(e) {}
  }

  var scores = load('pd_diagnosis');
  if (!scores) {
    window.location.replace('pd-diagnosis.html');
    return;
  }

  showPDResults(scores);
}

// ════════════════════════════════════════════════
// MAIN RENDER
// ════════════════════════════════════════════════
function showPDResults(scores) {
  document.getElementById('pd-view-results').classList.remove('section-hidden');

  scores = scalePDScores(scores);

  var profileKey = determinePDProfile(scores);
  var profile = PD_PROFILES[profileKey];
  var grade = getPDScoreGrade(getPDTotal(scores));

  // Hero
  document.getElementById('pd-hero-emoji').textContent = profile.emoji;
  document.getElementById('pd-hero-name').textContent = profile.name;
  document.getElementById('pd-hero-message').textContent = profile.message;

  var gradeEl = document.getElementById('pd-hero-grade');
  gradeEl.innerHTML = '<span class="' + grade.cls + '">' + grade.emoji + ' ' + grade.label + '</span>';

  var tagsEl = document.getElementById('pd-hero-tags');
  tagsEl.innerHTML = profile.tags.map(function(t) { return '<span class="pd-tag">' + t + '</span>'; }).join('');

  // Total score
  var total = getPDTotal(scores);
  document.getElementById('pd-total-score').textContent = total;
  document.getElementById('pd-total-bar-fill').style.width = Math.round(total / 50 * 100) + '%';

  // Score bars
  renderPDScoreBars(scores);

  // 5 charts
  renderPDCharts(scores);

  // Learning path
  renderPDLearningPath(scores);

  // Share card
  populateShareCard(scores, profile, grade);
}

// ════════════════════════════════════════════════
// SCORE BARS
// ════════════════════════════════════════════════
function renderPDScoreBars(scores) {
  var container = document.getElementById('pd-score-bars');
  var areas = ['selfdirect','limitless','unlearnrelearn','fastloop','deadline'];
  var html = '';
  for (var i = 0; i < areas.length; i++) {
    var a = areas[i];
    var comp = PD_COMPETENCIES[a];
    var val = scores[a].total;
    var pct = Math.round(val / 10 * 100);
    html += '<div class="pd-score-row" style="border-left:3px solid ' + comp.color + ';padding-left:8px;" onclick="scrollToChart(\'' + a + '\')" title="' + comp.name + ' 상세 보기">' +
      '<span class="pd-score-row-label">' + comp.icon + ' ' + comp.name + '</span>' +
      '<div class="pd-score-row-bar"><div class="pd-score-row-fill" style="width:' + pct + '%;background:' + comp.color + ';"></div></div>' +
      '<span class="pd-score-row-val">' + val + ' / 10</span>' +
      '<span class="pd-score-row-goto">↓</span>' +
      '</div>';
  }
  container.innerHTML = html;
}

function scrollToChart(areaKey) {
  var card = document.getElementById('pd-chart-' + areaKey);
  if (!card) return;
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  card.classList.remove('pd-chart-highlighted');
  void card.offsetWidth;
  card.classList.add('pd-chart-highlighted');
  setTimeout(function() { card.classList.remove('pd-chart-highlighted'); }, 1400);
}

// ════════════════════════════════════════════════
// 5 DIAMOND CHARTS
// ════════════════════════════════════════════════
function renderPDCharts(scores) {
  var grid = document.getElementById('pd-charts-grid');
  var areas = ['selfdirect','limitless','unlearnrelearn','fastloop','deadline'];

  var html = '';
  for (var i = 0; i < areas.length; i++) {
    var a = areas[i];
    var comp = PD_COMPETENCIES[a];
    var areaScore = scores[a];
    var interp = getPDInterpretation(a, areaScore.total);

    html += '<div class="pd-chart-card" id="pd-chart-' + a + '" style="--comp-color:' + comp.color + '">' +
      '<div class="pd-chart-header">' +
        '<span class="pd-chart-icon">' + comp.icon + '</span>' +
        '<span class="pd-chart-name">' + comp.name + '</span>' +
        '<span class="pd-chart-score">' + areaScore.total + '/10</span>' +
      '</div>' +
      '<div class="pd-chart-canvas-wrap">' +
        '<canvas id="pd-radar-' + a + '"></canvas>' +
      '</div>' +
      '<p class="pd-chart-interp">' + interp + '</p>' +
      '<div class="pd-chart-contrast">' +
        '<span class="contrast-before">' + comp.contrast.before + '</span>' +
        '<span class="contrast-arrow">→</span>' +
        '<span class="contrast-after">' + comp.contrast.after + '</span>' +
      '</div>' +
      '</div>';
  }
  grid.innerHTML = html;

  // Render charts with delay for DOM to settle
  setTimeout(function() {
    for (var i = 0; i < areas.length; i++) {
      renderSinglePDRadar(areas[i], scores[areas[i]]);
    }
  }, 150);
}

function renderSinglePDRadar(areaKey, areaScore) {
  var comp = PD_COMPETENCIES[areaKey];
  var ctx = document.getElementById('pd-radar-' + areaKey);
  if (!ctx) return;

  var color = comp.color;

  var chart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: comp.subDimensions,
      datasets: [{
        data: areaScore.dims,
        backgroundColor: hexToRgba(color, 0.15),
        borderColor: color,
        borderWidth: 2.5,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      layout: {
        padding: { top: 14, bottom: 14, left: 20, right: 20 }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(c) { return c.label + ': ' + c.raw + '점 / 3점'; }
          }
        }
      },
      scales: {
        r: {
          min: 0,
          max: 3,
          ticks: { stepSize: 1, font: { size: 10 }, backdropColor: 'transparent', color: '#999' },
          grid: { color: 'rgba(0,0,0,0.1)', lineWidth: 1 },
          angleLines: { color: 'rgba(0,0,0,0.12)', lineWidth: 1 },
          pointLabels: { font: { size: 12, weight: '600' }, color: '#444', padding: 12 }
        }
      }
    }
  });
  pdCharts.push(chart);
}

// ════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════
function scalePDScores(rawScores) {
  var areas = ['selfdirect','limitless','unlearnrelearn','fastloop','deadline'];
  var scaled = {};
  for (var i = 0; i < areas.length; i++) {
    var a = areas[i];
    scaled[a] = {
      total: Math.round(rawScores[a].total / 12 * 10),
      dims: rawScores[a].dims.slice()
    };
  }
  return scaled;
}

function getPDTotal(scores) {
  var total = 0;
  var areas = ['selfdirect','limitless','unlearnrelearn','fastloop','deadline'];
  for (var i = 0; i < areas.length; i++) total += scores[areas[i]].total;
  return total;
}

function getPDInterpretation(areaKey, total) {
  var interp = PD_INTERPRETATIONS[areaKey];
  if (total <= 3) return interp.low;
  if (total <= 7) return interp.mid;
  return interp.high;
}

function hexToRgba(hex, alpha) {
  var r = parseInt(hex.slice(1,3), 16);
  var g = parseInt(hex.slice(3,5), 16);
  var b = parseInt(hex.slice(5,7), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

// ════════════════════════════════════════════════
// LEARNING PATH
// ════════════════════════════════════════════════
function renderPDLearningPath(scores) {
  var container = document.getElementById('pd-learning-path');
  if (!container) return;

  var areas = ['selfdirect','limitless','unlearnrelearn','fastloop','deadline'];

  // Sort ascending by score (weakest first = highest priority)
  var sorted = areas.slice().sort(function(a, b) {
    return scores[a].total - scores[b].total;
  });

  var topKey = sorted[0];
  var topComp = PD_COMPETENCIES[topKey];
  var topStage = PD_STAGE_MAP[topKey];

  var html = '<div class="pd-path-section">' +
    '<div class="pd-path-eyebrow">📍 당신의 맞춤 학습 경로</div>' +
    '<p class="pd-path-desc">진단 결과를 바탕으로 가장 효과적인 학습 순서입니다. 점수가 낮은 역량부터 해당 단계를 먼저 훈련하세요.</p>';

  // Primary CTA
  html += '<div class="pd-path-primary">' +
    '<div class="pd-path-primary-label">⚡ 지금 바로 여기서 시작하세요</div>' +
    '<div class="pd-path-primary-content">' +
      '<span class="pd-path-primary-comp">' + topComp.icon + ' ' + topComp.name + '</span>' +
      '<span class="pd-path-primary-arrow">→</span>' +
      '<span class="pd-path-primary-stage">' + topStage.icon + ' ' + topStage.stage + '단계: ' + topStage.name + '</span>' +
    '</div>' +
    '<p class="pd-path-primary-reason">' + topStage.reason + '</p>' +
    '<a href="' + topStage.url + '" class="pd-path-cta">' + topStage.stage + '단계 시작하기 →</a>' +
  '</div>';

  // Full ranking list
  html += '<div class="pd-path-list-title">학습 추천 순서</div>';
  html += '<div class="pd-path-list">';
  for (var i = 0; i < sorted.length; i++) {
    var aKey = sorted[i];
    var comp = PD_COMPETENCIES[aKey];
    var stageInfo = PD_STAGE_MAP[aKey];
    var score = scores[aKey].total;
    var pct = Math.round(score / 10 * 100);
    var isPrimary = i === 0;

    html += '<a href="' + stageInfo.url + '" class="pd-path-item' + (isPrimary ? ' pd-path-item-primary' : '') + '">' +
      '<div class="pd-path-item-rank">' + (i + 1) + '</div>' +
      '<div class="pd-path-item-body">' +
        '<div class="pd-path-item-header">' +
          '<span class="pd-path-item-comp">' + comp.icon + ' ' + comp.name + '</span>' +
          '<span class="pd-path-item-sep">→</span>' +
          '<span class="pd-path-item-stage">' + stageInfo.icon + ' ' + stageInfo.stage + '단계: ' + stageInfo.name + '</span>' +
        '</div>' +
        '<div class="pd-path-item-reason">' + stageInfo.reason + '</div>' +
        '<div class="pd-path-mini-bar"><div class="pd-path-mini-fill" style="width:' + pct + '%;background:' + comp.color + '"></div></div>' +
      '</div>' +
      '<span class="pd-path-item-score">' + score + '/10</span>' +
    '</a>';
  }
  html += '</div></div>';

  container.innerHTML = html;
}

// ════════════════════════════════════════════════
// SHARE / EXPORT
// ════════════════════════════════════════════════
function pdShareLink() {
  var scores = load('pd_diagnosis');
  if (!scores) return;
  try {
    var encoded = btoa(JSON.stringify(scores));
    var url = location.origin + location.pathname + '?result=' + encoded;
    navigator.clipboard.writeText(url).then(function() { showToast('🔗 링크가 복사되었습니다!'); });
  } catch(e) { showToast('링크 복사에 실패했습니다.'); }
}

function populateShareCard(scores, profile, grade) {
  document.getElementById('sc-emoji').textContent = profile.emoji;
  document.getElementById('sc-name').textContent = profile.name;
  document.getElementById('sc-grade').innerHTML = '<span class="sc-grade-badge">' + grade.emoji + ' ' + grade.label + '</span>';
  document.getElementById('sc-score-num').textContent = getPDTotal(scores);

  var areas = ['selfdirect','limitless','unlearnrelearn','fastloop','deadline'];
  var html = '';
  for (var i = 0; i < areas.length; i++) {
    var a = areas[i];
    var comp = PD_COMPETENCIES[a];
    var val = scores[a].total;
    var pct = Math.round(val / 10 * 100);
    html += '<div class="sc-bar-row" style="border-left-color:' + comp.color + '">' +
      '<span class="sc-bar-label">' + comp.icon + ' ' + comp.name + '</span>' +
      '<div class="sc-bar-track"><div class="sc-bar-fill" style="width:' + pct + '%;background:' + comp.color + '"></div></div>' +
      '<span class="sc-bar-val">' + val + '/10</span>' +
    '</div>';
  }
  document.getElementById('sc-bars').innerHTML = html;
}

function pdSaveImage() {
  var card = document.getElementById('pd-share-card');
  if (!card || typeof domtoimage === 'undefined') { showToast('저장 기능을 사용할 수 없습니다.'); return; }
  showToast('이미지 생성 중...');
  domtoimage.toPng(card, { scale: 2, width: 640, height: 640 })
    .then(function(dataUrl) {
      var a = document.createElement('a');
      a.download = 'pd-result.png';
      a.href = dataUrl;
      a.click();
      showToast('✅ 저장 완료!');
    })
    .catch(function() { showToast('이미지 저장에 실패했습니다.'); });
}
