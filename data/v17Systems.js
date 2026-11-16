// V17.0 신규 시스템 데이터: 즉결 재판소, 코스튬, 럭키 캡슐, 콩이 산책 돌발 이벤트

export const COURT_CASES = [
  {
    villain: '🚬 길빵 흡연충',
    excuse: '"내가 언제 금연구역에서 담배를 폈다고 그래?! 증거도 없으면서 생사람 잡네!"',
    options: [
      '📸 "타임스탬프 찍힌 4K 채증 영상과 꽁초 투기 사진 여기 있습니다!"',
      '🗣️ "그냥 눈빛만 봐도 폈을 것 같은데요?"',
      '🏃 "아... 그럼 제가 잘못 봤나 보네요..."',
    ],
    answer: 0,
    okMsg: '⚖️ [이의 있음 대성공!!] 빼박 채증 영상에 빌런이 꼬리를 내렸습니다! 벌금 2.5배 몰수!',
    failMsg: '⚖️ 증거 불충분으로 훈방 조치되었습니다... 다음엔 정확히 들이미세요!',
  },
  {
    villain: '🚙 스쿨존 불법주차 차주',
    excuse: '"비상등 켜고 딱 3분만 약국 갔다 온 건데 이게 무슨 불법이야?!"',
    options: [
      '🏃 "3분이면 봐줄 만하긴 하네요..."',
      '⚖️ "어린이보호구역은 주정차 절대 금지 구역! 도로교통법 과태료 3배 대상입니다!"',
      '🗣️ "차가 너무 커서 보기 싫어요!"',
    ],
    answer: 1,
    okMsg: '⚖️ [판사 봉 쾅쾅!!] 완벽한 법 조항 인용! 과태료 2.5배 즉시 징수 완료!',
    failMsg: '⚖️ 논점이 흐려져 과태료 증액에 실패했습니다...',
  },
  {
    villain: '📱 영화관 폰딧불이',
    excuse: '"어두워서 화면 밝기 최저로 해놨는데 그게 뭐가 방해된다고 난리야!"',
    options: [
      '📸 "암전 상영관 빛 반사 측정치 & 주변 관객 진술서 전부 제출합니다!"',
      '🗣️ "다음부턴 조심하세요~"',
      '📱 "저도 사실 카톡 좀 봤어요..."',
    ],
    answer: 0,
    okMsg: '⚖️ [완벽한 반박!!] 관객 피해 입증 성공! 위자료 2.5배 + 팔로워 폭발!',
    failMsg: '⚖️ 재판부가 미온적인 태도를 보이며 경고로 끝났습니다...',
  },
  {
    villain: '🔊 공공장소 스피커 빌런',
    excuse: '"유튜브 쇼츠 소리 좀 틀고 본 게 무슨 죄라고 신고까지 해?!"',
    options: [
      '🗣️ "노래가 제 취향이 아니었어요!"',
      '🏃 "이어폰 사드리면 되나요?"',
      '⚖️ "경범죄 처벌법상 인근소란죄! 데시벨 측정 기록 82dB 제출합니다!"',
    ],
    answer: 2,
    okMsg: '⚖️ [인근소란죄 확정!!] 데시벨 증거 앞엔 장사 없다! 벌금 2.5배 몰수!',
    failMsg: '⚖️ 법적 근거를 대지 못해 빌런이 뻔뻔하게 빠져나갔습니다...',
  },
];

export const COSTUMES = [
  {
    id: 'default',
    name: '🧥 시민영웅 기본 점퍼',
    desc: '노란 완장이 돋보이는 기본 복장',
    unlockText: '기본 지급',
    check: () => true,
  },
  {
    id: 'police',
    name: '👮 명예 경찰 제복',
    desc: '[법전 들이밀기] 주사위 +3 보정',
    unlockText: '모범시민 30+ 또는 보스 2명 처치',
    check: (s) => (s.lawful >= 30) || (s.defeatedBossIds?.length || 0) >= 2,
  },
  {
    id: 'dark',
    name: '🕶️ 다크 히어로 코트',
    desc: '전투 시작 시 빌런 멘탈 -20% 선제 타격!',
    unlockText: '광인 지수 30+ 또는 승리 8회+',
    check: (s) => (s.chaotic >= 30) || (s.winCount || 0) >= 8,
  },
  {
    id: 'couple',
    name: '💑 러블리 커플룩',
    desc: '[합동 필살기] 사이다 소모 50 → 35로 감소!',
    unlockText: '유키 또는 클로이와 연인 성사',
    check: (s) => (s.lovers?.length || 0) >= 1,
  },
  {
    id: 'cyber',
    name: '⚡ 네오 사이버 슈트',
    desc: '매 턴 피버 +15% · 치명타 확률 +10%!',
    unlockText: '레벨 15+ 또는 승리 30회+',
    check: (s) => (s.level || 1) >= 15 || (s.winCount || 0) >= 30,
  },
  {
    id: 'golden_hero',
    name: '👑 1대 영웅의 황금 코트',
    desc: '전 스탯 +5 · 매 턴 인내심 +12 회복!',
    unlockText: '스토리 25화+ 또는 배틀타워 5층+',
    check: (s) => (s.chapterIndex || 0) >= 24 || (s.bestTowerFloor || 0) >= 5 || !!s.storyCleared,
  },
];

