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

  // highlight selected
  var opts = document.querySelectorAll('#pd-quiz-question-area .quiz-opt');
  for (var i = 0; i < opts.length; i++) {
    if (i === optIdx) opts[i].classList.add('selected');
    else opts[i].classList.remove('selected');
  }

  // auto-advance
  setTimeout(function() {
    if (PDD.index < PD_QUESTIONS.length - 1) {
      PDD.index++;
      renderPDQuestion(PDD.index);
    } else {
      finishPDQuiz();
    }
  }, 350);
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
