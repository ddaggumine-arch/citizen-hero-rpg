// V33.2: 20가지 멀티 엔딩 풀일러스트 + 장편 3단 후일담 + 유키/클로이 관계 분기

export const ENDINGS = [
  {
    id: 'end_true_utopia',
    num: 10,
    title: '👑 [진 엔딩] 예절이 법이 된 신세계',
    badge: 'TRUE ENDING',
    image: 'assets/images/end_true_utopia.jpg',
    hint: '모든 스탯(언변·깡다구·법률) 6 이상 + 팔로워 2,500+ + 서울 민폐도 25% 이하로 클리어',
    ascii: '  👑 [ SEOUL UTOPIA 2026 ]  \n   🌸 서울 전역 예절 지수 100%  \n   🕊️ 빌런 전원 개과천선 완료!  ',
    story:
      '4대 보스와 진상 연합이 모두 참교육을 받고 개과천선하자, 서울 거리에 기적 같은 평화가 찾아왔습니다.\n\n' +
      '봄바람에 벚꽃이 흩날리는 경복궁과 광화문 일대에서는 시민들이 먼저 양보하고 웃으며 인사를 나눕니다. 과거 길빵과 고성방가로 악명 높던 빌런들마저 스스로 노란 조끼를 입고 동네 청소 봉사에 나서기 시작했습니다.\n\n' +
      '홍대 길빵 대장은 금연 홍보대사가 되었고, 카페 사탄은 무료 스터디 카페를 열었습니다. 이제 서울에서 "시민영웅"이라는 이름은 한 명의 영웅이 아니라, 서로를 배려하는 모든 시민의 자부심이 되었습니다.',
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
      '서울의 민폐 오염도가 100%를 돌파하며 온 거리가 발망치, 쇼츠 스피커폰, 길빵 연기로 뒤덮였습니다!\n\n' +
      '더 이상 감당할 수 없을 만큼 거대해진 진상들의 파도 앞에서, 당신과 김순경은 마지막 순찰을 마친 뒤 조용히 고개를 저었습니다.\n\n' +
      '결국 두 사람은 제주도행 비행기에 몸을 실었습니다. 귤밭 너머로 불어오는 바닷바람을 맞으며 김순경이 캔커피를 건넵니다. "서울은 잠시 빌런들에게 맡기고, 우리끼리 여기서 재충전한 뒤 언젠가 다시 돌아가죠!"',
  },
  {
    id: 'end_youtuber',
    num: 4,
    title: '📺 [엔딩 4] 300만 유튜버 · 국민 팩트폭격기',
    badge: 'INFLUENCER END',
    image: 'assets/images/end_youtuber.jpg',
    hint: '언변 스탯이 가장 높고 팔로워 3,500명 이상으로 클리어',
    ascii: '  ▶️ [ 구독자 3,000,000명 ]  \n   💎 다이아 버튼 수여식!  \n   🎤 "오늘의 참교육 시작합니다!"',
    story:
      '당신이 올린 참교육 쇼츠와 사이다 어록이 대한민국을 넘어 전 세계를 열광시켰습니다!\n\n' +
      '단 한 번의 욕설도 없이 오직 팩트와 예절로 진상들의 말문을 막아버리는 영상은 매 편 조회수 1,000만을 돌파했고, 결국 300만 구독자 다이아 버튼을 거머쥐었습니다.\n\n' +
      '지상파 예능과 공익광고 섭외가 빗발치지만, 당신은 여전히 작은 카메라 하나만 들고 오늘도 골목길의 작은 불의를 비추며 외칩니다. "구독과 좋아요보다 중요한 건 여러분의 배려입니다!"',
  },
  {
    id: 'end_prosecutor',
    num: 3,
    title: '⚖️ [엔딩 3] 살아있는 육법전서 · 명예 특별검사',
    badge: 'LAW MASTER END',
    image: 'assets/images/end_prosecutor.jpg',
    hint: '법률 스탯이 가장 높고(7 이상) 모범시민 성향으로 클리어',
    ascii: '  ⚖️ [ 대법원 특별 포상 ]  \n   📜 "제 몇 조 몇 항에 의거!"  \n   🏛️ 민폐 전담 특별기구 수장 임명',
    story:
      '어떤 빌런도 당신의 완벽한 법조항 암기와 빈틈없는 채증 앞에서는 변명조차 꺼내지 못했습니다.\n\n' +
      '대법원과 법무부는 당신이 구축한 [시민 채증 · 즉결 심판 매뉴얼]의 공로를 높이 인정해, 신설된 [생활예절 특별수사부]의 초대 명예 특별고문으로 위촉했습니다.\n\n' +
      '멋진 네이비 정장 소매 위로 여전히 노란 완장을 찬 채 법정에 선 당신. 오늘도 황금 천칭을 들어 올리며 선언합니다. "법은 멀리 있지 않습니다. 바로 우리 일상의 예절 속에 있습니다!"',
  },
  {
    id: 'end_ironman',
    num: 5,
    title: '💪 [엔딩 5] 서울의 아이언맨 · 피지컬 수호자',
    badge: 'PHYSICAL END',
    image: 'assets/images/end_ironman.jpg',
    hint: '배짱(깡다구) 스탯 7 이상 & 최대 인내심(HP) 130 이상으로 클리어',
    ascii: '  🏋️ [ 3대 600 예절 지킴이 ]  \n   💥 눈빛만으로 빌런 제압!  \n   🥊 특수부대 교관 스카우트 제의',
    story:
      '철봉과 샌드백으로 단련된 압도적인 피지컬과 어떤 도발에도 흔들리지 않는 강철 멘탈!\n\n' +
      '한강 야외 헬스장에서 가볍게 턱걸이를 하는 당신의 실루엣만 보고도, 골목길 불량배들이 알아서 90도로 허리를 굽히며 담배꽁초를 줍고 줄을 섭니다.\n\n' +
      '특수부대 교관 스카우트 제의마저 정중히 거절한 당신은 웃으며 말합니다. "진정한 힘은 남을 누르는 게 아니라, 평범한 시민의 일상을 지켜낼 때 빛나는 겁니다!"',
  },
  {
    id: 'end_franchise_ceo',
    num: 6,
    title: '🏪 [엔딩 6] 알바왕에서 24시 편의점 회장님으로',
    badge: 'TYCOON END',
    image: 'assets/images/end_franchise_ceo.jpg',
    hint: '보유 도덕점수(포인트) 450 P 이상을 모은 채로 클리어',
    ascii: '  🏅 [ 보유 자산: 건물 1채 ]  \n   🏪 "이제 내가 본사 회장이다!"  \n   ☕ 진상 출입금지 전국 1호 체인',
    story:
      '밤낮없이 알바를 뛰며 진상을 참교육하던 당신은 모은 포인트와 치밀한 투자로 결국 24시 편의점 프랜차이즈 본사를 인수했습니다!\n\n' +
      '전국 모든 매장에 [예절 수호자 인증 마크]와 알바생 보호 시스템이 도입되었고, 진상 손님은 자동 차단되는 쾌적한 매장 문화 덕분에 역대 최고 매출을 달성했습니다.\n\n' +
      '깔끔한 쓰리피스 정장을 입고 매장을 둘러보는 당신 손엔 여전히 시원한 아메리카노 한 잔이 들려 있습니다. "우리 알바생들 기죽지 마세요, 회장이 뒤에서 다 지켜봅니다!"',
  },
  {
    id: 'end_lucky_guy',
    num: 7,
    title: '🎲 [엔딩 7] 인형뽑기·로또 신화 · 서울의 럭키가이',
    badge: 'LUCKY END',
    image: 'assets/images/end_lucky_guy.jpg',
    hint: '자유행동 누적 12회 이상 + 광인 지수 30 이상으로 클리어',
    ascii: '  🎰 [ 잭팟! 행운 수치 MAX ]  \n   🧸 인형뽑기 마스터 & 복권 당첨  \n   ✨ "운도 실력이라니까~?"',
    story:
      '인형뽑기 기계와 즉석복권을 휩쓸던 미친 행운의 기운이 결국 서울까지 구해냈습니다!\n\n' +
      '엄청난 당첨금과 경품을 독차지하는 대신, 당신은 동네 곳곳에 쾌적한 무료 쉼터와 투명 흡연부스, 그리고 아이들을 위한 문화 공간을 통 크게 지어버렸습니다.\n\n' +
      '선글라스를 끼고 황금빛 종이꽃가루 속에서 유쾌하게 웃는 당신을 보며, 한때 빌런이던 녀석들조차 "역시 행운의 형님!"이라며 엄지를 치켜세웁니다.',
  },
  {
    id: 'end_police_partner',
    num: 8,
    title: '👮 [엔딩 8] 김순경의 영원한 파트너 · 명예 기동대장',
    badge: 'PARTNER END',
    image: 'assets/images/end_police_partner.jpg',
    hint: '순찰 5회 이상 진행 & 모범시민 우세로 클리어',
    ascii: '  🚓 [ 서울청 명예 특수기동대 ]  \n   ☕ 김순경: "우리 오래오래 같이 순찰 돌아요!"  \n   🛡️ 완벽한 2인조 콤비 탄생',
    story:
      '밤낮없이 골목과 지하철을 누빈 당신과 김순경의 환상적인 콤비 플레이는 서울지방경찰청의 전설이 되었습니다.\n\n' +
      '명예 특수기동대장 배지를 수여받은 뒤에도 두 사람의 일상은 크게 달라지지 않았습니다. 해 질 녘 서울의 야경 아래, 순찰차 옆에서 따뜻한 캔커피를 부딪치며 웃는 그 순간이 가장 행복하기 때문입니다.\n\n' +
      '"자경단! 저쪽 골목에 또 시끄러운 소리가 나는데, 한 번 출동해볼까요?" "좋죠, 김순경님. 오늘도 가봅시다!"',
  },
  {
    id: 'end_dark_hero',
    num: 2,
    title: '😈 [엔딩 2] 어둠의 다크 히어로 · 맑은 눈의 전설',
    badge: 'DARK HERO END',
    image: 'assets/images/end_dark_hero.jpg',
    hint: '광인 지수가 모범시민보다 높은 상태로 클리어',
    ascii: '  🌙 [ 밤의 서울 수호자 ]  \n   👁️ 맑은 눈의 광인 전설  \n   🦇 "다음 진상은 누구냐..."',
    story:
      '법보다 빠른 거울치료와 서늘한 맑은 눈의 광기로 서울의 모든 보스들을 제압했습니다!\n\n' +
      '낮에는 평범한 시민으로 지내지만, 어둠이 내리면 검은 자켓에 노란 완장을 두르고 나타나는 당신의 모습은 서울 밤거리의 도시전설이 되었습니다.\n\n' +
      '이제 서울의 민폐 빌런들은 밤길에 검은 그림자만 스쳐도 식은땀을 흘리며 조용히 쓰레기를 주워 담습니다. "착하게 살자... 다크 히어로님한테 걸리면 끝장이다..."',
  },
  {
    id: 'end_model_hero',
    num: 1,
    title: '😇 [엔딩 1] 서울시장 표창 · 명예 시민영웅',
    badge: 'MODEL CITIZEN END',
    image: 'assets/images/end_model_hero.jpg',
    hint: '모범시민 지수가 광인 지수보다 높은 상태로 클리어',
    ascii: '  🏅 [ 서울특별시 명예 표창 ]  \n   🕊️ 합법적이고 완벽한 정의구현!  \n   🎉 시민들의 박수갈채',
    story:
      '합법적인 채증과 날카로운 논리, 그리고 끝없는 인내심으로 서울을 정화한 당신!\n\n' +
      '서울시청 대강당에서 시장님으로부터 직접 명예 시민영웅 표창을 받은 날, TV 뉴스와 커뮤니티는 온통 당신의 미담으로 가득 찼습니다.\n\n' +
      '수많은 박수갈채 속에서도 겸손함을 잃지 않은 당신은 오늘도 따뜻한 미소를 지으며 출근길 시민들의 발걸음을 든든하게 지켜줍니다.',
  },
  {
    id: 'end_yuki_tokyo',
    num: 11,
    title: '🇯🇵 [엔딩 11] 도쿄 신혼부부 & 말차 카페 엔딩',
    badge: 'YUKI ROMANCE END',
    image: 'assets/images/end_yuki_tokyo.jpg',
    hint: '유키와 연인이 되고 일본어 Lv.4 이상 달성 후 클리어',
    ascii: '  🇯🇵 [ TOKYO & SEOUL LOVE ]  \n   🍵 유키와 함께 여는 예절 북카페  \n   💕 "평생 내 옆에 있어 줄래요?"',
    story:
      '서울의 평화를 되찾은 뒤, 당신은 유창한 일본어로 도쿄에 계신 유키의 부모님까지 완벽하게 사로잡았습니다!\n\n' +
      '두 사람은 홍대와 도쿄 시모키타자와를 오가며 세상에서 가장 포근하고 예의 바른 말차 북카페를 함께 열었습니다.\n\n' +
      '창밖으로 햇살이 스며드는 오후, 따뜻한 말차를 건네며 수줍게 웃는 유키의 모습에 당신은 깨닫습니다. 서울을 지킨 것보다 더 큰 기적은 바로 그녀를 만난 것이었음을.',
  },
  {
    id: 'end_chloe_ny',
    num: 12,
    title: '🇺🇸 [엔딩 12] 뉴욕·LA 헐리우드 커플 엔딩',
    badge: 'CHLOE ROMANCE END',
    image: 'assets/images/end_chloe_ny.jpg',
    hint: '클로이와 연인이 되고 영어 Lv.4 이상 달성 후 클리어',
    ascii: '  🇺🇸 [ HOLLYWOOD POWER COUPLE ]  \n   📸 클로이의 참교육 다큐 넷플릭스 1위!  \n   🥂 "We are the best team ever!"',
    story:
      '클로이가 직접 촬영하고 편집한 당신의 서울 참교육 다큐멘터리가 글로벌 스트리밍 1위를 휩쓸었습니다!\n\n' +
      '유창한 영어로 미국 유명 토크쇼까지 점령한 당신과 클로이는 뉴욕 소호 한복판에 감각적인 포토 스튜디오를 열었습니다.\n\n' +
      '레드카펫 위에서도 장난스럽게 윙크하며 셔터를 누르는 클로이. "Hey, my hero! 다음엔 브로드웨이의 진상들을 혼내주러 갈까?"',
  },
  {
    id: 'end_two_timer',
    num: 13,
    title: '💥 [엔딩 13] 양다리 대참사 · 합동 참교육 엔딩',
    badge: 'COMEDY BAD END',
    image: 'assets/images/end_two_timer.jpg',
    hint: '유키와 클로이 둘 다 동시에 연인이 된 상태(양다리·호감도 부족)로 클리어',
    ascii: '  💔 [ 4대 보스보다 무서운 두 사람 ]  \n   🇯🇵 유키: "오빠... 나랑만 사귄다면서?"  \n   🇺🇸 클로이: "Are you kidding me?!"',
    story:
      '모든 보스를 쓰러뜨리고 영웅 축하 파티가 열린 밤, 유키와 클로이가 동시에 꽃다발을 들고 파티장 문을 열었습니다!\n\n' +
      '1초의 정적도 잠시, 두 사람의 눈빛이 마주친 순간 세상에서 가장 무서운 한·일·미 합동 팩트폭격이 시작되었습니다.\n\n' +
      '4대 보스 앞에서도 끄떡없던 당신의 멘탈은 30초 만에 0이 되었고, 결국 두 사람에게 평생 싹싹 빌며 반성문 1,000장을 쓰는 독거 시민영웅으로 남았습니다. (양다리는 절대 금지!!)',
  },
  {
    id: 'end_polyglot',
    num: 14,
    title: '🌍 [엔딩 14] 3개국어 글로벌 외교관 엔딩',
    badge: 'POLYGLOT END',
    image: 'assets/images/end_polyglot.jpg',
    hint: '일본어 Lv.4 이상 & 영어 Lv.4 이상 & 언변 6 이상으로 클리어',
    ascii: '  🌐 [ UN 예절 특별대사 임명 ]  \n   🗣️ 한·영·일 3개국어 완전체!  \n   🕊️ 전 세계 공중도덕 캠페인 주도',
    story:
      '한국어·일본어·영어 3개국어를 완벽하게 마스터하고 압도적인 언변으로 무장한 당신!\n\n' +
      'UN 본부에서 전 세계 관광지와 대도시의 민폐 문화를 정화하는 글로벌 예절 특별대사로 당신을 정식 초빙했습니다.\n\n' +
      '태극기·일장기·성조기 앞에서 멋진 턱시도를 입고 연설하는 당신. 전 세계인들이 기립박수를 보내는 가운데, 당신의 소매엔 여전히 노란 완장이 빛나고 있습니다.',
  },
  {
    id: 'end_true_love',
    num: 15,
    title: '💍 [엔딩 15] 세기의 국제결혼 · 진 러브 엔딩',
    badge: 'TRUE LOVE END',
    image: 'assets/images/end_true_love.jpg',
    hint: '한 명과 순애보 연인 + 모범시민 우세 + 서울 민폐도 25% 이하로 클리어',
    ascii: '  💍 [ SEOUL GRAND WEDDING ]  \n   💐 서울시장 주례 · 김순경 사회  \n   💖 완벽한 사랑과 평화의 결실',
    story:
      '평화롭고 깨끗해진 서울시청 앞 광장에서, 서울시장님의 주례와 김순경의 유쾌한 사회 속에 세기의 결혼식이 열렸습니다!\n\n' +
      '수많은 시민과 정령들의 축복 속에서 두 손 꼭 잡은 채 버진로드를 걷는 당신과 연인. 지난날 빗속에서 시작된 작은 선의가 이토록 눈부신 사랑의 결실로 이어졌습니다.\n\n' +
      '사랑도, 정의도, 예절도 모두 지켜낸 당신이야말로 2026년 서울이 낳은 가장 완벽한 히어로입니다.',
  },
  {
    id: 'end_black_mcn_truth',
    num: 16,
    title: '🕵️ [비밀 진엔딩 16] 흑막 [블랙 튜브 MCN] 일망타진!',
    badge: 'SECRET TRUTH END',
    image: 'assets/images/end_black_mcn_truth.jpg',
    hint: '흑막 단서 5개를 모두 수집한 상태로 클리어',
    ascii: '  🕵️ [ BLACK TUBE MCN 해체! ]  \n   ⚖️ 닥터 카오스 긴급 체포  \n   🌅 3년 전 빗속의 약속 완수!',
    story:
      '수집한 5개의 결정적 단서가 여의도 본사 앞 수많은 기자들의 플래시 세례 속에서 세상에 전부 폭로되었습니다!\n\n' +
      '서울의 혼란과 갈등을 숏폼 콘텐츠로 팔아먹던 흑막 [블랙 튜브 MCN]의 총수 닥터 카오스는 현장에서 수갑을 찬 채 연행되었고, 거대 악의 제국은 하루아침에 무너졌습니다.\n\n' +
      '멀리서 이 광경을 지켜보던 3년 전 빗속의 1대 시민영웅 선배 역시, 이제야 마음의 짐을 내려놓듯 당신을 향해 조용히 엄지를 치켜세웠습니다.',
  },
  {
    id: 'end_yuki_home',
    num: 17,
    title: '🌸 [엔딩 17] 유키와 홍대 작은 다다미집의 영원한 봄',
    badge: 'YUKI PURE LOVE END',
    image: 'assets/images/end_yuki_home.jpg',
    hint: '유키 순애보 연인 + 유키 데이트 5종 이상(또는 깊은 호감도)으로 클리어',
    ascii: '  🌸 [ HONGDAE COZY HOME ]  \n   🍵 유키·콩이와 함께하는 나른한 오후  \n   💕 "오빠, 오늘도 참 잘했어요"',
    story:
      '거창한 명예나 스포트라이트보다, 두 사람이 함께 웃는 소소한 일상을 선택한 당신과 유키.\n\n' +
      '햇살이 따스하게 들어오는 홍대의 작은 다다미 북카페 거실에서, 두 사람은 나란히 앉아 따뜻한 녹차 한 잔을 나누고 발밑에선 콩이가 곤히 낮잠을 잡니다.\n\n' +
      '유키가 당신의 어깨에 살짝 기대며 속삭입니다. "세상을 구하는 영웅도 좋지만, 제 곁에 있어 주는 지금 이 순간이 제일 행복해요."',
  },
  {
    id: 'end_chloe_world',
    num: 18,
    title: '📸 [엔딩 18] 클로이와 함께한 세계 100대 도시 다큐 투어',
    badge: 'CHLOE ADVENTURE END',
    image: 'assets/images/end_chloe_world.jpg',
    hint: '클로이 순애보 연인 + 클로이 데이트 5종 이상 달성 후 클리어',
    ascii: '  📸 [ WORLDWIDE HERO TOUR ]  \n   ✈️ 서울에서 파리·런던·뉴욕까지!  \n   🥂 "우리의 모험은 끝나지 않아!"',
    story:
      '서울을 지킨 뒤에도 당신과 클로이의 열정은 멈추지 않았습니다! 카메라 두 대를 챙긴 두 사람은 전 세계의 아름다운 풍경과 예절 문화를 담는 다큐 투어를 떠났습니다.\n\n' +
      '노을 지는 파리의 광장 앞에서도 클로이는 환하게 웃으며 당신에게 카메라를 들이밉니다. "자, 여기도 질서 1등 커플 포즈! 하나, 둘, 치즈!"\n\n' +
      '두 사람이 함께 걸어가는 곳이라면 세계 어디든 웃음과 정의가 피어나는 최고의 무대가 됩니다.',
  },
  {
    id: 'end_trio_house',
    num: 19,
    title: '💖 [히든 화해 엔딩 19] 한강뷰 트리오 하우스의 기적',
    badge: 'HIDDEN HAREM END',
    image: 'assets/images/end_trio_house.jpg',
    hint: '유키·클로이 모두 연인 + 두 사람 호감도 각 120 이상 + 모범시민 우세로 클리어',
    ascii: '  💖 [ HAN RIVER TRIO HOUSE ]  \n   🌅 유키·클로이·콩이와 함께한 완벽한 화해  \n   🏠 "셋이 합치면 천하무적이잖아!"',
    story:
      '처음엔 아슬아슬한 위기도 있었지만, 당신의 진심 어린 책임감과 한결같은 다정함에 유키와 클로이는 마침내 서로의 손을 마주 잡았습니다.\n\n' +
      '"혼자 독차지하려다 싸우는 것보다, 셋이서 평생 서울을 지키며 함께 웃는 게 더 멋지잖아?" 클로이의 호탕한 웃음에 유키도 발그레 웃으며 고개를 끄덕였습니다.\n\n' +
      '노을이 물든 한강뷰 아파트 소파 위, 왼쪽엔 유키·오른쪽엔 클로이·무릎 앞엔 활짝 웃는 콩이까지! 서울에서 가장 행복하고 든든한 영웅 패밀리가 탄생했습니다.',
  },
  {
    id: 'end_squad_spirits',
    num: 20,
    title: '🐾 [엔딩 20] 김순경·콩이·수호정령단 영원한 파트너',
    badge: 'SQUAD & SPIRITS END',
    image: 'assets/images/end_squad_spirits.jpg',
    hint: '연인 없이 콩이 입양 + 수호정령 10종 이상 수집한 채로 클리어',
    ascii: '  🐾 [ ETERNAL GUARDIAN SQUAD ]  \n   👻 100종 수호정령과 콩이·김순경!  \n   🌆 서울의 하늘은 오늘도 우리가 지킨다',
    story:
      '연애보다 소중한 전우애와 교감을 선택한 당신의 곁에는 언제나 믿음직한 동료들이 있습니다.\n\n' +
      '황혼이 물든 남산 정상 위, 팔짱을 낀 채 미소 짓는 김순경과 혀를 내밀고 웃는 콩이, 그리고 하늘을 수놓은 다섯 속성의 귀여운 수호정령들이 당신을 중심으로 반짝입니다.\n\n' +
      '혼자가 아니기에 두렵지 않습니다. 서울의 내일이 부른다면 언제든, 이 최고의 드림팀이 가장 먼저 달려갈 것입니다!',
  },
];

