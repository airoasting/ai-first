// ════════════════════════════════════════════════
// PD: 5대 핵심 역량 메타데이터
// ════════════════════════════════════════════════
const PD_COMPETENCIES = {
  selfdirect: {
    id: 'selfdirect',
    name: '자기주도성',
    nameEn: 'Self-directedness',
    icon: '🧭',
    color: '#8b5cf6',
    tagline: 'AI 활용 방향 설정',
    desc: 'AI에게 무엇을 시킬지 스스로 정의하고 실행 방향을 설계하는 능력',
    question: 'AI에게 무엇을 시킬지 스스로 고민하고 있는가?',
    context: 'AI에게 무엇을 왜 시킬지 정하는 것이 더 중요해짐',
    contrast: { before: '시키는 대로만', after: '"무엇을 시키지?"' },
    subDimensions: ['문제 인식', '방향 설정', '자발적 탐색', '의사결정 주도']
  },
  limitless: {
    id: 'limitless',
    name: 'Limitless Mindset',
    nameEn: 'Limitless Mindset',
    icon: '🌐',
    color: '#3b82f6',
    tagline: '영역 제한 없는 사고',
    desc: 'AI가 실행을 대체하므로 "내 영역 밖"이란 개념 자체가 소멸',
    question: "'안해봤으니, 모르니까'라는 생각에 갇혀 있는가?",
    context: '전문 영역의 지식에 바로 접근 가능함',
    contrast: { before: '"이건 못 해"', after: '"무엇을 물어볼까?"' },
    subDimensions: ['영역 확장', '도전 의지', '질문 활용', '한계 전환']
  },
  unlearnrelearn: {
    id: 'unlearnrelearn',
    name: 'Unlearn-Relearn',
    nameEn: 'Unlearn-Relearn',
    icon: '🔄',
    color: '#f59e0b',
    tagline: '지속적 학습',
    desc: '과거 성공 방정식이 빠르게 무효화. 경력·직급보다 학습 속도가 경쟁력',
    question: '과거 성공 공식에 여전히 의존하고 있지 않은가?',
    context: '과거의 성공 방정식이 근본적으로 변화 중임',
    contrast: { before: '"내 경험상…"', after: '"제로 베이스로 다시"' },
    subDimensions: ['기존 방식 탈피', '제로베이스 사고', '학습 속도', '변화 수용']
  },
  deadline: {
    id: 'deadline',
    name: '1/10 데드라인',
    nameEn: '1/10 Deadline',
    icon: '⏱️',
    color: '#10b981',
    tagline: '극한 속도의 실행',
    desc: '기존 소요 시간을 측정한 뒤, AI로 1/10 이내 달성을 기본값으로 설정',
    question: '기존의 방식 대비 시간을 1/10로 단축할 방법을 실험 중인가?',
    context: '자료 생성의 시간이 극도로 단축됨',
    contrast: { before: '기획서 10일', after: '기획서 1일' },
    subDimensions: ['시간 압축', 'AI 위임 설계', '데드라인 준수', '병렬 작업']
  },
  fastloop: {
    id: 'fastloop',
    name: '빠른 검증·반복',
    nameEn: 'Fast Verification Loop',
    icon: '🔍',
    color: '#ef4444',
    tagline: 'AI 산출물 검증',
    desc: 'AI 할루시네이션은 불가피. 완벽 1회보다 빠른 반복 검증이 품질을 결정',
    question: 'AI 산출물의 오류를 주도적으로 검증하고 있는가?',
    context: '할루시네이션 이슈가 존재함',
    contrast: { before: 'AI 답변 그대로 사용', after: '반드시 교차 검증' },
    subDimensions: ['교차 검증', '반복 개선', '오류 탐지', '피드백 반영']
  }
};

