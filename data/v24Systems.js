// V24.0: 난이도(노멀/하드/헬), 방어력+0.1% 유니크 파밍 장비, 콩이 특기 전직, 논리 카운터, 서울 익명 커뮤니티

export const DIFFICULTIES = {
  normal: {
    id: 'normal',
    name: '🌱 노멀 (NORMAL)',
    desc: '기본 밸런스 · 스토리 & 연애 추천',
    hpMult: 1.0,
    atkMult: 1.0,
    rewardMult: 1.0,
    uniqueRate: 0.001, // 0.1%
    dropChance: 0.35,
  },
  hard: {
    id: 'hard',
    name: '🔥 하드 (HARD)',
    desc: '적 체력 1.45배 · 공격 1.35배 | 보상 1.35배 · 드랍 2배',
    hpMult: 1.45,
    atkMult: 1.35,
    rewardMult: 1.35,
    uniqueRate: 0.003, // 0.3%
    dropChance: 0.50,
  },
  hell: {
    id: 'hell',
    name: '💀 헬 (HELL)',
    desc: '적 체력 2.1배 · 공격 1.85배 | 보상 1.85배 · 유니크 확률 3배!',
    hpMult: 2.1,
    atkMult: 1.85,
    rewardMult: 1.85,
    uniqueRate: 0.006, // 일반 0.6%, 보스 3%
    dropChance: 0.65,
  },
};

export const RARITY_INFO = {
  common: { label: '⬜ 일반', color: '#6c757d', salvageP: 15 },
  rare: { label: '🟦 레어', color: '#1d4ed8', salvageP: 35 },
  epic: { label: '🟪 에픽', color: '#7e22ce', salvageP: 80 },
  unique: { label: '🟨 유니크', color: '#b45309', salvageP: 250 },
};

export const GEAR_LOOT_POOL = [
  // 무기/도구 (weapon)
  { id: 'w_whistle_c', name: '교통 호루라기', slot: 'weapon', rarity: 'common', atk: 4, def: 0, crit: 0.03, icon: 'golden_whistle', desc: '공격 +4 · 치명 +3%' },
  { id: 'w_lawbook_r', name: '포켓 경범죄 법전', slot: 'weapon', rarity: 'rare', atk: 9, def: 1, crit: 0.08, icon: 'fact_book', desc: '공격 +9 · 방어 +1 · 치명 +8%' },
  { id: 'w_megaphone_e', name: '특수 확성기 Mk.II', slot: 'weapon', rarity: 'epic', atk: 17, def: 2, crit: 0.14, icon: 'megaphone', desc: '공격 +17 · 방어 +2 · 치명 +14%' },
  { id: 'w_taser_e', name: '고압 팩트 테이저건', slot: 'weapon', rarity: 'epic', minDropLv: 20, atk: 24, def: 3, crit: 0.18, icon: 'megaphone', desc: '공격 +24 · 방어 +3 · 치명 +18% (Lv.20+)' },
  { id: 'u_fact_bible', name: '팩트 대백과 초판본', slot: 'weapon', rarity: 'unique', atk: 30, def: 4, crit: 0.25, icon: 'fact_book', desc: '공격 +30 · 방어 +4 · 치명 +25%' },
  { id: 'u_gavel_legend', name: '대법관의 황금 의사봉', slot: 'weapon', rarity: 'unique', minDropLv: 35, atk: 44, def: 6, crit: 0.32, icon: 'fact_book', desc: '공격 +44 · 방어 +6 · 치명 +32% (Lv.35+ 전설!)' },

  // 방어구 (armor)
  { id: 'a_vest_c', name: '형광 순찰 조끼', slot: 'armor', rarity: 'common', atk: 0, def: 4, reflect: 0, icon: 'costume_police', desc: '방어력 +4' },
  { id: 'a_hoodie_r', name: '방풍 데님 자켓', slot: 'armor', rarity: 'rare', atk: 2, def: 8, reflect: 0.05, icon: 'costume_couple', desc: '방어력 +8 · 공격 +2 · 반사 5%' },
  { id: 'a_uniform_e', name: '기동대 특수 방검복', slot: 'armor', rarity: 'epic', atk: 4, def: 14, reflect: 0.12, icon: 'costume_police', desc: '방어력 +14 · 공격 +4 · 반사 12%' },
  { id: 'a_riotshield_e', name: '중장갑 진압 패딩', slot: 'armor', rarity: 'epic', minDropLv: 20, atk: 5, def: 19, reflect: 0.16, icon: 'costume_police', desc: '방어력 +19 · 공격 +5 · 반사 16% (Lv.20+)' },
  { id: 'u_riot_jacket', name: '방탄 시위 진압 코트', slot: 'armor', rarity: 'unique', atk: 6, def: 22, reflect: 0.20, icon: 'costume_dark', desc: '방어력 +22 · 공격 +6 · 적 피해 20% 반사!' },
  { id: 'u_aegis_coat', name: '네오 서울 히어로 아머', slot: 'armor', rarity: 'unique', minDropLv: 35, atk: 10, def: 32, reflect: 0.28, icon: 'costume_dark', desc: '방어력 +32 · 공격 +10 · 적 피해 28% 반사! (Lv.35+)' },

  // 악세서리 (acc)
  { id: 'x_mirror_c', name: '미니 반사 배지', slot: 'acc', rarity: 'common', atk: 2, def: 2, spRegen: 2, icon: 'mirror', desc: '공격 +2 · 방어 +2 · 매턴 사이다 +2' },
  { id: 'x_soda_r', name: '탄산 에너지 뱃지', slot: 'acc', rarity: 'rare', atk: 5, def: 4, spRegen: 4, icon: 'cold_soda', desc: '공격 +5 · 방어 +4 · 매턴 사이다 +4' },
  { id: 'x_pill_e', name: '황금 청심환 부적', slot: 'acc', rarity: 'epic', atk: 10, def: 7, spRegen: 6, icon: 'cheongsimhwan', desc: '공격 +10 · 방어 +7 · 매턴 사이다 +6' },
  { id: 'x_siren_e', name: '초음파 정의의 호각', slot: 'acc', rarity: 'epic', minDropLv: 20, atk: 14, def: 9, spRegen: 8, icon: 'golden_whistle', desc: '공격 +14 · 방어 +9 · 매턴 사이다 +8 (Lv.20+)' },
  { id: 'u_first_armband', name: '1대 영웅의 황금 호루라기', slot: 'acc', rarity: 'unique', atk: 18, def: 10, spRegen: 8, icon: 'golden_whistle', desc: '공격 +18 · 방어 +10 · 매턴 사이다 +8!' },
  { id: 'u_cider_core', name: '영웅단의 무지개 사이다 코어', slot: 'acc', rarity: 'unique', minDropLv: 35, atk: 24, def: 14, spRegen: 12, icon: 'cold_soda', desc: '공격 +24 · 방어 +14 · 매턴 사이다 +12! (Lv.35+)' },
];

