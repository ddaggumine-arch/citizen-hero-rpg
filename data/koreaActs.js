// V50.0: 전국 5대 액트 대장정 (전주 5화 + 평택 10화 + 동탄 15화 + 마계 인천 20화 + 서울 30화 = 80화)
// + 50명 전용 스프라이트, 추천 레벨 곡선, 지역 배경 4종, 무역/던전/지부/정령석 데이터
import { buildDeepEpisode } from './actStoriesRich.js?v=119';

export const KOREA_ACTS = [
  {
    id: 'jeonju',
    actNum: 1,
    name: '🍲 Act 1 · 전주',
    sub: '한옥마을 & 전북대 · 추천 Lv.1~5 (총 5화)',
    minLv: 1,
    recLvRange: 'Lv.1~5',
    totalEps: 5,
    bossId: 'act_jeonju_5',
    bg: 'assets/images/ui/bg_jeonju.jpg?v=102',
    desc: '바가지 상인과 새치기 빌런이 판치는 전주 한옥마을! 노란 완장의 첫 여정이 시작됩니다.',
    dungeonName: '🏯 한옥마을 야시장 뒷골목',
    buffDesc: '클리어 보상: Act 2 평택 해금 · 최대 HP +20 · 무역/공방 개방',
  },
  {
    id: 'pyeongtaek',
    actNum: 2,
    name: '🚆 Act 2 · 평택',
    sub: '평택역 & 항구·기지앞 · 추천 Lv.6~14 (총 10화)',
    minLv: 4,
    recLvRange: 'Lv.6~14',
    totalEps: 10,
    bossId: 'act_pyeongtaek_10',
    bg: 'assets/images/ui/bg_pyeongtaek.jpg?v=102',
    desc: '불법 호객꾼과 항구 밀수꾼이 모이는 교차로! 전주 5화 클리어 시 개방됩니다.',
    dungeonName: '⚓ 평택항 심야 컨테이너 구역',
    buffDesc: '클리어 보상: Act 3 동탄 해금 · 공격력 +4 · 지부/부동산 개방',
  },
  {
    id: 'dongtan',
    actNum: 3,
    name: '🏙️ Act 3 · 동탄',
    sub: '호수공원 & 신도시 · 추천 Lv.15~25 (총 15화)',
    minLv: 12,
    recLvRange: 'Lv.15~25',
    totalEps: 15,
    bossId: 'act_dongtan_15',
    bg: 'assets/images/ui/bg_dongtan.jpg?v=102',
    desc: '층간소음 리코더 마왕과 맘카페 여론 조작단이 지배하는 신도시! 평택 10화 클리어 시 개방됩니다.',
    dungeonName: '🏢 동탄 메타폴리스 지하주차장',
    buffDesc: '클리어 보상: Act 4 마계 인천 해금 · 방어력 +4 · 정령석 소켓 개방',
  },
  {
    id: 'incheon',
    actNum: 4,
    name: '😈 Act 4 · 마계 인천',
    sub: '부평 지하상가 · 월미도 · 추천 Lv.26~40 (총 20화)',
    minLv: 22,
    recLvRange: 'Lv.26~40',
    totalEps: 20,
    bossId: 'act_incheon_20',
    bg: 'assets/images/ui/bg_incheon.jpg?v=102',
    desc: '한 번 들어가면 못 나오는 부평 지하상가 미로와 월미도 디스코팡팡 마왕 DJ가 군림하는 진짜 마계!',
    dungeonName: '🕸️ 부평 지하상가 무한 미로 던전',
    buffDesc: '클리어 보상: Act 5 서울 총결전 & 치명타 +8% · 마계 정령석 드랍↑',
  },
  {
    id: 'seoul',
    actNum: 5,
    name: '👑 Act 5 · 서울',
    sub: '대한민국 최종 결전 본진 · 추천 Lv.30~50 (기존 30화)',
    minLv: 1,
    recLvRange: 'Lv.30~50',
    totalEps: 30,
    bossId: 'cafe_boss',
    bg: 'assets/images/seoul_map_bg.png',
    desc: '전국 4개 도시를 평정한 영웅이 서울 최종 흑막과 마주하는 최후의 무대!',
    dungeonName: '🚇 2호선 심야 환승 미궁',
    buffDesc: '전국 5대 액트 완전 제패 시 [대한민국 총괄 영웅] 칭호 부여!',
  },
];

