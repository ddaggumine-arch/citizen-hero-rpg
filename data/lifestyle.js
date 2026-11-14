// V14.0: 반려견 · 자동차 · 장비 진화 · 15종 업적 데이터

export const CARS = [
  {
    level: 1,
    name: '🚙 중고 모닝 (경차)',
    cost: 180,
    driveBonus: 4,
    desc: '연비 최강! 야간 드라이브 데이트 해금 (호감도 +4 추가)',
  },
  {
    level: 2,
    name: '🚘 국산 준중형 세단',
    cost: 380,
    driveBonus: 6,
    desc: '정숙한 승차감! 남산 노을 드라이브 (호감도 +6, 모범 +5)',
  },
  {
    level: 3,
    name: '🏎️ 오픈카 로드스터',
    cost: 650,
    driveBonus: 9,
    desc: '서울 야경 끝판왕! 드라이브 호감도 +9 & 팔로워 +200',
  },
];

export const GEAR_UPGRADES = {
  water_gun: [
    { lv: 1, name: '🔫 고압 물총', bonusDmg: 0, cost: 0 },
    { lv: 2, name: '💦 고압 워터캐논', bonusDmg: 15, cost: 90, desc: '전투 피해 +15 & 확정 기절' },
    { lv: 3, name: '🚒 소방 호스 포', bonusDmg: 35, cost: 160, desc: '전투 피해 +35 & 확정 기절' },
  ],
  megaphone: [
    { lv: 1, name: '📢 고출력 메가폰', bonusDmg: 0, cost: 0 },
    { lv: 2, name: '🔊 클럽 우퍼 스피커', bonusDmg: 18, cost: 90, desc: '전투 피해 +18 & 사이다 +25' },
    { lv: 3, name: '🏟️ 콘서트 음향 폭격기', bonusDmg: 38, cost: 160, desc: '전투 피해 +38 & 사이다 +35' },
  ],
  mirror: [
    { lv: 1, name: '🪞 전신 반사 거울', bonusDmg: 0, cost: 0 },
    { lv: 2, name: '🪩 미러볼 반사판', bonusDmg: 14, cost: 90, desc: '전투 피해 +14 & HP +25 회복' },
    { lv: 3, name: '☀️ 360도 태양광 거울', bonusDmg: 32, cost: 160, desc: '전투 피해 +32 & HP +40 회복' },
  ],
};

export const ACHIEVEMENTS = [
  { id: 'ach_first_win', name: '🥊 첫 참교육', desc: '스토리 또는 순찰로 빌런 1명 제압', rewardDesc: '+25 P', check: (s) => (s.winCount || 0) >= 1, reward: (s) => { s.points += 25; } },
  { id: 'ach_5_wins', name: '🔥 동네 파수꾼', desc: '빌런 누적 5명 참교육', rewardDesc: '공격력 +2', check: (s) => (s.winCount || 0) >= 5, reward: (s) => { s.bonusDmg += 2; } },
  { id: 'ach_boss_1', name: '🚬 길빵 진압', desc: '4대 보스 중 1명 이상 격파', rewardDesc: '+40 P', check: (s) => (s.defeatedBossIds?.length || 0) >= 1, reward: (s) => { s.points += 40; } },
  { id: 'ach_pet', name: '🐶 콩이 집사', desc: '시바견 [콩이] 입양하기', rewardDesc: '최대HP +8', check: (s) => !!s.pet?.adopted, reward: (s) => { s.maxHp += 8; s.hp = Math.min(s.maxHp, s.hp + 8); } },
  { id: 'ach_pet_lv3', name: '🦴 모범 댕댕이', desc: '콩이 친밀도 Lv.3 이상 달성', rewardDesc: '배짱 +1', check: (s) => (s.pet?.level || 0) >= 3, reward: (s) => { s.stats.guts += 1; } },
  { id: 'ach_car_1', name: '🚗 오너 드라이버', desc: '첫 자동차 구매하기', rewardDesc: '+50 P', check: (s) => (s.carLevel || 0) >= 1, reward: (s) => { s.points += 50; } },
  { id: 'ach_car_3', name: '🏎️ 오픈카 플렉스', desc: '3단계 오픈카 로드스터 구매', rewardDesc: '팔로워 +500', check: (s) => (s.carLevel || 0) >= 3, reward: (s) => { s.followers = (s.followers || 120) + 500; } },
  { id: 'ach_gear_up', name: '🔧 장비 장인', desc: '참교육 장비 1개 이상 2단계 강화', rewardDesc: '공격력 +3', check: (s) => Object.values(s.gearLevels || {}).some((lv) => lv >= 2), reward: (s) => { s.bonusDmg += 3; } },
  { id: 'ach_perfect_snap', name: '📸 파파라치 신', desc: '타이밍 셔터 PERFECT 1회 성공', rewardDesc: '치명타 +5%', check: (s) => (s.perfectSnaps || 0) >= 1, reward: (s) => { s.critBonus += 0.05; } },
  { id: 'ach_lang_jp', name: '🇯🇵 일본어 능력자', desc: '일본어 Lv.4 이상 달성', rewardDesc: '언변 +1', check: (s) => (s.lang?.jp || 0) >= 4, reward: (s) => { s.stats.speech += 1; } },
  { id: 'ach_lang_en', name: '🇺🇸 영어 네이티브', desc: '영어 Lv.4 이상 달성', rewardDesc: '배짱 +1', check: (s) => (s.lang?.en || 0) >= 4, reward: (s) => { s.stats.guts += 1; } },
  { id: 'ach_lover', name: '💖 첫 연애 성사', desc: '유키 또는 클로이와 연인 되기', rewardDesc: '+60 P', check: (s) => (s.lovers?.length || 0) >= 1, reward: (s) => { s.points += 60; } },
  { id: 'ach_lawful_50', name: '😇 모범시민 표창', desc: '모범시민 지수 50 이상 달성', rewardDesc: '법률 +1', check: (s) => (s.lawful || 0) >= 50, reward: (s) => { s.stats.law += 1; } },
  { id: 'ach_chaotic_50', name: '😈 맑은 눈의 전설', desc: '광인 지수 50 이상 달성', rewardDesc: '공격력 +3', check: (s) => (s.chaotic || 0) >= 50, reward: (s) => { s.bonusDmg += 3; } },
  { id: 'ach_clean_city', name: '✨ 클린 서울', desc: '서울 민폐도 15% 이하 달성', rewardDesc: '+50 P', check: (s) => (s.chaosLevel ?? 25) <= 15, reward: (s) => { s.points += 50; } },
];
