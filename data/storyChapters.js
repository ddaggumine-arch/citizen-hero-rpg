// V26.0 메인 스토리 30파트(30화) 대장정 — 5막 × 6화 구성

export const STORY_CHAPTERS = [
  // ===== 제1막: 동네 자경단 각성편 (1~6화) =====
  {
    id: 'ch1',
    mission: null,
    chapterNum: 1,
    title: '골목길의 불청객',
    bossId: 'spitter',
    scenes: [
      {
        image: 'assets/images/officer_kim.jpg',
        tag: '제1화 · 제1막',
        title: '아침 공기를 가르는 소리',
        quote: '"어이구... 출근길 기분 다 망쳤네 진짜."',
        text: '노란 완장을 챙겨 집을 나선 지 불과 3분. 원룸촌 모퉁이에서 귓가를 찢는 불쾌한 소리와 함께 보도블록에 웅덩이가 생깁니다.',
        choices: [{ text: '👀 소리가 난 쪽을 매섭게 노려본다', sub: '계속 ▶', nextScene: 1 }],
      },
      {
        tag: '제1화 · 선택',
        title: '삼선 슬리퍼의 사나이',
        badge: '⚡ 상황 판단',
        ascii: '   🩴 😒 (당당하게 걷는 중) \n   📸 증거를 남길 것인가?  \n ───────────────────────── ',
        sub: '빌런에게 접근하는 방식을 고르세요',
        text: '삼선 슬리퍼를 질질 끌고 가는 남자가 두 번째 침을 모으고 있습니다! 이대로 두면 행인 신발에 튈 판입니다.',
        choices: [
          { text: '📸 스마트폰을 꺼내 조용히 영상을 찍어둔다', sub: '모범시민 +8 · 채증 +1 · 법지식 +1', effect: { lawful: 8, report: 1, law: 1 }, nextScene: 2 },
          { text: '😈 보란 듯이 달려가 앞길을 딱 막아선다', sub: '광인 +8 · 사이다 +10 · 깡다구 +1', effect: { chaotic: 8, sp: 10, guts: 1 }, nextScene: 2 },
        ],
      },
      {
        image: 'assets/images/spitter_villain.jpg',
        tag: '제1화 · 대치',
        title: '가래침 스나이퍼와의 첫 결전',
        quote: '"아 바닥 좀 더러워지면 어때서 젊은 놈이 유난이야?!"',
        text: '적반하장으로 눈을 부라리는 빌런! 첫 번째 참교육으로 본때를 보여줍시다!',
        choices: [{ text: '⚔️ 전투 시작! (참교육 돌입)', sub: '전투 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch2',
    mission: { key: 'patrols', target: 1, label: '🔍 [순찰·탐문] 1회 이상 진행' },
    chapterNum: 2,
    title: '좁은 인도의 통곡의 벽',
    bossId: 'sidewalk_blockers',
    scenes: [
      {
        image: 'assets/images/sidewalk_blockers.jpg',
        tag: '제2화 · 제1막',
        title: '시속 1km의 횡렬 보행',
        quote: '"어머~ 자기야 이거 봐봐 ㅋㅋ 완전 웃기지~"',
        text: '상가 앞 좁은 인도를 가로로 나란히 점령한 커플! 뒤에서 급히 가려는 시민들이 발만 동동 구르고 있습니다.',
        choices: [
          { text: '🗣️ "실례합니다, 뒷사람들 지나갈 길 좀 내주시죠."', sub: '모범 +6 · 언변 +1', effect: { lawful: 6, speech: 1 }, nextScene: 1 },
          { text: '😈 똑같이 앞질러 가서 시속 0.5km로 길막한다', sub: '광인 +6 · 사이다 +10', effect: { chaotic: 6, sp: 10 }, nextScene: 1 },
        ],
      },
      {
        image: 'assets/images/sidewalk_blockers.jpg',
        tag: '제2화 · 대치',
        title: '인도 2인 바리케이드 듀오',
        quote: '"우리가 전세 낸 거 아니지만 비켜줄 의무도 없거든?!"',
        text: '적반하장으로 따지는 바리케이드 듀오를 말빨과 센스로 제압하세요!',
        choices: [{ text: '⚔️ 전투 시작!', sub: '전투 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch3',
    mission: { key: 'patrols', target: 2, label: '🔍 [순찰·탐문] 2회 이상 진행' },
    chapterNum: 3,
    title: '두 칸의 대각선',
    bossId: 'parking_villain',
    scenes: [
      {
        image: 'assets/images/parking_villain.jpg',
        tag: '제3화 · 제1막',
        title: '황금빛 대각선 주차',
        quote: '"내 차 문콕 당하면 니가 책임질 거야?!"',
        text: '경차 두 대 들어갈 자리에 보란 듯이 대각선으로 주차해 놓은 뻔뻔한 차주! 클리어 시 공방·장비 창고가 열립니다.',
        choices: [{ text: '⚔️ 차주 참교육 돌입!', sub: '전투 ▶ (클리어 시 🔧 장비 해금)', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch4',
    mission: null,
    chapterNum: 4,
    title: '원룸촌 어둠 속의 무단투기',
    bossId: 'trash_dumper',
    scenes: [
      {
        image: 'assets/images/trash_dumper_sprite.png',
        tag: '제4화 · 제1막',
        title: '검은 비닐봉지의 주인',
        quote: '"밤인데 누가 본다고 ㅋㅋ 남들도 다 전봇대 밑에 버리던데?"',
        text: '종량제 봉투도 쓰지 않고 음식물 섞인 검은 비닐봉지를 전봇대 밑에 슬쩍 던지는 빌런을 현장에서 딱 잡았습니다!',
        choices: [
          { text: '⚖️ 폐기물관리법 과태료 100만원을 읊으며 돌진!', sub: '전투 ▶', startBoss: true },
        ],
      },
    ],
  },
  {
    id: 'ch5',
    mission: { key: 'stat_guts', target: 3, label: '🦁 배짱(깡다구) 3 이상 달성' },
    chapterNum: 5,
    title: '새벽 2시의 발망치',
    bossId: 'noise_villain',
    scenes: [
      {
        image: 'assets/images/noise_villain.jpg',
        tag: '제5화 · 제1막',
        title: '천장을 울리는 쿵쿵 소리',
        quote: '"내 집에서 내가 걷겠다는데 왜 난리야! 예민충이네!"',
        text: '밤마다 뒤꿈치로 바닥을 찍어대는 윗집 발망치 빌런! 더 이상 참을 수 없습니다. 윗집 현관문 앞 최종 담판!',
        choices: [{ text: '⚔️ 층간소음 빌런 제압!', sub: '전투 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch6',
    mission: null,
    chapterNum: 6,
    title: '골목 자경단의 밤 (1막 완결)',
    scenes: [
      {
        image: 'assets/images/officer_kim.jpg',
        tag: '제6화 · 1막 피날레',
        title: '김순경과의 긴급 공조',
        quote: '"영웅님! 골목길이 몰라보게 깨끗해졌습니다! 하지만..."',
        text: '파출소 김순경이 심각한 표정으로 태블릿을 보여줍니다. 최근 서울 전역의 민폐 빌런들이 조직적으로 움직이기 시작했다는 첩보! 이제 온라인 여론전과 커뮤니티 정보망까지 열립니다.',
        choices: [
          {
            text: '📱 "좋습니다! 이제 서울 시내 전체로 순찰 범위를 넓히죠!"',
            sub: '1막 완료 · 🔓 라이브 방송 & 서울 커뮤니티 해금!',
            effect: { points: 50, lawful: 10 },
            completeChapterOnly: true,
          },
        ],
      },
    ],
  },

  // ===== 제2막: 도심과 대중교통 침투편 (7~12화) =====
  {
    id: 'ch7',
    mission: { key: 'stat_law', target: 3, label: '⚖️ 법지식 3 이상 달성' },
    chapterNum: 7,
    title: '정적을 깨는 딸깍임',
    bossId: 'pen_clicker',
    scenes: [
      {
        image: 'assets/images/pen_clicker_sprite.png',
        tag: '제7화 · 제2막',
        title: '스터디카페의 빌런',
        quote: '"딸깍! 딸깍! 나 집중할 때 원래 이런 버릇 있는데~?"',
        text: '조용한 스터디카페에서 3초마다 볼펜을 딸깍거리며 다리를 떠는 빌런! 집중이 깨진 수험생들의 눈빛이 당신에게 향합니다.',
        choices: [{ text: '⚔️ 볼펜 딸깍이 참교육!', sub: '전투 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch8',
    mission: { key: 'stat_speech', target: 3, label: '🗣️ 언변 3 이상 달성' },
    chapterNum: 8,
    title: '272번 버스의 음파 테러',
    bossId: 'shorts_terrorist',
    scenes: [
      {
        image: 'assets/images/shorts_terrorist_sprite.png',
        tag: '제8화 · 제2막',
        title: '스피커폰 100%의 공포',
        quote: '"푸하하하!! 다 같이 웃으면 좋잖아? 이어폰 귀 아파서 안 껴!"',
        text: '퇴근길 만원 버스 안에서 이어폰 없이 숏폼 영상을 최대 음량으로 틀어놓은 빌런! 모두의 귀를 구원합시다.',
        choices: [{ text: '⚔️ 음파 테러리스트 제압!', sub: '전투 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch9',
    mission: { key: 'wins', target: 5, label: '⚔️ 빌런 총 5회 이상 승리' },
    chapterNum: 9,
    title: '출근길 새치기 엘보우',
    bossId: 'line_cutter',
    scenes: [
      {
        image: 'assets/images/line_cutter_sprite.png',
        tag: '제9화 · 제2막',
        title: '강남역 2호선 승강장',
        quote: '"어? 나 방금 급해서 먼저 타야 돼요~ (이어폰 낀 채 모른 척)"',
        text: '열차 문 앞에서 줄을 무시하고 팔꿈치로 밀치며 들어가는 새치기 빌런! 클리어 시 법적 처벌을 내릴 수 있는 시민 즉결 재판소가 해금됩니다.',
        choices: [{ text: '⚔️ 새치기 빌런 정면 제지!', sub: '전투 ▶ (클리어 시 ⚖️ 재판소 해금)', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch10',
    mission: null,
    chapterNum: 10,
    title: '카페 4인석 콘센트 점령',
    bossId: 'cafe_hogger',
    scenes: [
      {
        image: 'assets/images/cafe_hogger_sprite.png',
        tag: '제10화 · 제2막',
        title: '아아 1잔과 멀티탭의 제국',
        quote: '"저 잠깐 2시간만 나갔다 올 건데 짐 치우지 마세요. 내 자리임."',
        text: '손님이 바글바글한 카페 4인석에 노트북, 태블릿, 멀티탭을 다 꽂아두고 자리만 비우는 뻔뻔한 빌런!',
        choices: [{ text: '⚔️ 콘센트 독점 빌런 참교육!', sub: '전투 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch11',
    mission: { key: 'wins', target: 7, label: '⚔️ 빌런 총 7회 이상 승리' },
    chapterNum: 11,
    title: '철과 땀의 무법지대',
    bossId: 'gym_villain',
    scenes: [
      {
        image: 'assets/images/gym_villain.jpg',
        tag: '제11화 · 제2막',
        title: '덤벨 투척 고릴라',
        quote: '"어이 멸치, 벤치 내 자리야 비켜! 20분만 인스타 보고 칠 거야!"',
        text: '40kg 덤벨을 바닥에 내동댕이치며 머신을 독점하는 헬스장 고릴라를 제압하세요!',
        choices: [{ text: '⚔️ 헬스장 고릴라 제압!', sub: '전투 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch12',
    mission: null,
    chapterNum: 12,
    title: '진상 연합 단톡방 해킹 작전 (2막 완결)',
    scenes: [
      {
        image: 'assets/images/act_patrol.jpg',
        tag: '제12화 · 2막 피날레',
        title: '진상 연합의 비밀 네트워크',
        quote: '"어라... 얘네 배후에 누군가 돈을 대주고 있었네?!"',
        text: '제압한 빌런의 폰에서 [진상 연합 서울지부] 단톡방을 입수했습니다! 뒤에서 민폐 영상을 사들이는 거대 MCN 조직의 정체가 드러납니다. 보상금으로 자취방 꾸미기 & 주식 재테크가 열립니다!',
        choices: [
          {
            text: '💻 증거를 백업하고 아지트를 정비한다',
            sub: '2막 완료 · 🔓 자취방 꾸미기 & 서울 주식 해금!',
            effect: { points: 80, law: 1 },
            completeChapterOnly: true,
          },
        ],
      },
    ],
  },

  // ===== 제3막: 운명의 만남 & 연애/동료 해금편 (13~18화) =====
  {
    id: 'ch13',
    mission: { key: 'wins', target: 9, label: '⚔️ 빌런 총 9회 이상 승리' },
    chapterNum: 13,
    title: '한강대로 새벽의 굉음',
    bossId: 'night_biker',
    scenes: [
      {
        image: 'assets/images/night_biker_sprite.png',
        tag: '제13화 · 제3막',
        title: '배기음 튜닝 폭주족',
        quote: '"부아아앙!! 내 오토바이 배기음 예술이지?!"',
        text: '새벽 도심을 울리는 불법 튜닝 오토바이의 굉음! 소음 측정기와 법지식으로 폭주족을 멈춰 세웁시다!',
        choices: [{ text: '⚔️ 심야 폭주족 단속!', sub: '전투 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch14',
    mission: null,
    chapterNum: 14,
    title: '홍대 북카페의 소동',
    bossId: 'spitter',
    scenes: [
      {
        image: 'assets/images/yuki_normal.jpg',
        tag: '제14화 · 운명의 만남 ①',
        title: '말차 라떼를 든 일본인 점원',
        quote: '"저기... 매장 안에서는 매너를 지켜주시면 감사하겠어요..."',
        text: '홍대 골목 감성 북카페에서 난동을 부리는 민폐 손님 때문에 곤란해하는 단발의 일본인 여성, 유키! 지금 바로 나서서 도와줍시다!',
        choices: [{ text: '⚔️ "아가씨 뒤로 물러서세요! 제가 처리합니다!"', sub: '전투 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch15',
    mission: null,
    chapterNum: 15,
    title: '빗속 북카페의 수호자',
    scenes: [
      {
        image: 'assets/images/yuki_blush.jpg',
        tag: '제15화 · 유키 루트 해금!',
        title: '따뜻한 말차 라떼 한 잔',
        quote: '"아까 정말 멋졌어요...! 혹시 일본어에 관심 있으시면 제가 알려드릴까요?"',
        text: '유키가 감사의 표시로 직접 내린 말차 라떼를 건네며 수줍게 웃습니다. 연락처를 교환한 두 사람! 이제 [💘 연애·어학]에서 유키와 알아가고 데이트할 수 있습니다!',
        choices: [
          {
            text: '💖 "좋아요! 앞으로 자주 놀러 올게요, 유키 씨!"',
            sub: '🔓 연애 모드(유키 루트 & 일본어) 해금! · 유키 호감도 +15',
            effect: { loveYuki: 15, sp: 20 },
            completeChapterOnly: true,
          },
        ],
      },
    ],
  },
  {
    id: 'ch16',
    mission: null,
    chapterNum: 16,
    title: '성수동 촬영장의 훼방꾼',
    bossId: 'parking_villain',
    scenes: [
      {
        image: 'assets/images/chloe_normal.jpg',
        tag: '제16화 · 운명의 만남 ②',
        title: '필름 카메라를 든 뉴욕 포토그래퍼',
        quote: '"Excuse me?! 여기 스태프 구역인데 차를 대면 어떡해요!"',
        text: '성수동 붉은 벽돌거리에서 화보를 촬영하던 금발의 포토그래퍼 클로이 앞에 불법 주차 빌런이 들이닥쳤습니다! 멋지게 해결해줍시다!',
        choices: [{ text: '⚔️ "촬영 방해는 용서 못 하죠! 비키시죠!"', sub: '전투 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch17',
    mission: null,
    chapterNum: 17,
    title: '렌즈 너머의 미소',
    scenes: [
      {
        image: 'assets/images/chloe_wink.jpg',
        tag: '제17화 · 클로이 루트 해금!',
        title: '찰칵! 마음에 담긴 한 컷',
        quote: '"Wow, 완전 히어로 같았어! 내 SNS 모델이랑 영어 과외도 해줄게~♥"',
        text: '클로이가 윙크하며 당신의 멋진 모습을 필름 카메라에 담았습니다! 이제 [💘 연애·어학]에서 클로이와 영어 공부 및 설레는 데이트가 해금됩니다!',
        choices: [
          {
            text: '📸 "영광이네요, 클로이! 잘 부탁해요!"',
            sub: '🔓 연애 모드(클로이 루트 & 영어) 해금! · 클로이 호감도 +15',
            effect: { loveChloe: 15, followers: 100 },
            completeChapterOnly: true,
          },
        ],
      },
    ],
  },
  {
    id: 'ch18',
    mission: null,
    chapterNum: 18,
    title: '골목길 작은 꼬리의 구조',
    bossId: 'trash_dumper',
    scenes: [
      {
        image: 'assets/images/pet_walk.jpg',
        tag: '제18화 · 3막 피날레',
        title: '버려진 상자 속 아기 시바견',
        quote: '"멍! 멍!! (쓰레기 더미 앞에서 용감하게 짖는 중)"',
        text: '무단투기 현장을 단속하다가, 씩씩하게 빌런의 바짓가랑이를 물고 늘어지는 아기 시바견 "콩이"를 만났습니다! 빌런을 쫓아내면 [🐶 시바견 콩이 입양 & 산책/전직]이 해금됩니다!',
        choices: [{ text: '⚔️ 콩이와 함께 무단투기범 제압!', sub: '전투 ▶ (클리어 시 🐶 콩이 해금)', startBoss: true }],
      },
    ],
  },

  // ===== 제4막: 진상 연합 4대 천왕 결전편 (19~24화) =====
  {
    id: 'ch19',
    mission: { key: 'wins', target: 11, label: '⚔️ 빌런 총 11회 이상 승리' },
    chapterNum: 19,
    title: '홍대 골목의 검은 연기',
    bossId: 'street_smoker',
    scenes: [
      {
        image: 'assets/images/street_smoker.jpg',
        tag: '제19화 · 4대 천왕 ①',
        title: '보행 훈제 길빵 대장',
        quote: '"길거리에서 내가 피우는데 무슨 상관인데? 꼬우면 피해 가 ㅋㅋ"',
        text: '진상 연합 4대 천왕의 첫 번째 간부 [길빵 대장]! 홍대 거리의 맑은 공기를 되찾기 위해 정면 돌파합니다!',
        choices: [{ text: '⚔️ [보스전] 길빵 대장 참교육!', sub: '보스전 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch20',
    mission: { key: 'wins', target: 13, label: '⚔️ 빌런 총 13회 이상 승리' },
    chapterNum: 20,
    title: '2호선의 140도',
    bossId: 'subway_manspreader',
    scenes: [
      {
        image: 'assets/images/subway_manspreader.jpg',
        tag: '제20화 · 4대 천왕 ②',
        title: '지하철 2호선 쩍벌 대마왕',
        quote: '"내 다리가 길어서 어쩔 수 없다는데? 꼬우면 서서 가!"',
        text: '출근길 지옥철에서 양옆 두 칸을 140도로 점령한 두 번째 천왕 [쩍벌 대마왕]을 꺾으세요!',
        choices: [{ text: '⚔️ [보스전] 쩍벌 대마왕 참교육!', sub: '보스전 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch21',
    mission: null,
    chapterNum: 21,
    title: '다리 꼬기 & 차고 해금 작전',
    bossId: 'subway_legger',
    scenes: [
      {
        image: 'assets/images/subway_legger_sprite.png',
        tag: '제21화 · 제4막',
        title: '통로를 막은 쩍벌 후예',
        quote: '"구두에 흙 묻었잖아! 물어낼 거야?!"',
        text: '지하철 통로까지 다리를 뻗고 앉은 빌런을 제압하면, 더 넓은 기동력을 위해 [🚗 차량 구매 & 코스튬 쇼룸]이 해금됩니다!',
        choices: [{ text: '⚔️ 다리꼬기 빌런 제압!', sub: '전투 ▶ (클리어 시 🚗 차고 & 코스튬 해금)', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch22',
    mission: { key: 'wins', target: 15, label: '⚔️ 빌런 총 15회 이상 승리' },
    chapterNum: 22,
    title: '어둠 속의 반딧불이',
    bossId: 'cinema_boss',
    scenes: [
      {
        image: 'assets/images/cinema_boss.jpg',
        tag: '제22화 · 4대 천왕 ③',
        title: '영화관 발차기 & 반딧불이',
        quote: '"어머~ 카톡 한 번 본 게 뭐 대수라고 유난이야?!"',
        text: '클라이맥스 장면마다 밝기 100% 폰 화면을 켜고 앞좌석을 차대는 세 번째 천왕을 암전 속으로 돌려보냅시다!',
        choices: [{ text: '⚔️ [보스전] 영화관 빌런 참교육!', sub: '보스전 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch23',
    mission: { key: 'wins', target: 17, label: '⚔️ 빌런 총 17회 이상 승리' },
    chapterNum: 23,
    title: '성수동의 검은 드래곤',
    bossId: 'cafe_boss',
    scenes: [
      {
        image: 'assets/images/cafe_boss.jpg',
        tag: '제23화 · 4대 천왕 ④',
        title: '카페 실내 흡연 드래곤',
        quote: '"창문 5cm 열어놨잖아? 단골인데 한 대도 못 피워?!"',
        text: '마침내 4대 천왕의 마지막 보스 [카페 실내 흡연 드래곤]과 성수동에서 격돌합니다!',
        choices: [{ text: '⚔️ [최종 보스전] 실내 흡연 드래곤 참교육!', sub: '보스전 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch24',
    mission: null,
    chapterNum: 24,
    title: '🚨 히로인 구출 & 합동 방어전!',
    bossId: 'illegal_parker',
    scenes: [
      {
        image: 'assets/images/illegal_parker_sprite.png',
        tag: '제24화 · 4막 피날레',
        title: '스쿨존 앞 보복 난동!',
        quote: '"네가 우리 보스들을 건드렸겠다?! 이 거리 다 막아버릴 거야!"',
        text: '4대 천왕을 잃고 앙심을 품은 진상 연합 잔당이 유키와 클로이가 있는 거리 입구를 차로 막고 협박합니다! 반드시 지켜내고 [🏛️ 시민영웅 재단 & 배틀타워]를 여세요!',
        choices: [{ text: '⚔️ "내 소중한 사람들에게 손대지 마!!"', sub: '전투 ▶ (클리어 시 🏛️ 재단 & 타워 해금)', startBoss: true }],
      },
    ],
  },

  // ===== 제5막: 블랙 튜브 MCN & 닥터 카오스 최종 결전편 (25~30화) =====
  {
    id: 'ch25',
    mission: null,
    chapterNum: 25,
    title: '🕵️ 여의도 MCN 본사 위장 잠입',
    scenes: [
      {
        image: 'assets/images/dr_chaos_sprite.png',
        tag: '제25화 · 5막 첩보전',
        title: '노란 완장을 숨겨라!',
        quote: '"어이 신입? 자네 얼굴이 낯익은데... 어느 팀 소속이지?"',
        text: '블랙 튜브 MCN 본사에 인턴으로 위장 잠입한 순간, 보안 팀장이 날카롭게 쳐다봅니다! 들키지 않고 기밀 서버실에 들어가야 합니다.',
        choices: [
          {
            text: '🎭 "어제 새로 온 영상 편집팀 인턴입니다! 어그로 썸네일 수정 중입니다!"',
            sub: '완벽한 연기! · 법지식+2 · 모범+10 · 🔓 심야 마계 보스러시 해금',
            effect: { law: 2, lawful: 10, points: 60 },
            completeChapterOnly: true,
          },
          {
            text: '😈 "조회수 100만 찍어오려다 길 막혀서 늦었습니다. 비키시죠."',
            sub: '광기의 당당함! · 깡다구+2 · 광인+10 · 🔓 심야 마계 보스러시 해금',
            effect: { guts: 2, chaotic: 10, sp: 25 },
            completeChapterOnly: true,
          },
        ],
      },
    ],
  },
  {
    id: 'ch26',
    mission: null,
    chapterNum: 26,
    title: '알고리즘 조작실 돌파',
    bossId: 'shorts_terrorist',
    scenes: [
      {
        image: 'assets/images/shorts_terrorist_sprite.png',
        tag: '제26화 · 제5막',
        title: '분노 유발 알고리즘의 근원',
        quote: '"시민들이 화날수록 우리 채널 수익이 복리로 터진다고 ㅋㅋ!"',
        text: '서울의 민폐 영상을 고의로 확산시키던 MCN 알고리즘 조작실장! 장비를 박살 내고 서버를 셧다운시킵시다!',
        choices: [{ text: '⚔️ 조작실장 제압!', sub: '전투 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch27',
    mission: null,
    chapterNum: 27,
    title: '가짜 뉴스 편집실 격파',
    bossId: 'cafe_hogger',
    scenes: [
      {
        image: 'assets/images/cafe_hogger_sprite.png',
        tag: '제27화 · 제5막',
        title: '악마의 편집 디렉터',
        quote: '"너도 곧 악당으로 몰아줄게! 키보드 샷건 맛 좀 볼래?!"',
        text: '시민영웅을 음해하는 가짜 뉴스를 찍어내던 편집팀장을 팩트폭력으로 박살 내세요!',
        choices: [{ text: '⚔️ 가짜 뉴스 편집장 제압!', sub: '전투 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch28',
    mission: { key: 'wins', target: 20, label: '⚔️ 빌런 총 20회 이상 승리' },
    chapterNum: 28,
    title: '사생팬 & 악플러 부대 돌파',
    bossId: 'noise_villain',
    scenes: [
      {
        image: 'assets/images/noise_villain.jpg',
        tag: '제28화 · 제5막',
        title: '비상계단 앞 최후의 바리케이드',
        quote: '"닥터 카오스님 방에 한 발짝도 못 들어간다! 쿵쾅쿵쾅!!"',
        text: '회장실 바로 앞 층계를 가로막은 친위대장을 물리치면 드디어 흑막의 문이 열립니다!',
        choices: [{ text: '⚔️ 친위대장 돌파!', sub: '전투 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch29',
    mission: null,
    chapterNum: 29,
    title: 'MCN 옥상 헬기장 게이트',
    bossId: 'gym_villain',
    scenes: [
      {
        image: 'assets/images/gym_villain.jpg',
        tag: '제29화 · 제5막',
        title: '거대한 문지기',
        quote: '"도망칠 헬기 준비 끝났다! 내 주먹을 뚫어보실까?!"',
        text: '여의도 빌딩 옥상으로 도주하려는 닥터 카오스를 막기 위해 최후의 경호원을 쓰러뜨리세요!',
        choices: [{ text: '⚔️ 옥상 경호원 격파!', sub: '전투 ▶', startBoss: true }],
      },
    ],
  },
  {
    id: 'ch30',
    mission: null,
    chapterNum: 30,
    title: '🎭 흑막 총수 · 닥터 카오스 최종 결전',
    bossId: 'boss_dr_chaos',
    scenes: [
      {
        image: 'assets/images/dr_chaos_sprite.png',
        tag: '제30화 · GRAND FINALE',
        title: '노란 완장의 그림자',
        quote: '"호오, 내 후배가 여기까지 올 줄이야? 서울의 혼란은 곧 돈이야!"',
        text: '3년 전 빗속 버스정류장 사건의 원흉이자 모든 진상 연합을 조종한 흑막 총수 [닥터 카오스]! 서울 시민, 김순경, 유키, 클로이, 콩이의 응원을 등에 업고 최후의 참교육을 시작합니다!',
        choices: [{ text: '🔥 [최종 결전] 닥터 카오스 참교육 돌입!', sub: '최종 보스전 ▶', startBoss: true }],
      },
    ],
  },
];