export const REGIONAL_GOODS = [
  { id: 'good_jeonju', origin: 'jeonju', name: '🍲 전주 수제 모주·비빔팩', basePrice: 30, desc: '서울·인천에서 고가에 팔리는 전통 보양 특산품' },
  { id: 'good_pyeongtaek', origin: 'pyeongtaek', name: '⚡ 평택 수입 에너지팩', basePrice: 55, desc: '동탄·서울 직장인들이 줄 서서 사는 고카페인 보급품' },
  { id: 'good_dongtan', origin: 'dongtan', name: '☕ 동탄 스페셜티 원두', basePrice: 80, desc: '전주·인천 카페거리에서 프리미엄 붙는 원두' },
  { id: 'good_incheon', origin: 'incheon', name: '😈 마계 인천 정령촉매', basePrice: 120, desc: '차이나타운 뒷골목에서만 구할 수 있는 희귀 촉매' },
  { id: 'good_seoul', origin: 'seoul', name: '🎗️ 서울 노란완장 굿즈', basePrice: 45, desc: '지방 팬덤이 열광하는 정품 시민영웅 굿즈' },
];

export const RUNE_STONES = [
  { id: 'rune_jeonju', name: '🟢 전주의 숨결석', atk: 2, def: 2, crit: 0, spRegen: 1, desc: '공격+2 · 방어+2 · 매턴 사이다+1' },
  { id: 'rune_pyeongtaek', name: '🔵 평택의 번개석', atk: 5, def: 0, crit: 0.04, spRegen: 0, desc: '공격+5 · 치명타+4%' },
  { id: 'rune_dongtan', name: '🟡 동탄의 방패석', atk: 1, def: 5, crit: 0, spRegen: 2, desc: '공격+1 · 방어+5 · 매턴 사이다+2' },
  { id: 'rune_incheon', name: '🟣 마계 인천의 심연석', atk: 8, def: 2, crit: 0.08, spRegen: 0, desc: '공격+8 · 방어+2 · 치명타+8%' },
  { id: 'rune_seoul', name: '🌟 서울 각성석', atk: 6, def: 4, crit: 0.05, spRegen: 3, desc: '공격+6 · 방어+4 · 치명+5% · 사이다+3' },
];