// ════════════════════════════════════════════════
// PD: 진단 문항 (20문항 = 5역량 × 4문항)
// ════════════════════════════════════════════════
const PD_QUESTIONS = [
  // ── 자기주도성 (SD1~SD4) ──
  { id:'SD1', area:'selfdirect', areaName:'자기주도성', subDim:0, subDimName:'문제 인식',
    title:'문제 인식',
    scenario:'팀 회의에서 "AI를 활용해서 업무 효율을 높이자"는 방향이 정해졌다. 회의 후 나의 첫 행동은?',
    options:[
      {text:'팀장이 구체적으로 뭘 하라고 할 때까지 기다린다', score:0},
      {text:'다른 팀에서 AI를 어떻게 쓰는지 사례를 검색해본다', score:1},
      {text:'우리 팀 업무 중 AI로 바꿀 수 있는 게 뭔지 AI에게 물어본다', score:2},
      {text:'우리 팀의 반복 업무를 직접 리스트업한 후, 각각 AI 위임 가능 여부를 판단한다', score:3}
    ]
  },
  { id:'SD2', area:'selfdirect', areaName:'자기주도성', subDim:1, subDimName:'방향 설정',
    title:'방향 설정',
    scenario:'새 프로젝트를 맡았다. AI를 적극 활용하라는 지시를 받았는데, 어디서부터 시작하겠는가?',
    options:[
      {text:'AI 도구 사용법 튜토리얼부터 찾아본다', score:1},
      {text:'프로젝트의 최종 산출물과 마감일을 먼저 정의한 후, AI에게 맡길 부분을 나눈다', score:3},
      {text:'AI에게 "이 프로젝트 어떻게 진행하면 좋을까?"라고 물어본다', score:2},
      {text:'이전 프로젝트 방식대로 진행하면서, 필요할 때 AI를 쓴다', score:0}
    ]
  },
  { id:'SD3', area:'selfdirect', areaName:'자기주도성', subDim:2, subDimName:'자발적 탐색',
    title:'자발적 탐색',
    scenario:'일상 업무 중 반복적으로 시간이 많이 걸리는 작업이 있다. 이에 대한 나의 태도는?',
    options:[
      {text:'원래 이렇게 하는 거니까 그냥 한다', score:0},
      {text:'불편하긴 하지만 바꿀 시간이 없다', score:1},
      {text:'AI로 자동화할 수 있는지 틈틈이 실험해본다', score:3},
      {text:'IT팀에 자동화 요청을 넣어둔다', score:2}
    ]
  },
  { id:'SD4', area:'selfdirect', areaName:'자기주도성', subDim:3, subDimName:'의사결정 주도',
    title:'의사결정 주도',
    scenario:'AI가 제안한 3가지 전략 방향 중 어느 것을 택할지 결정해야 한다. 어떻게 하겠는가?',
    options:[
      {text:'AI에게 "가장 좋은 거 골라줘"라고 한다', score:1},
      {text:'3가지 다 실행해보고 결과를 보겠다', score:0},
      {text:'상사에게 어떤 걸 선택할지 판단을 맡긴다', score:1},
      {text:'우리 상황(예산·인력·긴급성)에 맞춰 내가 직접 1개를 선택하고 이유를 정리한다', score:3}
    ]
  },

  // ── Limitless Mindset (LM1~LM4) ──
  { id:'LM1', area:'limitless', areaName:'Limitless Mindset', subDim:0, subDimName:'영역 확장',
    title:'영역 확장',
    scenario:'마케팅 담당인데, 갑자기 데이터 분석이 필요한 프로젝트에 투입됐다. 데이터 분석은 해본 적 없다. 첫 반응은?',
    options:[
      {text:'"저는 마케팅이라 데이터 분석은 못 합니다"라고 말한다', score:0},
      {text:'데이터팀에 분석을 대신해달라고 요청한다', score:1},
      {text:'AI에게 데이터 분석 기초를 물어보며 직접 시도해본다', score:3},
      {text:'온라인 강의를 등록해서 먼저 공부한다', score:2}
    ]
  },
  { id:'LM2', area:'limitless', areaName:'Limitless Mindset', subDim:1, subDimName:'도전 의지',
    title:'도전 의지',
    scenario:'경쟁사가 AI 기반 신규 서비스를 출시했다. 우리 팀에도 비슷한 것을 만들자는 의견이 나왔다. 나의 반응은?',
    options:[
      {text:'"우리 팀은 그런 기술력이 없어서 어렵다"', score:0},
      {text:'"일단 벤치마킹 자료부터 모아보자"', score:2},
      {text:'"AI에게 프로토타입 설계를 시키고 가능성을 먼저 확인하자"', score:3},
      {text:'"전문 업체에 외주를 주는 게 낫다"', score:1}
    ]
  },
  { id:'LM3', area:'limitless', areaName:'Limitless Mindset', subDim:2, subDimName:'질문 활용',
    title:'질문 활용',
    scenario:'전혀 모르는 분야의 보고서를 이해해야 한다. 가장 먼저 하는 행동은?',
    options:[
      {text:'해당 분야 전문가에게 설명해달라고 부탁한다', score:1},
      {text:'AI에게 "이 보고서의 핵심을 비전문가가 이해할 수 있게 설명해줘"라고 한다', score:2},
      {text:'AI에게 먼저 요약을 시키고, 모르는 용어를 하나씩 추가 질문하며 파악한다', score:3},
      {text:'관련 책이나 강의를 찾아서 기초부터 공부한다', score:0}
    ]
  },
  { id:'LM4', area:'limitless', areaName:'Limitless Mindset', subDim:3, subDimName:'한계 전환',
    title:'한계 전환',
    scenario:'"이건 우리 부서 소관이 아닌데?"라는 업무가 떨어졌다. 나의 반응은?',
    options:[
      {text:'담당 부서로 넘긴다', score:0},
      {text:'일단 맡되, 관련 부서에 협조를 구한다', score:2},
      {text:'AI를 활용해서 해당 영역의 기본 프레임을 잡은 후, 전문가에게 검증받는다', score:3},
      {text:'상사에게 이건 우리 일이 아니라고 보고한다', score:1}
    ]
  },

  // ── Unlearn-Relearn (UR1~UR4) ──
  { id:'UR1', area:'unlearnrelearn', areaName:'Unlearn-Relearn', subDim:0, subDimName:'기존 방식 탈피',
    title:'기존 방식 탈피',
    scenario:'10년간 써온 보고서 양식이 있다. 후배가 "AI로 새 양식을 만들어보면 어떨까요?"라고 제안했다. 나의 반응은?',
    options:[
      {text:'"이 양식은 검증된 거야. 바꿀 필요 없어"', score:0},
      {text:'"좋은 생각이네. AI에게 기존 양식의 문제점을 분석시킨 후 개선안을 만들어보자"', score:3},
      {text:'"나중에 시간 나면 한번 해보자"', score:1},
      {text:'"일단 새 양식 만들어봐. 괜찮으면 쓰자"', score:2}
    ]
  },
  { id:'UR2', area:'unlearnrelearn', areaName:'Unlearn-Relearn', subDim:1, subDimName:'제로베이스 사고',
    title:'제로베이스 사고',
    scenario:'매년 같은 방식으로 진행하던 연례 행사의 기획을 맡았다. 올해는 어떻게 접근하겠는가?',
    options:[
      {text:'작년 기획서를 복사해서 날짜만 바꾼다', score:0},
      {text:'작년 기획서를 기반으로 소폭 개선한다', score:1},
      {text:'AI에게 "올해 트렌드를 반영한 기획안을 만들어줘"라고 한다', score:2},
      {text:'"이 행사의 목적이 무엇인가?"부터 다시 묻고, AI와 함께 제로베이스에서 재설계한다', score:3}
    ]
  },
  { id:'UR3', area:'unlearnrelearn', areaName:'Unlearn-Relearn', subDim:2, subDimName:'학습 속도',
    title:'학습 속도',
    scenario:'새로운 AI 도구가 매주 출시되고 있다. 나의 학습 방식은?',
    options:[
      {text:'지금 쓰는 도구로 충분하다. 새 도구까지 배울 여유가 없다', score:0},
      {text:'뉴스레터를 구독해서 트렌드는 파악하고 있다', score:1},
      {text:'관심 가는 도구는 직접 써보면서 기존 도구와 비교해본다', score:2},
      {text:'매주 30분씩 새 도구를 실험하고, 기존 업무에 적용할 수 있는지 테스트한다', score:3}
    ]
  },
  { id:'UR4', area:'unlearnrelearn', areaName:'Unlearn-Relearn', subDim:3, subDimName:'변화 수용',
    title:'변화 수용',
    scenario:'회사가 기존 업무 프로세스를 전면 AI 기반으로 전환한다고 발표했다. 나의 반응은?',
    options:[
      {text:'"갑자기 바꾸면 혼란만 생긴다"며 반대 의견을 낸다', score:0},
      {text:'일단 지켜보다가 주변이 적응하면 따라간다', score:1},
      {text:'새 프로세스를 빨리 익혀서 적응하려고 노력한다', score:2},
      {text:'변환 과정에서 발생할 문제를 미리 예측하고, AI로 파일럿 테스트를 자발적으로 진행한다', score:3}
    ]
  },

  // ── 1/10 데드라인 (DL1~DL4) ──
  { id:'DL1', area:'deadline', areaName:'1/10 데드라인', subDim:0, subDimName:'시간 압축',
    title:'시간 압축',
    scenario:'평소 5일 걸리던 기획서 작성 업무를 맡았다. AI를 활용해 시간을 줄이라는 지시를 받았다. 목표를 어떻게 설정하겠는가?',
    options:[
      {text:'AI를 써도 3~4일은 필요할 것 같다', score:0},
      {text:'2~3일이면 가능할 것 같다', score:1},
      {text:'1일 안에 끝내는 것을 목표로 잡는다', score:3},
      {text:'AI에게 "빨리 해줘"라고 하면 반나절이면 될 것 같다', score:2}
    ]
  },
  { id:'DL2', area:'deadline', areaName:'1/10 데드라인', subDim:1, subDimName:'AI 위임 설계',
    title:'AI 위임 설계',
    scenario:'보고서를 AI와 함께 작성해야 한다. 시작 전 가장 먼저 하는 일은?',
    options:[
      {text:'AI에게 "보고서 써줘"라고 바로 시킨다', score:1},
      {text:'보고서 목차를 직접 잡고, 각 섹션별로 AI가 할 일과 내가 할 일을 나눈다', score:3},
      {text:'일단 직접 초안을 쓰고, 막히는 부분만 AI에게 물어본다', score:0},
      {text:'AI에게 목차부터 만들어달라고 한다', score:2}
    ]
  },
  { id:'DL3', area:'deadline', areaName:'1/10 데드라인', subDim:2, subDimName:'데드라인 준수',
    title:'데드라인 준수',
    scenario:'오후 3시까지 발표 자료 10장이 필요하다. 현재 오전 10시다. 어떻게 접근하겠는가?',
    options:[
      {text:'10장을 순서대로 하나씩 만든다', score:0},
      {text:'"12시까지 완성"이라고 데드라인을 앞당겨 잡고, AI와 역할을 나눠 병렬 작업한다', score:3},
      {text:'AI에게 10장 전부 만들어달라고 한다', score:1},
      {text:'핵심 3장만 먼저 만들고 나머지는 나중에 추가한다', score:2}
    ]
  },
  { id:'DL4', area:'deadline', areaName:'1/10 데드라인', subDim:3, subDimName:'병렬 작업',
    title:'병렬 작업',
    scenario:'시장 분석 + 경쟁사 분석 + 재무 모델을 동시에 준비해야 한다. 어떻게 진행하겠는가?',
    options:[
      {text:'시장 분석부터 순서대로 하나씩 끝낸다', score:0},
      {text:'세 작업의 AI 프롬프트를 동시에 준비해서 병렬로 진행하고, 결과를 통합한다', score:3},
      {text:'AI에게 세 가지를 한 번에 요청한다', score:1},
      {text:'각 분석을 팀원에게 나눠서 맡긴다', score:2}
    ]
  },

  // ── 빠른 검증·반복 (FL1~FL4) ──
  { id:'FL1', area:'fastloop', areaName:'빠른 검증·반복', subDim:0, subDimName:'교차 검증',
    title:'교차 검증',
    scenario:'AI가 작성한 시장 분석 보고서에서 "이 시장은 연 25% 성장 중"이라는 수치를 발견했다. 다음 행동은?',
    options:[
      {text:'AI가 분석한 거니까 신뢰하고 그대로 사용한다', score:0},
      {text:'AI에게 "이 수치의 출처를 알려줘"라고 물어본다', score:1},
      {text:'직접 업계 보고서나 공신력 있는 소스에서 해당 수치를 교차 확인한다', score:3},
      {text:'수치가 너무 높은 것 같아서 삭제한다', score:1}
    ]
  },
  { id:'FL2', area:'fastloop', areaName:'빠른 검증·반복', subDim:1, subDimName:'반복 개선',
    title:'반복 개선',
    scenario:'AI가 만든 기획서 초안이 70점짜리다. 어떻게 하겠는가?',
    options:[
      {text:'70점이면 괜찮으니 그대로 제출한다', score:0},
      {text:'"청중이 CFO인데, 재무적 임팩트 중심으로 다시 써줘"처럼 구체적 피드백을 주고 다시 시킨다', score:3},
      {text:'AI를 버리고 직접 처음부터 다시 쓴다', score:1},
      {text:'AI에게 "더 잘 써줘"라고 한다', score:1}
    ]
  },
  { id:'FL3', area:'fastloop', areaName:'빠른 검증·반복', subDim:2, subDimName:'오류 탐지',
    title:'오류 탐지',
    scenario:'AI가 정리한 경쟁사 분석에서 A사의 매출이 "5,000억 원"이라고 되어 있다. 평소 알기로는 3,000억 원대였다. 어떻게 하겠는가?',
    options:[
      {text:'AI가 최신 정보를 반영한 거겠지 하고 넘어간다', score:0},
      {text:'AI에게 "이 수치 맞아?"라고 다시 물어본다', score:1},
      {text:'"A사 최근 매출"을 직접 검색해서 확인하고, 틀리면 수정한다', score:3},
      {text:'해당 수치를 빼고 정성적 분석으로 대체한다', score:2}
    ]
  },
  { id:'FL4', area:'fastloop', areaName:'빠른 검증·반복', subDim:3, subDimName:'피드백 반영',
    title:'피드백 반영',
    scenario:'AI에게 3번 수정을 시켰는데 여전히 만족스럽지 않다. 어떻게 하겠는가?',
    options:[
      {text:'"AI는 역시 한계가 있구나" 하고 직접 처음부터 쓴다', score:0},
      {text:'내 프롬프트가 문제일 수 있으니, 역할·맥락·출력 형식을 더 구체적으로 재설계한 후 다시 시도한다', score:3},
      {text:'다른 AI 모델로 바꿔서 같은 요청을 해본다', score:2},
      {text:'지금 나온 결과에서 쓸 만한 부분만 발췌한다', score:1}
    ]
  }
];

