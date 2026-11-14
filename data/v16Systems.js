// V16.0 신규 시스템 데이터: 라이브 시청자 미션, 자취방 인테리어, 게릴라 빌런, 서울 주식, 히로인 선물

export const STREAM_MISSIONS = [
  { id: 'speech', label: '💬 [별풍선 미션] 이번 턴 "팩트폭력"으로 혼내주면 +35 P!', rewardP: 35, rewardF: 180 },
  { id: 'guts', label: '💬 [도네 미션] 이번 턴 "거울치료"로 멘탈 털면 +40 P!', rewardP: 40, rewardF: 220 },
  { id: 'law', label: '💬 [시청자 요청] 이번 턴 "법전 들이밀기" 시전 시 +35 P!', rewardP: 35, rewardF: 200 },
  { id: 'snap', label: '💬 [구독자 10만] 이번 턴 "채증 셔터"로 박제하면 +45 P!', rewardP: 45, rewardF: 260 },
];

export const ROOM_UPGRADES = [
  {
    id: 'mattress',
    name: '🛏️ 꿀잠 메모리폼 매트리스',
    cost: 110,
    desc: '하루가 지날 때마다 HP +15 자동 회복',
  },
  {
    id: 'soundproof',
    name: '🔇 프로 방음 부스',
    cost: 140,
    desc: '하루가 지날 때마다 사이다(SP) +12 자동 충전',
  },
  {
    id: 'desk',
    name: '🖥️ 4K 라이브 편집 데스크',
    cost: 180,
    desc: '전투 도네이션·라이브 팔로워 획득량 +35%',
  },
  {
    id: 'doghouse',
    name: '🐶 콩이 럭셔리 원목 하우스',
    cost: 160,
    desc: '콩이 전투 발목 물기 지원 확률 28% → 45% 상승!',
  },
];

export const GUERRILLA_VILLAINS = [
  {
    id: 'tuning_biker',
    name: '🏍️ 새벽 3시 배기음 튜닝 폭주족',
    location: '한강대로 한복판',
    maxHp: 115,
    atk: 15,
    reward: 95,
    weakness: 'law',
    weaknessLabel: '약점: ⚖️ 법지식',
    banterQuotes: [
      '"부아아앙!! 내 오토바이 배기음 예술이지?!"',
      '"새벽에 좀 달릴 수도 있지 뭘 신고를 해!"',
    ],
    defeatQuote: '"으악! 소음 측정기에 딱 걸렸네!!"',
    wanted: { emoji: '🏍️💨', crime: '심야 불법 튜닝 소음 테러', stars: '★★★★☆' },
  },
  {
    id: 'subway_legger',
    name: '🦵 지하철 2칸 차지 다리꼬기 빌런',
    location: '2호선 출근길 열차',
    maxHp: 105,
    atk: 14,
    reward: 85,
    weakness: 'guts',
    weaknessLabel: '약점: 🦁 깡다구',
    banterQuotes: [
      '"내 다리가 길어서 어쩔 수 없는데? 불편하면 서서 가!"',
      '"구두에 흙 묻었잖아! 물어낼 거야?!"',
    ],
    defeatQuote: '"아, 알았어요! 다리 오므릴게요 죄송해요!"',
    wanted: { emoji: '🦵💢', crime: '출근길 좌석 2인분 독점', stars: '★★★★☆' },
  },
  {
    id: 'illegal_parker',
    name: '🚙 횡단보도 앞 상습 불법주차 차주',
    location: '어린이보호구역 앞',
    maxHp: 125,
    atk: 16,
    reward: 105,
    weakness: 'speech',
    weaknessLabel: '약점: 🗣️ 언변',
    banterQuotes: [
      '"잠깐 비상등 켜고 5분만 대놓은 건데 왜 난리야!"',
      '"내 차 긁히면 네가 책임질 거냐?!"',
    ],
    defeatQuote: '"과태료 12만원?! 바로 차 뺄게요!!"',
    wanted: { emoji: '🚙🚨', crime: '스쿨존 횡단보도 불법 주정차', stars: '★★★★★' },
  },
];

export const STOCKS = [
  { id: 'cider_pharma', name: '🫧 사이다제약', basePrice: 30, min: 15, max: 65 },
  { id: 'manner_ent', name: '📺 참교육엔터', basePrice: 45, min: 20, max: 95 },
  { id: 'hanriver_ev', name: '🚗 한강모빌리티', basePrice: 60, min: 30, max: 125 },
];

export const HEROINE_GIFTS = [
  {
    id: 'matcha_set',
    name: '🍵 교토 고급 말차 세트',
    cost: 40,
    yukiLove: 14,
    chloeLove: 3,
    desc: '유키 최애 선물 (+14) · 클로이 (+3)',
  },
  {
    id: 'film_roll',
    name: '🎞️ 빈티지 코닥 필름 롤',
    cost: 40,
    yukiLove: 3,
    chloeLove: 14,
    desc: '클로이 최애 선물 (+14) · 유키 (+3)',
  },
  {
    id: 'vitamin_box',
    name: '💊 피로회복 비타민 박스',
    cost: 30,
    yukiLove: 8,
    chloeLove: 8,
    desc: '누구에게나 무난한 선물 (+8)',
  },
];