export function buildFullEndingText(ending, state) {
  const parts = [ending.story];
  const lovers = state.lovers || [];
  const hasYuki = lovers.includes('yuki');
  const hasChloe = lovers.includes('chloe');
  const loveY = state.love?.yuki || 0;
  const loveC = state.love?.chloe || 0;

  // 2부: 현재 연애 상태 맞춤 후일담
  if (ending.id === 'end_two_timer') {
    parts.push('💔 [연애 후일담]\n양다리 참교육 이후, 유키와 클로이는 서로 절친이 되어 주말마다 당신을 불러내 감시하고 있습니다. 그래도 가끔 웃어주는 걸 보면 희망이 있을지도...?');
  } else if (hasYuki && hasChloe) {
    parts.push(`💕 [연애 후일담 — 유키 & 클로이]\n유키(호감도 ${loveY})와 클로이(호감도 ${loveC}) 모두와 깊은 인연을 맺은 당신. 세 사람은 서울의 평화 뒤에도 서로를 아끼며 특별한 팀워크를 이어가고 있습니다.`);
  } else if (hasYuki) {
    parts.push(`💚 [연애 후일담 — 유키]\n당신의 유일한 연인 유키(호감도 ${loveY})는 매일 아침 따뜻한 미소로 도시락과 말차를 챙겨줍니다. 두 사람의 다정한 일상은 서울에서 가장 부러운 커플로 소문이 자자합니다.`);
  } else if (hasChloe) {
    parts.push(`📸 [연애 후일담 — 클로이]\n당신의 유일한 연인 클로이(호감도 ${loveC})는 오늘도 당신의 가장 멋진 모습을 렌즈에 담느라 바쁩니다. "My hero, 웃어봐!" 그녀의 웃음소리가 일상을 채웁니다.`);
  } else if (loveY >= 35 || loveC >= 35) {
    parts.push(`💌 [연애 후일담 — 두근거리는 썸]\n아직 정식 고백 전이지만, ${loveY >= loveC ? '유키' : '클로이'}와 주고받는 눈빛 속엔 이미 설렘이 가득합니다. 이제 자유모드에서 용기를 내 고백해볼 시간입니다!`);
  } else {
    parts.push('🛡️ [파트너 후일담]\n연애보다 정의 구현에 집중한 당신! 김순경과 듬직한 동료들이 든든한 뒷배가 되어 주며 다음 도전을 응원합니다.');
  }

  // 3부: 수호정령 & 콩이 한마디
  const spCount = Object.keys(state.spirits || {}).filter((k) => (state.spirits[k] || 0) > 0).length;
  const petStr = state.pet?.adopted ? `반려견 콩이(Lv.${state.pet.level || 1})` : '동네 길고양이들';
  parts.push(`👻 [수호정령 & 동료 기록]\n수집한 수호정령 ${spCount}/100종 · ${petStr}과 함께한 DAY ${state.day}의 대장정이 영원한 전설로 기록되었습니다.`);
  return parts.join('\n\n');
}