// ════════════════════════════════════════════════
// PD: 결과 프로필
// ════════════════════════════════════════════════
const PD_PROFILES = {
  pd_starter: {
    emoji: '🌱', name: 'AI 입문자',
    message: '아직 AI와의 협업이 익숙하지 않은 단계예요. 하지만 시작이 반! 각 역량을 하나씩 키워가면 빠르게 성장할 수 있어요.',
    tags: ['시작 단계', '성장 잠재력']
  },
  pd_executor: {
    emoji: '🏃', name: '실행 중심형',
    message: '속도와 검증에는 강하지만, "무엇을 왜 해야 하는가"를 먼저 정의하는 습관이 필요해요. 방향 설정 역량을 키워보세요.',
    tags: ['빠른 실행력', '방향 설정 필요']
  },
  pd_thinker: {
    emoji: '💭', name: '사고 중심형',
    message: '문제 인식과 학습에는 강하지만, 실행 속도와 검증 루프를 강화해야 해요. AI를 활용한 빠른 실험을 시작해보세요.',
    tags: ['깊은 사고력', '실행 속도 필요']
  },
  pd_traditionalist: {
    emoji: '📚', name: '경험 의존형',
    message: '풍부한 경험이 있지만, AI 시대에는 과거 방식을 과감히 내려놓는 것이 필요해요. Unlearn-Relearn부터 시작해보세요.',
    tags: ['풍부한 경험', '변화 수용 필요']
  },
  pd_ai_definer: {
    emoji: '⚡', name: 'AI 네이티브 리더',
    message: '5대 역량을 고르게 갖추고 있어요! 이제 이 능력을 팀과 조직 전체로 확산시킬 차례예요.',
    tags: ['균형잡힌 역량', '리더 잠재력']
  }
};