const RAW_ROSTER = {
  jeonju: [
    ['🍡 한옥마을 꼬치 새치기 빌런', 'speech', 'act_s1_01.png', '"아 줄 서는 거 답답해서 못 기다려요~ 먼저 좀 삽시다!"'],
    ['🍚 비빔밥 가격후려치기 상인', 'law', 'act_s1_02.png', '"전주 비빔밥에 계란 추가는 5천 원이야!"'],
    ['🛴 한옥길 킥보드 무법자', 'guts', 'act_s1_03.png', '"돌담길 비켜요! 풀악셀 나간다!!"'],
    ['📚 전북대 도서관 자리맡기 빌런', 'speech', 'act_s1_04.png', '"가방 4개 올려놨으니까 여기 다 내 자리임 ㅅㄱ"'],
    ['🏮 한옥마을 바가지 대왕 (Act 1 보스)', 'law', 'act_s1_05.png', '"관광지 프리미엄 몰라?! 물 한 병에 만 원이야!"'],
  ],
  pyeongtaek: [
    ['📢 평택역 불법호객꾼', 'speech', 'act_s1_06.png', '"형님~ 딱 10초만 들어보시고 가시라니까!"'],
    ['🏍️ 미군기지앞 소음폭주족', 'guts', 'act_s1_07.png', '"부아아앙!! 새벽 배기음 튜닝 예술이지?!"'],
    ['🚬 평택터미널 무단흡연남', 'law', 'act_s1_08.png', '"야외나 다름없는데 담배 한 대 피우면 어때!"'],
    ['🚇 기차역 무임승차 빌런', 'snap', 'act_s1_09.png', '"개찰구 뛰어넘는 게 내 특기야! 못 잡지롱!"'],
    ['⚖️ 평택시장 저울속이기 상인', 'law', 'act_s1_10.png', '"어허, 바구니 무게 포함해서 딱 두 근 맞다니까!"'],
    ['🚛 불법 주정차 덤프트럭 기사', 'snap', 'act_s2_01.png', '"비상등 켰잖아! 5분만 대고 간다고!!"'],
    ['🍺 송탄 클럽 만취 진상', 'guts', 'act_s2_02.png', '"내가 누군지 알아?! 술 더 가져와!!"'],
    ['🚕 바가지 미터기 택시', 'law', 'act_s2_03.png', '"시외 할증 3배 붙는 거 원래 법이야 손님~"'],
    ['📦 야간 컨테이너 도둑', 'snap', 'act_s2_04.png', '"어둠 속에서 박스 하나 들고 튀는 건 식은 죽 먹기지!"'],
    ['⚓ 평택항 심야 밀수 브로커 (Act 2 보스)', 'speech', 'act_s2_05.png', '"항구 바닷바람 맞으며 사라지고 싶지 않으면 비켜라."'],
  ],
  dongtan: [
    ['🐕 호수공원 오프리쉬 견주', 'law', 'act_s2_06.png', '"우리 애기 안 물어요~ 그냥 뛰어놀게 둬요!"'],
    ['🍼 쌍둥이 유모차 길막 무법자', 'speech', 'act_s2_07.png', '"아기 자니까 보행로 전부 비키세요!!"'],
    ['💻 카페 6시간 콘센트 빌런', 'speech', 'act_s2_08.png', '"아메리카노 한 잔 시켰으면 3노트북 풀가동 가능하지!"'],
    ['🛗 엘리베이터 문닫기 빌런', 'guts', 'act_s2_09.png', '"바빠 죽겠는데 누가 타! 닫힘 버튼 연타!!"'],
    ['🛴 단지 내 2인 역주행 킥보드족', 'snap', 'act_s2_10.png', '"인도로 역주행하는 게 제일 빠르다니까!"'],
    ['📱 맘카페 허위사실 유포자', 'law', 'act_s3_01.png', '"카더라로 글 하나 쓰면 여론 바로 뒤집어지거든~"'],
    ['🏋️ 새벽 헬스장 덤벨 던지기남', 'guts', 'act_s3_02.png', '"으아악! 득근하려면 덤벨은 던져야 제맛이지!"'],
    ['🚗 주차장 두칸 차지 빌런', 'snap', 'act_s3_03.png', '"내 차 문콕 당하면 어쩔 건데! 두 칸 내 거다!"'],
    ['🗑️ 아파트 분리수거 테러리스트', 'law', 'act_s3_04.png', '"음식물이랑 플라스틱 다 섞어 버리면 알아서 치우겠지!"'],
    ['🚙 학원가 불법주정차 맘', 'snap', 'act_s3_05.png', '"우리 애 나올 때까지만 비상등 켜고 있을게요~"'],
    ['🚅 동탄역 GTX 새치기 직장인', 'speech', 'act_s3_06.png', '"출근 늦었다고! 줄 좀 끼어들면 어때서!"'],
    ['🍗 배달음식 몰래 빼먹는 라이더', 'snap', 'act_s3_07.png', '"치킨 다리 하나쯤 빠져도 손님은 모를 거야 꿀꺽~"'],
    ['🪵 층간 발망치 괴물', 'guts', 'act_s3_08.png', '"집에서 뒤꿈치로 걸어 다니는 게 내 자유 아니야?!"'],
    ['👜 가짜 명품 중고거래 사기꾼', 'law', 'act_s3_09.png', '"정품 보증서? 지금 집에 두고 왔는데 일단 입금해~"'],
    ['🎺 층간소음 리코더 마왕 (Act 3 보스)', 'law', 'act_s3_10.png', '"새벽 3시엔 역시 삐리리~ 내 집에서 내가 부는데 무슨 상관?!"'],
  ],
  incheon: [
    ['👻 부평 지하상가 호객꾼 망령', 'speech', 'act_s4_01.png', '"학생~ 딱 1분만 보고 가~ 출구 못 찾지? 크크크!"'],
    ['😈 출구 방향 속이는 길안내 악마', 'speech', 'act_s4_02.png', '"3번 출구는 사실 17번 출구랑 이어져 있지롱!"'],
    ['🍺 주안역 넥타이 취객 난동꾼', 'guts', 'act_s4_03.png', '"내가 누군지 알아?! 오늘 밤 끝까지 간다!!"'],
    ['🪩 구월동 로데오 삐끼 대장', 'speech', 'act_s4_04.png', '"우리 가게 수질 최고야~ 일단 들어와 보라니까!"'],
    ['⌚ 인천터미널 짝퉁 시계 팔이', 'law', 'act_s4_05.png', '"명품 시계 5만 원! 방금 세관에서 나온 특급 물건이야!"'],
    ['🦀 소래포구 저울치기 달인', 'law', 'act_s4_06.png', '"물 무게? 아 이 정도 물은 원래 다 들어가는 거야~"'],
    ['🍲 차이나타운 마라탕 새치기', 'guts', 'act_s4_07.png', '"국자 먼저 집었으면 내 차례지! 비켜!"'],
    ['📚 배다리 헌책방 사재기꾼', 'speech', 'act_s4_08.png', '"희귀본 내가 다 싹쓸이해서 10배로 되팔 거야!"'],
    ['🏎️ 인천대교 과속 폭주 카레이서', 'snap', 'act_s4_09.png', '"바다 위 직선도로는 내 서킷이야! 풀악셀!!"'],
    ['⛺ 송도 센트럴파크 텐트 알박기남', 'law', 'act_s4_10.png', '"명당 자리는 1년 365일 내 텐트가 지킨다!"'],
    ['🔥 차이나타운 암흑 요리사', 'guts', 'act_s5_01.png', '"불맛을 넘어선 지옥맛 짬뽕을 먹어보겠나?!"'],
    ['🔧 월미도 바이킹 안전바 파괴자', 'snap', 'act_s5_02.png', '"스릴이 부족해! 안전바 좀 느슨하게 풀어줄까?!"'],
    ['🔊 부평 클럽 스피커 테러리스트', 'guts', 'act_s5_03.png', '"베이스 200% 올린다!! 고막 터질 준비해라!!"'],
    ['🏮 인천항 심야 밀입국 브로커', 'law', 'act_s5_04.png', '"안개 낀 인천항의 비밀을 건드리지 마라..."'],
    ['🗑️ 계양산 쓰레기 투기 마귀', 'snap', 'act_s5_05.png', '"산 정상에서 빈 병 던지는 기분 끝내주네!"'],
    ['📄 검단신도시 불법 전단지 폭격수', 'snap', 'act_s5_06.png', '"온 바닥에 전단지 눈보라를 뿌려주마!!"'],
    ['🐟 연안부두 가짜 회 사기꾼', 'law', 'act_s5_07.png', '"자연산 다금바리 맞다니까! (사실 고무 모형)"'],
    ['🍻 인하대 후문 먹자골목 진상', 'guts', 'act_s5_08.png', '"쓰레기통 걷어차야 술맛이 나지 크하하!"'],
    ['🕵️ 마계 인천 뒷골목 해결사', 'speech', 'act_s5_09.png', '"인천 바닥에서 노란 완장 따위가 통할 것 같나?"'],
    ['🎡 월미도 디스코팡팡 마왕 DJ (Act 4 보스)', 'guts', 'act_s5_10.png', '"어디 한번 버텨봐라!! 마계 인천의 원심력을 맛보여주마!!"'],
  ],
};

