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
    name: '🎸 마포구 (홍대·연남)',
    buffDesc: '전투 매 턴 사이다 +3 자연 충전',
    villains: ['spitter', 'street_smoker', 'cafe_hogger', 'trash_dumper'],
  },
  {
    id: 'seongsu',
    name: '☕ 성동구 (성수동)',
    buffDesc: '팩트폭력 치명타 확률 +6%',
    villains: ['cafe_boss', 'parking_villain', 'sidewalk_blockers'],
  },
  {
    id: 'gangnam',
    name: '🚇 강남구 (2호선·역삼)',
    buffDesc: '모든 공격 피해 +4',
    villains: ['subway_manspreader', 'line_cutter', 'subway_legger', 'gym_villain'],
  },
  {
    id: 'jongno',
    name: '📚 종로구 (익선·대학가)',
    buffDesc: '기본 방어력(DEF) +3',
    villains: ['pen_clicker', 'noise_villain', 'cinema_boss'],
  },
  {
    id: 'yeouido',
    name: '🌃 영등포구 (여의도)',
    buffDesc: '유니크/레어 장비 드랍률 +25% 보정',
    villains: ['shorts_terrorist', 'night_biker', 'illegal_parker', 'boss_dr_chaos'],
  },
];

export function getDistrictIdForEnemy(enemyId) {
  const found = SEOUL_DISTRICTS.find((d) => d.villains.includes(enemyId));
  return found ? found.id : 'mapo';
}

export function getClearedDistrictCount(state) {
  const dMap = state.districts || {};
  return SEOUL_DISTRICTS.filter((d) => (dMap[d.id] || 0) >= 100).length;
}