// ════════════════════════════════════════════════
// PD: 역량별 해석 텍스트
// ════════════════════════════════════════════════
const PD_INTERPRETATIONS = {
  selfdirect: {
    low: 'AI에게 무엇을 시킬지 직접 정의하기보다, 주어진 지시를 따르는 경향이 있어요. "내가 풀어야 할 문제는 무엇인가?"를 먼저 묻는 습관을 들여보세요.',
    mid: '문제를 인식하는 눈은 있지만, AI 활용 방향을 주도적으로 설계하는 데는 아직 연습이 필요해요. 업무마다 "AI에게 뭘 시킬까?"를 먼저 생각해보세요.',
    high: '스스로 문제를 정의하고 AI 활용 방향을 설계하는 능력이 뛰어나요. 이 역량을 팀원들에게도 전파해보세요.'
  },
  limitless: {
    low: '"이건 내 영역이 아니야"라는 생각이 강한 편이에요. AI 시대에는 영역의 경계가 사라지고 있어요. 작은 것부터 새로운 영역에 도전해보세요.',
    mid: '새로운 영역에 대한 호기심은 있지만, 실제 도전으로 연결되지 않는 경우가 있어요. AI를 "모르는 영역의 가이드"로 활용해보세요.',
    high: '영역 제한 없이 다양한 분야에 AI를 활용하고 있어요. 이 열린 마인드셋이 AI 시대의 가장 큰 경쟁력이에요.'
  },
  unlearnrelearn: {
    low: '과거 성공 경험에 의존하는 경향이 강해요. AI가 빠르게 바꾸는 환경에서는 "제로베이스"로 다시 생각하는 연습이 필요해요.',
    mid: '변화의 필요성은 인식하지만, 기존 방식을 내려놓기 어려운 때가 있어요. 작은 업무부터 "이전과 다른 방식"을 실험해보세요.',
    high: '빠르게 배우고, 기존 방식을 과감히 버리는 능력이 뛰어나요. 이 학습 속도가 경력·직급보다 강력한 경쟁력이에요.'
  },
  deadline: {
    low: 'AI를 활용한 시간 단축 경험이 부족해요. 다음 업무에서 "기존의 1/10 시간 안에 끝내기"를 한 번 도전해보세요.',
    mid: 'AI로 시간을 줄이려는 시도를 하고 있지만, 아직 극적인 단축까지는 이르지 못했어요. AI 위임 설계와 병렬 작업 기법을 익혀보세요.',
    high: 'AI와의 역할 분담을 통해 극적인 시간 단축을 실현하고 있어요. 1/10 데드라인이 기본값인 AI 네이티브에 가까워요.'
  },
  fastloop: {
    low: 'AI 산출물을 그대로 사용하는 경향이 있어요. AI 할루시네이션은 불가피하기 때문에, 반드시 교차 검증하는 습관을 들여야 해요.',
    mid: '검증의 중요성은 알지만, 체계적인 검증 루프가 아직 부족해요. "한 번 더 확인"하는 습관이 품질을 결정해요.',
    high: 'AI 산출물을 빠르게 검증하고 반복 개선하는 루프가 잘 갖춰져 있어요. 이 습관이 AI 시대 품질의 핵심이에요.'
  }
};

