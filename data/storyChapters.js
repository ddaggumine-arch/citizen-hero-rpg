// V26.5 메인 스토리 30파트(30화) 대장정 — 5막 × 6화 구성 (제1막·제2막 10배 풀볼륨 분리)
import { STORY_ACT_1 } from './storyAct1.js';
import { STORY_ACT_2 } from './storyAct2.js';

export const STORY_CHAPTERS = [
  ...STORY_ACT_1,
  ...STORY_ACT_2,

  // ===== 제3막: 운명의 만남 & 연애/동료 해금편 (13~18화) =====
  {
    id: 'ch13',
    mission: { key: 'wins', target: 9, label: '⚔️ 빌런 총 9회 이상 승리' },
    chapterNum: 13,
    title: '한강대로 새벽의 굉음',
    bossId: 'sb_13',
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
    bossId: 'sb_14',
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
    bossId: 'sb_15',
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
            startBoss: true,
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
    bossId: 'sb_16',
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
    bossId: 'sb_17',
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
            startBoss: true,
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
    bossId: 'sb_18',
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
    bossId: 'sb_19',
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
    bossId: 'sb_20',
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
    bossId: 'sb_21',
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
    bossId: 'sb_22',
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
    bossId: 'sb_23',
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
    bossId: 'sb_24',
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
    bossId: 'sb_25',
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
            startBoss: true,
          },
          {
            text: '😈 "조회수 100만 찍어오려다 길 막혀서 늦었습니다. 비키시죠."',
            sub: '광기의 당당함! · 깡다구+2 · 광인+10 · 🔓 심야 마계 보스러시 해금',
            effect: { guts: 2, chaotic: 10, sp: 25 },
            startBoss: true,
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
    bossId: 'sb_26',
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
    bossId: 'sb_27',
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
    bossId: 'sb_28',
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
    bossId: 'sb_29',
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
    bossId: 'sb_30',
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
