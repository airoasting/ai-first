// ════════════════════════════════════════════════
// PD DIAGNOSIS PAGE STATE
// ════════════════════════════════════════════════
var PDD = {
  answers: [],
  index: 0
};

// ════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════
function initPDDiagnosis() {
  PDD.answers = [];
  PDD.index = 0;
  renderPDQuestion(PDD.index);
}

// ════════════════════════════════════════════════
// RENDER
// ════════════════════════════════════════════════
function renderPDQuestion(idx) {
  var q = PD_QUESTIONS[idx];

  var areaEl = document.getElementById('pd-quiz-area-label');
  var fillEl = document.getElementById('pd-quiz-progress-fill');
  var textEl = document.getElementById('pd-quiz-progress-text');
  var prevBtn = document.getElementById('pd-quiz-prev-btn');
  var qArea = document.getElementById('pd-quiz-question-area');

  if (areaEl) areaEl.textContent = q.areaName;
  if (fillEl) fillEl.style.width = (idx / PD_QUESTIONS.length * 100) + '%';
  if (textEl) textEl.textContent = idx + ' / ' + PD_QUESTIONS.length + ' 완료';
  if (prevBtn) prevBtn.style.display = idx > 0 ? 'inline-flex' : 'none';

  if (qArea) {
    var html = '<div class="quiz-q-card">' +
      '<div class="quiz-q-num">문항 ' + (idx + 1) + ' / ' + PD_QUESTIONS.length + '</div>' +
      '<div class="quiz-q-title">' + q.title + '</div>' +
      '<p class="quiz-q-scenario">' + q.scenario + '</p>' +
      '<div class="quiz-options">';
    for (var i = 0; i < q.options.length; i++) {
      html += '<button class="quiz-opt" onclick="selectPDAnswer(' + i + ')"' +
        ' aria-label="선택지 ' + (i+1) + ': ' + q.options[i].text + '">' +
        q.options[i].text + '</button>';
    }
    html += '</div></div>';
    qArea.innerHTML = html;
  }
}

// ════════════════════════════════════════════════
// INTERACTION
// ════════════════════════════════════════════════
function selectPDAnswer(optIdx) {
  var q = PD_QUESTIONS[PDD.index];
  var score = q.options[optIdx].score;
  PDD.answers[PDD.index] = {
    questionId: q.id,
    area: q.area,
    subDim: q.subDim,
    score: score
  };

  // highlight selected + micro-animation
  var opts = document.querySelectorAll('#pd-quiz-question-area .quiz-opt');
  for (var i = 0; i < opts.length; i++) {
    opts[i].disabled = true;
    if (i === optIdx) {
      opts[i].classList.add('selected');
      opts[i].style.animation = 'opt-select 0.3s ease';
    } else {
      opts[i].style.opacity = '0.45';
    }
  }

  // 5문항마다 마일스톤 카드 표시
  var nextIdx = PDD.index + 1;
  var isMilestone = nextIdx > 0 && nextIdx % 5 === 0 && nextIdx < PD_QUESTIONS.length;

  // auto-advance
  setTimeout(function() {
    if (PDD.index < PD_QUESTIONS.length - 1) {
      PDD.index++;
      if (isMilestone) {
        showMilestoneCard(nextIdx, function() { renderPDQuestion(PDD.index); });
      } else {
        renderPDQuestion(PDD.index);
      }
    } else {
      finishPDQuiz();
    }
  }, isMilestone ? 200 : 350);
}

var MILESTONE_MSGS = [
  { at: 5,  emoji: '✅', title: '5문항 완료!', sub: '자기주도성 역량 측정 완료. 다음은 Limitless Mindset입니다.' },
  { at: 10, emoji: '🔥', title: '절반 왔어요!', sub: '10문항 완료. 집중력 훌륭합니다. 계속 가봐요!' },
  { at: 15, emoji: '💪', title: '15문항 완료!', sub: '거의 다 왔습니다. 마지막 5문항만 남았어요.' }
];

function showMilestoneCard(idx, callback) {
  var msg = null;
  for (var i = 0; i < MILESTONE_MSGS.length; i++) {
    if (MILESTONE_MSGS[i].at === idx) { msg = MILESTONE_MSGS[i]; break; }
  }
  if (!msg) { callback(); return; }

  var qArea = document.getElementById('pd-quiz-question-area');
  if (!qArea) { callback(); return; }

  qArea.innerHTML =
    '<div class="quiz-milestone-card">' +
    '<div class="milestone-emoji">' + msg.emoji + '</div>' +
    '<div class="milestone-title">' + msg.title + '</div>' +
    '<div class="milestone-sub">' + msg.sub + '</div>' +
    '</div>';

  setTimeout(callback, 1200);
}

function pdQuizPrev() {
  if (PDD.index > 0) {
    PDD.index--;
    renderPDQuestion(PDD.index);
  }
}

// ════════════════════════════════════════════════
// FINISH
// ════════════════════════════════════════════════
function finishPDQuiz() {
  var fillEl = document.getElementById('pd-quiz-progress-fill');
  var textEl = document.getElementById('pd-quiz-progress-text');
  if (fillEl) fillEl.style.width = '100%';
  if (textEl) textEl.textContent = PD_QUESTIONS.length + ' / ' + PD_QUESTIONS.length + ' 완료';

  var scores = calcPDScores(PDD.answers);

  // Save previous to history
  var existing = load('pd_diagnosis');
  if (existing) {
    var hist = load('pd_diagnosis_history') || [];
    hist.push(existing);
    store('pd_diagnosis_history', hist);
  }
  store('pd_diagnosis', scores);

  setTimeout(function() {
    window.location.href = 'pd-result.html';
  }, 400);
}

// ════════════════════════════════════════════════
// SCORING
// ════════════════════════════════════════════════
function calcPDScores(answers) {
  var areas = ['selfdirect','limitless','unlearnrelearn','fastloop','deadline'];
  var scores = {};
  for (var i = 0; i < areas.length; i++) {
    scores[areas[i]] = { total: 0, dims: [0, 0, 0, 0] };
  }
  for (var i = 0; i < answers.length; i++) {
    var a = answers[i];
    if (a && scores[a.area]) {
      scores[a.area].total += a.score;
      scores[a.area].dims[a.subDim] += a.score;
    }
  }
  return scores;
}