// ════════════════════════════════════════════════
// PD: 역량 × 학습 단계 매핑
// ════════════════════════════════════════════════
const PD_STAGE_MAP = {
  selfdirect:     { stage: 1, url: 'stage1.html', name: '프롬프트 실전 훈련', icon: '🛠️', reason: '"무엇을, 왜 시킬지" 직접 정의하는 것이 프롬프트의 본질입니다.' },
  limitless:      { stage: 2, url: 'stage2.html', name: '정보 탐색', icon: '🔭', reason: '모르는 영역을 AI로 탐색하는 것이 Limitless Mindset의 실전입니다.' },
  unlearnrelearn: { stage: 3, url: 'stage3.html', name: '방향 설정', icon: '💡', reason: '제로베이스로 방향을 재설계하는 훈련이 Unlearn-Relearn의 핵심입니다.' },
  fastloop:       { stage: 4, url: 'stage4.html', name: '근거 확인', icon: '⚖️', reason: 'AI 산출물 교차검증·반복 루프를 실전에서 훈련합니다.' },
  deadline:       { stage: 5, url: 'stage5.html', name: '결과물 완성', icon: '🚀', reason: '1시간 안에 완성하는 것 자체가 1/10 데드라인 훈련입니다.' }
};

// ════════════════════════════════════════════════
// PD: 등급 판정
// ════════════════════════════════════════════════
function getPDScoreGrade(total) {
  if (total >= 42) return { label: 'AI 네이티브 리더', cls: 'grade-master', emoji: '⚡' };
  if (total >= 33) return { label: '문제 정의 고수', cls: 'grade-great', emoji: '🔥' };
  if (total >= 25) return { label: '성장 중', cls: 'grade-growing', emoji: '🌱' };
  if (total >= 17) return { label: '가능성 충분', cls: 'grade-potential', emoji: '💪' };
  return { label: '시작이 반!', cls: 'grade-start', emoji: '🚀' };
}

// 프로필 판정
function determinePDProfile(scores) {
  var total = 0;
  var areas = ['selfdirect','limitless','unlearnrelearn','fastloop','deadline'];
  for (var i = 0; i < areas.length; i++) total += scores[areas[i]].total;

  if (total >= 42) return 'pd_ai_definer';
  if (total <= 17) return 'pd_starter';

  // 실행 그룹 (deadline + fastloop) vs 사고 그룹 (selfdirect + limitless)
  var execScore = scores.deadline.total + scores.fastloop.total;
  var thinkScore = scores.selfdirect.total + scores.limitless.total;

  if (scores.unlearnrelearn.total <= 3) return 'pd_traditionalist';
  if (execScore > thinkScore + 3) return 'pd_executor';
  if (thinkScore > execScore + 3) return 'pd_thinker';

  // 가장 낮은 영역 기반
  var minArea = areas[0];
  for (var i = 1; i < areas.length; i++) {
    if (scores[areas[i]].total < scores[minArea].total) minArea = areas[i];
  }
  if (minArea === 'unlearnrelearn') return 'pd_traditionalist';
  if (minArea === 'deadline' || minArea === 'fastloop') return 'pd_thinker';
  return 'pd_executor';
}
