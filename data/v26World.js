// V26.0 스토리 연동 단계별 해금 시스템 + 서울 5대 자치구 치안 정화 + 심야 마계 보스 러시

export const UNLOCK_MILESTONES = {
  gear: { chapter: 3, label: '🔧 장비 진화 & 파밍 창고' },
  community: { chapter: 6, label: '📱 라이브 방송 & 서울 익명 커뮤니티' },
  court: { chapter: 9, label: '⚖️ 시민 즉결 재판소' },
  room_stock: { chapter: 12, label: '🏠 자취방 꾸미기 & 주식 투자' },
  yuki: { chapter: 15, label: '💕 연애 모드 (유키 루트 & 일본어)' },
  chloe: { chapter: 17, label: '💕 연애 모드 (클로이 루트 & 영어)' },
  pet: { chapter: 18, label: '🐶 시바견 콩이 입양 & 산책/전직' },
  car_costume: { chapter: 21, label: '🚗 차량 구매 & 코스튬 쇼룸' },
  foundation: { chapter: 24, label: '🏛️ 시민영웅 재단 & 배틀타워' },
  nightmare: { chapter: 25, label: '🌃 심야 마계 서울 (무한 보스 러시)' },
};

export function isFeatureUnlocked(state, key) {
  if (!state) return false;
  if ((state.ngPlus || 0) >= 1) return true; // 2회차 NG+는 모든 모드 자유 해금
  const req = UNLOCK_MILESTONES[key]?.chapter ?? 0;
  return (state.chapterIndex || 0) >= req;
}

export const SEOUL_DISTRICTS = [
  {
    id: 'mapo',
    minLv: 1, maxLv: 10,
    name: '🍲 전주 (한옥마을·전북대)',
    buffDesc: '전투 매 턴 사이다 +3 자연 충전',
    villains: ['spitter', 'street_smoker', 'trash_dumper'],
  },
  {
    id: 'seongsu',
    minLv: 11, maxLv: 20,
    name: '🚆 평택 (평택역·항구)',
    buffDesc: '팩트폭력 치명타 확률 +6%',
    villains: ['cafe_boss', 'parking_villain', 'sidewalk_blockers', 'line_cutter', 'subway_legger'],
  },
  {
    id: 'jongno',
    minLv: 21, maxLv: 30,
    name: '🏙️ 동탄 (호수공원·신도시)',
    buffDesc: '기본 방어력(DEF) +3',
    villains: ['pen_clicker', 'noise_villain', 'cinema_boss'],
  },
  {
    id: 'gangnam',
    minLv: 31, maxLv: 40,
    name: '😈 마계 인천 (부평·월미도)',
    buffDesc: '모든 공격 피해 +4',
    villains: ['subway_manspreader', 'gym_villain', 'cafe_hogger'],
  },
  {
    id: 'yeouido',
    minLv: 41, maxLv: 50,
    name: '👑 서울 (홍대·강남·여의도)',
    buffDesc: '유니크/레어 장비 드랍률 +25% 보정',
    villains: ['shorts_terrorist', 'night_biker', 'illegal_parker', 'boss_dr_chaos'],
  },
];

export function getDistrictIdForEnemy(enemyId) {
  if (typeof enemyId === 'string') {
    if (enemyId.startsWith('act_jeonju_')) return 'mapo';
    if (enemyId.startsWith('act_pyeongtaek_')) return 'seongsu';
    if (enemyId.startsWith('act_dongtan_')) return 'jongno';
    if (enemyId.startsWith('act_incheon_')) return 'gangnam';
    if (enemyId.startsWith('mob_m')) return 'mapo';
    if (enemyId.startsWith('mob_s')) return 'seongsu';
    if (enemyId.startsWith('mob_j')) return 'jongno';
    if (enemyId.startsWith('mob_g')) return 'gangnam';
    if (enemyId.startsWith('mob_y')) return 'yeouido';
  }
  const found = SEOUL_DISTRICTS.find((d) => d.villains.includes(enemyId));
  return found ? found.id : 'mapo';
}

export function getClearedDistrictCount(state) {
  const dMap = state.districts || {};
  return SEOUL_DISTRICTS.filter((d) => (dMap[d.id] || 0) >= 100).length;
}
