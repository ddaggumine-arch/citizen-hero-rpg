export const ITEMS = {
  water_gun: {
    id: 'water_gun',
    name: '🔫 초정밀 휴대용 물총',
    desc: '원거리에서 담배불이나 무개념의 콧대를 정확히 진압하는 수압 병기.',
    consumable: false,
  },
  megaphone: {
    id: 'megaphone',
    name: '📢 팩트폭력 메가폰',
    desc: '120dB의 우렁찬 공익 방송으로 공공장소 빌런의 수치심을 자극합니다.',
    consumable: false,
  },
  mirror: {
    id: 'mirror',
    name: '🪞 거울치료 반사경',
    desc: '상대방의 몰상식한 행동을 똑같이 되돌려주어 멘탈을 붕괴시킵니다.',
    consumable: false,
  },
  cheongsimhwan: {
    id: 'cheongsimhwan',
    name: '💊 우황청심환',
    desc: '치솟는 혈압을 가라앉혀 인내심을 35 회복합니다. (소모품)',
    consumable: true,
    useEffect: { hp: 35 },
  },
  cold_soda: {
    id: 'cold_soda',
    name: '🫧 얼음 동동 칠성사이다',
    desc: '답답한 속을 뚫어 사이다력을 40 충전합니다. (소모품)',
    consumable: true,
    useEffect: { sp: 40 },
  },
};