export function evaluateEnding(state, isChaosCollapse = false) {
  if (isChaosCollapse) {
    return ENDINGS.find((e) => e.id === 'end_chaos_island');
  }
  const lovers = state.lovers || [];
  const hasYuki = lovers.includes('yuki');
  const hasChloe = lovers.includes('chloe');
  const loveY = state.love?.yuki || 0;
  const loveC = state.love?.chloe || 0;
  const yukiDates = state.dateStamps?.yuki?.length || 0;
  const chloeDates = state.dateStamps?.chloe?.length || 0;
  const spCount = Object.keys(state.spirits || {}).filter((k) => (state.spirits[k] || 0) > 0).length;

  // 19. 히든 화해 트리오 (둘 다 연인 + 각 호감도 120+ + 모범시민 우세)
  if (hasYuki && hasChloe && loveY >= 120 && loveC >= 120 && state.lawful >= state.chaotic) {
    return ENDINGS.find((e) => e.id === 'end_trio_house');
  }
  // 13. 양다리 대참사
  if (hasYuki && hasChloe) {
    return ENDINGS.find((e) => e.id === 'end_two_timer');
  }
  // 16. 흑막 블랙 튜브 MCN 단서 5개 진엔딩
  if ((state.clues || []).length >= 5) {
    return ENDINGS.find((e) => e.id === 'end_black_mcn_truth');
  }
  const { speech, guts, law } = state.stats;
  const chaos = state.chaosLevel ?? 25;
  const followers = state.followers || 120;
  const jpLv = state.lang?.jp || 1;
  const enLv = state.lang?.en || 1;

  if (hasYuki && yukiDates >= 5) {
    return ENDINGS.find((e) => e.id === 'end_yuki_home');
  }
  if (hasChloe && chloeDates >= 5) {
    return ENDINGS.find((e) => e.id === 'end_chloe_world');
  }
  if ((hasYuki || hasChloe) && state.lawful >= state.chaotic && chaos <= 25) {
    return ENDINGS.find((e) => e.id === 'end_true_love');
  }
  if (hasYuki && jpLv >= 4) {
    return ENDINGS.find((e) => e.id === 'end_yuki_tokyo');
  }
  if (hasChloe && enLv >= 4) {
    return ENDINGS.find((e) => e.id === 'end_chloe_ny');
  }
  if (!hasYuki && !hasChloe && state.pet?.adopted && spCount >= 10) {
    return ENDINGS.find((e) => e.id === 'end_squad_spirits');
  }
  if (jpLv >= 4 && enLv >= 4 && speech >= 6) {
    return ENDINGS.find((e) => e.id === 'end_polyglot');
  }
  if (speech >= 6 && guts >= 6 && law >= 6 && followers >= 2500 && chaos <= 25) {
    return ENDINGS.find((e) => e.id === 'end_true_utopia');
  }
  if (followers >= 3500 && speech >= guts && speech >= law) {
    return ENDINGS.find((e) => e.id === 'end_youtuber');
  }
  if (law >= 7 && law >= speech && law >= guts && state.lawful >= state.chaotic) {
    return ENDINGS.find((e) => e.id === 'end_prosecutor');
  }
  if (guts >= 7 && state.maxHp >= 130) {
    return ENDINGS.find((e) => e.id === 'end_ironman');
  }
  if (state.points >= 450) {
    return ENDINGS.find((e) => e.id === 'end_franchise_ceo');
  }
  if ((state.freeActionCount || 0) >= 12 && state.chaotic >= 30) {
    return ENDINGS.find((e) => e.id === 'end_lucky_guy');
  }
  if ((state.patrolCount || 0) >= 5 && state.lawful >= state.chaotic) {
    return ENDINGS.find((e) => e.id === 'end_police_partner');
  }
  if (state.chaotic > state.lawful) {
    return ENDINGS.find((e) => e.id === 'end_dark_hero');
  }
  return ENDINGS.find((e) => e.id === 'end_model_hero');
}