export const PET_JOBS = [
  { id: 'guard', name: '🛡️ 경비견 콩이', desc: '적 반격 피해 15% 자동 반사!' },
  { id: 'healer', name: '💖 힐링견 콩이', desc: '매 턴 종료 시 인내심(HP) +5 회복!' },
  { id: 'detective', name: '🕵️ 탐지견 콩이', desc: '전투 승리 시 50% 확률로 채증 +1 추가!' },
];

export const LOGIC_COUNTERS = [
  {
    claim: '"길바닥에 침 좀 뱉은 게 뭐가 대수라고 법을 들이대냐?!"',
    options: [
      { text: '⚖️ "경범죄처벌법 제3조 노상방뇨·오물투기 범칙금 5만원 대상입니다!"', ok: true },
      { text: '💬 "그냥 기분이 나빠서요!"', ok: false },
      { text: '🏃 "일단 죄송한데 조용히 하세요!"', ok: false },
    ],
  },
  {
    claim: '"창문 5cm 열어놨으니까 카페 실내 흡연 아니거든?!"',
    options: [
      { text: '⚖️ "국민건강증진법상 카페 전체가 금연구역! 과태료 10만원입니다!"', ok: true },
      { text: '💬 "담배 냄새가 제 취향이 아니라서요!"', ok: false },
      { text: '🙄 "그럼 10cm만 더 여세요..."', ok: false },
    ],
  },
  {
    claim: '"내 차 문콕 당할까 봐 주차선 2칸 물었는데 니가 물어줄 거야?!"',
    options: [
      { text: '⚖️ "공용 주차 구획 점거는 재물손괴·업무방해 소지! 지금 블랙박스 채증 완료!"', ok: true },
      { text: '💬 "차가 부러워서 그래요..."', ok: false },
      { text: '🙇 "제 차도 옆에 똑같이 2칸 대볼게요!"', ok: false },
    ],
  },
];

export function generateCommunityPosts(state) {
  const posts = [
    {
      author: '익명(원룸촌)',
      tag: '🔥 HOT',
      text: `요즘 서울 민폐도 ${state.chaosLevel ?? 25}%라던데 노란 완장 영웅님 덕분에 골목이 좀 조용해짐 ㄹㅇ`,
      likes: `👍 ${120 + (state.winCount || 0) * 14}`,
    },
  ];
  if ((state.winCount || 0) >= 3) {
    posts.push({
      author: '익명(홍대생)',
      tag: '목격담',
      text: `방금 길빵러 참교육하는 거 직관함 ㅋㅋ 사이다 100캔 마신 기분`,
      likes: `👍 ${88 + (state.followers || 120) / 10 | 0}`,
    });
  }
  if (state.lovers?.length > 0) {
    posts.push({
      author: '익명(성수동)',
      tag: '연애설',
      text: `시민영웅님 ${state.lovers.length >= 2 ? '양쪽에 미녀 두 분이랑' : '연인이랑'} 손잡고 다니던데 부럽다...`,
      likes: '👍 342',
    });
  }
  if (state.statueBuilt) {
    posts.push({
      author: '익명(시청앞)',
      tag: '성지순례',
      text: `서울 광장에 시민영웅 명예 동상 세워졌는데 비둘기들도 예절 지켜서 안 앉음 ㄷㄷ`,
      likes: '👍 999+',
    });
  }
  if ((state.equipped?.weapon || state.equipped?.armor || state.equipped?.acc)) {
    posts.push({
      author: '익명(장비덕후)',
      tag: '장비',
      text: `영웅님 오늘 착장 개간지나던데 어디서 파밍한 거임?`,
      likes: '👍 77',
    });
  }
  return posts;
}