const WEAK_LABELS = {
  speech: '🗣️ 약점: 언변',
  guts: '🥊 약점: 깡다구',
  law: '⚖️ 약점: 법지식',
  snap: '📸 약점: 채증',
};

const ACT_BASE_LV = { jeonju: 1, pyeongtaek: 6, dongtan: 15, incheon: 26 };

export const ACT_VILLAINS = [];
export const ACT_STORY_EPISODES = {};

const ACT_DRAMA_TEMPLATES = {
  jeonju: {
    witness: '전통 찻집 사장님',
    witnessLine: '"아이고 영웅님, 저 사람 때문에 한옥마을 찾은 손님들이 다 인상을 찌푸리고 돌아가고 있어요! 제발 좀 혼내주세요!"',
    snsTag: '전주한옥마을_실시간',
    heroVow: '나는 소매에 감긴 노란 완장을 꽉 조여 맸다. 천년 고도 전주의 따뜻한 인심을 망치는 민폐는 절대 용서할 수 없다.',
    afterCitizen: '한옥마을 상인회 어르신이 따뜻한 모주와 손수건을 건네며 연신 고개를 숙여 감사 인사를 전했다.',
  },
  pyeongtaek: {
    witness: '평택역 야간 역무원',
    witnessLine: '"여기 교통이랑 항구 치안이 마비될 지경입니다! 경찰 오기 전에 저 막무가내 빌런을 멈춰주세요!"',
    snsTag: '평택_교통치안_속보',
    heroVow: '차가운 밤바람을 가르며 앞을 가로막았다. 수도권과 항구가 만나는 이 거친 교차로에서도 질서는 반드시 지켜져야 한다.',
    afterCitizen: '주변을 지나던 시민들과 외국인 관광객들이 일제히 엄지를 치켜세우며 박수를 보냈다.',
  },
  dongtan: {
    witness: '동탄 신도시 입주민',
    witnessLine: '"매일 밤낮으로 저런 무개념 행동 때문에 주민들 스트레스가 폭발 직전이에요! 제발 팩트와 법으로 참교육 좀 해주세요!"',
    snsTag: '동탄맘_실시간제보',
    heroVow: '반짝이는 호수공원 야경 뒤편에 숨은 이기주의를 정면으로 마주할 시간이다. 도덕과 상식의 무게를 똑똑히 보여주마.',
    afterCitizen: '동탄 커뮤니티 실시간 게시판에 "노란 완장 영웅님 진짜 레전드"라며 인증샷과 감사 댓글이 폭주하기 시작했다.',
  },
  incheon: {
    witness: '부평 지하상가 상인',
    witnessLine: '"여긴 마계 인천이라 경찰도 혀를 내두르는 곳이에요... 정말 저 괴물 같은 녀석을 상대할 수 있겠어요?!"',
    snsTag: '마계인천_레전드속보',
    heroVow: '보랏빛 네온사인이 번쩍이는 마계 인천의 한복판. 심장이 거세게 뛰지만, 물러설 생각은 추호도 없다. 오늘 이 구역의 질서를 새로 쓴다!',
    afterCitizen: '충격에 빠졌던 마계 인천 구경꾼들 사이에서 "저 노란 완장은 진짜배기다!"라는 경외의 탄성이 터져 나왔다.',
  },
};

