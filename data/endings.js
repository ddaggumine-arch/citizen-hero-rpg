// V10.0: 10가지 멀티 엔딩 & 엔딩 도감 힌트 데이터

export const ENDINGS = [
  {
    id: 'end_true_utopia',
    num: 10,
    title: '👑 [진 엔딩] 예절이 법이 된 신세계',
    badge: 'TRUE ENDING',
    hint: '모든 스탯(언변·배짱·법률) 6 이상 + 팔로워 2,500+ + 서울 민폐도 25% 이하로 4대 보스 격파',
    ascii: '  👑 [ SEOUL UTOPIA 2026 ]  \n   🌸 서울 전역 예절 지수 100%  \n   🕊️ 빌런 전원 개과천선 완료!  ',
    story:
      '4대 보스가 모두 참교육을 받고 개과천선하자, 서울 거리에 기적 같은 평화가 찾아왔습니다.\n' +
      '홍대 길빵 대장은 금연 홍보대사가 되었고, 카페 사탄은 무료 스터디 카페를 열었습니다.\n' +
      '당신의 이름 앞에는 언제나 "전설의 시민영웅"이라는 칭호가 따라다닙니다!',
  },
  {
    id: 'end_chaos_island',
    num: 9,
    title: '🚨 [히든 배드엔딩] 혼돈의 서울, 제주도 대탈출',
    badge: 'CHAOS BAD END',
    image: 'assets/images/end_chaos_island.jpg',
    hint: '서울 민폐 오염도를 100%까지 방치하면 발생하는 특별 엔딩',
    ascii: '  ✈️ [ 김포공항 → 제주행 ]  \n   🔥 뒤돌아보니 서울이 진상 천국  \n   🍊 "난 할 만큼 했어... 귤이나 먹자"',
    story:
      '서울의 민폐 오염도가 100%를 돌파하며 온 거리가 발망치, 쇼츠 스피커폰, 길빵 연기로 뒤덮였습니다!\n' +
      '결국 당신은 김순경과 함께 제주도행 비행기에 몸을 실었습니다.\n' +
      '"서울은 빌런들에게 맡기고, 우리끼리 조용한 귤밭에서 살자..."',
  },
  {
    id: 'end_youtuber',
    num: 4,
    title: '📺 [엔딩 4] 300만 유튜버 · 국민 팩트폭격기',
    badge: 'INFLUENCER END',
    image: 'assets/images/end_youtuber.jpg',
    hint: '언변 스탯이 가장 높고 팔로워 3,500명 이상으로 4대 보스 격파',
    ascii: '  ▶️ [ 구독자 3,000,000명 ]  \n   💎 다이아 버튼 수여식!  \n   🎤 "오늘의 참교육 시작합니다!"',
    story:
      '당신이 올린 참교육 쇼츠와 사이다 어록이 전 국민을 열광시켰습니다!\n' +
      '지상파 예능과 공익광고 섭외가 빗발치며, 당신은 대한민국에서 가장 영향력 있는 1등 인플루언서가 되었습니다.',
  },
  {
    id: 'end_prosecutor',
    num: 3,
    title: '⚖️ [엔딩 3] 살아있는 육법전서 · 명예 특별검사',
    badge: 'LAW MASTER END',
    hint: '법률 스탯이 가장 높고(7 이상) 모범시민 성향으로 4대 보스 격파',
    ascii: '  ⚖️ [ 대법원 특별 포상 ]  \n   📜 "제 몇 조 몇 항에 의거!"  \n   🏛️ 민폐 전담 특별기구 수장 임명',
    story:
      '어떤 빌런도 당신의 완벽한 법조항 암기와 빈틈없는 채증 앞에서는 무릎을 꿇었습니다.\n' +
      '법무부는 당신의 공로를 인정해 신설된 [생활예절 특별수사부]의 초대 고문으로 위촉했습니다!',
  },
  {
    id: 'end_ironman',
    num: 5,
    title: '💪 [엔딩 5] 서울의 아이언맨 · 피지컬 수호자',
    badge: 'PHYSICAL END',
    hint: '배짱(깡다구) 스탯 7 이상 & 최대 인내심(HP) 130 이상으로 4대 보스 격파',
    ascii: '  🏋️ [ 3대 600 예절 지킴이 ]  \n   💥 눈빛만으로 빌런 제압!  \n   🥊 특수부대 교관 스카우트 제의',
    story:
      '철봉과 샌드백으로 단련된 압도적인 피지컬과 강철 멘탈!\n' +
      '이제는 말 한마디 꺼내기도 전에, 팔뚝 근육과 맑은 눈만 보고도 빌런들이 알아서 쓰레기를 줍고 줄을 섭니다.',
  },
  {
    id: 'end_franchise_ceo',
    num: 6,
    title: '🏪 [엔딩 6] 알바왕에서 24시 편의점 회장님으로',
    badge: 'TYCOON END',
    hint: '보유 도덕점수(포인트) 450 P 이상을 모은 채로 4대 보스 격파',
    ascii: '  🏅 [ 보유 자산: 건물 1채 ]  \n   🏪 "이제 내가 본사 회장이다!"  \n   ☕ 진상 출입금지 전국 1호 체인',
    story:
      '열심히 알바를 뛰며 진상을 참교육하던 당신은 모은 포인트와 투자금으로 24시 편의점 프랜차이즈를 인수했습니다!\n' +
      '전국의 매장에 [예절 수호자 인증 마크]가 붙으며 역대 최고 매출을 기록했습니다.',
  },
  {
    id: 'end_lucky_guy',
    num: 7,
    title: '🎲 [엔딩 7] 인형뽑기·로또 신화 · 서울의 럭키가이',
    badge: 'LUCKY END',
    hint: '자유행동 누적 12회 이상 + 광인 지수 30 이상으로 4대 보스 격파',
    ascii: '  🎰 [ 잭팟! 행운 수치 MAX ]  \n   🧸 인형뽑기 마스터 & 복권 당첨  \n   ✨ "운도 실력이라니까~?"',
    story:
      '인형뽑기 기계와 즉석복권을 휩쓸던 행운의 기운이 서울을 구했습니다!\n' +
      '당첨금으로 동네에 무료 쉼터와 흡연부스를 지어버리자, 빌런들조차 당신을 "행운의 형님"으로 모시기 시작했습니다.',
  },
  {
    id: 'end_police_partner',
    num: 8,
    title: '👮 [엔딩 8] 김순경의 영원한 파트너 · 명예 기동대장',
    badge: 'PARTNER END',
    image: 'assets/images/officer_kim.jpg',
    hint: '순찰 5회 이상 진행 & 모범시민 우세로 4대 보스 격파',
    ascii: '  🚓 [ 서울청 명예 특수기동대 ]  \n   ☕ 김순경: "우리 오래오래 같이 순찰 돌아요!"  \n   🛡️ 완벽한 2인조 콤비 탄생',
    story:
      '밤낮없이 골목과 지하철을 누빈 당신과 김순경의 환상적인 콤비 플레이!\n' +
      '서울지방경찰청은 당신에게 명예 기동대장 배지를 수여했고, 오늘도 두 사람은 커피 한 잔 들고 순찰길에 오릅니다.',
  },
  {
    id: 'end_dark_hero',
    num: 2,
    title: '😈 [엔딩 2] 어둠의 다크 히어로 · 맑은 눈의 전설',
    badge: 'DARK HERO END',
    image: 'assets/images/end_dark_hero.jpg',
    hint: '광인 지수가 모범시민보다 높은 상태로 4대 보스 격파',
    ascii: '  🌙 [ 밤의 서울 수호자 ]  \n   👁️ 맑은 눈의 광인 전설  \n   🦇 "다음 진상은 누구냐..."',
    story:
      '법보다 빠른 거울치료와 맑은 눈의 광기로 서울의 4대 보스를 전부 꺾었습니다!\n' +
      '이제 서울의 모든 민폐 빌런들은 밤길에 검은 자켓과 노란 완장만 봐도 90도로 인사하고 도망칩니다.',
  },
  {
    id: 'end_model_hero',
    num: 1,
    title: '😇 [엔딩 1] 서울시장 표창 · 명예 시민영웅',
    badge: 'MODEL CITIZEN END',
    image: 'assets/images/end_model_hero.jpg',
    hint: '모범시민 지수가 광인 지수보다 높은 상태로 4대 보스 격파',
    ascii: '  🏅 [ 서울특별시 명예 표창 ]  \n   🕊️ 합법적이고 완벽한 정의구현!  \n   🎉 시민들의 박수갈채',
    story:
      '합법적인 채증과 날카로운 논리, 그리고 끝없는 인내심으로 서울의 4대 보스를 정화했습니다!\n' +
      '서울시장님께 직접 표창장을 받은 당신은 오늘도 따뜻한 미소로 거리를 지킵니다.',
  },
  {
    id: 'end_yuki_tokyo',
    num: 11,
    title: '🇯🇵 [엔딩 11] 도쿄 신혼부부 & 말차 카페 엔딩',
    badge: 'YUKI ROMANCE END',
    image: 'assets/images/end_yuki_tokyo.jpg',
    hint: '유키와 연인이 되고 일본어 Lv.4 이상 달성 후 4대 보스 격파',
    ascii: '  🇯🇵 [ TOKYO & SEOUL LOVE ]  \n   🍵 유키와 함께 여는 예절 북카페  \n   💕 "평생 내 옆에 있어 줄래요?"',
    story:
      '서울의 평화를 되찾은 뒤, 유창한 일본어로 유키의 부모님까지 완벽하게 사로잡았습니다!\n' +
      '두 사람은 홍대와 도쿄를 오가며 세상에서 가장 따뜻한 말차 북카페를 함께 운영하며 행복하게 살았습니다.',
  },
  {
    id: 'end_chloe_ny',
    num: 12,
    title: '🇺🇸 [엔딩 12] 뉴욕·LA 헐리우드 커플 엔딩',
    badge: 'CHLOE ROMANCE END',
    image: 'assets/images/end_chloe_ny.jpg',
    hint: '클로이와 연인이 되고 영어 Lv.4 이상 달성 후 4대 보스 격파',
    ascii: '  🇺🇸 [ HOLLYWOOD POWER COUPLE ]  \n   📸 클로이의 참교육 다큐 넷플릭스 1위!  \n   🥂 "We are the best team ever!"',
    story:
      '클로이가 찍은 당신의 4대 보스 참교육 다큐멘터리가 글로벌 스트리밍 1위를 휩쓸었습니다!\n' +
      '유창한 영어로 미국 토크쇼까지 점령한 당신과 클로이는 뉴욕 소호에 멋진 스튜디오를 차렸습니다.',
  },
  {
    id: 'end_two_timer',
    num: 13,
    title: '💥 [엔딩 13] 양다리 대참사 · 합동 참교육 엔딩',
    badge: 'COMEDY BAD END',
    image: 'assets/images/end_two_timer.jpg',
    hint: '유키와 클로이 둘 다 동시에 연인이 된 상태(양다리)로 4대 보스 격파',
    ascii: '  💔 [ 4대 보스보다 무서운 두 사람 ]  \n   🇯🇵 유키: "오빠... 나랑만 사귄다면서?"  \n   🇺🇸 클로이: "Are you kidding me?!"',
    story:
      '4대 보스를 다 잡고 축하 파티가 열린 날, 유키와 클로이가 동시에 꽃다발을 들고 나타났습니다!\n' +
      '어색한 정적도 잠시, 두 사람의 완벽한 한일미 합동 팩트폭력에 당신의 멘탈은 0이 되었고...\n' +
      '결국 두 사람에게 평생 사죄하며 독거 시민영웅으로 남았습니다. (양다리는 금지!!)',
  },
  {
    id: 'end_polyglot',
    num: 14,
    title: '🌍 [엔딩 14] 3개국어 글로벌 외교관 엔딩',
    badge: 'POLYGLOT END',
    hint: '일본어 Lv.4 이상 & 영어 Lv.4 이상 & 언변 6 이상으로 4대 보스 격파',
    ascii: '  🌐 [ UN 예절 특별대사 임명 ]  \n   🗣️ 한·영·일 3개국어 완전체!  \n   🕊️ 전 세계 공중도덕 캠페인 주도',
    story:
      '일본어와 영어를 모두 마스터하고 압도적인 언변으로 무장한 당신!\n' +
      'UN에서 전 세계 관광지 민폐를 정화하는 글로벌 예절 특별대사로 스카우트되어 세계를 누빕니다.',
  },
  {
    id: 'end_true_love',
    num: 15,
    title: '💍 [엔딩 15] 세기의 국제결혼 · 진 러브 엔딩',
    badge: 'TRUE LOVE END',
    image: 'assets/images/end_true_love.jpg',
    hint: '한 명과 순애보 연인 + 모범시민 우세 + 서울 민폐도 25% 이하로 4대 보스 격파',
    ascii: '  💍 [ SEOUL GRAND WEDDING ]  \n   💐 서울시장 주례 · 김순경 사회  \n   💖 완벽한 사랑과 평화의 결실',
    story:
      '깨끗해진 서울 시청 앞 광장에서 서울시장의 주례와 김순경의 사회로 성대한 결혼식이 열렸습니다!\n' +
      '사랑도, 정의도, 예절도 모두 지켜낸 당신이야말로 진정한 2026년 서울의 히어로입니다.',
  },
];