export const CAPSULE_POOL = [
  { weight: 5, id: 'jackpot', name: '💎 150 P 초특급 잭팟!', apply: (s) => { s.points += 150; } },
  { weight: 10, id: 'elixir', name: '🧪 만능 영약 (언변·깡·법 +1 영구)', apply: (s) => { s.stats.speech += 1; s.stats.guts += 1; s.stats.law += 1; } },
  { weight: 15, id: 'sp_full', name: '🫧 사이다 원액 (SP 풀충전 + 50P)', apply: (s) => { s.sp = s.maxSp; s.points += 50; } },
  { weight: 25, id: 'p45', name: '🪙 도덕 포인트 +45 P 당첨!', apply: (s) => { s.points += 45; } },
  { weight: 25, id: 'item', name: '💊 [청심환] 1개 획득!', apply: (s) => { s.inventory.push('cheongsimhwan'); } },
  { weight: 20, id: 'fail', name: '🥫 꽝... 캔커피 (HP +10 · SP +5)', apply: (s) => { s.hp = Math.min(s.maxHp, s.hp + 10); s.sp = Math.min(s.maxSp, s.sp + 5); } },
];

export const PET_WALK_EVENTS = [
  {
    title: '💩 배변봉투 안 챙긴 무개념 견주 발견!',
    text: '콩이가 풀숲에서 응가를 치우는 사이, 옆 견주가 자기 개 배변을 냅두고 도망가려 합니다!',
    choices: [
      {
        text: '🐶 "콩이야, 저기 봐!" + 여분 배변봉투 딱 들이밀기',
        sub: '모범 참교육 (법+1 · 도덕+30P · 유키 호감+5)',
        effect: { points: 30, law: 1, lawful: 8, yukiLove: 5 },
        reply: '견주가 얼굴이 빨개져서 바로 치웠습니다! 유키가 소식을 듣고 칭찬합니다!',
      },
      {
        text: '😈 확성기로 "저기요!! 강아지 응가 두고 가셨어요!!" 외치기',
        sub: '광인 참교육 (사이다+20 · 팔로워+200 · 클로이 호감+5)',
        effect: { sp: 20, chaotic: 8, followers: 200, chloeLove: 5 },
        reply: '공원 사람들 시선이 전부 쏠려 견주가 식은땀을 흘리며 치웠습니다!',
      },
    ],
  },
  {
    title: '🐕 목줄 안 채우고 뛰어다니는 대형견 주인!',
    text: '산책로에서 목줄을 푼 견주가 "우리 애는 안 물어요~" 하며 방치하고 있습니다!',
    choices: [
      {
        text: '⚖️ "동물보호법 과태료 대상입니다. 당장 목줄 채우세요!"',
        sub: '합법적 제압 (도덕+35P · 모범+10 · 유키 호감+5)',
        effect: { points: 35, lawful: 10, yukiLove: 5 },
        reply: '콩이도 늠름하게 앞을 지켜줘서 견주가 즉시 목줄을 채웠습니다!',
      },
      {
        text: '📸 채증 카메라 들이대며 "유튜브 박제 가볼까요?"',
        sub: '사이다 박제 (도덕+25P · 광인+8 · 팔로워+250)',
        effect: { points: 25, chaotic: 8, followers: 250 },
        reply: '카메라를 보자마자 견주가 허겁지겁 목줄을 채우고 사과했습니다!',
      },
    ],
  },
];
