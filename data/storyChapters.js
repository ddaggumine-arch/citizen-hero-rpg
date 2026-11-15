// V26.7 메인 스토리 30파트(30화) 대장정 — 5막 × 6화 구성 (제1~4막 10배 풀볼륨 분리)
import { STORY_ACT_1 } from './storyAct1.js';
import { STORY_ACT_2 } from './storyAct2.js';
import { STORY_ACT_3 } from './storyAct3.js';
import { STORY_ACT_4 } from './storyAct4.js';

export const STORY_CHAPTERS = [
  ...STORY_ACT_1,
  ...STORY_ACT_2,
  ...STORY_ACT_3,
  ...STORY_ACT_4,

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