export function evaluateEnding(state, isChaosCollapse = false) {
  if (isChaosCollapse) {
    return ENDINGS.find((e) => e.id === 'end_chaos_island');
  }
  const { speech, guts, law } = state.stats;
  const followers = state.followers || 120;
  const chaos = state.chaosLevel ?? 25;
  const isLawful = state.lawful >= state.chaotic;

  const yukiLover = state.lovers?.includes('yuki');
  const chloeLover = state.lovers?.includes('chloe');
  const jpLv = state.lang?.jp || 0;
  const enLv = state.lang?.en || 0;

  // 연애/어학 멀티 엔딩 최우선 판정
  if (yukiLover && chloeLover) {
    return ENDINGS.find((e) => e.id === 'end_two_timer');
  }
  if ((yukiLover || chloeLover) && isLawful && chaos <= 25) {
    return ENDINGS.find((e) => e.id === 'end_true_love');
  }
  if (yukiLover && jpLv >= 4) {
    return ENDINGS.find((e) => e.id === 'end_yuki_tokyo');
  }
  if (chloeLover && enLv >= 4) {
    return ENDINGS.find((e) => e.id === 'end_chloe_ny');
  }
  if (jpLv >= 4 && enLv >= 4 && speech >= 6) {
    return ENDINGS.find((e) => e.id === 'end_polyglot');
  }

  if (speech >= 6 && guts >= 6 && law >= 6 && followers >= 2500 && chaos <= 25) {
    return ENDINGS.find((e) => e.id === 'end_true_utopia');
  }
  if (speech >= guts && speech >= law && followers >= 3500) {
    return ENDINGS.find((e) => e.id === 'end_youtuber');
  }
  if (law >= 7 && law >= speech && law >= guts && isLawful) {
    return ENDINGS.find((e) => e.id === 'end_prosecutor');
  }
  if (guts >= 7 && state.maxHp >= 130) {
    return ENDINGS.find((e) => e.id === 'end_ironman');
  }
  if (state.points >= 450) {
    return ENDINGS.find((e) => e.id === 'end_franchise_ceo');
  }
  if ((state.activityCount || 0) >= 12 && state.chaotic >= 30) {
    return ENDINGS.find((e) => e.id === 'end_lucky_guy');
  }
  if ((state.patrolCount || 0) >= 5 && isLawful) {
    return ENDINGS.find((e) => e.id === 'end_police_partner');
  }
  if (!isLawful) {
    return ENDINGS.find((e) => e.id === 'end_dark_hero');
  }
  return ENDINGS.find((e) => e.id === 'end_model_hero');
}