Object.entries(RAW_ROSTER).forEach(([actId, list]) => {
  const baseLv = ACT_BASE_LV[actId] || 1;
  const actObj = KOREA_ACTS.find((a) => a.id === actId);
  const drama = ACT_DRAMA_TEMPLATES[actId] || ACT_DRAMA_TEMPLATES.jeonju;
  const locFlavor = {
    jeonju: ['전주 한옥마을 돌담길', '전통시장 먹거리 골목', '전북대 캠퍼스 앞', '한옥마을 야시장'],
    pyeongtaek: ['평택역 광장', '송탄 로데오거리', '평택항 부두길', '평택 시외터미널'],
    dongtan: ['동탄 호수공원 산책로', '동탄역 GTX 환승통로', '메타폴리스 아파트 단지', '동탄 신도시 카페거리'],
    incheon: ['부평 지하상가 미로', '차이나타운 홍등 거리', '소래포구 어시장', '월미도 테마파크 앞바다'],
  }[actId] || ['현장'];

  ACT_STORY_EPISODES[actId] = [];
  list.forEach((row, idx) => {
    const epNum = idx + 1;
    const isBoss = epNum === list.length;
    const recLv = Math.min(45, baseLv + Math.floor(idx * (actId === 'incheon' ? 0.75 : 0.85)));
    const maxHp = Math.round((75 + recLv * 18) * (isBoss ? 1.45 : 1.0));
    const atk = Math.round((10 + recLv * 1.15) * (isBoss ? 1.25 : 1.0));
    const reward = Math.round((32 + recLv * 6) * (isBoss ? 1.8 : 1.0));
    const id = `act_${actId}_${epNum}`;
    const spot = locFlavor[idx % locFlavor.length];
    const nextRow = list[idx + 1];
    const spriteUrl = `assets/images/acts/${row[2]}?v=120`;

    ACT_VILLAINS.push({
      id,
      actId,
      actEp: epNum,
      isActBoss: isBoss,
      fixedLv: recLv,
      location: `${actObj?.name || actId} ${epNum}화`,
      name: row[0],
      maxHp,
      atk,
      reward,
      weakness: row[1],
      weaknessLabel: WEAK_LABELS[row[1]] || '🗣️ 약점: 언변',
      image: spriteUrl,
      introQuote: row[3],
      banterQuotes: [row[3]],
      defeatQuote: isBoss ? '"크윽... 전국구 시민영웅의 완장, 인정한다!"' : '"죄송합니다! 두 번 다시 민폐 안 끼칠게요!"',
    });

    const deep = buildDeepEpisode({
      ep: epNum,
      recLv,
      isBoss,
      actId,
      actName: actObj?.name || actId,
      bg: actObj?.bg || '',
      sprite: spriteUrl,
      title: `제${epNum}화 · ${row[0]}`,
      battleBossId: id,
      villainName: row[0],
      weakness: row[1],
      quote: row[3],
    });
    ACT_STORY_EPISODES[actId].push({
      ep: epNum,
      recLv,
      isBoss,
      actId,
      actName: actObj?.name || actId,
      bg: actObj?.bg || '',
      sprite: spriteUrl,
      title: `제${epNum}화 · ${row[0]}`,
      battleBossId: id,
      scenes: deep.scenes,
      aftermathScenes: deep.aftermathScenes,
    });
  });
});