export const STORY_NODES = {
  intro: {
    id: 'intro',
    location: '제1장 · 집 앞 현관',
    tag: '프롤로그',
    tagType: 'event',
    title: '시민영웅의 출격',
    image: 'assets/images/street_smoker.jpg',
    text: `평화로운 주말 오후, 모처럼 동네 카페에서 여유를 즐기려 집을 나섰습니다.
하지만 바깥세상은 공중도덕을 밥 말아 먹은 각종 빌런들로 가득 차 있습니다!

오늘만큼은 참지 않겠다고 다짐한 당신.
외출 전, 책상 위에 놓인 '참교육 장비' 중 하나를 가방에 챙기기로 합니다.`,
    choices: [
      {
        text: '🔫 초정밀 휴대용 물총을 챙긴다',
        badge: '장비 획득',
        badgeClass: 'badge-item',
        effect: { addItem: 'water_gun', sp: 10 },
        resultText: '가방에 [초정밀 휴대용 물총]을 챙겼습니다! 물 탱크도 가득 채웠습니다.',
        next: 'stage1_spitter',
      },
      {
        text: '📢 팩트폭력 메가폰을 챙긴다',
        badge: '장비 획득',
        badgeClass: 'badge-item',
        effect: { addItem: 'megaphone', sp: 10 },
        resultText: '가방에 [팩트폭력 메가폰]을 챙겼습니다! 배터리 100% 완충!',
        next: 'stage1_spitter',
      },
      {
        text: '🪞 거울치료 반사경을 챙긴다',
        badge: '장비 획득',
        badgeClass: 'badge-item',
        effect: { addItem: 'mirror', sp: 10 },
        resultText: '가방에 [거울치료 반사경]을 챙겼습니다! 당한 만큼 돌려줄 준비 완료!',
        next: 'stage1_spitter',
      },
    ],
  },

  stage1_spitter: {
    id: 'stage1_spitter',
    location: '제1장 · 원룸촌 골목',
    tag: '빌런 조우',
    tagType: 'villain',
    title: '카악-퉤 가래침 스나이퍼',
    image: 'assets/images/spitter_villain.jpg',
    text: `골목 모퉁이를 돌자마자 귓가를 찢는 불쾌한 소리가 울려 퍼집니다.
"카아아악— 퉤!!"

삼선 슬리퍼를 질질 끌고 가던 남자가 보란 듯이 보도블록 한가운데 거대한 침을 뱉어 영역 표시를 하고 있습니다. 당신의 신발 코앞까지 튈 뻔했습니다!`,
    choices: [
      {
        text: '🪞 빌런 바로 앞 바닥에 생수를 뱉으며 거울치료 시전!',
        badge: '거울치료 반사경',
        badgeClass: 'badge-item',
        requiresItem: 'mirror',
        effect: { sp: 25, score: 35 },
        resultText: '당신이 보란 듯이 더 크게 "카악- 푸우!" 생수를 뱉자, 빌런이 기겁하며 "아 더럽게 뭐야!"라고 외치고 도망쳤습니다! (완벽한 거울치료!)',
        next: 'stage2_smoker',
      },
      {
        text: '📢 "방금 침 뱉으신 분! 경범죄 처벌법 과태료 5만원입니다!"',
        badge: '팩트폭력 메가폰',
        badgeClass: 'badge-item',
        requiresItem: 'megaphone',
        effect: { sp: 25, score: 35 },
        resultText: '골목 전체에 울려 퍼진 메가폰 소리에 주변 창문이 열리자, 빌런이 화들짝 놀라 줄행랑을 쳤습니다!',
        next: 'stage2_smoker',
      },
      {
        text: '🗣️ "저기요, 여기가 본인 안방입니까?" 정면 일침을 날린다',
        badge: '🎲 판정 (11+)',
        badgeClass: 'badge-dice',
        dice: {
          dc: 11,
          successEffect: { sp: 20, score: 30 },
          successText: '당신의 서늘한 눈빛과 정중한 일침에 빌런이 머쓱해하며 "죄송함다..." 하고 휴지로 닦고 사라졌습니다!',
          failEffect: { hp: -18 },
          failText: '빌런이 "니가 뭔데 참견이야!"라며 적반하장 시비를 걸고 도망갔습니다. 혈압이 솟구칩니다!',
        },
        next: 'stage2_smoker',
      },
      {
        text: '🤢 비위가 상하지만 꾹 참고 침 웅덩이를 피해 지나간다',
        badge: '인내심 -15',
        badgeClass: 'badge-cost',
        effect: { hp: -15 },
        resultText: '속으로 쌍욕을 삼키며 발걸음을 재촉했습니다. 하루가 벌써 고단합니다...',
        next: 'stage2_smoker',
      },
    ],
  },

  stage2_smoker: {
    id: 'stage2_smoker',
    location: '제2장 · 횡단보도 앞',
    tag: '빌런 조우',
    tagType: 'villain',
    title: '보행 훈제 빌런 (길빵러)',
    image: 'assets/images/street_smoker.jpg',
    text: `큰길로 나오자마자 매캐한 연기가 당신의 코와 폐를 강타합니다.
앞서 걷는 남자가 손가락 사이에 담배를 끼운 채 유유히 걸으며, 뒤따라오는 모든 행인들에게 강제 간접흡연 훈제 코스를 대접하고 있습니다!

당신의 인내심 한계가 점점 차오릅니다.`,
    choices: [
      {
        text: '🔫 바람을 뚫고 담배 끝을 정밀 조준 발사한다!',
        badge: '휴대용 물총',
        badgeClass: 'badge-item',
        requiresItem: 'water_gun',
        effect: { sp: 30, score: 45 },
        resultText: '피유우웅- 치이익! 한 방울의 오차도 없는 저격으로 담뱃불이 완벽히 꺼졌습니다! 어리둥절한 빌런을 뒤로하고 유유히 걸어갑니다.',
        next: 'stage3_blockers',
      },
      {
        text: '🌬️ 앞질러 뛰어가며 가방으로 바람을 일으켜 연기를 되돌린다',
        badge: '🎲 판정 (12+)',
        badgeClass: 'badge-dice',
        dice: {
          dc: 12,
          successEffect: { sp: 25, score: 35 },
          successText: '강력한 역풍에 자기 담배 연기를 정면으로 뒤집어쓴 길빵러가 "켁켁!"거리며 담배를 껐습니다!',
          failEffect: { hp: -22 },
          failText: '바람 방향을 잘못 계산해 연기를 두 배로 마셔버렸습니다! 콜록콜록! 폐가 아픕니다.',
        },
        next: 'stage3_blockers',
      },
      {
        text: '🫧 [사이다 필살기] "길빵 금지구역입니다! 바로 신고합니다!" 찰칵!',
        badge: '사이다 30 소모',
        badgeClass: 'badge-sp',
        requiresSp: 30,
        effect: { sp: -30, score: 50 },
        resultText: '단호하게 셔터를 누르는 시늉과 우렁찬 경고에 길빵러가 꼬리를 말고 꽁초를 휴대용 휴지통에 버리고 도망쳤습니다!',
        next: 'stage3_blockers',
      },
      {
        text: '😷 숨을 40초간 참고 전력 질주로 앞질러 간다',
        badge: '인내심 -18',
        badgeClass: 'badge-cost',
        effect: { hp: -18 },
        resultText: '폐활량 테스트를 강제로 치르며 겨우 빠져나왔습니다. 머리가 어지럽습니다...',
        next: 'stage3_blockers',
      },
    ],
  },

  stage3_blockers: {
    id: 'stage3_blockers',
    location: '제3장 · 좁은 상가 인도',
    tag: '빌런 조우',
    tagType: 'villain',
    title: '인도 2인 바리케이드 듀오',
    image: 'assets/images/sidewalk_blockers.jpg',
    text: `이제 목적지인 카페 코앞입니다. 그런데 좁아터진 인도 한복판을 두 사람이 나란히 팔짱을 낀 채 스마트폰만 보며 시속 1km로 기어가고 있습니다!

뒤에서는 행인들이 줄줄이 정체되어 있는데도, 이들은 낄낄대며 절대 길을 비켜줄 생각이 없어 보입니다.`,
    choices: [
      {
        text: '📢 "전방 거북이 2마리 서행 중! 좌우로 갈라지세요!" 방송',
        badge: '팩트폭력 메가폰',
        badgeClass: 'badge-item',
        requiresItem: 'megaphone',
        effect: { sp: 25, score: 40 },
        resultText: '모세의 기적처럼 두 사람이 좌우로 쫙 갈라지며 얼굴이 홍당무가 되었습니다! 뒤따르던 시민들이 작은 박수를 보냅니다.',
        next: 'convenience_store',
      },
      {
        text: '🪞 두 사람 바로 앞으로 쏙 들어가서 더 느린 거북이걸음 시전!',
        badge: '거울치료 반사경',
        badgeClass: 'badge-item',
        requiresItem: 'mirror',
        effect: { sp: 25, score: 40 },
        resultText: '당신이 앞에서 양팔 벌려 0.3km/h로 걷자 듀오가 답답해서 "아 좀 비켜요!" 하다가 자기들 꼴을 깨닫고 입을 다물었습니다!',
        next: 'convenience_store',
      },
      {
        text: '🏃 두 사람 사이 5cm 틈을 노려 어깨빵 없이 날렵하게 돌파!',
        badge: '🎲 판정 (11+)',
        badgeClass: 'badge-dice',
        dice: {
          dc: 11,
          successEffect: { sp: 20, score: 30 },
          successText: '"잠시 실례합니다~" 부드럽지만 단호한 목소리로 중앙 돌파에 성공했습니다!',
          failEffect: { hp: -18 },
          failText: '틈이 너무 좁아 부딪치자 둘이 "어머, 앞을 안 보고 다녀?"라며 째려봅니다. 억울해서 혈압이 오릅니다!',
        },
        next: 'convenience_store',
      },
      {
        text: '😤 한숨을 푹 쉬며 차도 가장자리로 아슬아슬하게 돌아간다',
        badge: '인내심 -15',
        badgeClass: 'badge-cost',
        effect: { hp: -15 },
        resultText: '뒤에서 빵빵거리는 경적 소리에 심장이 철렁했습니다.',
        next: 'convenience_store',
      },
    ],
  },

  convenience_store: {
    id: 'convenience_store',
    location: '제4장 · 카페 앞 24시 편의점',
    tag: '보급 & 휴식',
    tagType: 'event',
    title: '참교육 보급소 (편의점)',
    image: 'assets/images/street_smoker.jpg',
    text: `드디어 동네 카페 앞 편의점에 도착했습니다.
카페 창문 너머로 심상치 않은 검은 연기가 피어오르는 것이 보입니다... 무언가 거대한 최종 빌런이 안에 도사리고 있는 듯합니다!

지금까지 모은 [도덕점수]로 보스전을 대비해 물품을 보급할 수 있습니다.`,
    choices: [
      {
        text: '💊 우황청심환 구매 (즉시 인내심 +35 회복)',
        badge: '30 P 소모',
        badgeClass: 'badge-cost',
        requiresScore: 30,
        effect: { score: -30, hp: 35 },
        resultText: '우황청심환 한 알을 꿀꺽 삼켰습니다! 끓어오르던 화병이 눈 녹듯 가라앉습니다. (인내심 +35)',
        next: 'convenience_store',
      },
      {
        text: '🫧 얼음 동동 칠성사이다 구매 (사이다력 +40 충전)',
        badge: '25 P 소모',
        badgeClass: 'badge-cost',
        requiresScore: 25,
        effect: { score: -25, sp: 40 },
        resultText: '크으—! 목구멍을 때리는 탄산! 사이다력이 40 충전되었습니다!',
        next: 'convenience_store',
      },
      {
        text: '🔫 [초정밀 휴대용 물총] 추가 구매',
        badge: '35 P 소모',
        badgeClass: 'badge-cost',
        requiresScore: 35,
        hideIfHasItem: 'water_gun',
        effect: { score: -35, addItem: 'water_gun' },
        resultText: '편의점 장난감 코너에서 [초정밀 휴대용 물총]을 득템했습니다!',
        next: 'convenience_store',
      },
      {
        text: '☕ 심호흡을 하고 카페 문을 힘차게 열고 들어간다! (보스전)',
        badge: '보스전 돌입',
        badgeClass: 'badge-sp',
        next: 'boss_cafe',
      },
    ],
  },

  boss_cafe: {
    id: 'boss_cafe',
    location: '최종장 · 동네 아지트 카페 실내',
    tag: '에어리어 보스',
    tagType: 'boss',
    isBoss: true,
    title: '🔥 카페 실내 흡연 드래곤',
    image: 'assets/images/cafe_boss.jpg',
    text: `카페 문을 열자마자 눈을 의심했습니다!
구석 푹신한 소파에 다리를 꼬고 앉은 거대한 풍채의 남자가 **실내 카페 안에서 버젓이 담배를 피우며** 용처럼 연기를 내뿜고 있습니다!

알바생이 벌벌 떨며 말리자 보스가 코웃음을 칩니다.
"어이 학생, 내가 창문 조금 열어놨잖아? 뭐가 문제야? 내가 단골인데!"`,
    choices: [
      {
        text: '🔫 물총으로 보스의 담배와 재떨이를 일제 수압 사격!',
        badge: '휴대용 물총',
        badgeClass: 'badge-item',
        requiresItem: 'water_gun',
        bossDamage: 45,
        bossCounterDamage: 15,
        resultText: '물총의 정밀 수압 직격! 보스의 손에 들린 담배가 젖어버렸습니다! 보스가 "어이쿠 내 옷!" 하며 당황해합니다! (보스 멘탈 -45)',
        next: 'boss_cafe',
      },
      {
        text: '📢 "국민건강증진법 제9조! 실내흡연 과태료 10만원 현행범입니다!"',
        badge: '팩트폭력 메가폰',
        badgeClass: 'badge-item',
        requiresItem: 'megaphone',
        bossDamage: 45,
        bossCounterDamage: 15,
        resultText: '카페 손님들의 시선이 일제히 보스에게 꽂힙니다! 보스의 얼굴이 시뻘게지며 멘탈이 크게 흔들립니다! (보스 멘탈 -45)',
        next: 'boss_cafe',
      },
      {
        text: '🫧 [사이다 필살기] 전 손님과 합심해 112 & 보건소 동시 신고 + 영상 채증!',
        badge: '사이다 40 소모',
        badgeClass: 'badge-sp',
        requiresSp: 40,
        effect: { sp: -40 },
        bossDamage: 60,
        bossCounterDamage: 10,
        resultText: '완벽한 합법적 정의구현! 주변 손님들까지 스마트폰을 꺼내 들자 보스가 땀을 뻘뻘 흘리기 시작합니다! (보스 멘탈 -60)',
        next: 'boss_cafe',
      },
      {
        text: '🗣️ "어르신, 여긴 금연구역입니다. 당장 끄시죠." 정면 대치',
        badge: '🎲 판정 (11+)',
        badgeClass: 'badge-dice',
        dice: {
          dc: 11,
          successBossDamage: 35,
          successCounterDamage: 12,
          successText: '당신의 흔들리지 않는 기세에 눌린 보스가 흠칫하며 뒷걸음질 쳤습니다! (보스 멘탈 -35)',
          failBossDamage: 10,
          failCounterDamage: 24,
          failText: '보스가 "젊은 놈이 버릇없게!"라며 뿜은 연기에 눈이 매워졌습니다! (보스 멘탈 -10, 내 인내심 -24)',
        },
        next: 'boss_cafe',
      },
    ],
  },

  ending_victory: {
    id: 'ending_victory',
    location: '에필로그 · 평화로운 카페',
    tag: '엔딩: 대승리',
    tagType: 'event',
    title: '🏆 진정한 시민영웅 등극!',
    image: 'assets/images/cafe_boss.jpg',
    text: `결국 [카페 실내 흡연 드래곤]은 사방에서 쏟아지는 따가운 시선과 신고 출동 소리에 꽁무니를 빼고 도망쳤습니다!

카페 안에서는 환호와 박수가 터져 나오고, 알바생은 감사의 의미로 가장 비싼 아인슈페너를 무료로 건넵니다.
창밖의 거리가 오늘따라 유난히 맑고 상쾌해 보입니다.

당신의 위대한 공중도덕 수호기는 계속될 것입니다!`,
    choices: [
      {
        text: '🔄 새로운 장비로 처음부터 다시 참교육하기',
        badge: '재시작',
        badgeClass: 'badge-item',
        isRestart: true,
      },
    ],
  },

  ending_gameover: {
    id: 'ending_gameover',
    location: '에필로그 · 동네 응급실',
    tag: '엔딩: 패배',
    tagType: 'boss',
    title: '💥 화병(혈압 폭발)으로 쓰러짐...',
    image: 'assets/images/spitter_villain.jpg',
    text: `몰상식한 빌런들의 만행을 너무 많이 목격한 나머지, 당신의 인내심 게이지가 0이 되어 그 자리에서 뒷목을 잡고 쓰러졌습니다!

눈을 떠보니 천장이 하얗습니다. 의사 선생님이 말합니다.
"혈압이 220까지 치솟았습니다. 당분간 길빵러와 쩍벌남을 피하셔야 합니다..."

하지만 포기할 수 없습니다. 다음엔 더 강력한 사이다로 복수하리라 다짐합니다!`,
    choices: [
      {
        text: '🔄 퇴원하고 다시 참교육 출격하기!',
        badge: '재시작',
        badgeClass: 'badge-cost',
        isRestart: true,
      },
    ],
  },
};