export const ACT_PIN_LABELS = {
  jeonju: { patrol: '한옥순찰', work: '비빔알바', train: '전주천', heal: '전주숙소', shop: '한옥상점', luck: '야시장', landmark: '🏯', river: '〰️ 전주천 〰️' },
  pyeongtaek: { patrol: '항구순찰', work: '기지알바', train: '부두공원', heal: '평택숙소', shop: '24시편의점', luck: '역오락실', landmark: '⚓', river: '〰️ 평택항 〰️' },
  dongtan: { patrol: '신도시순찰', work: '카페알바', train: '호수공원', heal: '동탄숙소', shop: '동탄마트', luck: '메타오락실', landmark: '🏙️', river: '〰️ 동탄호수 〰️' },
  incheon: { patrol: '부평순찰', work: '차이나알바', train: '월미공원', heal: '인천아지트', shop: '뒷문암시장', luck: '디스코오락실', landmark: '🎡', river: '〰️ 월미바다 〰️' },
  seoul: { patrol: '골목순찰', work: '알바터', train: '철봉공원', heal: '우리집', shop: '24시편의점', luck: '오락실', landmark: '🗼', river: '〰️ 한강 〰️' },
};

export const RELAY_QUESTS = [
  {
    id: 'relay_jj_ic',
    title: '🌶️ 전주 → 😈 인천: 전설의 비법 고추장 배달',
    from: 'jeonju',
    to: 'incheon',
    itemName: '전주 100년 비법 고추장',
    rewardDesc: '불지옥 엘릭서 2개 + 공격력 +3 + 120P',
    rewardPoints: 120,
    rewardAtk: 3,
  },
  {
    id: 'relay_pt_dt',
    title: '🔧 평택 → 🏙️ 동탄: 수입 소음차단 부품 납품',
    from: 'pyeongtaek',
    to: 'dongtan',
    itemName: '평택항 특수 방음 모듈',
    rewardDesc: '방어력 +4 + 최대 HP +15 + 150P',
    rewardPoints: 150,
    rewardDef: 4,
  },
  {
    id: 'relay_dt_sl',
    title: '🚄 동탄 → 👑 서울: GTX VIP 쾌속 패스 개통',
    from: 'dongtan',
    to: 'seoul',
    itemName: 'GTX VIP 쾌속 패스',
    rewardDesc: '동탄↔서울 KTX 특실 영구 무료 + 180P',
    rewardPoints: 180,
    freeGtx: true,
  },
  {
    id: 'relay_ic_jj',
    title: '💿 인천 → 🍲 전주: 부평 레트로 명반 선물',
    from: 'incheon',
    to: 'jeonju',
    itemName: '부평 지하상가 희귀 레코드판',
    rewardDesc: '🌟 서울 각성석(정령석) + 250P',
    rewardPoints: 250,
    rewardRune: 'rune_seoul',
  },
];

ACT_STORY_EPISODES.seoul = [
  {
    ep: 1,
    recLv: 30,
    title: '👑 제5막 · 전국 제패 시민영웅 서울 귀환',
    text: '전주·평택·동탄·마계 인천을 모두 거친 당신! 이제 서울의 기존 4대 구역 보스와 메인 스토리 30화를 완결지어 진정한 레전드로 등극하세요.',
    choices: [
      { label: '🔥 전국 영웅 오라 개방! (전체 스탯 강화)', sub: '사이다·인내심 풀회복 · +150P', spFull: true, points: 150, skill: 'combat' },
    ],
  },
];
