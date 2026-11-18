import { TIME_SLOTS, ITEMS, TRAITS, VILLAINS, BOSSES, HIDDEN_BOSS, WEATHERS, RANDOM_EVENTS, STORY_MESSAGES } from './data/gameData.js?v=111';
import { SKILLS_100, getSkillById, getUnlockedSkillsForLevel } from './data/skills100.js?v=111';
import { YUKI_DMS_50, CHLOE_DMS_50 } from './data/heroineDms.js?v=112';
import { KOREA_ACTS, REGIONAL_GOODS, RUNE_STONES, ACT_VILLAINS, ACT_STORY_EPISODES, ACT_PIN_LABELS, RELAY_QUESTS } from './data/koreaActs.js?v=109';
import { STORY_CHAPTERS } from './data/storyChapters.js?v=48';
import { ACTIVITY_CATEGORIES } from './data/activities.js?v=48';
import { MINI_EVENTS, ENEMY_INTENTS, createFeedForVictory } from './data/liveEvents.js';
import { ENDINGS, evaluateEnding, buildFullEndingText } from './data/endings.js?v=82';
import { HEROINES, LANG_QUIZZES, DATE_EVENTS } from './data/romance.js?v=63';
import { CARS, GEAR_UPGRADES, ACHIEVEMENTS } from './data/lifestyle.js';
import { STREAM_MISSIONS, ROOM_UPGRADES, GUERRILLA_VILLAINS, STOCKS, HEROINE_GIFTS } from './data/v16Systems.js';
import { COURT_CASES, COSTUMES, CAPSULE_POOL, PET_WALK_EVENTS } from './data/v17Systems.js?v=63';
import { CLUES, SOME_CRISIS_EVENTS, RIVAL_EVENTS, REFORMED_ALLIES, GETTING_TO_KNOW_EVENTS, STORY_INTERLUDES, WEEKEND_EVENTS } from './data/v19Story.js?v=51';
import { DIFFICULTIES, RARITY_INFO, GEAR_LOOT_POOL, GEAR_ENCHANTS, PET_JOBS, LOGIC_COUNTERS, generateCommunityPosts } from './data/v24Systems.js?v=61';
import { KISS_SCENES, LOVER_ACTIONS, KISS_SCENE_CHOICES } from './data/v25Romance.js?v=71';
import { SPIRITS_50, SPIRIT_ELEMENTS } from './data/spirits50.js?v=76';
import { UNLOCK_MILESTONES, isFeatureUnlocked, SEOUL_DISTRICTS, getDistrictIdForEnemy, getClearedDistrictCount } from './data/v26World.js?v=108';
import { STORY_BOSSES } from './data/storyBosses.js?v=45';
import { STORY_AFTERMATHS } from './data/storyAftermath.js?v=81';
import { YUKI_ROMANCE_STORY } from './data/romanceStoryYuki.js?v=92';
import { CHLOE_ROMANCE_STORY } from './data/romanceStoryChloe.js?v=92';
import { sfx } from './sound.js';

const SAVE_KEY = 'citizen_hero_gta_save_v4';
const SAVE_SLOTS_KEY = 'citizen_hero_gta_slots_v1';
const ENDINGS_KEY = 'citizen_hero_endings_v1';
const SETTINGS_KEY = 'citizen_hero_gta_settings_v1';

const ITEM_ICONS = {
  water_gun: 'assets/images/items/water_gun.png',
  megaphone: 'assets/images/items/megaphone.png',
  mirror: 'assets/images/items/mirror.png',
  cheongsimhwan: 'assets/images/items/cheongsimhwan.png',
  cold_soda: 'assets/images/items/cold_soda.png',
  gift_box: 'assets/images/items/gift_box.png',
  car_1: 'assets/images/items/car_1.png',
  car_2: 'assets/images/items/car_2.png',
  car_3: 'assets/images/items/car_3.png',
  police: 'assets/images/items/costume_police.png',
  dark: 'assets/images/items/costume_dark.png',
  couple: 'assets/images/items/costume_couple.png',
  costume_police: 'assets/images/items/costume_police.png',
  costume_dark: 'assets/images/items/costume_dark.png',
  costume_couple: 'assets/images/items/costume_couple.png',
  golden_whistle: 'assets/images/items/golden_whistle.png',
  fact_book: 'assets/images/items/fact_book.png',
  mattress: 'assets/images/items/room_mattress.png',
  soundproof: 'assets/images/items/room_soundproof.png',
  desk: 'assets/images/items/room_desk.png',
  doghouse: 'assets/images/items/room_doghouse.png',
};

function itemImgHtml(key, cls = 'choice-thumb') {
  const src = ITEM_ICONS[key];
  return src ? `<img src="${src}" class="${cls}" alt="" />` : '';
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { sound: true, bgm: true, vibrate: true, ...JSON.parse(raw) };
  } catch (_) {}
  return { sound: true, bgm: true, vibrate: true };
}

function saveSettings() {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (_) {}
}

function createNewGameState() {
  return {
    phase: 'prologue_1',
    day: 1,
    timeIndex: 0, // 0: 오전, 1: 오후, 2: 밤, 3: 심야
    hp: 100,
    maxHp: 100,
    sp: 25,
    maxSp: 100,
    points: 30,
    lawful: 0,
    chaotic: 0,
    pendingReports: 1, // 시작 시 윗집 소음 채증 1건 보유
    unreadMessages: 1,
    stats: { speech: 2, guts: 2, law: 2 },
    bonusDmg: 0,
    critBonus: 0,
    spDmgBonus: 0,
    diceBonus: 0,
    gutsSpBonus: 0,
    inventory: ['cheongsimhwan'],
    usedEquipThisBattle: [],
    traits: [],
    flags: [],
    defeatedBossIds: [],
    chapterIndex: 0,
    storySceneIndex: 0,
    currentEnemyId: null,
    currentEventId: null,
    enemyHp: 0,
    enemyMaxHp: 0,
    enemyStunned: false,
    quote: '',
    log: '',
    draftOptions: [],
    chaosLevel: 25,
    followers: 120,
    liveFeed: null,
    enemyIntent: 'normal',
    weakCombo: 0,
    bossPhase2: false,
    currentMiniEventId: null,
    patrolCount: 0,
    activityCount: 0,
    lastCutscene: null,
    mapLoc: 'heal',
    achievedEndingId: null,
    lang: { jp: 0, en: 0 },
    love: { yuki: 0, chloe: 0 },
    lovers: [],
    romanceTarget: null,
    currentQuizIdx: 0,
    lastDateDay: { yuki: 0, chloe: 0 },
    pet: { adopted: false, name: '콩이', level: 0, exp: 0 },
    carLevel: 0,
    gearLevels: { water_gun: 1, megaphone: 1, mirror: 1 },
    unlockedAch: [],
    winCount: 0,
    perfectSnaps: 0,
    enemyBroken: false,
    dateMessages: [],
    usedQuizIdx: { jp: [], en: [] },
    usedDateIdx: { yuki: [], chloe: [] },
    dailyStats: { wins: 0, loveGain: 0 },
    lastContactDay: { yuki: 1, chloe: 1 },
    roomUpgrades: [],
    guerrilla: null,
    stockPrices: { cider_pharma: 30, manner_ent: 45, hanriver_ev: 60 },
    stockHoldings: { cider_pharma: 0, manner_ent: 0, hanriver_ev: 0 },
    streamMission: null,
    costume: 'default',
    towerFloor: 0,
    bestTowerFloor: 0,
    courtCaseIdx: 0,
    petWalkEventIdx: 0,
    clues: [],
    someCleared: { yuki: false, chloe: false },
    dateCount: { yuki: 0, chloe: 0 },
    sulky: { yuki: false, chloe: false },
    lastHomeVisitDay: 0,
    allies: [],
    enemyApologyTurns: 0,
    isFirstTurn: true,
    lastStudyDay: { jp: 0, en: 0 },
    usedKnowIdx: { yuki: [], chloe: [] },
    seenInterludes: [],
    pendingInterlude: null,
    sodaBuffDmg: 0,
    weather: 'sunny',
    skillChain: [],
    villainWins: {},
    villainEncounters: {},
    level: 1,
    exp: 0,
    flatDef: 0,
    bossDmgMult: 0,
    startSpBonus: 0,
    rewardMultBonus: 0,
    skillPoints: 0,
    allocatedStats: { speech: 0, guts: 0, law: 0, hp: 0 },
    scrap: 0,
    gearPlus: {},
    feverGauge: 0,
    feverTurns: 0,
    enemyModifier: null,
    pendingWeekend: false,
    statueBuilt: false,
    difficulty: 'normal',
    ngPlus: 0,
    gearBag: [],
    equipped: { weapon: null, armor: null, acc: null },
    usedLogicCounter: false,
    kissUnlocked: { yuki: false, chloe: false },
    lastKissDay: { yuki: 0, chloe: 0 },
    lastLoverDateDay: { yuki: 0, chloe: 0 },
    loverStamps: { yuki: [], chloe: [] },
    loverMasterBonus: { yuki: false, chloe: false },
    kissCollection: [],
    activeKissAction: null,
    loverActionIdx: 0,
    districts: { mapo: 0, seongsu: 0, gangnam: 0, jongno: 0, yeouido: 0 },
    nightmareFloor: 0,
    bestNightmareFloor: 0,
    breakingNews: null,
    breakingFirstDone: false,
    dailyFortune: 'gold',
    storyCleared: false,
    freePlayMode: false,
    extendedGoldenTime: false,
    pendingMorningSummary: null,
    gearEnchants: {},
    invadedDistrict: null,
    goldenMission: null,
    partnerBond: 1,
    partnerWinTicks: 0,
    lastPicnicDay: 0,
    dailyQuests: null,
    bossGimmick: null,
    bossShield: 0,
    bossCountdown: 0,
    skillPp: { speech: 12, guts: 10, law: 8, snap: 6 },
    spirits: {},
    spiritProgress: {},
    spiritNicknames: {},
    equippedSpirit: null,
    pendingSpiritEncounter: null,
    spiritCaptureResult: null,
    pendingStoryAftermath: null,
    lastMainStoryDay: 0,
    lastRomanceEpDay: { yuki: 0, chloe: 0 },
    romanceStory: { yuki: { ep: 0, cleared: false }, chloe: { ep: 0, cleared: false } },
    activeRomanceStory: null,
    epilogueIdx: 0,
    epilogueSeen: false,
    fame: 0,
    infamy: 0,
    skills: { sneak: 1, speech: 1, alchemy: 1, combat: 1 },
    skillXp: { sneak: 0, speech: 0, alchemy: 0, combat: 0 },
    ingredients: { bacchus: 1, capsaicin: 1, red_ginseng: 0, spirit_dust: 0, cold_brew: 0 },
    customPotions: [],
    customSpell: null,
    rumor: '',
    sideQuest: { id: null, step: 0, done: [] },
    houseTier: 0,
    lottoTickets: 0,
    pendingDm: null,
    currentAct: 'seoul',
    clearedActs: [],
    actStoryStep: {},
    tradeCargo: {},
    marketRates: null,
    dispatchedActs: {},
    ownedRunes: [],
    socketedRunes: { weapon: null, armor: null, acc: null },
    relayItems: [],
    relayDone: [],
    pendingSos: null,
    freeGtxPass: false,
    activeActStory: null,
    pendingActAftermath: null,
    equippedSkills: { speech: 'sk_speech_1', guts: 'sk_guts_1', law: 'sk_law_1', snap: 'sk_snap_1' },
    unlockedSkills: ['sk_speech_1', 'sk_guts_1', 'sk_law_1', 'sk_snap_1'],
    usedDmIdx: { yuki: [], chloe: [] },
    pendingLevelUp: null,
    lastDateDay: { yuki: 0, chloe: 0 },
  };
}

const GOLDEN_TIME_DAYS = 120;

const DAILY_FORTUNES = [
  { id: 'gold', icon: '🌟', short: '황금의 날(보상1.5배)', desc: '오늘 전투 승리 포인트 +50%!' },
  { id: 'cider', icon: '⚡', short: '사이다 날(SP+20·필살)', desc: '전투 시작 시 SP+20 & 첫 공격 치명타!' },
  { id: 'romance', icon: '💘', short: '인연의 날(호감+보너스)', desc: '오늘 어학·데이트 시 추가 보너스!' },
  { id: 'shield', icon: '🛡️', short: '수호의 날(전투HP+15)', desc: '전투 시작마다 인내심 +15 회복!' },
];

const VILLAIN_EXCUSES = [
  '"아 제가 오늘 기분이 좀 우울해서 그랬어요... 한 번만 봐주세요!!"',
  '"나 원래 이런 사람 아니에요! 맘카페에 올리지 마요, 카메라 치워!!"',
  '"아이고 허리야... 나 환자예요 환자! 오히려 내가 피해자라고!!"',
  '"아니 남들도 다 이렇게 하던데 왜 나한테만 지랄이에요?!"',
  '"잠깐만! 우리 아버지가 누군지 알아요?!... 아 죄송합니다 살려주세요!"',
  '"인스타 릴스 찍으려고 장난 좀 친 건데 그게 그렇게 큰 죄예요?!"',
];

let _typewriterTimer = null;
let _typewriterFull = '';
function setLogText(text, useTypewriter = false) {
  if (_typewriterTimer) {
    clearInterval(_typewriterTimer);
    _typewriterTimer = null;
  }
  const str = String(text || '');
  _typewriterFull = str;
  if (!useTypewriter || str.length <= 10) {
    elBattleLog.textContent = str;
    return;
  }
  let idx = 0;
  elBattleLog.textContent = '';
  elBattleLog.onclick = () => {
    if (_typewriterTimer) {
      clearInterval(_typewriterTimer);
      _typewriterTimer = null;
      elBattleLog.textContent = _typewriterFull;
    }
  };
  _typewriterTimer = setInterval(() => {
    idx += 2;
    elBattleLog.textContent = str.slice(0, idx);
    if (idx >= str.length) {
      clearInterval(_typewriterTimer);
      _typewriterTimer = null;
    }
  }, 16);
}

function rollBreakingNews() {
  const heroLv = state.level || 1;
  const availDists = SEOUL_DISTRICTS.filter((d) => (d.minLv || 1) <= heroLv + 4);
  const distPool = availDists.length > 0 ? availDists : [SEOUL_DISTRICTS[0]];
  const dist = distPool[Math.floor(Math.random() * distPool.length)];
  const pool = (dist.villains || []).filter((id) => VILLAINS.some((v) => v.id === id) || GUERRILLA_VILLAINS.some((v) => v.id === id));
  const enemyId = pool.length ? pool[Math.floor(Math.random() * pool.length)] : 'shorts_terrorist';
  const enemy = getEnemyById(enemyId);
  state.breakingNews = {
    districtId: dist.id,
    districtName: dist.name,
    enemyId: enemy.id,
    enemyName: enemy.name,
    bonusPts: 35,
  };
}

function loadSavedGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

function saveGame() {
  if (!state || state.phase === 'title' || state.phase === 'gameover') return;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (_) {}
}

function loadSaveSlots() {
  try {
    const raw = localStorage.getItem(SAVE_SLOTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 10) return parsed;
    }
  } catch (_) {}
  return Array(10).fill(null);
}

function saveToSlot(idx) {
  const slots = loadSaveSlots();
  const rep = getReputationInfo();
  const now = new Date();
  const timeStr = `${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  slots[idx] = {
    savedAt: timeStr,
    summary: `DAY ${state.day} · 제${Math.min(30, state.chapterIndex + 1)}화 · ${rep.label} · ${state.points}P`,
    data: JSON.parse(JSON.stringify(state)),
  };
  try { localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots)); } catch (_) {}
}

function loadFromSlot(idx) {
  const slots = loadSaveSlots();
  const entry = slots[idx];
  if (!entry || !entry.data) return false;
  state = { ...createNewGameState(), ...entry.data };
  saveGame();
  return true;
}

function deleteSlot(idx) {
  const slots = loadSaveSlots();
  slots[idx] = null;
  try { localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots)); } catch (_) {}
}

function loadUnlockedEndings() {
  try {
    const raw = localStorage.getItem(ENDINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [];
}

function unlockEnding(endingId) {
  const list = loadUnlockedEndings();
  if (!list.includes(endingId)) {
    list.push(endingId);
    try { localStorage.setItem(ENDINGS_KEY, JSON.stringify(list)); } catch (_) {}
  }
}

let settings = loadSettings();
sfx.enabled = settings.sound;
sfx.bgmEnabled = settings.bgm !== false;

let state = createNewGameState();
state.phase = 'title';

// DOM Elements
const elLocation = document.getElementById('location-label');
const elHpText = document.getElementById('hp-text');
const elHpBar = document.getElementById('hp-bar');
const elSpText = document.getElementById('sp-text');
const elSpBar = document.getElementById('sp-bar');
const elStatSpeech = document.getElementById('stat-speech');
const elStatGuts = document.getElementById('stat-guts');
const elStatLaw = document.getElementById('stat-law');
const elStatPoints = document.getElementById('stat-points');
const elMiniStatsBtn = document.getElementById('mini-stats-btn');
const elMiniSpDot = document.getElementById('mini-sp-dot');
const elHeroLvBadge = document.getElementById('hero-lv-badge');
const elEnemyLvBadge = document.getElementById('enemy-lv-badge');
const elInvCount = document.getElementById('inv-count');
const elTraitCount = document.getElementById('trait-count');
const elPhoneBadge = document.getElementById('phone-badge');

const elSceneTag = document.getElementById('scene-tag');
const elSceneTitle = document.getElementById('scene-title');
const elWeaknessPill = document.getElementById('weakness-pill');
const elEnemyHpWrap = document.getElementById('enemy-hp-wrap');
const elEnemyHpLabel = document.getElementById('enemy-hp-label');
const elEnemyHpText = document.getElementById('enemy-hp-text');
const elEnemyHpBar = document.getElementById('enemy-hp-bar');
const elFrame = document.getElementById('illustration-frame');
const elRomMgOverlay = document.getElementById('rom-mg-overlay');
const elRomMgPanel = document.getElementById('rom-mg-panel');
const elWildSpiritSprite = document.getElementById('wild-spirit-sprite');
const elCaptureStamp = document.getElementById('capture-stamp');
const elSceneImage = document.getElementById('scene-image');
const elWantedPoster = document.getElementById('wanted-poster');
const elWantedEmoji = document.getElementById('wanted-emoji');
const elWantedName = document.getElementById('wanted-name');
const elWantedCrime = document.getElementById('wanted-crime');
const elWantedStars = document.getElementById('wanted-stars');
const elSceneCard = document.getElementById('scene-card');
const elSceneCardBadge = document.getElementById('scene-card-badge');
const elSceneCardAscii = document.getElementById('scene-card-ascii');
const elSceneCardSub = document.getElementById('scene-card-sub');

const elFloatingLayer = document.getElementById('floating-layer');
const elQuoteBubble = document.getElementById('quote-bubble');
const elBattleLog = document.getElementById('battle-log');
const elChoicesPanel = document.getElementById('choices-panel');
const elBookPage = document.querySelector('.book-page');

// Modals & Buttons
const btnPhone = document.getElementById('btn-phone');
const btnSettings = document.getElementById('btn-settings');
const btnInventory = document.getElementById('btn-inventory');
const btnTraits = document.getElementById('btn-traits');
const elPhoneModal = document.getElementById('phone-modal');
const elPhoneBody = document.getElementById('phone-body');
const btnClosePhone = document.getElementById('close-phone');
const elInvModal = document.getElementById('inventory-modal');
const elInvList = document.getElementById('inventory-list');
const btnCloseInv = document.getElementById('close-inventory');
const elTraitsModal = document.getElementById('traits-modal');
const elTraitsList = document.getElementById('traits-list');
const btnCloseTraits = document.getElementById('close-traits');
const elSettingsModal = document.getElementById('settings-modal');
const btnCloseSettings = document.getElementById('close-settings');
const btnToggleSound = document.getElementById('toggle-sound');
const btnToggleBgm = document.getElementById('toggle-bgm');
const btnToggleVibrate = document.getElementById('toggle-vibrate');
const btnGoTitle = document.getElementById('btn-go-title');
const elActivityModal = document.getElementById('activity-modal');
const elActivityModalTitle = document.getElementById('activity-modal-title');
const elActivityList = document.getElementById('activity-list');
const btnCloseActivity = document.getElementById('close-activity');
const elEnemyIntentBar = document.getElementById('enemy-intent-bar');
const elLiveFeed = document.getElementById('live-feed');
const elLiveFeedBadge = document.getElementById('live-feed-badge');
const elLiveFeedLikes = document.getElementById('live-feed-likes');
const elLiveFeedTitle = document.getElementById('live-feed-title');
const elLiveFeedComment = document.getElementById('live-feed-comment');
const elHeroSprite = document.getElementById('hero-sprite');
const elSpiritSprite = document.getElementById('spirit-sprite');
const elYukiSprite = document.getElementById('yuki-sprite');
const elChloeSprite = document.getElementById('chloe-sprite');
const elKongiSprite = document.getElementById('kongi-sprite');
const elCoupleSprite = document.getElementById('couple-sprite');
const elDateFxLayer = document.getElementById('date-fx-layer');
const elActivityModalImg = document.getElementById('activity-modal-img');
const elSeoulMinimap = document.getElementById('seoul-minimap');
const elMinimapChaos = document.getElementById('minimap-chaos');
const elMinimapFollowers = document.getElementById('minimap-followers');
const elMinimapBosses = document.getElementById('minimap-bosses');
const elChibiWalker = document.getElementById('chibi-walker');
const elSaveModal = document.getElementById('save-modal');
const elSaveSlotsList = document.getElementById('save-slots-list');
const btnCloseSave = document.getElementById('close-save');
const btnOpenSlots = document.getElementById('btn-open-slots');
const elDdayPill = document.getElementById('dday-pill');
const elMorningModal = document.getElementById('morning-modal');
const elMorningTitle = document.getElementById('morning-title');
const elMorningSummaryBody = document.getElementById('morning-summary-body');
const btnMorningOk = document.getElementById('btn-morning-ok');
if (btnMorningOk) {
  btnMorningOk.addEventListener('click', () => {
    sfx.click();
    state.pendingMorningSummary = null;
    if (elMorningModal) elMorningModal.classList.add('hidden');
    saveGame();
  });
}
const elEndingsModal = document.getElementById('endings-modal');
const elEndingsModalTitle = document.getElementById('endings-modal-title');
const elEndingsList = document.getElementById('endings-list');
const btnCloseEndings = document.getElementById('close-endings');
const elTimingModal = document.getElementById('timing-modal');
const elTimingCursor = document.getElementById('timing-cursor');
const btnTimingTap = document.getElementById('btn-timing-tap');
const elAchModal = document.getElementById('achievements-modal');
const elAchModalTitle = document.getElementById('ach-modal-title');
const elAchList = document.getElementById('ach-list');
const btnCloseAch = document.getElementById('close-ach');
const elToastContainer = document.getElementById('toast-container');
const elCombatBadges = document.getElementById('combat-badges');

const MAP_COORDS = {
  patrol: { x: 17, y: 32 },
  work: { x: 50, y: 31 },
  train: { x: 83, y: 32 },
  heal: { x: 17, y: 63 },
  shop: { x: 50, y: 62 },
  luck: { x: 83, y: 63 },
};

let walkInterval = null;
let prevChibiLoc = 'heal';

function updateChibiImmediate(loc) {
  const pt = MAP_COORDS[loc] || MAP_COORDS.heal;
  if (!elChibiWalker) return;
  elChibiWalker.style.left = `${pt.x}%`;
  elChibiWalker.style.top = `${pt.y}%`;
}

function animateChibiTo(loc) {
  if (!elChibiWalker) return;
  const fromPt = MAP_COORDS[prevChibiLoc] || MAP_COORDS.heal;
  const toPt = MAP_COORDS[loc] || MAP_COORDS.heal;
  prevChibiLoc = loc;

  if (fromPt.x === toPt.x && fromPt.y === toPt.y) {
    elChibiWalker.src = 'assets/images/chibi_win.png';
    return;
  }

  elChibiWalker.classList.toggle('flip-left', toPt.x < fromPt.x);
  const frames = [
    'assets/images/chibi_walk_1.png',
    'assets/images/chibi_walk_2.png',
    'assets/images/chibi_walk_3.png',
    'assets/images/chibi_walk_2.png',
  ];
  let idx = 0;
  clearInterval(walkInterval);
  elChibiWalker.src = frames[0];
  requestAnimationFrame(() => {
    elChibiWalker.style.left = `${toPt.x}%`;
    elChibiWalker.style.top = `${toPt.y}%`;
  });
  walkInterval = setInterval(() => {
    idx = (idx + 1) % frames.length;
    elChibiWalker.src = frames[idx];
  }, 160);
  setTimeout(() => {
    clearInterval(walkInterval);
    elChibiWalker.classList.remove('flip-left');
    elChibiWalker.src = 'assets/images/chibi_win.png';
  }, 920);
}

let heroAnimTimer = null;
function playHeroAnim(pose) {
  if (!elHeroSprite) return;
  const map = {
    attack: { src: 'assets/images/hero_attack.png', cls: 'anim-attack' },
    guard: { src: 'assets/images/hero_guard.png', cls: 'anim-guard' },
    hit: { src: 'assets/images/hero_hit.png', cls: 'anim-hit' },
  };
  const cfg = map[pose];
  if (!cfg) return;
  clearTimeout(heroAnimTimer);
  elHeroSprite.src = cfg.src;
  elHeroSprite.classList.remove('anim-attack', 'anim-guard', 'anim-hit');
  void elHeroSprite.offsetWidth;
  elHeroSprite.classList.add(cfg.cls);
  heroAnimTimer = setTimeout(() => {
    elHeroSprite.src = 'assets/images/hero_idle.png';
    elHeroSprite.classList.remove('anim-attack', 'anim-guard', 'anim-hit');
  }, 460);
}

function checkChapterMission(mission) {
  if (!mission) return { done: true, progress: '바로 진행 가능!' };
  const t = mission.target;
  switch (mission.key) {
    case 'patrols': {
      const v = state.patrolCount || 0;
      return { done: v >= t, progress: `${v}/${t}회` };
    }
    case 'activities': {
      const v = state.activityCount || 0;
      return { done: v >= t, progress: `${v}/${t}회` };
    }
    case 'stat_law': {
      const v = state.stats.law;
      return { done: v >= t, progress: `법률 ${v}/${t}` };
    }
    case 'stat_speech': {
      const v = state.stats.speech;
      return { done: v >= t, progress: `언변 ${v}/${t}` };
    }
    case 'stat_guts': {
      const v = state.stats.guts;
      return { done: v >= t, progress: `배짱 ${v}/${t}` };
    }
    case 'reports': {
      const v = state.pendingReports || 0;
      return { done: v >= t, progress: `채증 ${v}/${t}건` };
    }
    case 'chaosMax': {
      const v = state.chaosLevel ?? 25;
      return { done: v <= t, progress: `현재 ${v}% (목표 ≤${t}%)` };
    }
    case 'followers': {
      const v = state.followers || 120;
      return { done: v >= t, progress: `${v.toLocaleString()}/${t.toLocaleString()}명` };
    }
    default:
      return { done: true, progress: '' };
  }
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function vibrate(pattern) {
  if (!settings.vibrate) return;
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try { navigator.vibrate(pattern); } catch (_) {}
  }
}

function showToast(msg, type = '') {
  if (!elToastContainer) return;
  while (elToastContainer.children.length >= 2) {
    elToastContainer.firstElementChild.remove();
  }
  const pill = document.createElement('div');
  pill.className = `toast-pill${type ? ` ${type}` : ''}`;
  pill.textContent = msg;
  elToastContainer.appendChild(pill);
  setTimeout(() => pill.remove(), 1500);
}

function pickNonRepeatingIdx(len, usedArr) {
  if (len <= 1) return 0;
  const avail = [];
  for (let i = 0; i < len; i += 1) {
    if (!usedArr.includes(i)) avail.push(i);
  }
  if (avail.length === 0) {
    usedArr.length = 0;
    for (let i = 0; i < len; i += 1) avail.push(i);
  }
  const picked = avail[Math.floor(Math.random() * avail.length)];
  usedArr.push(picked);
  return picked;
}

function handleNewDayRollover() {
  state.timeIndex = 0;
  state.day += 1;
  if (state.day % 7 === 0) state.pendingWeekend = true;
  const wPick = WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
  state.weather = wPick.id;
  const fPick = DAILY_FORTUNES[Math.floor(Math.random() * DAILY_FORTUNES.length)];
  state.dailyFortune = fPick.id;
  const ds = state.dailyStats || { wins: 0, loveGain: 0 };

  // V16.0: 자취방 인테리어 패시브 회복
  if (state.roomUpgrades?.includes('mattress')) {
    state.hp = clamp(state.hp + 15, 1, state.maxHp);
  }
  if (state.roomUpgrades?.includes('soundproof')) {
    state.sp = clamp(state.sp + 12, 0, state.maxSp);
  }

  // V26.0: 평화구역 정화 일일 시민 후원금
  const clearedDist = getClearedDistrictCount(state);
  const distBonus = clearedDist > 0 ? clearedDist * 25 : 0;
  if (distBonus > 0) {
    state.points += distBonus;
  }

  // V16.0: 서울 테마 주식 시세 변동
  if (!state.stockPrices) state.stockPrices = { cider_pharma: 30, manner_ent: 45, hanriver_ev: 60 };
  STOCKS.forEach((st) => {
    const cur = state.stockPrices[st.id] || st.basePrice;
    const delta = Math.round((Math.random() * 0.5 - 0.23) * cur);
    state.stockPrices[st.id] = clamp(cur + delta, st.min, st.max);
  });

  // V16.0: 게릴라 지명수배 빌런 만료/출현
  if (state.guerrilla && state.day > state.guerrilla.expiresDay) {
    state.guerrilla = null;
    state.chaosLevel = clamp((state.chaosLevel ?? 25) + 15, 0, 100);
    showToast('🚨 지명수배 빌런 방치로 서울 민폐도 +15% 폭등!', 'break');
  } else if (!state.guerrilla && state.day % 3 === 0) {
    const gPick = pickLevelAppropriateVillain(GUERRILLA_VILLAINS, state.level || 1);
    state.guerrilla = { villainId: gPick.id, expiresDay: state.day + 1 };
    showToast(`🚨 지명수배 출몰: ${gPick.name}!`, 'break');
  }

  // V26.1: 실시간 서울 112 긴급 속보 갱신
  if (!state.breakingNews && Math.random() < 0.55) {
    rollBreakingNews();
  }

  // V29.0: 평화구역 빌런 역습 디펜스
  if (clearedDist >= 1 && !state.invadedDistrict && Math.random() < 0.30) {
    const clearedList = SEOUL_DISTRICTS.filter((d) => (state.districts?.[d.id] || 0) >= 100);
    if (clearedList.length > 0) {
      const targetD = clearedList[Math.floor(Math.random() * clearedList.length)];
      const pool = (targetD.villains || []).filter((id) => VILLAINS.some((v) => v.id === id));
      const eId = pool.length ? pool[Math.floor(Math.random() * pool.length)] : 'shorts_terrorist';
      state.invadedDistrict = { id: targetD.id, name: targetD.name, enemyId: eId };
      showToast(`🚨 [구역 역습!!] 블랙튜브 잔당이 ${targetD.name}에 침입했습니다!`, 'break');
    }
  }

  // V16.0/V30.0: 연인 방치 페널티 (언어 Lv.15+ 시 유예 3일 & 하락 -3, Lv.10+ 시 -4, 기본 -6)
  if (state.lovers && state.lovers.length > 0) {
    if (!state.lastContactDay) state.lastContactDay = { yuki: state.day, chloe: state.day };
    [...state.lovers].forEach((lk) => {
      const langKey = lk === 'yuki' ? 'jp' : 'en';
      const langLv = state.lang?.[langKey] || 1;
      const graceDays = langLv >= 15 ? 3 : 2;
      const decayAmt = langLv >= 15 ? 3 : (langLv >= 10 ? 4 : 6);
      const gap = state.day - (state.lastContactDay[lk] || state.day);
      if (gap >= graceDays) {
        state.love[lk] = clamp((state.love[lk] || 0) - decayAmt, 0, 100);
        const nm = lk === 'yuki' ? '유키' : '클로이';
        if (!state.dateMessages) state.dateMessages = [];
        state.dateMessages.unshift({
          sender: lk === 'yuki' ? '🇯🇵 유키' : '🇺🇸 클로이',
          title: `DAY ${state.day} · 💔 서운함 경고`,
          body: `"요즘 ${gap}일째 너무 소홀한 거 아니에요...?${langLv >= 15 ? ' (언어 Lv.15+ 신뢰 보너스로 완화!)' : ''} (호감도 -${decayAmt} → ${state.love[lk]}/100)"`,
        });
        state.unreadMessages += 1;
        if (state.love[lk] < 50) {
          state.lovers = state.lovers.filter((x) => x !== lk);
          showToast(`💔 ${nm}와(과) 소홀해져 이별했습니다...`, 'break');
        } else {
          showToast(`💔 ${nm}에게 소홀해 호감도 -${decayAmt}!`, 'break');
        }
      }
    });
  }

  rollDailyQuests();

  // V28.0: D-120 골든타임 체크 (클리어 전 제한, 1회 150P 시민 청원 +30일 연장)
  const maxDay = GOLDEN_TIME_DAYS + (state.extendedGoldenTime ? 30 : 0);
  if (!state.storyCleared && !state.freePlayMode && state.day > maxDay) {
    if (!state.extendedGoldenTime && state.points >= 150) {
      state.extendedGoldenTime = true;
      state.points -= 150;
      showToast('📜 [긴급 시민 청원 발동!] 150P로 서울 골든타임 +30일 연장!!', 'break');
    } else {
      const timeEnd = evaluateEnding(state, true);
      state.achievedEndingId = timeEnd.id;
      unlockEnding(timeEnd.id);
      state.phase = 'victory';
      state.log = `⏳ [D-${maxDay} 골든타임 만료...]\n기한 내에 닥터 카오스의 본거지를 막지 못했습니다...\n\n${timeEnd.story}`;
      state.dailyStats = { wins: 0, loveGain: 0 };
      return;
    }
  }

  const finalMaxDay = GOLDEN_TIME_DAYS + (state.extendedGoldenTime ? 30 : 0);
  const eqSp = getSpiritBonuses().spirit;
  const cheerWho = eqSp ? getSpiritDisplayName(eqSp) : (state.lovers?.length ? '연인 & 콩이' : '김순경');
  const teasers = [
    '여의도·강남 일대에 고등급 수호정령 기운이 감지되고 있습니다!',
    '서울 시민 지지율이 오르고 있습니다. 오늘 특명을 완수해보세요!',
    '단골 진상 빌런들이 새로운 철벽 변명 전술을 준비 중입니다!',
    '정령과 동행해 전투하면 정령 레벨업과 협공이 발동됩니다!',
  ];
  state.sp = clamp(state.sp + 15, 0, state.maxSp);
  state.pendingMorningSummary = {
    day: state.day,
    weatherLabel: wPick.label,
    fortuneIcon: fPick.icon,
    fortuneShort: fPick.short,
    prevWins: ds.wins || 0,
    prevLoveGain: ds.loveGain || 0,
    distBonus,
    breakingText: state.breakingNews ? `${state.breakingNews.districtName} '${state.breakingNews.enemyName}'` : null,
    remainingDays: (state.storyCleared || state.freePlayMode) ? null : Math.max(0, finalMaxDay - state.day + 1),
    cheerMsg: `☀️ [${cheerWho}] "좋은 아침이야! 오늘도 같이 서울을 지키자!" (아침 사이다 +15)`,
    teaserMsg: teasers[state.day % teasers.length],
  };
  state.dailyStats = { wins: 0, loveGain: 0 };
}

function advanceTime() {
  state.timeIndex += 1;
  if (state.timeIndex >= TIME_SLOTS.length) {
    restoreSkillPp(2);
    handleNewDayRollover();
    const hTier = state.houseTier || 0;
    if (hTier >= 3) {
      state.hp = state.maxHp;
      state.sp = state.maxSp;
    } else if (hTier > 0) {
      state.hp = clamp(state.hp + hTier * 15, 1, state.maxHp);
      state.sp = clamp(state.sp + hTier * 12, 0, state.maxSp);
    }
    if ((state.lottoTickets || 0) > 0 && state.day % 7 === 0) {
      let winTotal = 0;
      for (let i = 0; i < state.lottoTickets; i++) {
        const r = Math.random();
        if (r < 0.08) winTotal += 500;
        else if (r < 0.35) winTotal += 60;
      }
      state.lottoTickets = 0;
      if (winTotal > 0) {
        state.points += winTotal;
        showToast(`🎟️ 주간 서울 로또 당첨!! +${winTotal}P 획득!`, 'break');
      } else {
        showToast('🎟️ 이번 주 서울 로또는 아쉽게 꽝이었습니다...', 'warn');
      }
    }
  }
  if (!state.pendingDm && isFeatureUnlocked(state, 'yuki') && Math.random() < 0.22) {
    const elig = ['yuki', 'chloe'].filter((h) => {
      if (h === 'chloe' && !isFeatureUnlocked(state, 'chloe')) return false;
      const dated = (state.lastDateDay?.[h] || 0) === state.day;
      const epDone = (state.lastRomanceEpDay?.[h] || 0) === state.day;
      return !dated && !epDone;
    });
    if (elig.length > 0) state.pendingDm = elig[Math.floor(Math.random() * elig.length)];
  }
  // V40.0: 보부상 시세 변동 & 자경단 지부 파견 수익
  if (typeof rollMarketRates === 'function') rollMarketRates();
  const dispKeys = Object.keys(state.dispatchedActs || {});
  if (dispKeys.length > 0) {
    const dispGain = dispKeys.length * 10;
    state.points += dispGain;
  }
  if (!state.pendingSos && Math.random() < 0.18) {
    const candidates = KOREA_ACTS.filter((a) => a.id !== (state.currentAct || 'seoul') && (state.clearedActs?.includes(a.id) || state.dispatchedActs?.[a.id]));
    if (candidates.length > 0) {
      const pickAct = candidates[Math.floor(Math.random() * candidates.length)];
      const mob = ACT_VILLAINS.find((v) => v.actId === pickAct.id) || VILLAINS[0];
      state.pendingSos = { actId: pickAct.id, enemyId: mob.id };
    }
  }
  state.chaosLevel = clamp((state.chaosLevel ?? 25) + 4, 0, 100);
  if (state.chaosLevel <= 30) {
    state.points += 5;
    state.sp = clamp(state.sp + 5, 0, state.maxSp);
  }
}

function getReputationInfo() {
  if (state.lawful >= state.chaotic + 20) {
    return {
      label: '😇 모범시민 영웅',
      perkText: '합법적 위엄! [법전 들이밀기] 주사위 +2 보정',
      mode: 'lawful',
    };
  }
  if (state.chaotic >= state.lawful + 20) {
    return {
      label: '😈 맑은 눈의 광인',
      perkText: '공포의 소문! 전투 시작 시 빌런 멘탈 -15% 감소',
      mode: 'chaotic',
    };
  }
  return {
    label: '😐 평범한 시민',
    perkText: '모범시민 또는 광인 성향을 20 이상 높이면 특수 효과 발동!',
    mode: 'neutral',
  };
}

function showFloatingText(text, type = 'hit') {
  const el = document.createElement('div');
  el.className = `floating-dmg ${type}`;
  el.textContent = text;
  elFloatingLayer.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

function triggerEnemyHit(dmg, isCrit = false) {
  elFrame.classList.remove('hit-flash');
  void elFrame.offsetWidth;
  elFrame.classList.add('hit-flash');
  if (isCrit && elBookPage) {
    elBookPage.classList.remove('hit-flash', 'shake');
    void elBookPage.offsetWidth;
    elBookPage.classList.add('hit-flash', 'shake');
  }
  showFloatingText(isCrit ? `💥 치명 -${dmg}!!` : `-${dmg}`, isCrit ? 'crit' : 'hit');
  sfx.hit(isCrit);
  vibrate(isCrit ? [45, 30, 85] : 35);
}

function triggerPlayerDamage(dmg) {
  elBookPage.classList.remove('shake');
  void elBookPage.offsetWidth;
  elBookPage.classList.add('shake');
  showFloatingText(`내 인내심 -${dmg}`, 'player');
  sfx.damage();
  vibrate([100, 40, 100]);
}

function uiImg(name, cls = 'ui-icon-btn') {
  return `<img src="assets/images/ui/${name}.png?v=87" class="${cls}" alt="" />`;
}

function getHeroRankInfo() {
  const w = state.winCount || 0;
  const b = (state.defeatedBossIds || []).length;
  if (w >= 25 && b >= 4) return { grade: 'S급', title: 'S급 서울의 빛', atkBonus: 8, next: '최고 등급 달성!' };
  if (w >= 15 || b >= 4) return { grade: 'A급', title: 'A급 전설의 해결사', atkBonus: 4, next: 'S급: 25승 & 보스 4명' };
  if (w >= 8 || b >= 2) return { grade: 'B급', title: 'B급 서울 파수꾼', atkBonus: 2, next: 'A급: 15승 또는 보스 4명' };
  if (w >= 3) return { grade: 'C급', title: 'C급 골목 보안관', atkBonus: 1, next: 'B급: 8승 또는 보스 2명' };
  return { grade: 'D급', title: 'D급 동네 훈수꾼', atkBonus: 0, next: 'C급: 3승 달성' };
}

function getWeatherObj() {
  return WEATHERS.find((w) => w.id === (state.weather || 'sunny')) || WEATHERS[0];
}

function triggerEquipCutin(itemId) {
  const src = ITEM_ICONS[itemId];
  if (!src || !elFrame) return;
  const img = document.createElement('img');
  img.src = src;
  img.className = 'equip-cutin';
  elFrame.appendChild(img);
  setTimeout(() => img.remove(), 680);
}

function triggerPartnerCallout(who, text, isUnite = false) {
  const targetEl = who === 'yuki' ? elYukiSprite : (who === 'chloe' ? elChloeSprite : elKongiSprite);
  const cls = isUnite ? 'anim-unite' : 'anim-assist';
  if (targetEl) {
    targetEl.classList.remove('anim-assist', 'anim-unite');
    void targetEl.offsetWidth;
    targetEl.classList.add(cls);
    setTimeout(() => targetEl.classList.remove(cls), 620);
  }
  if (!elFrame || !text) return;
  const bubble = document.createElement('div');
  bubble.className = 'partner-callout';
  bubble.textContent = text;
  elFrame.appendChild(bubble);
  setTimeout(() => bubble.remove(), 1050);
}

function getEnemyById(id) {
  if (id === HIDDEN_BOSS.id) return HIDDEN_BOSS;
  return STORY_BOSSES.find((s) => s.id === id)
    || ACT_VILLAINS.find((a) => a.id === id)
    || BOSSES.find((b) => b.id === id)
    || GUERRILLA_VILLAINS.find((g) => g.id === id)
    || VILLAINS.find((v) => v.id === id)
    || VILLAINS[0];
}

function isBossId(id) {
  return BOSSES.some((b) => b.id === id);
}

// ===== V27.0 시민영웅 Lv.50 성장 & 다종 보상 시스템 =====
function getExpToNextLevel(lv) {
  return Math.round(45 + lv * 22 + Math.pow(lv, 1.35) * 4);
}

function getHeroRankTitle(lv) {
  if (lv >= 50) return '👑 서울 절대수호신 (MAX)';
  if (lv >= 40) return '🔥 전설의 시민영웅';
  if (lv >= 30) return '⚡ 도심 예절 집행관';
  if (lv >= 20) return '🚓 서울 명예경감';
  if (lv >= 10) return '🛡️ 골목 수호자';
  return '🌱 동네 자경단';
}

function getZoneDifficultyInfo(minLv, maxLv, heroLv = 1) {
  if (heroLv < minLv - 5) return { cls: 'extreme', label: '💀 매우 어려움' };
  if (heroLv < minLv) return { cls: 'hard', label: '🔥 어려움' };
  if (heroLv <= maxLv) return { cls: 'normal', label: '⚔️ 적정' };
  return { cls: 'easy', label: '🌿 쉬움' };
}

function renderCombatLevelOverlays(show) {
  if (elHeroLvBadge) {
    elHeroLvBadge.classList.toggle('hidden', !show);
    if (show) elHeroLvBadge.textContent = `🛡️ 나 Lv.${state.level || 1}`;
  }
  if (elEnemyLvBadge) {
    elEnemyLvBadge.classList.toggle('hidden', !show);
    if (show) {
      const hLv = state.level || 1;
      const eLv = state.currentEnemyLv || 1;
      elEnemyLvBadge.textContent = `💢 적 Lv.${eLv}`;
      elEnemyLvBadge.classList.remove('is-danger', 'is-even', 'is-easy');
      if (eLv >= hLv + 3) elEnemyLvBadge.classList.add('is-danger');
      else if (eLv <= hLv - 3) elEnemyLvBadge.classList.add('is-easy');
      else elEnemyLvBadge.classList.add('is-even');
    }
  }
}

function gainHeroExp(amount) {
  if ((state.level || 1) >= 50) return 0;
  state.level = state.level || 1;
  state.exp = (state.exp || 0) + amount;
  let ups = 0;
  while (state.level < 50) {
    const need = getExpToNextLevel(state.level);
    if (state.exp < need) break;
    state.exp -= need;
    state.level += 1;
    ups += 1;
    state.skillPoints = (state.skillPoints || 0) + 2;
    state.maxHp += 12;
    state.hp = Math.min(state.maxHp, state.hp + 25);
    state.maxSp += 1;
    state.bonusDmg += 1;
    if (state.level % 5 === 0) {
      state.stats.speech += 1;
      state.stats.guts += 1;
      state.stats.law += 1;
    }
  }
  if (state.level >= 50) state.exp = 0;
  if (ups > 0) {
    ensureSkillsState();
    const newSkills = getUnlockedSkillsForLevel(state.level).filter((s) => !state.unlockedSkills.includes(s.id));
    newSkills.forEach((s) => state.unlockedSkills.push(s.id));
    state.pendingLevelUp = { newLv: state.level, newSkills: newSkills.map((s) => s.id) };
    sfx.powerup();
    showToast(`🎉 LEVEL UP! Lv.${state.level} [${getHeroRankTitle(state.level)}]${newSkills.length ? ` · ⚡새 기술 ${newSkills.length}종 습득!` : ''}`, 'good');
  }
  return ups;
}

const ENEMY_MODIFIERS = [
  { id: 'enraged', label: '🔥 열받은', hpMult: 1.15, atkMult: 1.25, rewardMult: 1.45, expMult: 1.3 },
  { id: 'iron', label: '🛡️ 철벽', hpMult: 1.42, atkMult: 0.95, rewardMult: 1.35, expMult: 1.25 },
  { id: 'golden', label: '💎 황금빛', hpMult: 1.12, atkMult: 0.90, rewardMult: 2.0, expMult: 1.6 },
  { id: 'swift', label: '⚡ 민첩한', hpMult: 1.08, atkMult: 1.18, rewardMult: 1.3, expMult: 1.25 },
];

function ensureSkillsState() {
  if (!state.equippedSkills) state.equippedSkills = { speech: 'sk_speech_1', guts: 'sk_guts_1', law: 'sk_law_1', snap: 'sk_snap_1' };
  const unlocked = getUnlockedSkillsForLevel(state.level || 1).map((s) => s.id);
  state.unlockedSkills = Array.from(new Set([...(state.unlockedSkills || []), ...unlocked]));
}

function getEquippedSkill(slot) {
  ensureSkillsState();
  const id = state.equippedSkills?.[slot] || `sk_${slot}_1`;
  return getSkillById(id) || getSkillById(`sk_${slot}_1`);
}

function getMaxSkillPp(type) {
  const eqSk = ['speech', 'guts', 'law', 'snap'].includes(type) ? getEquippedSkill(type) : null;
  if (eqSk) {
    const s = state.stats || { speech: 2, guts: 2, law: 2 };
    const statVal = type === 'speech' ? s.speech : (type === 'guts' ? s.guts : s.law);
    return (eqSk.maxPp || 10) + ((statVal || 0) >= 50 ? 4 : (statVal || 0) >= 25 ? 2 : 0);
  }
  const s = state.stats || { speech: 2, guts: 2, law: 2 };
  if (type === 'speech') return 12 + ((s.speech || 0) >= 50 ? 6 : (s.speech || 0) >= 25 ? 3 : 0);
  if (type === 'guts') return 10 + ((s.guts || 0) >= 50 ? 6 : (s.guts || 0) >= 25 ? 3 : 0);
  if (type === 'law') return 8 + ((s.law || 0) >= 50 ? 4 : (s.law || 0) >= 25 ? 2 : 0);
  if (type === 'snap') return 6 + ((s.law || 0) >= 50 ? 4 : (s.law || 0) >= 25 ? 2 : 0);
  return 10;
}

function ensureSkillPp() {
  if (!state.skillPp) {
    state.skillPp = {
      speech: getMaxSkillPp('speech'),
      guts: getMaxSkillPp('guts'),
      law: getMaxSkillPp('law'),
      snap: getMaxSkillPp('snap'),
    };
  }
  return state.skillPp;
}

function restoreSkillPp(amt = 'full') {
  const pp = ensureSkillPp();
  ['speech', 'guts', 'law', 'snap'].forEach((k) => {
    const mx = getMaxSkillPp(k);
    pp[k] = amt === 'full' ? mx : Math.min(mx, (pp[k] ?? mx) + amt);
  });
}

function rollDailyQuests() {
  state.dailyQuests = {
    day: state.day,
    claimed: false,
    items: [
      { id: 'win', label: '🥊 빌런 참교육', cur: 0, goal: 2 },
      { id: 'spirit_win', label: '👻 정령 동행 승리', cur: 0, goal: 2 },
      { id: 'care', label: '💖 어학·연애·휴식 케어', cur: 0, goal: 1 },
    ],
  };
}

function advanceDailyQuest(qId, amt = 1) {
  if (!state.dailyQuests || state.dailyQuests.day !== state.day) rollDailyQuests();
  const dq = state.dailyQuests;
  const item = dq.items.find((x) => x.id === qId);
  if (!item || item.cur >= item.goal) return;
  item.cur = Math.min(item.goal, item.cur + amt);
  if (dq.claimed === false && dq.items.every((x) => x.cur >= x.goal)) {
    dq.claimed = true;
    state.points += 250;
    state.scrap = (state.scrap || 0) + 3;
    if (!state.inventory) state.inventory = [];
    state.inventory.push('cheongsimhwan');
    showToast('🎯 [오늘의 특명 올클리어!!] +250P · 강화석 +3 · 청심환 +1!', 'break');
  }
}

function addFever(amount) {
  if ((state.feverTurns || 0) > 0) return false;
  const prev = state.feverGauge || 0;
  const boostMult = getSpiritBonuses().perkId === 'fever_boost' ? 1.5 : 1;
  state.feverGauge = Math.min(100, prev + Math.round(amount * boostMult));
  if (prev < 100 && state.feverGauge >= 100) {
    showToast('⚡ 피버 100% 충전! [노란 완장 풀개방!!] 버튼을 눌러 각성하세요!', 'break');
    return true;
  }
  return false;
}

function buildDraftOptions(enemy) {
  const ownedMap = {};
  (state.traits || []).forEach((t) => {
    ownedMap[t.id] = Math.max(1, t.level || 1);
  });
  const pool = [];

  // 1) 신규 특성 또는 기존 특성 레벨업 (최대 Lv.5)
  TRAITS.forEach((t) => {
    if (t.id === 'first_aid') return;
    const curLv = ownedMap[t.id] || 0;
    if (curLv === 0) {
      pool.push({
        kind: 'trait_new',
        id: t.id,
        name: t.name,
        desc: `✨ [신규 특성] ${t.desc}`,
      });
    } else if (curLv < 5) {
      pool.push({
        kind: 'trait_up',
        id: t.id,
        nextLevel: curLv + 1,
        name: `⬆️ ${t.name} Lv.${curLv + 1}`,
        desc: `[특성 강화] 기존 효과 중첩 강화! (${t.desc})`,
      });
    }
  });

  // 2) 다종 실전 보상 카드 (특성을 다 모아도 다양한 보상 지속 등장!)
  const extraCards = [
    {
      kind: 'gear_polish',
      id: 'gear_polish',
      name: '🛠️ 장비 & 완장 연마석',
      desc: '[영구 강화] 모든 공격 피해 +4, 최대 인내심 +10 & 즉시 +15 회복',
    },
    {
      kind: 'stat_train',
      id: 'stat_train_speech',
      statKey: 'speech',
      name: '🎙️ 실전 설전 복기',
      desc: '[능력치 성장] 언변 +2, 경험치 +35 EXP',
    },
    {
      kind: 'stat_train',
      id: 'stat_train_guts',
      statKey: 'guts',
      name: '🦁 강심장 실전 담력',
      desc: '[능력치 성장] 깡다구 +2, 경험치 +35 EXP',
    },
    {
      kind: 'stat_train',
      id: 'stat_train_law',
      statKey: 'law',
      name: '⚖️ 판례 요약 노트',
      desc: '[능력치 성장] 법지식 +2, 경험치 +35 EXP',
    },
    {
      kind: 'loot_box',
      id: 'loot_box',
      name: '📦 미확인 전리품 보급상자',
      desc: '[보급품] 파밍 장비 1개(또는 희귀 소비템 2개) + 30 P 획득!',
    },
    {
      kind: 'first_aid_pack',
      id: 'first_aid_pack',
      name: '💊 긴급 구호 & 탄산 세트',
      desc: '[회복 보급] 인내심 35% 회복 + 우황청심환 1개 + 칠성사이다 1개!',
    },
    {
      kind: 'bounty_bonus',
      id: 'bounty_bonus',
      name: '💰 특별 현상금 & 112 채증',
      desc: `[보너스] 도덕P +${65 + Math.round((enemy?.reward || 30) * 0.5)} P · 채증 +1 · +25 EXP`,
      bonusPoints: 65 + Math.round((enemy?.reward || 30) * 0.5),
    },
  ];

  const traitChoices = shuffle(pool).slice(0, 2);
  const rewardChoices = shuffle(extraCards).slice(0, 3 - traitChoices.length);
  return shuffle([...traitChoices, ...rewardChoices]);
}

function applyDraftReward(opt) {
  if (!opt) return '보상을 획득했습니다!';
  if (opt.kind === 'trait_new' || opt.kind === 'trait_up') {
    const t = TRAITS.find((x) => x.id === opt.id);
    if (t) t.apply(state);
    const existing = (state.traits || []).find((x) => x.id === opt.id);
    if (existing) {
      existing.level = Math.min(5, (existing.level || 1) + 1);
      return `[${t?.name || opt.name}] Lv.${existing.level}로 강화!`;
    } else if (t) {
      state.traits.push({ id: t.id, name: t.name, desc: t.desc, level: 1 });
      return `[${t.name}] 특성 습득!`;
    }
  }
  if (opt.kind === 'gear_polish') {
    state.bonusDmg = (state.bonusDmg || 0) + 4;
    state.maxHp += 10;
    state.hp = clamp(state.hp + 15, 0, state.maxHp);
    return '🛠️ 장비 & 완장을 연마해 모든 공격 +4, 최대 인내심 +10 상승!';
  }
  if (opt.kind === 'stat_train') {
    const k = opt.statKey || 'speech';
    state.stats[k] = (state.stats[k] || 2) + 2;
    gainHeroExp(35);
    const labelMap = { speech: '언변', guts: '깡다구', law: '법지식' };
    return `📚 실전 복기로 [${labelMap[k] || k}] +2 & +35 EXP 성장!`;
  }
  if (opt.kind === 'loot_box') {
    state.points += 30;
    const prevLen = (state.gearBag || []).length;
    if (typeof rollGearDrop === 'function') rollGearDrop(true);
    if ((state.gearBag || []).length <= prevLen) {
      state.inventory.push('cheongsimhwan', 'cold_soda');
      return '📦 보급상자에서 [우황청심환] + [칠성사이다] + 30 P를 획득했습니다!';
    }
    return '📦 보급상자에서 파밍 장비 & 30 P를 획득했습니다!';
  }
  if (opt.kind === 'first_aid_pack') {
    const heal = Math.max(25, Math.round(state.maxHp * 0.35));
    state.hp = clamp(state.hp + heal, 0, state.maxHp);
    state.inventory.push('cheongsimhwan', 'cold_soda');
    return `💊 인내심 +${heal} 회복 & 우황청심환·칠성사이다 보급 완료!`;
  }
  if (opt.kind === 'bounty_bonus') {
    const pts = opt.bonusPoints || 75;
    state.points += pts;
    state.pendingReports = (state.pendingReports || 0) + 1;
    gainHeroExp(25);
    return `💰 특별 현상금 +${pts} P · 채증 +1 · +25 EXP 획득!`;
  }
  // 구버전 세이브 호환 fallback
  const fallback = TRAITS.find((x) => x.id === opt.id);
  if (fallback) {
    fallback.apply(state);
    if (fallback.id !== 'first_aid') state.traits.push({ id: fallback.id, name: fallback.name, desc: fallback.desc, level: 1 });
    return `[${fallback.name}] 특성 습득!`;
  }
  return '보상을 획득했습니다!';
}

function showSceneCard(badge, ascii, sub = '') {
  elSceneImage.classList.add('hidden');
  elSceneImage.classList.remove('enemy-sprite', 'boss-scale');
  elWantedPoster.classList.add('hidden');
  elSceneCard.classList.remove('hidden');
  elSceneCardBadge.textContent = badge;
  elSceneCardAscii.textContent = ascii;
  elSceneCardSub.textContent = sub;
}

const VILLAIN_PERSONALITIES = {
  aggro: { id: 'aggro', label: '🗣️ 어그로·허세형', hint: '팩트⬆️ · 거울⬇️', up: ['speech'], down: ['guts'] },
  reckless: { id: 'reckless', label: '🦁 배째라·무대포형', hint: '법전⬆️ · 팩트⬇️', up: ['law'], down: ['speech'] },
  slippery: { id: 'slippery', label: '⚖️ 얌체·법꾸라지형', hint: '거울⬆️ · 법전⬇️', up: ['guts'], down: ['law'] },
  covert: { id: 'covert', label: '🕶️ 은폐·조작형', hint: '채증⬆️ · 법전⬇️', up: ['snap'], down: ['law'] },
  tyrant: { id: 'tyrant', label: '👑 권력·갑질형', hint: '필살·합동⬆️ · 기본⬇️', up: ['special', 'tag'], down: ['speech', 'guts', 'law'] },
};

function getEnemyPersonality(enemy) {
  if (!enemy) return VILLAIN_PERSONALITIES.aggro;
  const id = String(enemy.id || '').toLowerCase();
  if (enemy.personality && VILLAIN_PERSONALITIES[enemy.personality]) {
    return VILLAIN_PERSONALITIES[enemy.personality];
  }
  if (/dumper|trash|deepfake|spy|leak|hack|stalker|scam|fake|sb_22|sb_26|sb_28/.test(id)) {
    return VILLAIN_PERSONALITIES.covert;
  }
  if (/vip|boss|chaos|king|valet|golf|landlord|sb_20|sb_27|sb_30|hidden/.test(id)) {
    return VILLAIN_PERSONALITIES.tyrant;
  }
  if (enemy.weakness === 'law') return VILLAIN_PERSONALITIES.reckless;
  if (enemy.weakness === 'guts') return VILLAIN_PERSONALITIES.slippery;
  return VILLAIN_PERSONALITIES.aggro;
}

function getActionStatValue(actionType) {
  const s = state.stats || { speech: 2, guts: 2, law: 2 };
  if (actionType === 'speech') return s.speech || 2;
  if (actionType === 'guts') return s.guts || 2;
  if (actionType === 'law' || actionType === 'snap') return s.law || 2;
  return Math.round(((s.speech || 2) + (s.guts || 2) + (s.law || 2)) / 3);
}

function getMatchupInfo(enemy, actionType) {
  const p = getEnemyPersonality(enemy);
  const statVal = getActionStatValue(actionType);
  const upBonus = statVal >= 50 ? 0.30 : (statVal >= 25 ? 0.15 : 0);
  const downMit = statVal >= 50 ? 0.20 : (statVal >= 25 ? 0.10 : 0);
  if (p.up.includes(actionType)) {
    const base = actionType === 'snap' ? 1.75 : (actionType === 'special' || actionType === 'tag' ? 1.45 : 1.60);
    const spOver = getSpiritBonuses().perkId === 'overdrive' ? 0.25 : 0;
    const mult = Number((base + upBonus + spOver).toFixed(2));
    return { mult, isUp: true, isDown: false, tag: `⬆️ 유리 ${mult}배!`, cls: 'weak' };
  }
  if (p.down.includes(actionType)) {
    const base = p.id === 'tyrant' ? 0.80 : 0.70;
    const mult = Number(Math.min(0.95, base + downMit).toFixed(2));
    return { mult, isUp: false, isDown: true, tag: `⬇️ 반감 ${mult}배`, cls: 'resist' };
  }
  return { mult: 1.0, isUp: false, isDown: false, tag: '', cls: '' };
}

function setStageBg(bgFile) {
  if (!elFrame) return;
  if (bgFile) {
    elFrame.style.backgroundImage = `linear-gradient(180deg, rgba(15,10,5,0.06) 0%, rgba(15,10,5,0.22) 100%), url('assets/images/${bgFile}?v=65')`;
    elFrame.classList.add('has-bg');
  } else {
    elFrame.style.backgroundImage = '';
    elFrame.classList.remove('has-bg');
  }
}

function showEnemyVisual(enemy) {
  elSceneCard.classList.add('hidden');
  if (enemy.image) {
    const isPngSprite = enemy.image.includes('.png');
    elSceneImage.src = enemy.image;
    elSceneImage.classList.remove('hidden');
    elSceneImage.classList.toggle('enemy-sprite', isPngSprite);
    elSceneImage.classList.toggle('boss-scale', isPngSprite && (enemy.id === HIDDEN_BOSS.id || !!enemy.storyBossScale));
    elWantedPoster.classList.add('hidden');
    if (isPngSprite) {
      const isBoss = isBossId(enemy.id) || !!enemy.storyOnly || enemy.id === HIDDEN_BOSS.id;
      if (enemy.id === HIDDEN_BOSS.id || (state.nightmareFloor || 0) > 0 || (isBoss && (state.chapterIndex || 0) >= 24)) {
        setStageBg('bg_boss_final.jpg');
      } else if ((state.towerFloor || 0) > 0) {
        setStageBg('bg_court.jpg');
      } else if (isBoss) {
        setStageBg('bg_boss_normal.jpg');
      } else {
        if (enemy.actId && ['jeonju', 'pyeongtaek', 'dongtan', 'incheon'].includes(enemy.actId) && elFrame) {
          elFrame.style.backgroundImage = `url('assets/images/ui/bg_${enemy.actId}.jpg?v=102')`;
          elFrame.style.backgroundSize = 'cover';
          elFrame.style.backgroundPosition = 'center';
        } else {
          const dId = enemy.district || getDistrictIdForEnemy(enemy.id) || 'mapo';
          setStageBg(`bg_${dId}.jpg`);
        }

      }
    } else {
      setStageBg(null);
    }
  } else {
    elSceneImage.classList.add('hidden');
    elSceneImage.classList.remove('enemy-sprite', 'boss-scale');
    elWantedPoster.classList.remove('hidden');
    elWantedEmoji.textContent = enemy.wanted?.emoji || '🚨';
    elWantedName.textContent = enemy.name;
    elWantedCrime.textContent = enemy.wanted?.crime || '공공질서 파괴';
    elWantedStars.textContent = `위험도: ${enemy.wanted?.stars || '★★★☆☆'}`;
  }
}

function grantClue(clueId) {
  if (!state.clues) state.clues = [];
  if (state.clues.includes(clueId)) return false;
  state.clues.push(clueId);
  const cObj = CLUES.find((c) => c.id === clueId);
  if (cObj) {
    showToast(`🕵️ 흑막 단서 확보 (${state.clues.length}/5): ${cObj.title}`, 'good');
  }
  if (state.clues.length === 2 && !state.seenInterludes?.includes('interlude_1')) {
    state.pendingInterlude = 'interlude_1';
  }
  if (state.clues.length === 4 && !state.clues.includes('clue_mastermind')) {
    state.clues.push('clue_mastermind');
    showToast('🕵️ 모든 단서 연결 완료! 흑막 [닥터 카오스] 정체 발각! (5/5)', 'break');
    if (!state.seenInterludes?.includes('interlude_2')) {
      state.pendingInterlude = 'interlude_2';
    }
  }
  return true;
}

function tryRecruitAlly() {
  if (!state.allies) state.allies = [];
  if (state.allies.length >= REFORMED_ALLIES.length) return;
  if ((state.winCount || 0) % 3 !== 0) return;
  const nextAlly = REFORMED_ALLIES.find((a) => !state.allies.includes(a.id));
  if (!nextAlly) return;
  state.allies.push(nextAlly.id);
  if (nextAlly.id === 'gym_bro') {
    state.maxHp += 15;
    state.hp = clamp(state.hp + 15, 1, state.maxHp);
  }
  showToast(`🤝 빌런 갱생 합류! ${nextAlly.name}`, 'good');
  state.log += `\n🤝 [개과천선 합류!] "${nextAlly.name}"이(가) 시민영웅단에 들어왔습니다! (${nextAlly.desc})`;
}

function getDiffObj() {
  return DIFFICULTIES[state.difficulty || 'normal'] || DIFFICULTIES.normal;
}

function getEquippedBonuses() {
  const eq = state.equipped || {};
  const res = { atk: 0, def: 0, crit: 0, spRegen: 0, reflect: 0, lifesteal: 0, rewardMult: 0, expMult: 0 };
  ['weapon', 'armor', 'acc'].forEach((sl) => {
    const id = eq[sl];
    if (!id) return;
    const g = GEAR_LOOT_POOL.find((x) => x.id === id);
    if (!g) return;
    res.atk += (g.atk || 0) + (state.gearPlus?.[id] || 0) * 3;
    res.def += (g.def || 0) + (state.gearPlus?.[id] || 0) * 2;
    res.crit += g.crit || 0;
    res.spRegen += g.spRegen || 0;
    res.reflect += g.reflect || 0;
    const encId = state.gearEnchants?.[id];
    const enc = encId ? GEAR_ENCHANTS.find((e) => e.id === encId) : null;
    if (enc) {
      res.atk += enc.atk || 0;
      res.def += enc.def || 0;
      res.crit += enc.crit || 0;
      res.spRegen += enc.spRegen || 0;
      res.lifesteal += enc.lifesteal || 0;
      res.rewardMult += enc.rewardMult || 0;
      res.expMult += enc.expMult || 0;
    }
  });
  const d = state.districts || {};
  if ((d.gangnam || 0) >= 100) res.atk += 4;
  if ((d.seongsu || 0) >= 100) res.crit += 0.06;
  if ((d.jongno || 0) >= 100) res.def += 3;
  if ((d.mapo || 0) >= 100) res.spRegen += 3;
  // V40.0: 장비 정령석(룬) 소켓 보너스
  Object.values(state.socketedRunes || {}).forEach((rId) => {
    const r = rId ? RUNE_STONES.find((x) => x.id === rId) : null;
    if (r) {
      res.atk += r.atk || 0;
      res.def += r.def || 0;
      res.crit += r.crit || 0;
      res.spRegen += r.spRegen || 0;
    }
  });
  const setSyn = getGearSetSynergy();
  if (setSyn.spRegen) res.spRegen += setSyn.spRegen;
  if (setSyn.crit) res.crit += setSyn.crit;
  const spBon = getSpiritBonuses();
  res.atk += spBon.atk;
  res.spRegen += spBon.spRegen;
  res.crit += spBon.crit;
  if (state.costume === 'cyber') res.crit += 0.10;
  if (state.costume === 'golden_hero') res.atk += 10;
  return res;
}

function getSpiritDisplayName(sp) {
  if (!sp) return '';
  const nick = state.spiritNicknames?.[sp.id];
  return nick ? `${nick} (${sp.name})` : sp.name;
}

function getSpiritNextExp(lv) {
  return 50 + Math.max(0, lv - 1) * 35;
}

function getSpiritProgress(spiritId) {
  if (!state.spiritProgress) state.spiritProgress = {};
  const p = state.spiritProgress[spiritId] || { lv: 1, exp: 0 };
  const lv = Math.max(1, Math.min(20, p.lv || 1));
  return { lv, exp: p.exp || 0, maxExp: getSpiritNextExp(lv) };
}

function gainSpiritExp(spiritId, amount) {
  const sp = SPIRITS_50.find((x) => x.id === spiritId);
  if (!sp || !state.spirits?.[spiritId] || amount <= 0) return { leveledUp: false, lv: 1 };
  if (!state.spiritProgress) state.spiritProgress = {};
  if (!state.spiritProgress[spiritId]) state.spiritProgress[spiritId] = { lv: 1, exp: 0 };
  const prog = state.spiritProgress[spiritId];
  if (prog.lv >= 20) return { leveledUp: false, lv: 20 };
  prog.exp += amount;
  let leveledUp = false;
  while (prog.lv < 20 && prog.exp >= getSpiritNextExp(prog.lv)) {
    prog.exp -= getSpiritNextExp(prog.lv);
    prog.lv += 1;
    leveledUp = true;
  }
  if (prog.lv >= 20) prog.exp = 0;
  if (leveledUp) {
    state.log = (state.log ? state.log + '\n' : '') + `🌟 [정령 레벨업!] ${sp.name} Lv.${prog.lv} 달성! (능력치·특수기술 강화)`;
    showToast(`🌟 [${sp.name}] Lv.${prog.lv} 레벨업!`, 'good');
  }
  return { leveledUp, lv: prog.lv };
}

function getSpiritBonuses(spiritIdOverride = null) {
  const id = spiritIdOverride || state.equippedSpirit;
  if (!id) return { atk: 0, spRegen: 0, crit: 0, element: null, elemBoost: 0, perkId: null, spirit: null, lv: 0, growthLv: 0 };
  const sp = SPIRITS_50.find((x) => x.id === id);
  const lv = state.spirits?.[id] || 0;
  if (!sp || lv <= 0) return { atk: 0, spRegen: 0, crit: 0, element: null, elemBoost: 0, perkId: null, spirit: null, lv: 0, growthLv: 0 };
  const growthLv = getSpiritProgress(id).lv;
  const lvMult = (1 + (lv - 1) * 0.22) * (1 + (growthLv - 1) * 0.07);
  return {
    atk: Math.round(sp.atk * lvMult) + (growthLv - 1),
    spRegen: Math.round(sp.spRegen * lvMult),
    crit: Number((sp.crit * lvMult).toFixed(3)),
    element: sp.element,
    elemBoost: Number((sp.elemBoost * lvMult).toFixed(2)),
    perkId: sp.perkId || null,
    spirit: sp,
    lv,
    growthLv,
  };
}

function grantSpirit(spiritId, autoEquip = false) {
  const sp = SPIRITS_50.find((x) => x.id === spiritId);
  if (!sp) return null;
  if (!state.spirits) state.spirits = {};
  if (!state.spiritProgress) state.spiritProgress = {};
  const prevLv = state.spirits[spiritId] || 0;
  if (prevLv === 0) {
    state.spirits[spiritId] = 1;
    state.spiritProgress[spiritId] = { lv: 1, exp: 0 };
    if (autoEquip || !state.equippedSpirit) state.equippedSpirit = spiritId;
    const msg = `👻 [수호정령 영입!!] ${sp.name}\n💬 나: "${sp.greet}"`;
    state.log = (state.log ? state.log + '\n' : '') + msg;
    showToast(`👻 신규 정령 [${sp.name}] 영입!`, sp.rarity === 'unique' ? 'break' : 'good');
  } else if (prevLv < 5) {
    state.spirits[spiritId] = prevLv + 1;
    if (autoEquip) state.equippedSpirit = spiritId;
    gainSpiritExp(spiritId, 80);
    const msg = `✨ [정령 ★${prevLv + 1} 각성!] ${sp.name} (EXP+80) — "${sp.greet}"`;
    state.log = (state.log ? state.log + '\n' : '') + msg;
    showToast(`✨ [${sp.name}] ★${prevLv + 1} 각성 + EXP 80!`, 'good');
  } else {
    state.points += 60;
    gainSpiritExp(spiritId, 100);
    state.log = (state.log ? state.log + '\n' : '') + `✨ [${sp.name}] ★5 중복 환원 → +60 P · 정령 EXP+100!`;
  }
  return { spirit: sp, isNew: prevLv === 0, count: state.spirits[spiritId], growthLv: getSpiritProgress(spiritId).lv };
}

function rollSpiritEncounter(isBoss = false, enemyLv = 1) {
  if ((state.towerFloor || 0) > 0 || (state.nightmareFloor || 0) > 0) return null;
  const diffId = state.difficulty || 'normal';
  const diffChanceMap = { normal: isBoss ? 0.55 : 0.26, hard: isBoss ? 0.68 : 0.34, hell: isBoss ? 0.80 : 0.42 };
  const chance = diffChanceMap[diffId] ?? (isBoss ? 0.55 : 0.26);
  if (Math.random() > chance) return null;
  const lv = Math.max(1, Number(enemyLv) || 1);
  let weights;
  if (lv >= 41) weights = { unique: 0.08, epic: 0.47, rare: 0.35, common: 0.10 };
  else if (lv >= 31) weights = { unique: 0.04, epic: 0.36, rare: 0.45, common: 0.15 };
  else if (lv >= 21) weights = { unique: 0.01, epic: 0.17, rare: 0.52, common: 0.30 };
  else if (lv >= 11) weights = { unique: 0, epic: 0.03, rare: 0.42, common: 0.55 };
  else weights = { unique: 0, epic: 0, rare: 0.15, common: 0.85 };

  const diffRarityMult = diffId === 'hell' ? 1.75 : (diffId === 'hard' ? 1.35 : 1.0);
  weights.unique *= diffRarityMult;
  weights.epic *= diffRarityMult;
  if (isBoss) {
    weights.unique *= 2;
    weights.epic *= 1.5;
  }
  const total = weights.unique + weights.epic + weights.rare + weights.common;
  let r = Math.random() * total;
  let rar = 'common';
  if (r < weights.unique) rar = 'unique';
  else if (r < weights.unique + weights.epic) rar = 'epic';
  else if (r < weights.unique + weights.epic + weights.rare) rar = 'rare';

  const pool = SPIRITS_50.filter((x) => x.rarity === rar);
  const pick = pool[Math.floor(Math.random() * pool.length)] || SPIRITS_50[0];
  state.pendingSpiritEncounter = pick.id;
  return pick;
}

function getGearSetSynergy() {
  const eq = state.equipped || {};
  const items = ['weapon', 'armor', 'acc'].map((sl) => GEAR_LOOT_POOL.find((x) => x.id === eq[sl])).filter(Boolean);
  const epicPlus = items.filter((g) => g.rarity === 'epic' || g.rarity === 'unique').length;
  const uniqueCnt = items.filter((g) => g.rarity === 'unique').length;
  const hasReflectArmor = (GEAR_LOOT_POOL.find((x) => x.id === eq.armor)?.reflect || 0) > 0;
  const labels = [];
  let startFever = 0;
  let spRegen = 0;
  let atkPct = 0;
  let crit = 0;
  let reflectStun = false;
  if (epicPlus >= 3) {
    labels.push('🟣 정예 영웅(피버+25%·SP+5)');
    startFever += 25;
    spRegen += 5;
  }
  if (uniqueCnt >= 2) {
    labels.push('🟨 전설 수호자(피해+15%·치명+10%)');
    atkPct += 0.15;
    crit += 0.10;
  }
  if (hasReflectArmor && eq.acc) {
    labels.push('🪞 거울 반사(피격20% 기절)');
    reflectStun = true;
  }
  return { labels, startFever, spRegen, atkPct, crit, reflectStun };
}

function notifyNewUnlocks(prevChapter, nextChapter) {
  Object.values(UNLOCK_MILESTONES).forEach((m) => {
    if (prevChapter < m.chapter && nextChapter >= m.chapter) {
      showToast(`🔓 신규 기능 해금! [${m.label}]`, 'break');
    }
  });
}

function rollGearDrop(isBoss = false, enemyLv = state.currentEnemyLv || state.level || 1) {
  const diff = getDiffObj();
  const spDropBonus = getSpiritBonuses().perkId === 'drop_up' ? 0.25 : 0;
  const dropChance = isBoss ? 1.0 : Math.min(0.95, diff.dropChance + (enemyLv >= 25 ? 0.1 : 0) + spDropBonus);
  if (Math.random() > dropChance) return null;

  const lv = Math.max(1, Number(enemyLv) || 1);
  let uMult = 0;
  let eBase = 0.01;
  let rBase = 0.14;
  if (lv >= 41) {
    uMult = 12;
    eBase = 0.50;
    rBase = 0.30;
  } else if (lv >= 31) {
    uMult = 6;
    eBase = 0.40;
    rBase = 0.35;
  } else if (lv >= 21) {
    uMult = 3;
    eBase = 0.24;
    rBase = 0.42;
  } else if (lv >= 11) {
    uMult = 1;
    eBase = 0.08;
    rBase = 0.35;
  }

  const yeouidoBonus = (state.districts?.yeouido || 0) >= 100 ? 1.25 : 1;
  const nmBonus = (state.nightmareFloor || 0) > 0 ? (1 + state.nightmareFloor * 0.5) : 1;
  const uRate = diff.uniqueRate * uMult * (isBoss ? 5 : 1) * yeouidoBonus * nmBonus;
  const eRate = (isBoss ? Math.max(eBase, 0.30) : eBase) * (state.difficulty === 'hell' ? 1.25 : 1);
  const rRate = (isBoss ? Math.max(rBase, 0.65) : rBase) * yeouidoBonus;

  const roll = Math.random();
  let rarity = 'common';
  if (roll < uRate) rarity = 'unique';
  else if (roll < uRate + eRate) rarity = 'epic';
  else if (roll < uRate + eRate + rRate) rarity = 'rare';

  let pool = GEAR_LOOT_POOL.filter((g) => g.rarity === rarity && (g.minDropLv || 1) <= lv);
  if (pool.length === 0) pool = GEAR_LOOT_POOL.filter((g) => g.rarity === rarity);
  const picked = pool[Math.floor(Math.random() * pool.length)];
  if (!picked) return null;

  if (!state.gearBag) state.gearBag = [];
  if (!state.equipped) state.equipped = { weapon: null, armor: null, acc: null };
  const slotNames = { weapon: '무기', armor: '방어구', acc: '악세서리' };
  const prevId = state.equipped[picked.slot];
  const prevGear = prevId ? GEAR_LOOT_POOL.find((x) => x.id === prevId) : null;
  const newScore = getGearPowerScore(picked, state.gearPlus?.[picked.id] || 0);
  const prevScore = prevGear ? getGearPowerScore(prevGear, state.gearPlus?.[prevGear.id] || 0) : -1;

  state.gearBag.push(picked.id);
  let cmpHint = '';
  if (!prevGear) {
    state.equipped[picked.slot] = picked.id;
    cmpHint = '✨ 빈 슬롯 자동 장착!';
  } else if (newScore > prevScore) {
    cmpHint = `🔥 현재 ${slotNames[picked.slot]}보다 강함! (창고서 교체 추천)`;
  } else {
    cmpHint = `♻️ 기존 장비가 더 강함 (고철 분해 추천)`;
  }
  const rLabel = RARITY_INFO[rarity]?.label || rarity;
  const dropLine = `🎁 [${rLabel} · ${slotNames[picked.slot]}] ${picked.name} (${picked.desc}) — ${cmpHint}`;
  state.log = (state.log ? state.log + '\n' : '') + dropLine;
  showToast(
    rarity === 'unique'
      ? `🟨✨ [Lv.${lv} 유니크 ★4!!] ${picked.name} (${picked.desc})`
      : `🎁 [${rLabel}] ${picked.name} — ${cmpHint}`,
    rarity === 'unique' ? 'break' : 'good'
  );
  return picked;
}

function getGearPowerScore(g, plus = 0) {
  if (!g) return 0;
  return (g.atk || 0) + plus * 3 + ((g.def || 0) + plus * 2) * 0.9 + (g.crit || 0) * 80 + (g.reflect || 0) * 60 + (g.spRegen || 0) * 1.5;
}

function pickLevelAppropriateVillain(pool, heroLv = state.level || 1) {
  const lv = Math.max(1, Number(heroLv) || 1);
  const filtered = pool.filter((v) => {
    const dId = v.district || getDistrictIdForEnemy(v.id);
    const dInfo = SEOUL_DISTRICTS.find((d) => d.id === dId);
    return (dInfo?.minLv || 1) <= lv + 4;
  });
  const candidates = filtered.length > 0 ? filtered : pool.filter((v) => {
    const dId = v.district || getDistrictIdForEnemy(v.id);
    const dInfo = SEOUL_DISTRICTS.find((d) => d.id === dId);
    return (dInfo?.minLv || 1) <= 15;
  });
  const finalPool = candidates.length > 0 ? candidates : pool;
  return finalPool[Math.floor(Math.random() * finalPool.length)] || VILLAINS[0];
}

function startBattle(enemyId, isRandomEncounter = false) {
  const baseEnemy = getEnemyById(enemyId);
  if (!state.villainEncounters) state.villainEncounters = {};
  state.villainEncounters[baseEnemy.id] = (state.villainEncounters[baseEnemy.id] || 0) + 1;
  const floor = state.towerFloor || 0;
  const nmFloor = state.nightmareFloor || 0;
  const diff = getDiffObj();
  const ngMult = 1 + (state.ngPlus || 0) * 0.3;
  const isBossEnemy = isBossId(baseEnemy.id) || !!baseEnemy.storyOnly || !!baseEnemy.isActBoss || baseEnemy.id === HIDDEN_BOSS.id;
  const mod = (!isBossEnemy && Math.random() < 0.45)
    ? ENEMY_MODIFIERS[Math.floor(Math.random() * ENEMY_MODIFIERS.length)]
    : null;
  state.enemyModifier = mod ? mod.id : null;
  const heroLv = state.level || 1;
  const distId = baseEnemy.district || getDistrictIdForEnemy(baseEnemy.id);
  const distInfo = SEOUL_DISTRICTS.find((d) => d.id === distId);
  const minZoneLv = distInfo?.minLv || 1;
  const maxZoneLv = distInfo?.maxLv || 50;
  // 랜덤 인카운터는 주인공 현재 레벨(-1 ~ +2)에 맞춤, 구역 지정 출동은 해당 구역 티어 유지
  const enemyLv = baseEnemy.fixedLv ? baseEnemy.fixedLv : (isBossEnemy
    ? Math.max(heroLv, Math.min(50, Math.round((state.chapterIndex || 0) * 1.65) + 2))
    : (isRandomEncounter
      ? Math.max(1, Math.min(50, heroLv + Math.floor(Math.random() * 3) - 1))
      : Math.max(minZoneLv, Math.min(maxZoneLv + Math.floor(Math.max(0, heroLv - maxZoneLv) * 0.55), heroLv + Math.max(0, minZoneLv - heroLv)))));

  const lvScale = 1 + Math.max(0, enemyLv - 1) * 0.115;
  const atkScale = 1 + Math.max(0, enemyLv - 1) * 0.085;
  const bossHpBoost = isBossEnemy ? 1.9 : 1.55;
  const bossAtkBoost = isBossEnemy ? 1.25 : 1.15;
  const modHpMult = mod ? mod.hpMult : 1;
  const modAtkMult = mod ? mod.atkMult : 1;
  const modRewardMult = mod ? mod.rewardMult : 1;

  // V32.7 주인공 실제 화력(각성/초월 + 정령 + 장비) 100% 연동 동적 스케일링
  const avgStat = ((state.stats?.speech || 2) + (state.stats?.guts || 2) + (state.stats?.law || 2)) / 3;
  if (!state.v34HpBoosted) {
    state.v34HpBoosted = true;
    state.maxHp = Math.max(140, Math.round((state.maxHp || 100) * 1.35));
    state.hp = Math.min(state.maxHp, Math.round((state.hp || 100) * 1.35));
  }
  const evoScale = avgStat >= 50 ? 1.75 : (avgStat >= 25 ? 1.38 : 1.0);
  const eqAtk = getEquippedBonuses().atk || 0;
  const spAtkEst = getSpiritBonuses().atk || 0;
  const estHeroHit = Math.round((24 + avgStat * 4.8 + (state.bonusDmg || 0) + eqAtk + spAtkEst) * 1.38 * evoScale);
  const targetTurns = isBossEnemy ? 11.5 : (enemyLv >= 7 ? 7.2 : 5.0);
  const coScaledHp = Math.round(estHeroHit * targetTurns * (enemyLv > heroLv ? 1 + (enemyLv - heroLv) * 0.04 : 1) * modHpMult);

  const rawFormulaHp = Math.round((Number(baseEnemy.maxHp || baseEnemy.hp) || 100) * lvScale * bossHpBoost * modHpMult);
  const baseScaledHp = Math.max(rawFormulaHp, coScaledHp);
  const minThreatAtk = Math.round((state.maxHp || 140) * (isBossEnemy ? 0.13 : (enemyLv >= 7 ? 0.11 : 0.09)));
  const baseScaledAtk = Math.max(Math.round((Number(baseEnemy.atk) || 14) * atkScale * bossAtkBoost * modAtkMult), minThreatAtk);
  const rawMaxHp = nmFloor > 0
    ? baseScaledHp + nmFloor * 52
    : (floor > 0 ? baseScaledHp + floor * 28 : baseScaledHp);
  const rawAtk = nmFloor > 0
    ? baseScaledAtk + nmFloor * 4
    : (floor > 0 ? baseScaledAtk + floor * 2 : baseScaledAtk);
  const spiritHpBal = enemyLv >= 21 ? 1.28 : (enemyLv >= 9 ? 1.15 : 1.0);
  const spiritAtkBal = enemyLv >= 21 ? 1.15 : (enemyLv >= 9 ? 1.10 : 1.0);
  const enemy = {
    ...baseEnemy,
    name: `[Lv.${enemyLv}] ${mod ? `[${mod.label}] ` : ''}${floor > 0 ? `[타워 ${floor}층] ` : ''}${baseEnemy.name}`,
    maxHp: Math.round(rawMaxHp * diff.hpMult * ngMult * spiritHpBal),
    atk: Math.round(rawAtk * diff.atkMult * ngMult * spiritAtkBal),
    reward: Math.round((floor > 0 ? 25 + floor * 10 : baseEnemy.reward + Math.min(30, enemyLv)) * diff.rewardMult * modRewardMult),
  };
  const rep = getReputationInfo();
  let startHp = enemy.maxHp;
  let extraLog = '';

  if (rep.mode === 'chaotic') {
    const scareDmg = Math.round(enemy.maxHp * 0.15);
    startHp = Math.max(10, enemy.maxHp - scareDmg);
    extraLog = `\n😈 [맑은 눈의 광인] 소문에 빌런이 쫄아서 멘탈 -${scareDmg} 상태로 시작!`;
  }
  if (state.costume === 'dark') {
    const darkDmg = Math.round(enemy.maxHp * 0.20);
    startHp = Math.max(10, startHp - darkDmg);
    extraLog += `\n🕶️ [다크 히어로 코트] 선제 기습으로 멘탈 -${darkDmg} 추가 감소!`;
  }

  state.phase = 'combat';
  state.currentEnemyId = enemy.id;
  state.currentEnemyLv = enemyLv;
  state.currentEnemyAtk = enemy.atk;
  state.enemyHp = startHp;
  if (state.activeActStory?.preDamagePct) {
    state.enemyHp = Math.max(1, Math.round(state.enemyHp * (1 - state.activeActStory.preDamagePct)));
  }
  state.activeActStory = null;
  state.diplomacyUsed = false;
  if (getSpiritBonuses().growthLv >= 10) {
    state.sp = clamp((state.sp || 0) + 15, 0, state.maxSp);
    extraLog += '\n👻 [정령 Lv.10+ 각성] 전투 시작 사이다 +15 충전!';
  }
  state.enemyMaxHp = enemy.maxHp;
  state.enemyStunned = false;
  state.enemyExcuseShield = false;
  state.enemyGuardShield = 3;
  state.combatChain = 0;
  state.nextGuaranteedCrit = false;
  state.snapExposed = false;
  state.enemyIntent = 'normal';
  state.weakCombo = 0;
  state.skillChain = [];
  state.enemyBroken = false;
  state.citizenAssistUsed = false;
  state.feverTurns = 0;
  state.bossGimmick = isBossEnemy ? (Math.random() < 0.5 ? 'shield' : 'countdown') : null;
  state.bossShield = state.bossGimmick === 'shield' ? 3 : 0;
  state.bossCountdown = state.bossGimmick === 'countdown' ? 3 : 0;
  const setSynStart = getGearSetSynergy();
  if (setSynStart.startFever > 0) addFever(setSynStart.startFever);
  if (getSpiritBonuses().perkId === 'start_fever') {
    addFever(30);
    extraLog += `\n🔥 [${getSpiritBonuses().spirit.name}] 선제 기세로 피버 +30% 충전!`;
  }
  if (state.bossGimmick === 'shield') extraLog += `\n🛡️ [보스 기믹] 철벽 변명 실드 3겹 전개! (약점·법전·채증으로 파괴!)`;
  if (state.bossGimmick === 'countdown') extraLog += `\n⏰ [보스 기믹] 3턴 광폭 카운트다운 시작! (기절로 초기화!)`;
  if ((state.startSpBonus || 0) > 0) {
    state.sp = clamp(state.sp + state.startSpBonus, 0, state.maxSp);
  }
  if (state.dailyFortune === 'cider') {
    state.sp = clamp(state.sp + 20, 0, state.maxSp);
    extraLog += `\n⚡ [오늘의 운세: 사이다 폭발의 날] 시작 사이다 +20!`;
  } else if (state.dailyFortune === 'shield') {
    state.hp = clamp(state.hp + 15, 1, state.maxHp);
    extraLog += `\n🛡️ [오늘의 운세: 수호의 날] 인내심 +15 회복!`;
  }
  state.usedLogicCounter = false;
  state.enemyApologyTurns = 0;
  state.isFirstTurn = true;
  state.bossPhase2 = false;
  state.usedEquipThisBattle = [];
  state.tagSkillUsedThisBattle = false;
  state.streamMission = STREAM_MISSIONS[Math.floor(Math.random() * STREAM_MISSIONS.length)];
  state.goldenMission = Math.random() < 0.22;
  state.quote = enemy.introQuote || enemy.banterQuotes?.[0] || '"뭐야 넌?!"';
  state.log = `[${enemy.location}]에서 [${enemy.name}]과(와) 마주쳤습니다!${extraLog}`;
  saveGame();
  render();
}

function rollNextIntent() {
  const r = Math.random();
  const dangerChance = state.bossPhase2 ? 0.55 : 0.35;
  if (r < dangerChance * 0.6) state.enemyIntent = 'heavy';
  else if (r < dangerChance) state.enemyIntent = 'rage';
  else state.enemyIntent = 'normal';
}

function triggerMiniEvent(evId) {
  const ev = evId
    ? MINI_EVENTS.find((e) => e.id === evId)
    : MINI_EVENTS[Math.floor(Math.random() * MINI_EVENTS.length)];
  state.phase = 'mini_event';
  state.currentMiniEventId = ev.id;
  state.log = ev.text;
  saveGame();
  render();
}

function triggerRandomEvent() {
  const ev = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
  state.phase = 'random_event';
  state.currentEventId = ev.id;
  state.log = ev.text;
  saveGame();
  render();
}

function enemyCounterTurn(enemy, isGuarding = false) {
  if (state.enemyHp <= 0) {
    handleEnemyDefeated(enemy);
    return;
  }

  // 보스/강적 50% 이하 2페이즈 각성 + 가드 실드 재정비
  if (!state.bossPhase2 && state.enemyHp <= Math.round(state.enemyMaxHp * 0.5)) {
    state.bossPhase2 = true;
    state.enemyIntent = 'heavy';
    state.enemyGuardShield = 3;
    state.log += `\n🔥 [${enemy.name}] 2페이즈 각성!! 가드 3칸 재정비 + 다음 턴 강공격을 준비합니다!`;
  }

  if (state.enemyStunned) {
    state.enemyStunned = false;
    if (state.bossGimmick === 'countdown') state.bossCountdown = 3;
    const wasDanger = state.enemyIntent !== 'normal';
    state.enemyIntent = 'normal';
    state.quote = '"으억... 잠깐 말문이 막혔다..."';
    state.log += wasDanger
      ? `\n💥 [패턴 캔슬!!] 기절시켜 빌런의 필살기를 끊었습니다! (+사이다 10)`
      : `\n💫 빌런이 당황하여 반격하지 못했습니다!`;
    if (wasDanger) state.sp = clamp(state.sp + 10, 0, state.maxSp);
    saveGame();
    render();
    return;
  }

  // V14.0/V16.0: 반려견 콩이 전투 지원 (기본 28%, 원목하우스 보유 시 45%)
  const petChance = state.roomUpgrades?.includes('doghouse') ? 0.45 : 0.28;
  if (state.pet?.adopted && Math.random() < petChance) {
    const petDmg = 8 + (state.pet.level || 1) * 3;
    state.enemyHp = clamp(state.enemyHp - petDmg, 0, state.enemyMaxHp);
    const petStun = Math.random() < 0.25;
    if (petStun) state.enemyStunned = true;
    state.log += `\n🐶 [콩이 지원!] 콩이가 빌런의 발목을 앙! (멘탈 -${petDmg}${petStun ? ' · 깜짝 기절!' : ''})`;
    triggerPartnerCallout('kongi', '멍! 발목 깨물기! 🐶');
    triggerEnemyHit(petDmg, petStun);
    if (state.enemyHp <= 0) {
      handleEnemyDefeated(enemy);
      return;
    }
  }

  const spBonTurn = getSpiritBonuses();
  const spChance = spBonTurn.perkId === 'overdrive' ? 1.0 : ((spBonTurn.growthLv || 1) >= 5 ? 0.55 : 0.45);
  if (spBonTurn.spirit && Math.random() < spChance) {
    const lv20Mult = (spBonTurn.growthLv || 1) >= 20 ? 1.5 : 1.0;
    const spHit = Math.round((8 + Math.round(spBonTurn.atk * 0.7) + Math.round((spBonTurn.growthLv || 1) * 1.2)) * lv20Mult);
    state.enemyHp = clamp(state.enemyHp - spHit, 0, state.enemyMaxHp);
    state.log += `\n👻 [${spBonTurn.spirit.name} Lv.${spBonTurn.growthLv || 1} 협공!] 수호정령의 기운이 빌런을 강타! (멘탈 -${spHit})`;
    if (elSpiritSprite) {
      elSpiritSprite.classList.remove('spirit-hop');
      void elSpiritSprite.offsetWidth;
      elSpiritSprite.classList.add('spirit-hop');
    }
    triggerEnemyHit(spHit, false);
    if (state.enemyHp <= 0) {
      handleEnemyDefeated(enemy);
      return;
    }
  }
  if (spBonTurn.perkId === 'turn_heal' && state.hp > 0) {
    const regenHp = Math.max(4, Math.round(state.maxHp * 0.04) + Math.floor(((spBonTurn.growthLv || 1) - 1) / 2));
    state.hp = clamp(state.hp + regenHp, 1, state.maxHp);
    state.log += `\n🫧 [${spBonTurn.spirit.name}] 탄산 재생! 인내심 +${regenHp}`;
  }

  const intentObj = ENEMY_INTENTS.find((i) => i.id === state.enemyIntent) || ENEMY_INTENTS[0];
  const chaosMult = (state.chaosLevel ?? 25) >= 70 ? 1.2 : 1.0;
  const scaledAtk = state.currentEnemyAtk || Math.round(enemy.atk * getDiffObj().atkMult * (1 + (state.ngPlus || 0) * 0.3));
  const eqBonus = getEquippedBonuses();

  if (!isGuarding && !state.usedLogicCounter && Math.random() < 0.18) {
    state.usedLogicCounter = true;
    state.logicCounterIdx = Math.floor(Math.random() * LOGIC_COUNTERS.length);
    state.phase = 'logic_counter';
    saveGame();
    render();
    return;
  }

  let dmg = Math.round((scaledAtk + Math.floor(Math.random() * 5) - 2) * intentObj.mult * chaosMult);
  if (state.bossGimmick === 'countdown') {
    state.bossCountdown = Math.max(0, (state.bossCountdown || 3) - 1);
    if (state.bossCountdown <= 0) {
      dmg = Math.round(dmg * 1.8);
      state.bossCountdown = 3;
      state.log += `\n💥 [보스 광폭 카운트다운 0!!] 1.8배 초강력 폭언 작렬!!`;
    }
  }
  if ((state.weather || 'sunny') === 'rain' && ['smoker', 'spitter', 'street_smoker', 'cafe_boss'].includes(enemy.id)) {
    dmg = Math.max(2, Math.round(dmg * 0.8));
    state.log += `\n☔ [우천 약화] 빗줄기에 빌런 기세가 꺾여 피해 -20%!`;
  }
  if ((state.enemyApologyTurns || 0) > 0) {
    dmg = Math.max(2, Math.round(dmg * 0.6));
    state.enemyApologyTurns -= 1;
    state.log += `\n📝 [반성문 효과] 빌런이 주눅 들어 공격력이 40% 감소!`;
  }
  if (isGuarding) {
    dmg = Math.max(1, Math.round(dmg * 0.10));
  }
  const totalDef = (eqBonus.def || 0) + (state.flatDef || 0) + Math.floor(((state.level || 1) - 1) / 3);
  if (totalDef > 0) {
    const minDmg = isGuarding ? 2 : Math.max(5, Math.round(scaledAtk * 0.25));
    const maxFlatBlock = isGuarding ? totalDef : Math.min(totalDef, Math.round(dmg * 0.55));
    const nextDmg = Math.max(minDmg, dmg - maxFlatBlock);
    const blocked = Math.max(0, dmg - nextDmg);
    dmg = nextDmg;
    if (blocked > 0) state.log += `\n🛡️ [방어력 경감 -${blocked}]`;
  }
  if (spBonTurn.perkId === 'counter_guard' && dmg > 1) {
    dmg = Math.max(2, Math.round(dmg * 0.85));
    state.enemyHp = clamp(state.enemyHp - 6, 0, state.enemyMaxHp);
    state.log += `\n🛡️ [${spBonTurn.spirit.name}] 수호 반격! (피해 -15% · 반사 -6)`;
  }
  const totalReflect = (eqBonus.reflect || 0) + (state.pet?.adopted && state.pet.job === 'guard' ? 0.15 : 0);
  if (totalReflect > 0 && dmg > 1) {
    const refDmg = Math.max(2, Math.round(dmg * totalReflect));
    state.enemyHp = clamp(state.enemyHp - refDmg, 0, state.enemyMaxHp);
    state.log += `\n🪞 [피해 반사!] 빌런에게 ${refDmg} 반사 데미지!`;
  }

  state.hp = clamp(state.hp - dmg, 0, state.maxHp);
  if (getGearSetSynergy().reflectStun && dmg > 1 && Math.random() < 0.20) {
    state.enemyStunned = true;
    state.log += `\n🪞 [거울 반사 세트!!] 반사 충격으로 빌런이 기절했습니다!`;
  }
  if (state.costume === 'cyber') addFever(15);
  if (state.costume === 'golden_hero' && state.hp > 0) {
    state.hp = clamp(state.hp + 12, 1, state.maxHp);
    state.log += `\n👑 [1대 영웅의 황금 코트] 인내심 +12 자동 회복!`;
  }
  if (eqBonus.spRegen > 0) state.sp = clamp(state.sp + eqBonus.spRegen, 0, state.maxSp);
  if (state.pet?.adopted && state.pet.job === 'healer' && state.hp > 0) {
    state.hp = clamp(state.hp + 5, 1, state.maxHp);
    state.log += `\n💖 [힐링견 콩이] 인내심 +5 회복!`;
  }
  if (state.lovers?.includes('yuki') && !state.sulky?.yuki && state.hp > 0) {
    state.hp = clamp(state.hp + 6, 1, state.maxHp);
    state.log += `\n💚 [유키 응원] 따뜻한 말차 에너지로 인내심 +6 회복!`;
    triggerPartnerCallout('yuki', '힘내요 자기! 💚');
  }
  if (state.enemyIntent === 'rage' && !isGuarding) {
    state.sp = clamp(state.sp - 10, 0, state.maxSp);
  }
  state.quote = enemy.banterQuotes[Math.floor(Math.random() * enemy.banterQuotes.length)];
  if (isGuarding) {
    state.log += `\n🛡️ 완벽 가드 성공! 피해를 ${dmg}로 줄였습니다!`;
  } else if (intentObj.isDanger) {
    playHeroAnim('hit');
    state.log += `\n💥 빌런의 필살기 작렬! 인내심이 ${dmg} 깎였습니다!`;
  } else {
    playHeroAnim('hit');
    state.log += `\n💢 빌런의 뻔뻔한 반박! 인내심이 ${dmg} 깎였습니다.`;
  }
  setTimeout(() => triggerPlayerDamage(dmg), 220);

  rollNextIntent();

  if (!state.enemyStunned && state.enemyHp > 0 && !state.enemyExcuseShield && Math.random() < 0.24) {
    state.enemyExcuseShield = true;
    state.log += `\n🛡️ [빌런 전술!] 빌런이 "철벽 변명 태세"에 돌입! (다음 일반 공격 50% 반감 · 법전/필살기로 파쇄!)`;
  }

  if (state.hp <= 0) {
    state.phase = 'gameover';
    state.log = `혈압이 한계치를 돌파했습니다... (${enemy.name}에게 패배)`;
    vibrate([200, 80, 200]);
  } else if (state.hp / state.maxHp <= 0.30) {
    state.log += `\n🚨 [인내심 위험!! (${state.hp}/${state.maxHp})] 체력이 30% 이하입니다! 🎒 가방에서 회복 아이템을 사용하거나 🛡️ 가드하세요!`;
    showToast('🚨 [위험!] 인내심이 30% 이하입니다! 회복 아이템을 사용하세요! 🎒', 'break');
  }
  saveGame();
  render();
}

function handleEnemyDefeated(enemy) {
  state.quote = enemy.defeatQuote;
  const diff = getDiffObj();
  const eqBon = getEquippedBonuses();
  const baseReward = Math.round(enemy.reward * diff.rewardMult * (1 + (state.rewardMultBonus || 0) + (eqBon.rewardMult || 0)));
  const nightBonus = state.timeIndex >= 5 ? Math.round(baseReward * 0.25) : 0;
  const dustBonus = (state.weather || 'sunny') === 'dust' ? 10 : 0;
  const goldSpBonus = getSpiritBonuses().perkId === 'gold_up' ? Math.round(baseReward * 0.25) : 0;
  state.points += baseReward + nightBonus + dustBonus + goldSpBonus;
  const expSpMult = getSpiritBonuses().perkId === 'exp_up' ? 1.35 : 1;
  const expGain = Math.round((24 + (enemy.reward || 30) * 0.65) * ((isBossId(enemy.id) || enemy.storyOnly) ? 1.6 : 1) * (1 + (eqBon.expMult || 0)) * expSpMult);
  gainHeroExp(expGain);
  if (state.equippedSpirit) {
    gainSpiritExp(state.equippedSpirit, Math.max(15, Math.round(expGain * 0.85)));
  }
  if (getSpiritBonuses().perkId === 'pp_refund') {
    restoreSkillPp(1);
    state.log = (state.log ? state.log + '\n' : '') + `🎵 [${getSpiritBonuses().spirit.name}] 승리의 여운으로 전 기술 PP +1 환급!`;
  }
  if (getSpiritBonuses().perkId === 'drop_up') {
    state.scrap = (state.scrap || 0) + 1;
  }
  state.pendingReports += 1;
  if (state.pet?.adopted && state.pet.job === 'detective' && Math.random() < 0.5) {
    state.pendingReports += 1;
    showToast('🕵️ [탐지견 콩이] 추가 채증 +1 확보!', 'good');
  }
  const enemyLv = state.currentEnemyLv || enemy.lv || state.level || 1;
  rollGearDrop(isBossId(enemy.id) || enemy.id === HIDDEN_BOSS.id, enemyLv);
  rollSpiritEncounter(isBossId(enemy.id) || enemy.id === HIDDEN_BOSS.id, enemyLv);
  if (enemy.actId && enemy.actEp) {
    if (!state.actStoryStep) state.actStoryStep = {};
    state.actStoryStep[enemy.actId] = Math.max(state.actStoryStep[enemy.actId] || 0, enemy.actEp);
    state.pendingActAftermath = { actId: enemy.actId, epNum: enemy.actEp, isBoss: !!enemy.isActBoss };
    showToast(`📖 [${enemy.location}] 클리어!`, 'good');
  }
  if (enemy.isActBoss && enemy.actId) {
    if (!Array.isArray(state.clearedActs)) state.clearedActs = [];
    if (!state.clearedActs.includes(enemy.actId)) {
      state.clearedActs.push(enemy.actId);
      const rPick = RUNE_STONES.find((x) => x.id === `rune_${enemy.actId}`) || RUNE_STONES[0];
      if (!Array.isArray(state.ownedRunes)) state.ownedRunes = [];
      state.ownedRunes.push(rPick.id);
      if (enemy.actId === 'jeonju') state.maxHp += 20;
      else if (enemy.actId === 'pyeongtaek') state.bonusDmg += 4;
      else if (enemy.actId === 'dongtan') state.flatDef = (state.flatDef || 0) + 3;
      else if (enemy.actId === 'incheon') state.critBonus = (state.critBonus || 0) + 0.08;
      showToast(`🏆 [지역 제패!!] ${enemy.name} 격파! [${rPick.name}] 획득!`, 'break');
    }
  }
  if (enemyLv >= 15 && Math.random() < (enemyLv >= 35 ? 0.65 : 0.40)) {
    const scrapGain = enemyLv >= 35 ? 3 : (enemyLv >= 25 ? 2 : 1);
    state.scrap = (state.scrap || 0) + scrapGain;
    state.log = (state.log ? state.log + '\n' : '') + `🔩 [Lv.${enemyLv} 전리품] 영웅 고철 +${scrapGain} 획득!`;
  }
  if (enemyLv >= 20 && Math.random() < (enemyLv >= 35 ? 0.35 : 0.20)) {
    if (!state.items) state.items = {};
    const dropKey = Math.random() < 0.5 ? 'cheongsimhwan' : 'cold_soda';
    const dropName = dropKey === 'cheongsimhwan' ? '황금 청심환' : '시원한 사이다';
    state.items[dropKey] = (state.items[dropKey] || 0) + 1;
    state.log = (state.log ? state.log + '\n' : '') + `🥤 [Lv.${enemyLv} 보급품] ${dropName} +1 획득!`;
  }
  state.winCount = (state.winCount || 0) + 1;
  advanceDailyQuest('win', 1);
  if (state.equippedSpirit) advanceDailyQuest('spirit_win', 1);
  if (!state.villainWins) state.villainWins = {};
  state.villainWins[enemy.id] = (state.villainWins[enemy.id] || 0) + 1;
  state.enemyBroken = false;
  if (state.guerrilla && state.guerrilla.villainId === enemy.id) {
    state.guerrilla = null;
    state.points += 40;
    showToast('🚨 지명수배 빌런 검거 완료! 현상금 +40 P!', 'good');
  }
  if (state.invadedDistrict && state.invadedDistrict.enemyId === enemy.id) {
    const dName = state.invadedDistrict.name;
    state.invadedDistrict = null;
    state.points += 90;
    state.scrap = (state.scrap || 0) + 3;
    rollGearDrop(true, Math.max(enemyLv, 20));
    showToast(`🛡️ [${dName} 디펜스 성공!!] +90 P · 강화석 +3 · 보너스 장비!`, 'break');
  }
  if (state.lovers?.includes('yuki') && state.lovers?.includes('chloe') && state.pet?.adopted) {
    state.partnerWinTicks = (state.partnerWinTicks || 0) + 1;
    if (state.partnerWinTicks >= 5) {
      state.partnerWinTicks = 0;
      state.partnerBond = (state.partnerBond || 1) + 1;
      showToast(`💖 [파티 유대 Lv.${state.partnerBond} 달성!] 유키·클로이·콩이 호흡이 더욱 강해졌습니다!`, 'good');
    }
  }
  if (!state.dailyStats) state.dailyStats = { wins: 0, loveGain: 0 };
  state.dailyStats.wins += 1;
  state.chaosLevel = clamp((state.chaosLevel ?? 25) - (isBossId(enemy.id) ? 18 : 10), 0, 100);
  state.followers = (state.followers || 120) + (isBossId(enemy.id) ? 1200 : 280);
  state.liveFeed = createFeedForVictory(enemy.name, getReputationInfo().mode);
  if (nightBonus > 0) showToast(`🌙 야간 순찰 보너스 +${nightBonus} P!`, 'good');
  if (state.winCount >= 2) grantClue('clue_mcn_card');
  if (state.defeatedBossIds.length >= 2) grantClue('clue_ledger');
  tryRecruitAlly();
  checkAchievements();
  sfx.victory();
  vibrate([50, 40, 50, 40, 150]);

  if ((state.towerFloor || 0) > 0) {
    restoreSkillPp(2);
    const cleared = state.towerFloor;
    state.points += cleared * 12;
    if (cleared > (state.bestTowerFloor || 0)) state.bestTowerFloor = cleared;
    state.phase = 'tower_clear';
    state.log = `🏢 [배틀타워 ${cleared}층 격파!!] 보너스 +${cleared * 12} P! 다음 층으로 올라갈까요?`;
    saveGame();
    render();
    return;
  }

  // V26.0 서울 5대 구역 치안 게이지 상승
  if (!state.districts) state.districts = { mapo: 0, seongsu: 0, gangnam: 0, jongno: 0, yeouido: 0 };
  const dId = getDistrictIdForEnemy(enemy.id);
  const prevDist = state.districts[dId] || 0;
  const distGain = isBossId(enemy.id) ? 40 : 20;
  state.districts[dId] = Math.min(100, prevDist + distGain);
  if (prevDist < 100 && state.districts[dId] >= 100) {
    const dInfo = SEOUL_DISTRICTS.find((d) => d.id === dId);
    if (dInfo) showToast(`🕊️ [${dInfo.name}] 치안 100% 평화구역 달성!! (${dInfo.buffDesc})`, 'break');
  }

  // V26.1 실시간 112 긴급 속보 해결 보너스
  if (state.breakingNews && state.breakingNews.enemyId === enemy.id) {
    const bn = state.breakingNews;
    state.points += bn.bonusPts;
    state.districts[bn.districtId] = Math.min(100, (state.districts[bn.districtId] || 0) + 15);
    state.followers = (state.followers || 120) + 180;
    state.breakingFirstDone = true;
    state.breakingNews = null;
    state.liveFeed = {
      badge: '🔴 서울 긴급 속보',
      likes: '❤️ 3.4만',
      title: `노란 완장 시민영웅, ${bn.districtName} '${bn.enemyName}' 10초 만에 제압!`,
      comment: `💬 시민 베댓: "112보다 빠른 노란 완장 폼 미쳤다 ㅋㅋ (+${bn.bonusPts}P · 치안+15%)"`,
    };
    showToast(`📰 긴급 속보 해결! +${bn.bonusPts} P · ${bn.districtName} 치안 +15%!`, 'good');
  }

  // V26.0 심야 마계 보스 러시 승리
  if ((state.nightmareFloor || 0) > 0) {
    restoreSkillPp(2);
    const nmCleared = state.nightmareFloor;
    state.points += nmCleared * 25;
    if (nmCleared > (state.bestNightmareFloor || 0)) state.bestNightmareFloor = nmCleared;
    state.phase = 'nightmare_clear';
    state.log = `🌃 [마계 보스 러시 ${nmCleared}층 격파!!] 보너스 +${nmCleared * 25} P!`;
    saveGame();
    render();
    return;
  }

  advanceTime();

  const prevCh = state.chapterIndex;
  const currentCh = STORY_CHAPTERS[state.chapterIndex];
  if (currentCh && currentCh.bossId === enemy.id) {
    state.chapterIndex += 1;
    state.storySceneIndex = 0;
    state.lastMainStoryDay = state.day;
    if (prevCh < STORY_AFTERMATHS.length) {
      state.pendingStoryAftermath = prevCh;
    }
    if (state.chapterIndex < STORY_CHAPTERS.length) {
      state.unreadMessages += 1;
    }
    notifyNewUnlocks(prevCh, state.chapterIndex);
  }

  if (isBossId(enemy.id) && !state.defeatedBossIds.includes(enemy.id)) {
    state.defeatedBossIds.push(enemy.id);
  }

  if (enemy.id === HIDDEN_BOSS.id || state.chapterIndex >= STORY_CHAPTERS.length) {
    if (enemy.id !== HIDDEN_BOSS.id && state.chapterIndex >= 29 && state.defeatedBossIds.length >= BOSSES.length && (state.clues || []).length >= 5) {
      showToast('🎭 4대 보스 격파! 최종 흑막 [닥터 카오스] 본사 결전 돌입!!', 'break');
      startBattle(HIDDEN_BOSS.id);
      return;
    }
    state.storyCleared = true;
    state.freePlayMode = true;
    const ending = evaluateEnding(state, false);
    state.achievedEndingId = ending.id;
    unlockEnding(ending.id);
    if (!state.epilogueSeen) {
      state.epilogueIdx = 0;
      state.phase = 'epilogue';
      state.log = '🎉 드디어 길고 길었던 서울의 대장정이 막을 내립니다...';
    } else {
      state.phase = 'victory';
      state.log = buildFullEndingText(ending, state);
    }
    showToast('♾️ 스토리 클리어! 에필로그 & 무한 자유모드 해금!', 'good');
    saveGame();
    render();
    return;
  }

  if (state.dailyFortune === 'gold') {
    const fBonus = Math.round((enemy.reward || 20) * 0.5);
    state.points += fBonus;
  }

  state.draftOptions = buildDraftOptions(enemy);

  // V26.2: 일반 빌런 격파 시 65% 확률로 찌질한 변명 + 최후의 일갈 이벤트
  if (!isBossId(enemy.id) && !(state.towerFloor > 0) && !(state.nightmareFloor > 0) && Math.random() < 0.65) {
    state.phase = 'villain_excuse';
    state.excuseEnemyName = enemy.name;
    state.excuseIdx = Math.floor(Math.random() * VILLAIN_EXCUSES.length);
    state.log = `✅ [${enemy.name}] 멘탈 붕괴! 빌런이 무릎을 꿇고 변명을 늘어놓기 시작합니다...`;
    saveGame();
    render();
    return;
  }

  state.phase = 'draft';
  state.log = `✅ [${enemy.name}] 참교육 성공! (+${baseReward} P · +${expGain} EXP · 채증 +1)\n보상 카드 3장 중 1개를 선택하세요!`;
  saveGame();
  render();
}

function performGuard() {
  const enemy = getEnemyById(state.currentEnemyId);
  const counterDmg = Math.round(22 + state.stats.guts * 3.5 + state.bonusDmg);
  state.sp = clamp(state.sp + 25, 0, state.maxSp);
  state.enemyHp = clamp(state.enemyHp - counterDmg, 0, state.enemyMaxHp);
  state.combatChain = (state.combatChain || 0) + 1;
  state.enemyGuardShield = Math.max(0, (state.enemyGuardShield ?? 3) - 1);
  addFever(30);
  playHeroAnim('guard');
  sfx.hit(true);
  state.log = `⚡ [저스트 패링!!] 피해 90% 차단 + 역관광 -${counterDmg} · 사이다 +25 · 피버 +30%!`;
  let gotBonusTurn = false;
  if (state.enemyGuardShield <= 0 && state.enemyHp > 0) {
    state.enemyBroken = true;
    state.enemyStunned = true;
    state.enemyGuardShield = 3;
    gotBonusTurn = true;
    state.log += `\n💥 [MENTAL BREAK!!] 실드 격파! 빌런 기절 + 공짜 보너스 1턴!!`;
    showToast('💥 MENTAL BREAK! 공짜 보너스 1턴 획득!!', 'break');
  }
  triggerEnemyHit(counterDmg, true);
  if (state.enemyHp <= 0) {
    handleEnemyDefeated(enemy);
    return;
  }
  if (gotBonusTurn) {
    saveGame();
    render();
    return;
  }
  enemyCounterTurn(enemy, true);
}

function checkStreamMission(actionId) {
  if (!state.streamMission || state.streamMission.id !== actionId) return;
  const mult = state.roomUpgrades?.includes('desk') ? 1.35 : 1;
  const p = Math.round(state.streamMission.rewardP * mult);
  const f = Math.round(state.streamMission.rewardF * mult);
  state.points += p;
  state.followers = (state.followers || 120) + f;
  state.sp = clamp(state.sp + 20, 0, state.maxSp);
  state.nextGuaranteedCrit = true;
  state.log += `\n📺 [시청자 미션 성공!] +${p}P · 팔로워 +${f} · 사이다 +20 · 다음 공격 확정 치명타!`;
  if (state.goldenMission) {
    state.goldenMission = false;
    state.points += 80;
    state.scrap = (state.scrap || 0) + 2;
    state.log += `\n🌟 [동접 10만 황금 별풍선 잭팟!!] +80 P · 강화석 +2개 즉석 지급!`;
    showToast(`🌟 황금 별풍선 잭팟!! +80 P · 강화석 +2 · 확정치명!`, 'break');
  } else {
    showToast(`📺 도네 성공! +${p}P · 사이다+20 · 다음 타 확정치명!`, 'good');
  }
  state.streamMission = STREAM_MISSIONS[Math.floor(Math.random() * STREAM_MISSIONS.length)];
  state.goldenMission = Math.random() < 0.15;
}

function getSkillEvolution(type) {
  const s = state.stats || { speech: 2, guts: 2, law: 2 };
  const avg = ((s.speech || 2) + (s.guts || 2) + (s.law || 2)) / 3;
  if (type === 'speech') {
    if ((s.speech || 0) >= 50) return { title: '🌟 초월·팩트', dmgMult: 1.35, critBonus: 0.20, tier: 3 };
    if ((s.speech || 0) >= 25) return { title: '⚡ 각성·팩트', dmgMult: 1.15, critBonus: 0.10, tier: 2 };
    return { title: '🗣️ 팩트폭력', dmgMult: 1.0, critBonus: 0, tier: 1 };
  }
  if (type === 'guts') {
    if ((s.guts || 0) >= 50) return { title: '🌟 초월·거울', dmgMult: 1.30, spExtra: 13, vampPct: 0.06, tier: 3 };
    if ((s.guts || 0) >= 25) return { title: '🔥 각성·거울', dmgMult: 1.15, spExtra: 5, vampPct: 0, tier: 2 };
    return { title: '🪞 거울치료', dmgMult: 1.0, spExtra: 0, vampPct: 0, tier: 1 };
  }
  if (type === 'law') {
    if ((s.law || 0) >= 50) return { title: '🌟 초월·법전', dmgMult: 1.30, diceExtra: 4, tier: 3 };
    if ((s.law || 0) >= 25) return { title: '⚖️ 각성·법전', dmgMult: 1.15, diceExtra: 2, tier: 2 };
    return { title: '⚖️ 법전밀기', dmgMult: 1.0, diceExtra: 0, tier: 1 };
  }
  if (avg >= 50) return { title: '🌟 초월·핵사이다', dmgMult: 1.45, healPct: 0.10, tier: 3 };
  if (avg >= 25) return { title: '🫧 각성·사이다', dmgMult: 1.25, healPct: 0, tier: 2 };
  return { title: '🫧 사이다 필살', dmgMult: 1.0, healPct: 0, tier: 1 };
}

function performAttack(type, ultPerfect = false) {
  playHeroAnim('attack');
  const enemy = getEnemyById(state.currentEnemyId);
  const rep = getReputationInfo();
  let dmg = 0;
  let isCrit = false;
  let hitWeakness = false;

  const eqBonus = getEquippedBonuses();
  const chloeCrit = (state.lovers?.includes('chloe') && !state.sulky?.chloe ? 0.18 : 0) + eqBonus.crit;
  const allyFirstBonus = state.isFirstTurn && state.allies?.includes('parking_bro') ? 8 : 0;
  const rankBonus = getHeroRankInfo().atkBonus || 0;
  const sodaBonus = (state.sodaBuffDmg || 0) + rankBonus + eqBonus.atk;
  const wasFirstTurn = !!state.isFirstTurn;
  state.isFirstTurn = false;
  if (state.sodaBuffDmg) state.sodaBuffDmg = 0;

  if (!state.skillChain) state.skillChain = [];
  if (['speech', 'guts', 'law', 'special'].includes(type)) {
    state.skillChain.push(type);
    if (state.skillChain.length > 3) state.skillChain.shift();
  }

  const isFever = (state.feverTurns || 0) > 0;
  const spBonCost = getSpiritBonuses();
  const baseSpCost = isFever ? 20 : 40;
  const spCost = spBonCost.perkId === 'sp_saver' ? Math.round(baseSpCost * 0.75) : baseSpCost;
  const ppMap = ensureSkillPp();
  if (['speech', 'guts', 'law', 'snap'].includes(type)) {
    if ((ppMap[type] ?? getMaxSkillPp(type)) <= 0) return;
    ppMap[type] = Math.max(0, (ppMap[type] ?? getMaxSkillPp(type)) - 1);
  }
  const evo = getSkillEvolution(type);
  const matchup = getMatchupInfo(enemy, type);
  if (type === 'speech') {
    const base = 18 + state.stats.speech * 4 + state.bonusDmg + allyFirstBonus + sodaBonus;
    const isWeak = isFever || matchup.isUp || enemy.weakness === 'speech';
    hitWeakness = isWeak;
    const critRoll = isFever || Math.random() < (0.15 + state.critBonus + chloeCrit + (evo.critBonus || 0));
    if (critRoll && chloeCrit > 0) triggerPartnerCallout('chloe', 'Nice Shot! 📸');
    dmg = Math.round(base * (evo.dmgMult || 1) * matchup.mult * (critRoll ? 1.5 : 1));
    isCrit = isWeak || critRoll;
    state.sp = clamp(state.sp + 10, 0, state.maxSp);
    state.lawful += 5;
    state.log = `${evo.title}! (적 멘탈 -${dmg}${matchup.isUp ? ` · ${matchup.tag}` : (matchup.isDown ? ` · ${matchup.tag}` : '')}${critRoll ? ' · 치명타!' : ''})`;
  } else if (type === 'guts') {
    const base = 16 + state.stats.guts * 4 + state.bonusDmg + allyFirstBonus;
    const isWeak = isFever || matchup.isUp || enemy.weakness === 'guts';
    hitWeakness = isWeak;
    const critRoll = isFever || Math.random() < chloeCrit;
    dmg = Math.round(base * (evo.dmgMult || 1) * matchup.mult * (critRoll ? 1.5 : 1));
    isCrit = isWeak || critRoll;
    const spGain = 15 + state.gutsSpBonus + (evo.spExtra || 0);
    state.sp = clamp(state.sp + spGain, 0, state.maxSp);
    if (evo.vampPct) state.hp = clamp(state.hp + Math.round(state.maxHp * evo.vampPct), 1, state.maxHp);
    state.chaotic += 10;
    state.log = `${evo.title} 시전! (적 멘탈 -${dmg}${matchup.isUp ? ` · ${matchup.tag}` : (matchup.isDown ? ` · ${matchup.tag}` : '')}, 사이다 +${spGain})`;
  } else if (type === 'law') {
    sfx.dice();
    const roll = Math.floor(Math.random() * 20) + 1;
    const repBonus = rep.mode === 'lawful' ? 2 : 0;
    const costumeLawBonus = state.costume === 'police' ? 3 : 0;
    const total = roll + state.stats.law + state.diceBonus + repBonus + costumeLawBonus + (evo.diceExtra || 0);
    const isWeak = isFever || matchup.isUp || enemy.weakness === 'law';
    hitWeakness = isWeak;
    state.lawful += 10;
    if (total >= 12 || isFever) {
      dmg = Math.round((24 + state.stats.law * 5 + state.bonusDmg + allyFirstBonus) * (evo.dmgMult || 1) * matchup.mult);
      isCrit = true;
      state.enemyStunned = true;
      const gotApology = getSpiritBonuses().perkId === 'apology_up' ? true : Math.random() < 0.5;
      if (gotApology) state.enemyApologyTurns = 2;
      state.log = `${evo.title} [주사위 ${roll}+보정=${total}] 대성공! (멘탈 -${dmg}${matchup.tag ? ` · ${matchup.tag}` : ''} & 기절${gotApology ? ' · 📝반성문 2턴!' : '!'})`;
    } else {
      dmg = Math.round((10 + state.bonusDmg + allyFirstBonus) * matchup.mult);
      state.log = `${evo.title} [주사위 ${roll}+보정=${total}] 법 조항이 가물가물... (적 멘탈 -${dmg})`;
    }
  } else if (type === 'special') {
    if (state.sp < spCost) return;
    state.sp -= spCost;
    const specBase = 62 + state.spDmgBonus + state.bonusDmg + eqBonus.atk + (state.stats.speech + state.stats.guts + state.stats.law) * 2.8;
    const specMatch = Math.max(1.35, matchup.mult);
    dmg = Math.round(specBase * (evo.dmgMult || 1) * specMatch * 1.5);
    isCrit = true;
    hitWeakness = true;
    state.enemyStunned = true;
    state.lawful += 8;
    if (evo.healPct) state.hp = clamp(state.hp + Math.round(state.maxHp * evo.healPct), 1, state.maxHp);
    state.log = `${evo.title}! 112·보건소 신고 + 공개 참교육!! (멘탈 -${dmg} · 상성무시 치명 & 기절!)`;
  } else if (type === 'snap') {
    const base = 22 + state.stats.law * 4.0 + state.bonusDmg + allyFirstBonus + eqBonus.atk;
    const isWeak = isFever || matchup.isUp || enemy.weakness === 'snap';
    hitWeakness = isWeak;
    const critRoll = isFever || Math.random() < (0.20 + state.critBonus + chloeCrit);
    dmg = Math.round(base * (evo.dmgMult || 1) * matchup.mult * (critRoll ? 1.5 : 1));
    isCrit = isWeak || critRoll;
    state.pendingReports = (state.pendingReports || 0) + 1;
    state.sp = clamp(state.sp + 12, 0, state.maxSp);
    state.log = `${getEquippedSkill('snap').name}! (적 멘탈 -${dmg} · 채증+1 · 사이다+12)`;
  }

  // V44.0: 궁극기(사이다 필살기) 타이밍 보너스 (옵션 B)
  if (type === 'special' && ultPerfect) {
    dmg = Math.round(dmg * 1.45);
    state.enemyGuardShield = Math.max(0, (state.enemyGuardShield ?? 3) - 2);
    addFever(25);
    state.log += `\n✨ [PERFECT 궁극기!!] 1.45배 극딜 + 가드 2칸 파쇄!`;
  }

  // V44.0: 100종 장착 스킬 고유기 & 배율 적용
  if (['speech', 'guts', 'law', 'snap'].includes(type)) {
    const eqSk = getEquippedSkill(type);
    if (eqSk) {
      const m = eqSk.mech;
      let skMult = eqSk.mult || 1.0;
      if (m === 'armor_pierce' && matchup.mult < 1) {
        dmg = Math.round(dmg / Math.max(0.5, matchup.mult));
        state.log += ' · 🗡️방어관통!';
      }
      if (m === 'low_hp') {
        const missPct = 1 - (state.hp / Math.max(1, state.maxHp));
        skMult *= (1 + missPct * 0.8);
      }
      if (m === 'crit_high' && Math.random() < 0.35) {
        skMult *= 1.35;
        isCrit = true;
        state.log += ' · ⚡초치명!';
      }
      dmg = Math.round(dmg * skMult);
      if (m === 'sp_drain') { state.sp = clamp(state.sp + 24, 0, state.maxSp); state.log += ' · 🫧사이다+24'; }
      else if (m === 'guard_break') { state.enemyGuardShield = Math.max(0, (state.enemyGuardShield ?? 3) - 2); state.log += ' · 🛡️가드-2'; }
      else if (m === 'vamp') { const vh = Math.max(5, Math.round(dmg * 0.35)); state.hp = clamp(state.hp + vh, 1, state.maxHp); state.log += ` · 🩸흡혈+${vh}`; }
      else if (m === 'stun' && Math.random() < 0.55) { state.enemyStunned = true; state.log += ' · 💫기절!'; }
      else if (m === 'expose') { state.snapExposed = true; state.log += ' · 🎯약점노출!'; }
      else if (m === 'weaken') { state.currentEnemyAtk = Math.max(5, Math.round((state.currentEnemyAtk || enemy.atk || 14) * 0.85)); state.log += ' · 📉적공격↓'; }
      else if (m === 'gold_farm') { state.points += 15; state.log += ' · 💰+15P'; }
      else if (m === 'fever_up') { addFever(30); state.log += ' · ⚡피버+30%'; }
    }
  }
  const setAtkMult = 1 + (getGearSetSynergy().atkPct || 0);
  const spBonAtk = getSpiritBonuses();
  const spElemMatch = (spBonAtk.element === type) || (spBonAtk.element === 'cider' && type === 'special');
  const spElemMult = spElemMatch ? (1 + (spBonAtk.elemBoost || 0)) : 1;
  const isBossNow = isBossId(enemy.id) || !!enemy.storyOnly || enemy.id === HIDDEN_BOSS.id;
  const spBossMult = (isBossNow && spBonAtk.perkId === 'boss_slayer') ? 1.20 : 1;
  if (setAtkMult > 1 || spElemMult > 1 || spBossMult > 1) dmg = Math.round(dmg * setAtkMult * spElemMult * spBossMult);
  if (state.bossGimmick === 'shield' && (state.bossShield || 0) > 0) {
    const breakHits = (hitWeakness || type === 'law' || type === 'special') ? (type === 'special' ? 2 : 1) : 0;
    if (breakHits > 0) {
      state.bossShield = Math.max(0, state.bossShield - breakHits);
      state.log += state.bossShield === 0
        ? `\n💥 [보스 실드 완전 파괴!!] 이제 전력이 그대로 들어갑니다!`
        : `\n🛡️ [보스 실드 -${breakHits}!] (남은 실드: ${state.bossShield}겹)`;
    } else {
      dmg = Math.round(dmg * 0.6);
      state.log += `\n🛡️ [실드 방어!] 피해 40% 감소 (약점·법전·필살기로 파괴!)`;
    }
  }
  if ((eqBonus.lifesteal || 0) > 0 && dmg > 0) {
    const ls = Math.max(2, Math.round(dmg * eqBonus.lifesteal));
    state.hp = clamp(state.hp + ls, 1, state.maxHp);
    state.log += `\n🩸 [흡혈 각인] 인내심 +${ls} 회복!`;
  }

  if (state.enemyBroken) {
    dmg = Math.round(dmg * 1.5);
    isCrit = true;
    state.enemyBroken = false;
    state.log += `\n💥 [멘붕 브레이크 추격!!] 1.5배 폭딜 적중!`;
  }
  if (state.snapExposed) {
    dmg = Math.round(dmg * 1.4);
    state.snapExposed = false;
    state.log += `\n📸 [채증 약점 노출!!] 피해 1.4배 추가 관통!`;
  }

  if (hitWeakness) {
    state.weakCombo = (state.weakCombo || 0) + 1;
    if (state.weakCombo >= 2) {
      dmg = Math.round(dmg * 1.25);
      state.sp = clamp(state.sp + 15, 0, state.maxSp);
      state.enemyStunned = true;
      state.enemyBroken = true;
      state.weakCombo = 0;
      state.log += `\n🔥 [약점 콤보 브레이크!!] 피해 1.25배 + 사이다 15 + 기절 + 다음 턴 1.5배!`;
      showToast('🔥 콤보 브레이크! 빌런 멘붕 (다음 공격 1.5배)', 'break');
    }
  } else {
    state.weakCombo = 0;
  }

  if (state.skillChain?.length === 3 && new Set(state.skillChain).size === 3) {
    dmg += 35;
    state.sp = clamp(state.sp + 20, 0, state.maxSp);
    state.skillChain = [];
    state.log += `\n⚡ [삼위일체 참교육 체인!!] 서로 다른 3연타로 추가 피해 +35 & 사이다 +20!`;
    showToast('⚡ 삼위일체 참교육 콤보! (+35 피해 · 사이다 +20)', 'break');
  }

  if ((state.bossDmgMult || 0) > 0 && (isBossId(enemy.id) || enemy.storyOnly || enemy.id === HIDDEN_BOSS.id)) {
    dmg = Math.round(dmg * (1 + state.bossDmgMult));
  }
  if (wasFirstTurn && spBonAtk.perkId === 'first_strike') {
    dmg = Math.round(dmg * 1.35);
    state.log += `\n⚡ [${spBonAtk.spirit.name}] 선제 강타! 피해 +35%!`;
  }
  if ((type === 'guts' || type === 'law') && spBonAtk.perkId === 'stun_master' && !state.enemyStunned && Math.random() < 0.20) {
    state.enemyStunned = true;
    state.log += `\n💫 [${spBonAtk.spirit.name}] 충격 파동으로 빌런 기절!`;
  }
  if (spBonAtk.perkId === 'vampiric' && dmg > 0 && state.hp > 0) {
    const vampHeal = Math.max(3, Math.round(dmg * 0.10));
    state.hp = clamp(state.hp + vampHeal, 1, state.maxHp);
    state.log += `\n🩸 [${spBonAtk.spirit.name}] 기운 흡수 +${vampHeal} HP`;
  }
  if (state.enemyExcuseShield) {
    state.enemyExcuseShield = false;
    if (type === 'law' || type === 'special') {
      dmg = Math.round(dmg * 1.2);
      state.log += `\n💥 [철벽 변명 파쇄!!] 방어 태세를 깨뜨려 피해 +20%!`;
    } else {
      dmg = Math.max(1, Math.round(dmg * 0.5));
      state.log += `\n🛡️ [빌런 철벽 변명!] 귀를 막아 피해 50% 감소!`;
    }
  }

  if (state.nextGuaranteedCrit) {
    state.nextGuaranteedCrit = false;
    if (!isCrit) {
      dmg = Math.round(dmg * 1.5);
      isCrit = true;
    }
    state.log += `\n📺 [구독자 환호 버프!] 확정 치명타 작렬!!`;
  }
  if (hitWeakness || isCrit) {
    state.combatChain = (state.combatChain || 0) + 1;
    if (state.combatChain >= 2) {
      const chainMult = 1 + Math.min(0.5, (state.combatChain - 1) * 0.1);
      dmg = Math.round(dmg * chainMult);
      state.log += `\n🔥 [${state.combatChain} CHAIN!] 콤보 배율 x${chainMult.toFixed(1)} 적용!`;
    }
  } else {
    state.combatChain = 0;
  }

  let gotBreakBonusTurn = false;
  if (hitWeakness && state.enemyHp > 0) {
    const shieldDmg = type === 'special' ? 2 : 1;
    state.enemyGuardShield = Math.max(0, (state.enemyGuardShield ?? 3) - shieldDmg);
    if (state.enemyGuardShield <= 0) {
      state.enemyBroken = true;
      state.enemyStunned = true;
      state.enemyGuardShield = 3;
      gotBreakBonusTurn = true;
      state.log += `\n💥 [MENTAL BREAK!!] 가드 완파! 빌런 기절 + 공짜 보너스 1턴 획득!!`;
      showToast('💥 MENTAL BREAK!! 공짜 보너스 1턴 획득!!', 'break');
    }
  }

  // V27.0: 사이다 필살기(special) 제외, 일반 공격으로는 풀피 적을 한 방에 처치 불가 (최소 2턴 이상 공방 보장)
  if (type !== 'special' && state.enemyHp >= state.enemyMaxHp && dmg >= state.enemyHp) {
    const surviveHp = Math.max(1, Math.round(state.enemyMaxHp * 0.14));
    dmg = Math.max(1, state.enemyHp - surviveHp);
    state.log += `\n💢 [끈질긴 멘탈!] 빌런이 이를 악물고 간신히 버텼습니다! (필살기 외 1타 격파 불가)`;
  }

  state.enemyHp = clamp(state.enemyHp - dmg, 0, state.enemyMaxHp);
  if (isFever) {
    state.feverTurns = Math.max(0, (state.feverTurns || 0) - 1);
  } else if (type !== 'special') {
    addFever(hitWeakness ? 25 : 14);
  }
  checkStreamMission(type);
  triggerEnemyHit(dmg, isCrit);
  if (state.enemyHp <= 0) {
    handleEnemyDefeated(enemy);
    return;
  }
  if (gotBreakBonusTurn) {
    saveGame();
    render();
    return;
  }
  enemyCounterTurn(enemy);
}

function useItem(itemId, invIndex) {
  const item = ITEMS[itemId];
  if (!item) return;

  if (item.consumable) {
    sfx.powerup();
    vibrate(30);
    if (state.phase === 'combat') triggerEquipCutin(itemId);
    const heatMult = (itemId === 'cold_soda' && (state.weather || 'sunny') === 'heat') ? 1.5 : 1;
    if (item.useEffect.hpPct) {
      const healAmt = Math.max(item.useEffect.hpMin || 40, Math.round(state.maxHp * item.useEffect.hpPct));
      state.hp = clamp(state.hp + healAmt, 0, state.maxHp);
    } else if (item.useEffect.hp) {
      state.hp = clamp(state.hp + Math.round(item.useEffect.hp * heatMult), 0, state.maxHp);
    }
    if (item.useEffect.sp) state.sp = clamp(state.sp + Math.round(item.useEffect.sp * heatMult), 0, state.maxSp);
    if (item.useEffect.tempDmg) state.sodaBuffDmg = (state.sodaBuffDmg || 0) + Math.round(item.useEffect.tempDmg * heatMult);
    state.inventory.splice(invIndex, 1);
    const ppGain = item.useEffect.ppAll || 2;
    restoreSkillPp(ppGain);
    state.log = `[${item.name}]을(를) 사용했습니다!${heatMult > 1 ? ' 🔥(폭염 보너스 1.5배!)' : ''} 기운이 펄펄 솟아납니다! (전 기술 PP +${ppGain >= 99 ? '100%' : ppGain})`;
    elInvModal.classList.add('hidden');
    saveGame();
    render();
    return;
  }

  if (state.phase !== 'combat') {
    alert('전투 중에만 사용할 수 있는 참교육 장비입니다!');
    return;
  }
  if (state.usedEquipThisBattle.includes(itemId)) {
    alert('이번 전투에서 이미 사용한 장비입니다!');
    return;
  }

  const enemy = getEnemyById(state.currentEnemyId);
  state.usedEquipThisBattle.push(itemId);
  const gearLv = state.gearLevels?.[itemId] || 1;
  const gearList = GEAR_UPGRADES[itemId] || [];
  const gearObj = gearList.find((g) => g.lv === gearLv);
  const gearBonus = gearObj ? gearObj.bonusDmg : 0;
  const dmg = item.combatDmg + gearBonus + state.bonusDmg;
  triggerEquipCutin(itemId);
  state.enemyHp = clamp(state.enemyHp - dmg, 0, state.enemyMaxHp);
  if (item.stun) state.enemyStunned = true;
  if (item.spGain) state.sp = clamp(state.sp + item.spGain, 0, state.maxSp);
  if (item.healHp) state.hp = clamp(state.hp + item.healHp, 0, state.maxHp);
  if (itemId === 'water_gun' || itemId === 'mirror') state.chaotic += 8;

  elInvModal.classList.add('hidden');
  const gearTitle = gearObj ? `${gearObj.name} (Lv.${gearLv})` : item.name;
  state.log = `[${gearTitle}] 발동!! 빌런에게 치명타! (멘탈 -${dmg}${item.stun ? ' · 기절!' : ''})`;
  triggerEnemyHit(dmg, true);

  if (state.enemyHp <= 0) {
    handleEnemyDefeated(enemy);
  } else {
    saveGame();
    render();
  }
}

function render() {
  if (elBookPage) {
    elBookPage.classList.toggle('night-mode', state.timeIndex >= 5 && state.phase !== 'title');
    elBookPage.classList.remove('boss-aura');
  }
  elHpText.textContent = `${state.hp} / ${state.maxHp}`;
  elHpBar.style.width = `${(state.hp / state.maxHp) * 100}%`;
  elSpText.textContent = `${state.sp} / ${state.maxSp}`;
  elSpBar.style.width = `${(state.sp / state.maxSp) * 100}%`;
  elStatSpeech.textContent = state.stats.speech;
  elStatGuts.textContent = state.stats.guts;
  elStatLaw.textContent = state.stats.law;
  elStatPoints.textContent = state.points;
  if (elMiniSpDot) {
    const spPts = state.skillPoints || 0;
    elMiniSpDot.textContent = `✨+${spPts}`;
    elMiniSpDot.classList.toggle('hidden', spPts <= 0);
  }
  elInvCount.textContent = state.inventory.length;
  elTraitCount.textContent = state.traits.length;
  renderCombatLevelOverlays(false);

  const badgeCount = state.unreadMessages + (state.pendingReports > 0 ? 1 : 0);
  if (badgeCount > 0 && state.phase !== 'title') {
    elPhoneBadge.textContent = badgeCount;
    elPhoneBadge.classList.remove('hidden');
  } else {
    elPhoneBadge.classList.add('hidden');
  }

  elChoicesPanel.innerHTML = '';
  elChoicesPanel.classList.toggle('is-combat-grid', state.phase === 'combat');
  elWantedPoster.classList.add('hidden');
  elSceneCard.classList.add('hidden');
  elSceneImage.className = 'hidden';
  setStageBg(null);
  if (elFrame) elFrame.classList.remove('combat-stage', 'couple-stage', 'story-stage', 'spirit-capture-stage', 'spirit-caught-holo');
  if (elWildSpiritSprite) {
    elWildSpiritSprite.className = 'wild-spirit-sprite hidden';
  }
  if (elCaptureStamp) elCaptureStamp.classList.add('hidden');
  if (elRomMgOverlay) elRomMgOverlay.classList.add('hidden');
  elHeroSprite.classList.add('hidden');
  elHeroSprite.classList.remove('with-yuki', 'couple-left');
  if (elYukiSprite) {
    elYukiSprite.classList.add('hidden');
    elYukiSprite.classList.remove('couple-right');
  }
  if (elChloeSprite) {
    elChloeSprite.classList.add('hidden');
    elChloeSprite.classList.remove('with-yuki', 'couple-right');
  }
  if (elKongiSprite) elKongiSprite.classList.add('hidden');
  if (elSpiritSprite) elSpiritSprite.classList.add('hidden');
  if (elCoupleSprite) elCoupleSprite.classList.add('hidden');
  if (elDateFxLayer) {
    elDateFxLayer.className = 'date-fx-layer hidden';
    elDateFxLayer.innerHTML = '';
  }
  elSeoulMinimap.classList.add('hidden');
  elEnemyIntentBar.classList.add('hidden');

  if (state.liveFeed && state.phase !== 'combat' && state.phase !== 'title') {
    elLiveFeed.classList.remove('hidden');
    elLiveFeedBadge.textContent = state.liveFeed.badge;
    elLiveFeedLikes.textContent = state.liveFeed.likes || '❤️ 1.5만';
    elLiveFeedTitle.textContent = state.liveFeed.title;
    elLiveFeedComment.textContent = state.liveFeed.comment;
  } else {
    elLiveFeed.classList.add('hidden');
  }

  const elStoryCont = document.getElementById('story-container');
  if (elStoryCont) {
    elStoryCont.classList.toggle('is-combat', state.phase === 'combat');
    if (state.phase === 'combat') elStoryCont.scrollTop = 0;
  }

  const timeLabel = TIME_SLOTS[state.timeIndex] || TIME_SLOTS[0];
  const timeThemes = ['dawn', 'morning', 'noon', 'afternoon', 'evening', 'night', 'midnight'];
  document.body.dataset.time = state.phase === 'title' ? 'morning' : (timeThemes[state.timeIndex] || 'morning');
  const elDiffPill = document.getElementById('diff-pill');
  if (elDiffPill) {
    if (state.phase === 'title') {
      elDiffPill.classList.add('hidden');
    } else {
      const dId = state.difficulty || 'normal';
      const dLabels = { normal: '🌱 노멀', hard: '🔥 하드', hell: '💀 헬' };
      elDiffPill.className = `diff-pill ${dId}`;
      elDiffPill.textContent = dLabels[dId] || '🌱 노멀';
    }
  }

  if (elDdayPill) {
    if (state.phase === 'title') {
      elDdayPill.classList.add('hidden');
    } else if (state.storyCleared || state.freePlayMode) {
      elDdayPill.classList.remove('hidden', 'warn', 'danger');
      elDdayPill.classList.add('free');
      elDdayPill.textContent = '♾️ 자유모드';
    } else {
      const maxDay = GOLDEN_TIME_DAYS + (state.extendedGoldenTime ? 30 : 0);
      const rem = Math.max(0, maxDay - state.day + 1);
      elDdayPill.classList.remove('hidden', 'free', 'warn', 'danger');
      if (rem <= 10) elDdayPill.classList.add('danger');
      else if (rem <= 30) elDdayPill.classList.add('warn');
      elDdayPill.textContent = `⏳ D-${rem}`;
    }
  }

  if (elMorningModal) {
    const ms = state.pendingMorningSummary;
    if (ms && !['title', 'gameover', 'victory'].includes(state.phase)) {
      if (elMorningTitle) elMorningTitle.textContent = `🌅 DAY ${ms.day} — 새로운 아침이 되었습니다!`;
      if (elMorningSummaryBody) {
        if (!state.dailyQuests || state.dailyQuests.day !== state.day) rollDailyQuests();
        const dqList = (state.dailyQuests?.items || []).map((x) => `• ${x.label} (${x.cur}/${x.goal})`).join('\n');
        const lines = [
          `🌤️ 오늘 날씨: ${ms.weatherLabel} | ${ms.fortuneIcon} ${ms.fortuneShort}`,
          `📊 어제 결산: 참교육 ${ms.prevWins}회 · 호감 +${ms.prevLoveGain}${ms.distBonus > 0 ? ` · 후원 +${ms.distBonus}P` : ''}`,
        ];
        if (ms.cheerMsg) lines.push(ms.cheerMsg);
        lines.push(`\n📋 [오늘의 서울 특명 · 완수 시 +250P·강화석+3·청심환+1]\n${dqList}`);
        if (ms.breakingText) lines.push(`🔴 112 긴급 속보: ${ms.breakingText} 출몰 중!`);
        if (ms.teaserMsg) lines.push(`📰 서울 소식: ${ms.teaserMsg}`);
        lines.push(ms.remainingDays !== null ? `⏳ 서울 골든타임: 결전까지 D-${ms.remainingDays}` : '♾️ 포스트게임 무한 자유모드 진행 중');
        elMorningSummaryBody.textContent = lines.join('\n');
      }
      elMorningModal.classList.remove('hidden');
    } else {
      elMorningModal.classList.add('hidden');
    }
  }

  updateBgmForPhase();

  // V32.1 정령 조우 대기 시 전용 컷신 화면으로 전환
  if (state.phase === 'map' && state.pendingSpiritEncounter) {
    state.phase = 'spirit_encounter';
  }

  // 0.5 정령 조우 & A+B+C 통합 포획 연출 (V32.3)
  if (state.phase === 'spirit_encounter') {
    const sp = SPIRITS_50.find((s) => s.id === state.pendingSpiritEncounter);
    if (!sp) {
      state.pendingSpiritEncounter = null;
      state.spiritCaptureResult = null;
      state.phase = 'map';
      render();
      return;
    }
    const elInfo = SPIRIT_ELEMENTS[sp.element] || { label: '✨ 정령', color: '#38bdf8' };
    const ownedCount = state.spirits?.[sp.id] || 0;
    const rarityBadge = { common: '일반', rare: '레어', epic: '에픽', unique: '유니크' }[sp.rarity] || sp.rarity;
    const baseRates = { common: 75, rare: 55, epic: 35, unique: 20 };
    const baseRate = baseRates[sp.rarity] || 60;
    const snackRate = Math.min(95, baseRate + 35);
    const capRes = state.spiritCaptureResult;

    // V32.4 포켓몬식 단독 확대 스포트라이트 무대 (주인공/적/레벨배지 모두 숨기고 정령에 100% 집중!)
    setStageBg(null);
    if (elFrame) {
      elFrame.classList.add('spirit-capture-stage');
      if (capRes?.status === 'caught') elFrame.classList.add('spirit-caught-holo');
    }
    elHeroSprite.classList.add('hidden');
    if (elHeroLvBadge) elHeroLvBadge.classList.add('hidden');
    if (elEnemyLvBadge) elEnemyLvBadge.classList.add('hidden');
    if (elWildSpiritSprite) {
      elWildSpiritSprite.src = `${sp.img}?v=75`;
      elWildSpiritSprite.className = 'wild-spirit-sprite';
      if (capRes?.status === 'resonating') elWildSpiritSprite.classList.add('is-resonating');
      else if (capRes?.status === 'caught') elWildSpiritSprite.classList.add('is-caught-fly');
      else if (capRes?.status === 'escaped') elWildSpiritSprite.classList.add('is-escaped');
    }
    if (elCaptureStamp) {
      if (capRes?.status === 'caught') {
        elCaptureStamp.textContent = capRes.isNew ? `✨ GET! 도감 No.${String(sp.num).padStart(2, '0')} 등록!` : `✨ GET! ★${capRes.awakeLv} 각성!`;
        elCaptureStamp.classList.remove('hidden');
      } else {
        elCaptureStamp.classList.add('hidden');
      }
    }

    elLocation.textContent = '✨ 수호정령 포획 · SPIRIT CAPTURE';
    elSceneTag.textContent = `${elInfo.label} · ${rarityBadge}`;
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = capRes?.status === 'caught'
      ? `💥 ${capRes.isSummon ? '소환 성공!!' : '찰칵!!'} [${sp.name}] ${capRes.isSummon ? '강림!!' : '포획 성공!!'}`
      : capRes?.status === 'escaped'
        ? `💨 [${sp.name}] 이(가) 달아났다...`
        : capRes?.isSummon
          ? `✨ [${sp.name}] 소환 의식 중...`
          : `✨ 야생 [${sp.name}] 출현!`;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    if (!capRes) {
      elQuoteBubble.classList.remove('hidden');
      elQuoteBubble.textContent = `💬 "${sp.greet}"`;
    } else {
      elQuoteBubble.classList.add('hidden');
    }

    const finishEncounter = (msg) => {
      if (window._spiritTimingRaf) {
        cancelAnimationFrame(window._spiritTimingRaf);
        window._spiritTimingRaf = null;
      }
      state.pendingSpiritEncounter = null;
      state.spiritCaptureResult = null;
      state.phase = 'map';
      state.lastLog = msg;
      saveGame();
      render();
    };

    const runResonateCapture = (finalRate, expBonus = 0, label = '완장 공명') => {
      state.spiritCaptureResult = { status: 'resonating', label };
      render();
      setTimeout(() => {
        if (state.phase !== 'spirit_encounter') return;
        const success = Math.random() * 100 < finalRate;
        if (success) {
          const res = grantSpirit(sp.id, false);
          if (expBonus > 0) gainSpiritExp(sp.id, expBonus);
          sfx.victory?.();
          state.spiritCaptureResult = {
            status: 'caught',
            isNew: res.isNew,
            awakeLv: res.count,
            growthLv: getSpiritProgress(sp.id).lv,
          };
        } else {
          state.points += 15;
          gainHeroExp(15);
          sfx.hit?.();
          state.spiritCaptureResult = { status: 'escaped' };
        }
        saveGame();
        render();
      }, 950);
    };

    elChoicesPanel.className = 'choices-panel';
    elChoicesPanel.innerHTML = '';

    // C안: 교감 주파수 타이밍 미니게임
    if (capRes?.status === 'timing') {
      elBattleLog.innerHTML = `
        <div class="spirit-timing-wrap">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;">
            <span>💫 ${capRes.label} — 중앙 황금존에 맞춰 교감!</span>
            <span style="color:#fde047;">기본 ${capRes.baseRate}%</span>
          </div>
          <div class="spirit-timing-track">
            <div class="spirit-timing-cursor" id="spirit-timing-cursor" style="left:50%"></div>
          </div>
        </div>
      `;
      let pos = 10;
      let dir = 1;
      const startTs = performance.now();
      const step = (now) => {
        if (state.phase !== 'spirit_encounter' || state.spiritCaptureResult?.status !== 'timing') return;
        const dt = Math.min(40, now - (step.last || now));
        step.last = now;
        pos += dir * dt * 0.14;
        if (pos >= 98) { pos = 98; dir = -1; }
        else if (pos <= 2) { pos = 2; dir = 1; }
        const curEl = document.getElementById('spirit-timing-cursor');
        if (curEl) curEl.style.left = `${pos.toFixed(1)}%`;
        window._spiritTimingRaf = requestAnimationFrame(step);
      };
      if (window._spiritTimingRaf) cancelAnimationFrame(window._spiritTimingRaf);
      window._spiritTimingRaf = requestAnimationFrame(step);

      const stopBtn = document.createElement('button');
      stopBtn.className = 'choice-btn primary';
      stopBtn.innerHTML = `<span class="choice-title">⚡ 지금 교감!! (타이밍 맞추기)</span><span class="choice-sub">🎯 중앙 골드존 +25% · ✨ 초록존 +10% 보너스!</span>`;
      stopBtn.onclick = () => {
        if (window._spiritTimingRaf) {
          cancelAnimationFrame(window._spiritTimingRaf);
          window._spiritTimingRaf = null;
        }
        let bonus = 0;
        if (pos >= 39 && pos <= 61) {
          bonus = 25;
          showToast('🎯 PERFECT 교감!! 포획률 +25%!', 'break');
        } else if (pos >= 22 && pos <= 78) {
          bonus = 10;
          showToast('✨ GOOD 교감! 포획률 +10%!', 'good');
        } else {
          showToast('💨 아슬아슬! 기본 확률로 교감 시도!', 'warn');
        }
        sfx.powerup?.();
        runResonateCapture(Math.min(100, capRes.baseRate + bonus), capRes.expBonus, capRes.label);
      };
      elChoicesPanel.appendChild(stopBtn);
      return;
    }

    if (capRes?.status === 'resonating') {
      elBattleLog.textContent = `✨ [${capRes.label}] 빛이 야생 ${sp.name}을(를) 감싸며 공명하고 있습니다... 두근두근!!`;
      const waitBtn = document.createElement('button');
      waitBtn.className = 'choice-btn';
      waitBtn.disabled = true;
      waitBtn.innerHTML = `<span class="choice-title">⏳ 교감 공명 중...</span><span class="choice-sub">정령이 완장의 부름에 응답하고 있습니다!</span>`;
      elChoicesPanel.appendChild(waitBtn);
      return;
    }

    if (capRes?.status === 'caught') {
      const prevNick = state.spiritNicknames?.[sp.id] || '';
      elBattleLog.textContent =
        `🎉 야생 [${sp.name}]을(를) 잡았다! (Lv.${capRes.growthLv}/20 · ★${capRes.awakeLv})\n` +
        `⚔️ 공격 +${sp.atk} · 🫧 사이다 +${sp.spRegen} · ★ 특수: ${sp.perkDesc}\n` +
        `💫 이 정령에게 특별한 별명을 지어줄까요?`;

      const nickInput = document.createElement('input');
      nickInput.type = 'text';
      nickInput.maxLength = 14;
      nickInput.className = 'spirit-nick-input';
      nickInput.value = prevNick;
      nickInput.placeholder = `별명 입력 (비워두면 '${sp.name}' 사용)`;
      elChoicesPanel.appendChild(nickInput);

      const saveNick = () => {
        const val = nickInput.value.trim();
        if (!state.spiritNicknames) state.spiritNicknames = {};
        if (val) state.spiritNicknames[sp.id] = val;
      };

      const btnNowEquip = document.createElement('button');
      btnNowEquip.className = 'choice-btn primary';
      btnNowEquip.innerHTML = `<span class="choice-title">✨ 이 이름으로 바로 동행하기!</span><span class="choice-sub">별명을 저장하고 전투 파트너로 즉시 장착합니다.</span>`;
      btnNowEquip.onclick = () => {
        saveNick();
        state.equippedSpirit = sp.id;
        sfx.powerup?.();
        finishEncounter(`💥 ${getSpiritDisplayName(sp)} 포획 & 동행 시작!`);
      };
      const btnKeepOnly = document.createElement('button');
      btnKeepOnly.className = 'choice-btn';
      btnKeepOnly.innerHTML = `<span class="choice-title">📖 이름 저장하고 도감에 보관하기</span><span class="choice-sub">현재 동행 중인 정령을 유지합니다.</span>`;
      btnKeepOnly.onclick = () => {
        saveNick();
        sfx.click?.();
        finishEncounter(`📖 ${getSpiritDisplayName(sp)} 도감 등록 완료!`);
      };
      elChoicesPanel.append(btnNowEquip, btnKeepOnly);
      return;
    }

    if (capRes?.status === 'escaped') {
      elBattleLog.textContent = `💨 아쉽다! [${sp.name}] 이(가) 완장 빛을 튕겨내고 서울 하늘로 사라졌습니다.\n(위로 보상: 도덕P +15 · 영웅 EXP +15)`;
      const btnBack = document.createElement('button');
      btnBack.className = 'choice-btn primary';
      btnBack.innerHTML = `<span class="choice-title">🗺️ 맵으로 돌아가기</span><span class="choice-sub">다음 순찰에서 다시 만나자!</span>`;
      btnBack.onclick = () => finishEncounter(`💨 ${sp.name} 포획 실패... (위로 보상 +15P · EXP +15)`);
      elChoicesPanel.appendChild(btnBack);
      return;
    }

    // 초기 조우 화면: 잘림 없는 깔끔한 텍스트 요약 (이미지는 위 무대 풀활용!)
    elBattleLog.textContent =
      `[${elInfo.label} · ${rarityBadge}] ${sp.name}${ownedCount > 0 ? ` (★${ownedCount} 보유 중)` : ' (미등록 야생 정령!)'}\n` +
      `⚔️ 공+${sp.atk} · 🫧 SP+${sp.spRegen} · 💥 치명+${Math.round(sp.crit * 100)}% | 📍 ${sp.zoneHint || '서울 전역'}\n` +
      `★ 특수 기술: ${sp.perkDesc || '전투 시 동행 지원'}`;

    const startTimingCapture = (rate, cost, label, expBonus = 0) => {
      if (cost > 0 && state.points < cost) return;
      if (cost > 0) state.points -= cost;
      sfx.click?.();
      state.spiritCaptureResult = { status: 'timing', baseRate: rate, label, expBonus };
      render();
    };

    const btnFree = document.createElement('button');
    btnFree.className = 'choice-btn primary';
    btnFree.innerHTML = `<span class="choice-title">✨ 맨손 교감 포획 (무료 · 기본 ${baseRate}% + 타이밍!)</span><span class="choice-sub">교감 주파수를 맞추면 최대 +25% 보너스!</span>`;
    btnFree.onclick = () => startTimingCapture(baseRate, 0, '맨손 교감');

    const canSnack = state.points >= 300;
    const btnSnack = document.createElement('button');
    btnSnack.className = 'choice-btn';
    btnSnack.disabled = !canSnack;
    btnSnack.innerHTML = `<span class="choice-title">🍡 정령 간식 꼬시기 (300P · 기본 ${snackRate}% + 타이밍!)</span><span class="choice-sub">${canSnack ? '간식으로 유인 + 성공 시 정령 EXP +60 보너스!' : '도덕P가 부족합니다 (300P 필요)'}</span>`;
    btnSnack.onclick = () => startTimingCapture(snackRate, 300, '달콤한 간식 교감', 60);

    const canMaster = state.points >= 800;
    const btnMaster = document.createElement('button');
    btnMaster.className = 'choice-btn';
    btnMaster.disabled = !canMaster;
    btnMaster.innerHTML = `<span class="choice-title">🟡 황금 완장 봉인구 (800P · 100% 즉시 확정!)</span><span class="choice-sub">${canMaster ? '타이밍 없이 100% 확정 포획 + 정령 EXP +80!' : '도덕P가 부족합니다 (800P 필요)'}</span>`;
    btnMaster.onclick = () => {
      if (state.points < 800) return;
      state.points -= 800;
      sfx.click?.();
      runResonateCapture(100, 80, '황금 완장 봉인구');
    };

    const btnRelease = document.createElement('button');
    btnRelease.className = 'choice-btn';
    btnRelease.innerHTML = `<span class="choice-title">🍃 조용히 보내주기 (사이다 +30 · 평판 +2)</span><span class="choice-sub">정령의 기운만 받고 자유롭게 보내줍니다.</span>`;
    btnRelease.onclick = () => {
      state.sp = clamp(state.sp + 30, 0, state.maxSp);
      state.rep += 2;
      sfx.click?.();
      finishEncounter(`🍃 ${sp.name}을(를) 자유롭게 보내주었습니다. (사이다 +30, 평판 +2)`);
    };

    elChoicesPanel.append(btnFree, btnSnack, btnMaster, btnRelease);
    return;
  }

  // 1. 타이틀 화면
  if (state.phase === 'title') {
    const saved = loadSavedGame();
    elLocation.textContent = 'SEOUL 2026 · TEXT GTA';
    elSceneTag.textContent = '타이틀';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = '시민영웅: 예절 수호자';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    showSceneCard(
      'CITIZEN HERO · SEOUL 2026',
      '┏━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🛡️ 시민영웅: 예절 수호자   ┃\n┃   서울 2026 공중도덕 정화기  ┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n   🚬   💦   🚇   🎬   🔥',
      '스토리 + 자유도 + 성향 분기 오픈월드 RPG'
    );
    elBattleLog.textContent =
      '2026년 서울, 시간대별 거리 순찰·알바·성향 분기·스마트폰 미션이 결합된 텍스트 GTA!\n\n' +
      (saved
        ? `💾 저장 기록: [DAY ${saved.day} · ${TIME_SLOTS[saved.timeIndex || 0]}] 보스 ${saved.defeatedBossIds?.length || 0}/4`
        : '💾 저장된 게임 기록이 없습니다. 새 게임을 시작하세요!');

    elChoicesPanel.className = 'choices-panel';

    // V24.0 가장 초창기 화면 난이도 선택 (노멀 / 하드 / 헬)
    if (!state.difficulty) state.difficulty = 'normal';
    const diffRow = document.createElement('div');
    diffRow.style.display = 'flex';
    diffRow.style.gap = '4px';
    Object.values(DIFFICULTIES).forEach((df) => {
      const db = document.createElement('button');
      db.className = 'choice-btn';
      db.style.flex = '1';
      db.style.padding = '7px 4px';
      if (state.difficulty === df.id) {
        db.style.background = '#e7d5b1';
        db.style.borderColor = '#9e2a2b';
      }
      db.innerHTML = `<span style="font-size:0.76rem;text-align:center;">${df.name}</span>`;
      db.addEventListener('click', () => {
        sfx.click();
        state.difficulty = df.id;
        state.log = `[${df.name}] ${df.desc}`;
        render();
      });
      diffRow.appendChild(db);
    });
    elChoicesPanel.appendChild(diffRow);

    const pickedDiff = getDiffObj();
    const btnNew = document.createElement('button');
    btnNew.className = 'choice-btn row-btn';
    btnNew.innerHTML = `<span>▶ 새 게임 시작 (${pickedDiff.name})</span><span class="choice-sub">NEW GAME</span>`;
    btnNew.addEventListener('click', () => {
      sfx.click();
      vibrate(25);
      const selDiff = state.difficulty || 'normal';
      state = createNewGameState();
      state.difficulty = selDiff;
      render();
    });

    const unlockedEndCnt = loadUnlockedEndings().length;
    if (unlockedEndCnt > 0) {
      const btnNg = document.createElement('button');
      btnNg.className = 'choice-btn row-btn';
      btnNg.style.background = 'linear-gradient(180deg, #fff6df 0%, #fde4a6 100%)';
      btnNg.style.borderColor = '#b07d2b';
      const bonusStat = Math.min(8, unlockedEndCnt * 2);
      btnNg.innerHTML = `<span>🔄 2회차 계승 시작 (${pickedDiff.name} · 엔딩 ${unlockedEndCnt}종)</span><span class="choice-sub">전스탯+${bonusStat} · +120P · 💕 유키/클로이 1일차 즉시 해금!</span>`;
      btnNg.addEventListener('click', () => {
        sfx.powerup();
        const selDiff = state.difficulty || 'normal';
        state = createNewGameState();
        state.difficulty = selDiff;
        state.ngPlus = 1;
        state.stats.speech += bonusStat;
        state.stats.guts += bonusStat;
        state.stats.law += bonusStat;
        state.points += 120;
        render();
      });
      elChoicesPanel.appendChild(btnNg);
    }
    elChoicesPanel.appendChild(btnNew);

    const btnLoad = document.createElement('button');
    btnLoad.className = 'choice-btn row-btn';
    btnLoad.disabled = !saved;
    btnLoad.innerHTML = `<span>📂 빠른 이어하기</span><span class="choice-sub">${saved ? `DAY ${saved.day} 이어서` : '기록 없음'}</span>`;
    btnLoad.addEventListener('click', () => {
      if (!saved) return;
      sfx.powerup();
      vibrate(30);
      state = { ...createNewGameState(), ...saved };
      render();
    });
    elChoicesPanel.appendChild(btnLoad);

    const btnSlots = document.createElement('button');
    btnSlots.className = 'choice-btn row-btn';
    btnSlots.innerHTML = '<span>💾 세이브 슬롯 (1~10번)</span><span class="choice-sub">불러오기</span>';
    btnSlots.addEventListener('click', () => {
      sfx.click();
      openSaveModal(false);
    });
    elChoicesPanel.appendChild(btnSlots);

    const unlockedCount = loadUnlockedEndings().length;
    const btnEndings = document.createElement('button');
    btnEndings.className = 'choice-btn row-btn';
    btnEndings.innerHTML = `<span>🏆 엔딩 도감 & 힌트 (${unlockedCount}/15)</span><span class="choice-sub">멀티 엔딩</span>`;
    btnEndings.addEventListener('click', () => {
      sfx.click();
      openEndingsModal();
    });
    elChoicesPanel.appendChild(btnEndings);

    const btnOpenSet = document.createElement('button');
    btnOpenSet.className = 'choice-btn row-btn';
    btnOpenSet.innerHTML = '<span>⚙️ 환경 설정 (사운드 / 진동 / 초기화)</span><span class="choice-sub">SETTINGS</span>';
    btnOpenSet.addEventListener('click', () => {
      sfx.click();
      openSettingsModal();
    });
    elChoicesPanel.appendChild(btnOpenSet);
    return;
  }

  // 2. 프롤로그 1 — V26.1 콜드 오픈 (시작 1초 만에 현장 난입!)
  if (state.phase === 'prologue_1') {
    elLocation.textContent = '긴급 상황 · 토요일 오전 8:00';
    elSceneTag.textContent = '현장 난입!';
    elSceneTag.className = 'scene-tag boss';
    elSceneTitle.textContent = '🚨 편의점 앞, 할머니를 밀친 빌런!';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = '"아 할매요~ 느려터져서 못 기다리겠네! 비켜요!" (쇼츠 풀볼륨 🔊)';
    elQuoteBubble.classList.remove('hidden');
    elSceneImage.src = 'assets/images/shorts_terrorist.jpg';
    elSceneImage.classList.remove('hidden');
    elSceneCard.classList.add('hidden');
    setLogText(
      '주말 아침, 24시 편의점 계산대 앞.\n' +
      '동네 할머니를 어깨로 밀치고 새치기하며 휴대폰 쇼츠를 풀볼륨으로 틀어댄 빌런이 비웃고 있습니다.\n' +
      '손목에 묶인 노란 완장이 뜨겁게 달아오릅니다. 지금 바로 참교육하시겠습니까?',
      true
    );

    elChoicesPanel.className = 'choices-panel';
    [
      {
        text: '💥 "어르신한테 뭐 하는 짓입니까?!" (즉시 참교육!)',
        sub: '사이다 일침 · 광인+5 · 배짱+1',
        run: () => { state.chaotic += 5; state.stats.guts += 1; },
      },
      {
        text: '📸 "방금 밀친 거 다 찍혔습니다. 사과하세요!"',
        sub: '완벽 채증 · 모범+5 · 법률+1',
        run: () => { state.lawful += 5; state.stats.law += 1; state.pendingReports += 1; },
      },
    ].forEach((c) => {
      const b = document.createElement('button');
      b.className = 'choice-btn row-btn story-main-btn';
      b.innerHTML = `<span>${c.text}</span><span class="choice-sub">${c.sub}</span>`;
      b.addEventListener('click', () => {
        sfx.hit(true);
        vibrate(45);
        showToast('💥 1방 참교육 적중!! 빌런 멘탈 붕괴!', 'break');
        c.run();
        state.followers = (state.followers || 120) + 1080;
        state.points += 30;
        state.liveFeed = {
          badge: '🔥 실시간 12만뷰',
          likes: '❤️ 4.8만',
          title: '편의점 앞 노란 완장 청년, 5초 만에 진상 참교육 ㄷㄷ',
          comment: '💬 베댓: "와 포스 지렸다... 누구냐 저 영웅?!"',
        };
        state.phase = 'prologue_cold_hit';
        render();
      });
      elChoicesPanel.appendChild(b);
    });
    return;
  }

  // 2.2. 콜드 오픈 직후 — 바이럴 폭발 & 실종된 1대 시민영웅 미스터리
  if (state.phase === 'prologue_cold_hit') {
    elLocation.textContent = '서울 속보 · 파출소 김순경 합류';
    elSceneTag.textContent = '미스터리';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = '🕵️ "그 노란 완장... 설마?!"';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = '"잠깐! 그 완장은 3년 전 실종된 [1대 시민영웅]의 것인데?!"';
    elQuoteBubble.classList.remove('hidden');
    elSceneImage.src = 'assets/images/hero_idle.png';
    elSceneImage.classList.remove('hidden', 'enemy-sprite', 'boss-scale');
    if (elFrame) elFrame.classList.add('story-stage');
    elSceneCard.classList.add('hidden');
    setLogText(
      '빌런이 쩔쩔매며 도망가고, 시민들이 찍은 영상이 순식간에 SNS 팔로워 1,200명 돌파!\n' +
      '그때 달려온 김순경이 당신의 노란 완장을 보고 굳어버립니다.\n' +
      '"3년 전, 비밀 조직 [블랙튜브 MCN]을 쫓다 사라진 전설의 선배... 최근 서울에 빌런이 폭증한 것도 그 놈들 짓입니다!"',
      true
    );
    elChoicesPanel.className = 'choices-panel';
    const btnNext = document.createElement('button');
    btnNext.className = 'choice-btn row-btn';
    btnNext.innerHTML = '<span>🟡 선배가 완장을 남긴 3년 전 그날을 떠올린다...</span><span class="choice-sub">과거 회상 ▶</span>';
    btnNext.addEventListener('click', () => {
      sfx.click();
      state.phase = 'prologue_past';
      render();
    });
    elChoicesPanel.appendChild(btnNext);
    return;
  }

  // 2.5. 프롤로그 과거 회상 (노란 완장의 비밀)
  if (state.phase === 'prologue_past') {
    elLocation.textContent = '회상 · 3년 전 빗속';
    elSceneTag.textContent = '과거 회상';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = '🌧️ 노란 완장을 물려받은 날';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = '"아무도 안 나서면 결국 선량한 사람만 다쳐. 자, 이 완장 받아라."';
    elQuoteBubble.classList.remove('hidden');
    elSceneImage.src = 'assets/images/hero_idle.png';
    elSceneImage.classList.remove('hidden');
    elSceneCard.classList.add('hidden');
    setLogText(
      '3년 전 폭우 속, 무개념 빌런 때문에 인생 면접을 망치고 주저앉아 있던 당신에게\n' +
      '노란 완장을 건네주고 사라진 [전설의 1대 시민영웅].\n' +
      '선배의 실종 비밀과 서울을 오염시킨 흑막을 파헤치기 위해, 당신의 신념을 정하세요!',
      true
    );

    elChoicesPanel.className = 'choices-panel';
    const pastChoices = [
      {
        text: '⚖️ "법과 질서, 완벽한 채증으로 정면 승부한다!"',
        sub: '모범시민 +10 · 법률 +1',
        run: () => { state.lawful += 10; state.stats.law += 1; },
      },
      {
        text: '🔥 "법이 늦으면 내 사이다가 먼저 날아간다!"',
        sub: '광인 +10 · 배짱 +1',
        run: () => { state.chaotic += 10; state.stats.guts += 1; },
      },
    ];
    pastChoices.forEach((pc) => {
      const b = document.createElement('button');
      b.className = 'choice-btn row-btn';
      b.innerHTML = `<span>${pc.text}</span><span class="choice-sub">${pc.sub}</span>`;
      b.addEventListener('click', () => {
        sfx.powerup();
        pc.run();
        state.phase = 'prologue_2';
        render();
      });
      elChoicesPanel.appendChild(b);
    });
    return;
  }

  // 3. 프롤로그 2
  if (state.phase === 'prologue_2') {
    elLocation.textContent = '프롤로그 · 각성';
    elSceneTag.textContent = '장비 선택';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = '예절 수호자의 출격';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    showSceneCard(
      'PROLOGUE · 출격 준비',
      '  🎒 [ 참교육 장비 보관함 ]  \n   🔫 물총  ·  📢 메가폰  ·  🪞 거울\n  ───────────────────────\n     "정의 구현 준비 완료!"',
      '가장 마음에 드는 초기 장비를 선택하세요'
    );
    elBattleLog.textContent =
      '상단의 [📱] 버튼을 누르면 톡방 미션, 안전신문고 신고, 성향(모범시민 vs 광인)을 언제든 확인할 수 있습니다.\n' +
      '가방에 챙길 첫 번째 참교육 장비를 선택하세요!';

    elChoicesPanel.className = 'choices-panel';
    ['water_gun', 'megaphone', 'mirror'].forEach((id) => {
      const item = ITEMS[id];
      const btn = document.createElement('button');
      btn.className = 'choice-btn row-btn';
      btn.innerHTML = `<span>${item.name}</span><span class="choice-sub">${id === 'water_gun' ? '기절 특화' : id === 'megaphone' ? '고화력+사이다' : '피해+회복'}</span>`;
      btn.addEventListener('click', () => {
        sfx.powerup();
        vibrate(30);
        state.inventory.push(id);
        state.phase = 'map';
        state.log = `[${item.name}] 장착 완료! 상단 [📱] 알림을 확인하거나 자유롭게 서울 거리를 누벼보세요!`;
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(btn);
    });
    return;
  }

  // 4. 오픈월드 서울 맵
  // 3.5. 흑막 추적 중간 스토리 컷신
  if (state.phase === 'map' && state.pendingInterlude) {
    state.phase = 'story_interlude';
  }
  if (state.phase === 'story_interlude') {
    const intId = state.pendingInterlude || 'interlude_1';
    const iv = STORY_INTERLUDES[intId] || STORY_INTERLUDES.interlude_1;
    elLocation.textContent = `DAY ${state.day} · ${timeLabel} · 메인 스토리`;
    elSceneTag.textContent = '긴급 막간';
    elSceneTag.className = 'scene-tag boss';
    elSceneTitle.textContent = iv.title;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = iv.quote;
    elQuoteBubble.classList.remove('hidden');
    showSceneCard(iv.badge, iv.ascii, '흑막 추적 진실에 한 걸음 더 다가갔다');
    elBattleLog.textContent = iv.text;
    elChoicesPanel.className = 'choices-panel';
    iv.choices.forEach((ch) => {
      const b = document.createElement('button');
      b.className = 'choice-btn row-btn';
      b.innerHTML = `<span>${ch.text}</span><span class="choice-sub">${ch.sub}</span>`;
      b.addEventListener('click', () => {
        sfx.powerup();
        if (!state.seenInterludes) state.seenInterludes = [];
        if (!state.seenInterludes.includes(intId)) state.seenInterludes.push(intId);
        state.pendingInterlude = null;
        if (ch.lawful) state.lawful += ch.lawful;
        if (ch.chaotic) state.chaotic += ch.chaotic;
        if (ch.law) state.stats.law += ch.law;
        if (ch.guts) state.stats.guts += ch.guts;
        if (ch.sp) state.sp = clamp(state.sp + ch.sp, 0, state.maxSp);
        if (ch.bonusDmg) state.bonusDmg += ch.bonusDmg;
        if (ch.fullHeal) {
          state.maxHp += 15;
          state.hp = state.maxHp;
          state.sp = clamp(state.sp + 30, 0, state.maxSp);
        }
        state.phase = 'map';
        state.log = `📖 [${iv.title}] 기록 완료!`;
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(b);
    });
    return;
  }

  // 3.6. V23.0 주말 특별 이벤트 & 주간 결산
  if (state.phase === 'map' && state.pendingWeekend) {
    state.phase = 'weekend_event';
  }
  if (state.phase === 'weekend_event') {
    const availWeekend = WEEKEND_EVENTS.filter((w) => !w.requireHeroine || isFeatureUnlocked(state, w.requireHeroine));
    const idx = Math.floor((state.day / 7 - 1)) % availWeekend.length;
    const wv = availWeekend[Math.max(0, idx)] || WEEKEND_EVENTS[0];
    const chaos = state.chaosLevel ?? 25;
    const weeklyGrade = chaos <= 25 ? 'S (모범 도시! +50P)' : (chaos <= 55 ? 'A (안정적! +25P)' : 'B (분발 필요!)');
    elLocation.textContent = `DAY ${state.day} · ${timeLabel} · 주말 특별`;
    elSceneTag.textContent = '주말 축제';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = wv.title;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = wv.quote;
    elQuoteBubble.classList.remove('hidden');
    showSceneCard(wv.badge, wv.ascii, `주간 민폐도 성적표: ${weeklyGrade}`);
    elBattleLog.textContent = wv.text;
    elChoicesPanel.className = 'choices-panel';
    wv.choices.forEach((ch) => {
      const b = document.createElement('button');
      b.className = 'choice-btn row-btn';
      b.innerHTML = `<span>${ch.text}</span><span class="choice-sub">${ch.sub}</span>`;
      b.addEventListener('click', () => {
        sfx.victory();
        state.pendingWeekend = false;
        const weekBonus = chaos <= 25 ? 50 : (chaos <= 55 ? 25 : 0);
        if (ch.points) state.points += ch.points + weekBonus;
        if (ch.chaos) state.chaosLevel = clamp((state.chaosLevel ?? 25) + ch.chaos, 0, 100);
        if (ch.lawful) state.lawful += ch.lawful;
        if (ch.chaotic) state.chaotic += ch.chaotic;
        if (ch.followers) state.followers = (state.followers || 120) + ch.followers;
        if (ch.sp) state.sp = clamp(state.sp + ch.sp, 0, state.maxSp);
        if (ch.guts) state.stats.guts += ch.guts;
        if (ch.maxHp) { state.maxHp += ch.maxHp; state.hp = clamp(state.hp + ch.maxHp, 1, state.maxHp); }
        if (ch.fullHeal) state.hp = state.maxHp;
        if (ch.yukiLove && isFeatureUnlocked(state, 'yuki')) state.love.yuki = clamp((state.love.yuki || 0) + ch.yukiLove, 0, state.someCleared?.yuki ? 100 : 75);
        if (ch.chloeLove && isFeatureUnlocked(state, 'chloe')) state.love.chloe = clamp((state.love.chloe || 0) + ch.chloeLove, 0, state.someCleared?.chloe ? 100 : 75);
        state.phase = 'map';
        state.log = `🎉 주말 특별 이벤트 완료!${weekBonus > 0 ? ` (주간 성적표 보너스 +${weekBonus} P)` : ''}`;
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(b);
    });
    return;
  }

  if (state.phase === 'map') {
    const rep = getReputationInfo();
    const fObj = DAILY_FORTUNES.find((f) => f.id === (state.dailyFortune || 'gold')) || DAILY_FORTUNES[0];
    const curActIdHud = state.currentAct || 'seoul';
    const actShortMap = { jeonju: '🍲 전주', pyeongtaek: '🚆 평택', dongtan: '🏙️ 동탄', incheon: '😈 마계 인천', seoul: '👑 서울' };
    const actShortLbl = actShortMap[curActIdHud] || '👑 서울';
    elLocation.textContent = `DAY ${state.day} · 📍${actShortLbl} · ${timeLabel}`;
    elSceneTag.textContent = `${actShortLbl} 맵`;
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = `📍 현재 위치: ${actShortLbl} (${rep.label})`;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    const bTag = (id) => (state.defeatedBossIds.includes(id) ? '✅' : '🔥');
    const chaos = state.chaosLevel ?? 25;
    const chaosTag = chaos >= 90 ? '🚨비상!' : chaos >= 70 ? '⚠️경계' : chaos <= 30 ? '✨쾌적' : '보통';
    elSeoulMinimap.classList.remove('hidden');
    const curActId = state.currentAct || 'seoul';
    const pinLbl = ACT_PIN_LABELS[curActId] || ACT_PIN_LABELS.seoul;
    if (curActId !== 'seoul') {
      elSeoulMinimap.style.backgroundImage = `linear-gradient(rgba(15,23,42,0.28), rgba(15,23,42,0.28)), url('assets/images/ui/bg_${curActId}.jpg?v=104')`;
      elSeoulMinimap.style.backgroundSize = 'cover';
      elSeoulMinimap.style.backgroundPosition = 'center';
    } else {
      elSeoulMinimap.style.backgroundImage = '';
    }
    const elLandmark = elSeoulMinimap.querySelector('.map-namsan');
    if (elLandmark) elLandmark.textContent = pinLbl.landmark;
    const elRiver = elSeoulMinimap.querySelector('.map-river');
    if (elRiver) elRiver.textContent = pinLbl.river;
    elSeoulMinimap.querySelectorAll('.map-pin').forEach((pin) => {
      const loc = pin.dataset.loc;
      const sm = pin.querySelector('small');
      if (sm && pinLbl[loc]) sm.textContent = pinLbl[loc];
    });
    elMinimapChaos.textContent = `🌆${chaos}%(${chaosTag})`;
    elMinimapFollowers.textContent = `📱${(state.followers || 120).toLocaleString()}명`;
    elMinimapBosses.textContent = `${bTag('street_smoker')}홍대 ${bTag('subway_manspreader')}2호선 ${bTag('cinema_boss')}영화관 ${bTag('cafe_boss')}카페(${state.defeatedBossIds.length}/4)`;

    const activeLoc = state.mapLoc || 'heal';
    elSeoulMinimap.querySelectorAll('.map-pin').forEach((pin) => {
      pin.classList.toggle('active-pin', pin.dataset.loc === activeLoc);
    });
    animateChibiTo(activeLoc);

    if (!state.dailyQuests || state.dailyQuests.day !== state.day) rollDailyQuests();
    ensureSandboxState();
    const dqLine = state.dailyQuests.claimed
      ? '🎯 오늘의 미션: ✅ 올클리어 완료!'
      : `🎯 오늘의 미션: ${state.dailyQuests.items.map((x) => `${x.label}(${x.cur}/${x.goal})`).join(' · ')}`;
    const repLine = `🏅 명성 ${state.fame || 0} · 😈 악명 ${state.infamy || 0} | 🤫은신${state.skills.sneak} 🗣️화술${state.skills.speech} 🧪연금${state.skills.alchemy} 🥊격투${state.skills.combat}`;
    const rumorLine = state.rumor ? `\n📰 [서울 소문] ${state.rumor}` : '';
    elBattleLog.textContent = (state.log || '전국 오픈월드 지도입니다. 위 미니맵 핀을 직접 눌러 장소별 자유행동을 선택해보세요!') + `\n${repLine}\n${dqLine}${rumorLine}`;

    elChoicesPanel.className = 'choices-panel grid-2';

    if (state.pendingLevelUp && elActivityModal?.classList.contains('hidden')) {
      setTimeout(() => {
        if (state.phase === 'map' && state.pendingLevelUp) openLevelUpModal();
      }, 80);
    }

    // V42.0: 타 지역 긴급 SOS 지원 요청 배너
    if (state.phase === 'map' && state.pendingSos) {
      const sosAct = KOREA_ACTS.find((a) => a.id === state.pendingSos.actId);
      if (sosAct) {
        const sosBtn = document.createElement('button');
        sosBtn.className = 'choice-btn row-btn breaking-banner';
        sosBtn.style.gridColumn = 'span 2';
        sosBtn.innerHTML = `<span>🚨 [긴급 SOS!!] ${sosAct.name} 지부 지원 요청!</span><span class="choice-sub">즉시 출동해 격퇴 시 +100P · 명성 +3!! ▶</span>`;
        sosBtn.addEventListener('click', () => {
          const eId = state.pendingSos.enemyId;
          state.currentAct = sosAct.id;
          state.pendingSos = null;
          state.points += 100;
          state.fame = (state.fame || 0) + 3;
          sfx.powerup();
          showToast(`🚨 ${sosAct.name} 긴급 출동!! (선지급 +100P · 명성 +3)`, 'break');
          startBattle(eId, true);
        });
        elChoicesPanel.appendChild(sosBtn);
      }
    }

    // V38.0: 히로인 실시간 선톡(DM) 알림 배너
    if (state.phase === 'map' && state.pendingDm) {
      const dmH = state.pendingDm === 'chloe' ? '🇺🇸 클로이' : '🇯🇵 유키';
      const dmBtn = document.createElement('button');
      dmBtn.className = 'choice-btn row-btn';
      dmBtn.style.gridColumn = 'span 2';
      dmBtn.style.background = 'linear-gradient(180deg, #fff0f6 0%, #ffd6e7 100%)';
      dmBtn.style.borderColor = '#eb2f96';
      dmBtn.innerHTML = `<span>📱 [카톡!] ${dmH}에게 선톡이 왔습니다!</span><span class="choice-sub" style="color:#9e1068;">지금 답장해서 돌발 데이트 잡기 ▶</span>`;
      dmBtn.addEventListener('click', () => {
        sfx.powerup();
        openHeroineDmModal();
      });
      elChoicesPanel.appendChild(dmBtn);
    }

    // V26.1 실시간 서울 112 긴급 속보 배너 (1일차 첫 진입 시 100% 자동 출몰)
    if (!state.breakingNews && state.day === 1 && !state.breakingFirstDone) {
      rollBreakingNews();
    }
    if (state.invadedDistrict) {
      const inv = state.invadedDistrict;
      const invBtn = document.createElement('button');
      invBtn.className = 'choice-btn row-btn breaking-banner';
      invBtn.style.gridColumn = 'span 2';
      invBtn.innerHTML = `<span>🛡️ [구역 역습 디펜스!!] ${inv.name} 블랙튜브 잔당 침입!</span><span class="choice-sub">격퇴 시 +150P · 강화석 +3 · 확정 장비! ▶</span>`;
      invBtn.addEventListener('click', () => {
        sfx.powerup();
        startBattle(inv.enemyId, true);
      });
      elChoicesPanel.appendChild(invBtn);
    }

    if (state.breakingNews) {
      const bn = state.breakingNews;
      const bnBtn = document.createElement('button');
      bnBtn.className = 'choice-btn row-btn breaking-banner';
      bnBtn.style.gridColumn = 'span 2';
      bnBtn.innerHTML = `<span>🔴 [112 긴급 속보] ${bn.districtName} · ${bn.enemyName} 난동!</span><span class="choice-sub">즉시 출동 시 +${bn.bonusPts}P · 구역치안+15% ▶</span>`;
      bnBtn.addEventListener('click', () => {
        sfx.powerup();
        startBattle(bn.enemyId, true);
      });
      elChoicesPanel.appendChild(bnBtn);
    }

    if (state.guerrilla) {
      const gv = getEnemyById(state.guerrilla.villainId);
      const dLeft = Math.max(0, state.guerrilla.expiresDay - state.day);
      const gBtn = document.createElement('button');
      gBtn.className = 'choice-btn row-btn guard-btn';
      gBtn.style.gridColumn = 'span 2';
      gBtn.innerHTML = `<span>🚨 [지명수배 D-${dLeft}] ${gv.name}</span><span class="choice-sub">현상금 +40P · 방치 시 민폐도+15%!</span>`;
      gBtn.addEventListener('click', () => {
        sfx.powerup();
        startBattle(gv.id, true);
      });
      elChoicesPanel.appendChild(gBtn);
    }

    const currentCh = STORY_CHAPTERS[state.chapterIndex];
    if (currentCh) {
      const mState = checkChapterMission(currentCh.mission);
      const storyBtn = document.createElement('button');
      storyBtn.style.gridColumn = 'span 2';
      if (mState.done && state.lastMainStoryDay === state.day) {
        storyBtn.className = 'choice-btn row-btn story-locked-btn';
        storyBtn.innerHTML = `<span>⏳ [제${currentCh.chapterNum}화] ${currentCh.title}</span><span class="choice-sub">오늘 스토리 완료 · 내일(DAY ${state.day + 1}) 개방!</span>`;
        storyBtn.addEventListener('click', () => {
          sfx.click();
          showToast(`📅 메인 스토리는 하루 1화씩! 내일(DAY ${state.day + 1})에 이어집니다.`, 'warn');
        });
      } else if (mState.done) {
        storyBtn.className = 'choice-btn row-btn story-main-btn';
        storyBtn.innerHTML = `<span>📖 [제${currentCh.chapterNum}화] ${currentCh.title}</span><span class="choice-sub" style="color:#6e480f;">✨ 해금됨! 진행 ▶</span>`;
        storyBtn.addEventListener('click', () => {
          sfx.powerup();
          state.lastCutscene = null;
          state.phase = 'story';
          state.storySceneIndex = 0;
          render();
        });
      } else {
        storyBtn.className = 'choice-btn row-btn story-locked-btn';
        storyBtn.innerHTML = `<span>🔒 [제${currentCh.chapterNum}화 미션] ${currentCh.mission.label}</span><span class="choice-sub">${mState.progress}</span>`;
        storyBtn.addEventListener('click', () => {
          sfx.click();
          state.log = `📌 [제${currentCh.chapterNum}화 해금 조건] ${currentCh.mission.label} (현재: ${mState.progress})\n아래 6개 자유행동으로 미션을 달성하세요!`;
          render();
        });
      }
      elChoicesPanel.appendChild(storyBtn);
    }

    // V40.0: 전국 5대 액트 대장정 (전주 → 평택 → 동탄 → 마계 인천 → 서울) 배너
    ensureNationalState();
    const curAct = KOREA_ACTS.find((a) => a.id === (state.currentAct || 'seoul')) || KOREA_ACTS[4];
    const actBanner = document.createElement('button');
    actBanner.className = 'choice-btn';
    actBanner.style.gridColumn = '';
    actBanner.style.background = 'linear-gradient(180deg, #eef2ff 0%, #e0e7ff 100%)';
    actBanner.style.borderColor = '#4f46e5';
    actBanner.innerHTML = `<span>🚄 ${curAct.name}</span><span class="choice-sub" style="color:#3730a3;">지역이동 · 던전 · 무역 (${(state.clearedActs || []).length}/5) ▶</span>`;
    actBanner.addEventListener('click', () => {
      sfx.click();
      openKoreaWorldModal();
    });
    elChoicesPanel.appendChild(actBanner);
    const guideAct = KOREA_ACTS.find((a) => !state.clearedActs.includes(a.id) && a.id !== 'seoul') || curAct;
    const guideEps = ACT_STORY_EPISODES[guideAct.id] || [];
    const guideStep = state.actStoryStep?.[guideAct.id] || 0;
    const guideEp = guideEps[Math.min(guideStep, Math.max(0, guideEps.length - 1))];
    if (guideEp && guideAct.id !== 'seoul' && guideStep < guideEps.length) {
      const gBtn = document.createElement('button');
      gBtn.className = 'choice-btn row-btn';
      gBtn.style.gridColumn = 'span 2';
      gBtn.style.background = 'linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)';
      gBtn.style.borderColor = '#d97706';
      gBtn.className = 'choice-btn';
      gBtn.style.gridColumn = '';
      gBtn.innerHTML = `<span>📌 ${guideAct.name} ${guideEp.ep || 1}/${guideEps.length}화</span><span class="choice-sub" style="color:#b45309;">추천 Lv.${guideEp.recLv || 1} (내 Lv.${state.level || 1}) ▶</span>`;
      gBtn.addEventListener('click', () => {
        sfx.click();
        state.currentAct = guideAct.id;
        openActStoryModal(guideAct.id);
      });
      elChoicesPanel.appendChild(gBtn);
    }

    // V36.0: 4대 핵심 허브 (2×2 그리드) + 모달 내 6대 활동/전투 통합
    function openCombatHubModal() {
      elActivityModalTitle.textContent = '⚔️ 출동 · 전투 허브';
      if (elActivityModalImg) elActivityModalImg.innerHTML = uiImg('pin_patrol');
      elActivityList.innerHTML = '';

      const patrolCat = ACTIVITY_CATEGORIES.find((c) => c.id === 'patrol');
      if (patrolCat) {
        const pBtn = document.createElement('button');
        pBtn.className = 'activity-item-btn';
        pBtn.innerHTML = `<div class="act-title">${uiImg('pin_patrol')} 순찰 출동</div><div class="act-desc">${patrolCat.sub} · 빌런 제압 & 치안 회복</div>`;
        pBtn.addEventListener('click', () => {
          sfx.click();
          openActivityModal(patrolCat);
        });
        elActivityList.appendChild(pBtn);
      }

      const distCleared = getClearedDistrictCount(state);
      const dBtn = document.createElement('button');
      dBtn.className = 'activity-item-btn';
      dBtn.innerHTML = `<div class="act-title">${uiImg('menu_districts')} 전국 5대 도시 치안 (${distCleared}/5)</div><div class="act-desc">평화도시 영구 버프 & 시민 후원 확인</div>`;
      dBtn.addEventListener('click', () => {
        sfx.click();
        elActivityModal.classList.add('hidden');
        openDistrictsModal();
      });
      elActivityList.appendChild(dBtn);

      const towerUnlocked = isFeatureUnlocked(state, 'foundation');
      const tBtn = document.createElement('button');
      tBtn.className = 'activity-item-btn';
      tBtn.innerHTML = towerUnlocked
        ? `<div class="act-title">${uiImg('menu_tower')} 배틀타워 (최고 ${state.bestTowerFloor || 0}층)</div><div class="act-desc" style="color:#9e2a2b;">무한 연승 도전 ▶</div>`
        : `<div class="act-title">🔒 배틀타워 (24화 해금)</div><div class="act-desc">4부 총력전 이후 개방</div>`;
      tBtn.addEventListener('click', () => {
        if (!towerUnlocked) {
          sfx.damage();
          showToast('🔒 제24화 이후 배틀타워가 개방됩니다!', 'warn');
          return;
        }
        sfx.powerup();
        elActivityModal.classList.add('hidden');
        state.towerFloor = 1;
        const pool = [...VILLAINS, ...GUERRILLA_VILLAINS];
        const pick = pool[Math.floor(Math.random() * pool.length)];
        startBattle(pick.id);
      });
      elActivityList.appendChild(tBtn);

      const nmUnlocked = isFeatureUnlocked(state, 'nightmare');
      const nBtn = document.createElement('button');
      nBtn.className = 'activity-item-btn';
      nBtn.innerHTML = nmUnlocked
        ? `<div class="act-title">${uiImg('menu_nightmare')} 심야 마계 보스 러시 (최고 ${state.bestNightmareFloor || 0}층)</div><div class="act-desc" style="color:#7e22ce;">보스 연속 격파 · 유니크 드랍↑ ▶</div>`
        : `<div class="act-title">🔒 심야 마계 보스 러시 (25화 해금)</div><div class="act-desc">5부 잠입작전 돌입 시 개방</div>`;
      nBtn.addEventListener('click', () => {
        if (!nmUnlocked) {
          sfx.damage();
          showToast('🔒 제25화 진입 시 심야 마계 보스 러시가 해금됩니다!', 'warn');
          return;
        }
        sfx.powerup();
        elActivityModal.classList.add('hidden');
        state.nightmareFloor = 1;
        const bossPool = [...BOSSES, HIDDEN_BOSS];
        const pick = bossPool[Math.floor(Math.random() * bossPool.length)];
        startBattle(pick.id);
      });
      elActivityList.appendChild(nBtn);

      elActivityModal.classList.remove('hidden');
    }

    function openDailyHubModal() {
      elActivityModalTitle.textContent = '🏠 일상 · 성장 허브';
      if (elActivityModalImg) elActivityModalImg.innerHTML = uiImg('pin_home');
      elActivityList.innerHTML = '';

      const gearUnlocked = isFeatureUnlocked(state, 'gear');
      const petTxt = state.pet?.adopted ? `🐶Lv.${state.pet.level}` : '🐶미입양';
      const carTxt = (state.carLevel || 0) >= 1 ? `🚗T${state.carLevel}` : '🚗뚜벅이';
      const obBtn = document.createElement('button');
      obBtn.className = 'activity-item-btn';
      obBtn.innerHTML = `<div class="act-title">📜 자유도 시트 · 연금술 · 필살기 제작</div><div class="act-desc">은신/화술/연금/격투 숙련도 · 명성(${state.fame || 0})/악명(${state.infamy || 0}) · 조합소</div>`;
      obBtn.addEventListener('click', () => {
        sfx.click();
        openOblivionSheetModal();
      });
      elActivityList.appendChild(obBtn);

      const skDeckBtn = document.createElement('button');
      skDeckBtn.className = 'activity-item-btn';
      skDeckBtn.innerHTML = `<div class="act-title">⚡ 100종 스킬 덱 교체 (${(state.unlockedSkills || []).length}/100 해금)</div><div class="act-desc">레벨업으로 습득한 고유 기술을 4슬롯에 자유롭게 장착!</div>`;
      skDeckBtn.addEventListener('click', () => {
        sfx.click();
        openSkillEquipModal('speech');
      });
      elActivityList.appendChild(skDeckBtn);

      const lifeItem = document.createElement('button');
      lifeItem.className = 'activity-item-btn';
      lifeItem.innerHTML = gearUnlocked
        ? `<div class="act-title">${uiImg('menu_pet_garage')} 펫 · 차고 · 공방 · 주식</div><div class="act-desc" style="color:#37611a;">${petTxt} · ${carTxt} · 장비 강화 & 자취방 관리</div>`
        : `<div class="act-title">🔒 공방 · 라이프 (3화 해금)</div><div class="act-desc">제3화 클리어 시 개방</div>`;
      lifeItem.addEventListener('click', () => {
        if (!gearUnlocked) {
          sfx.damage();
          showToast('🔒 제3화 클리어 후 공방·라이프가 개방됩니다!', 'warn');
          return;
        }
        sfx.click();
        elActivityModal.classList.add('hidden');
        state.phase = 'lifestyle';
        state.lifeTab = 'main';
        state.log = '반려견 콩이·차고·강화·자취방·주식을 관리하세요!';
        render();
      });
      elActivityList.appendChild(lifeItem);

      const dailyIconMap = { work: 'pin_work', train: 'pin_train', heal: 'pin_home', shop: 'pin_shop', luck: 'pin_arcade' };
      ACTIVITY_CATEGORIES.filter((c) => c.id !== 'patrol').forEach((cat) => {
        const cBtn = document.createElement('button');
        cBtn.className = 'activity-item-btn';
        const cIcon = dailyIconMap[cat.id] ? uiImg(dailyIconMap[cat.id]) : '';
        const cTitle = cIcon ? `${cIcon} ${cat.title.replace(/^[^\s]+\s*/, '')}` : cat.title;
        cBtn.innerHTML = `<div class="act-title">${cTitle}</div><div class="act-desc">${cat.sub}</div>`;
        cBtn.addEventListener('click', () => {
          sfx.click();
          openActivityModal(cat);
        });
        elActivityList.appendChild(cBtn);
      });

      elActivityModal.classList.remove('hidden');
    }

    // 1) ⚔️ 출동 · 전투
    const combatHubBtn = document.createElement('button');
    combatHubBtn.className = 'choice-btn';
    combatHubBtn.style.position = 'relative';
    combatHubBtn.style.background = 'linear-gradient(180deg, #fff1f0 0%, #ffe0dc 100%)';
    combatHubBtn.style.borderColor = '#c53030';
    const towerUnlocked = isFeatureUnlocked(state, 'foundation');
    const nmUnlocked = isFeatureUnlocked(state, 'nightmare');
    const combatBadge = nmUnlocked ? '🔥 마계' : (towerUnlocked ? '🏰 타워' : '출동');
    combatHubBtn.innerHTML = `<span>${uiImg('pin_patrol')}출동 · 전투 <span class="hub-live-badge">${combatBadge}</span></span><span class="choice-sub" style="color:#9b2c2c;">순찰 · 치안 · 타워</span>`;
    combatHubBtn.addEventListener('click', () => {
      sfx.click();
      openCombatHubModal();
    });
    elChoicesPanel.appendChild(combatHubBtn);

    // 2) 🏠 일상 · 성장
    const dailyHubBtn = document.createElement('button');
    dailyHubBtn.className = 'choice-btn';
    dailyHubBtn.style.position = 'relative';
    dailyHubBtn.style.background = 'linear-gradient(180deg, #f3fbe9 0%, #dff2cc 100%)';
    dailyHubBtn.style.borderColor = '#5b8c38';
    const gearUnlocked = isFeatureUnlocked(state, 'gear');
    const dailyBadge = gearUnlocked ? '펫·알바' : '5대활동';
    dailyHubBtn.innerHTML = `<span>${uiImg('menu_pet_garage')}일상 · 성장 <span class="hub-live-badge">${dailyBadge}</span></span><span class="choice-sub" style="color:#37611a;">알바·수련·휴식·상점·펫</span>`;
    dailyHubBtn.addEventListener('click', () => {
      sfx.click();
      openDailyHubModal();
    });
    elChoicesPanel.appendChild(dailyHubBtn);

    // 3) 💕 연애 · 어학
    const yukiLove = state.love?.yuki || 0;
    const chloeLove = state.love?.chloe || 0;
    const romanceUnlocked = isFeatureUnlocked(state, 'yuki');
    const romanceBtn = document.createElement('button');
    romanceBtn.className = 'choice-btn';
    romanceBtn.style.position = 'relative';
    romanceBtn.style.background = romanceUnlocked
      ? 'linear-gradient(180deg, #fff0f5 0%, #ffe0ec 100%)'
      : 'linear-gradient(180deg, #f3f0ea 0%, #e5dfd3 100%)';
    romanceBtn.style.borderColor = romanceUnlocked ? '#d46a92' : '#9c8f7a';
    romanceBtn.innerHTML = romanceUnlocked
      ? `<span>${uiImg('menu_romance')}연애 · 어학 <span class="hub-live-badge">💌 데이트</span></span><span class="choice-sub" style="color:#9d2d57;">🇯🇵${yukiLove} · 🇺🇸${chloeLove}</span>`
      : `<span>🔒 연애 · 어학 (15화 해금)</span><span class="choice-sub">유키 합류 시 개방</span>`;
    romanceBtn.addEventListener('click', () => {
      if (!romanceUnlocked) {
        sfx.damage();
        showToast('🔒 제15화에서 유키를 만나면 연애·어학 모드가 해금됩니다!', 'warn');
        state.log = '🔒 아직 히로인을 만나기 전입니다! 메인 스토리를 15화까지 진행해 보세요.';
        render();
        return;
      }
      sfx.powerup();
      state.phase = 'romance';
      state.log = '외국어를 공부하고 유키·클로이와 설레는 데이트를 즐겨보세요!';
      render();
    });
    elChoicesPanel.appendChild(romanceBtn);

    // 4) 👻 수호정령
    const spiritCount = Object.keys(state.spirits || {}).filter((k) => (state.spirits[k] || 0) > 0).length;
    const eqSp = getSpiritBonuses().spirit;
    const spBtn = document.createElement('button');
    spBtn.className = 'choice-btn';
    spBtn.style.position = 'relative';
    spBtn.style.background = 'linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)';
    spBtn.style.borderColor = '#3b82f6';
    const spBadge = spiritCount === 0 ? '무료소환' : `${spiritCount}/${SPIRITS_50.length}`;
    spBtn.innerHTML = `<span>${uiImg('menu_spirit')}수호정령 <span class="hub-live-badge">${spBadge}</span></span><span class="choice-sub" style="color:#1e40af;">${eqSp ? `${getSpiritDisplayName(eqSp)} 장착중` : '소환·장착·도감'}</span>`;
    spBtn.addEventListener('click', () => {
      sfx.click();
      openSpiritModal();
    });
    elChoicesPanel.appendChild(spBtn);
    return;
  }

  // 4-L. V14.0 라이프스타일 허브 (펫·차고·장비 강화)
  if (state.phase === 'lifestyle') {
    if (!state.pet) state.pet = { adopted: false, name: '콩이', level: 0, exp: 0 };
    if (!state.gearLevels) state.gearLevels = { water_gun: 1, megaphone: 1, mirror: 1 };
    const curCar = (state.carLevel || 0) >= 1 ? CARS[state.carLevel - 1] : null;
    const nextCar = CARS[state.carLevel || 0] || null;

    elLocation.textContent = `DAY ${state.day} · ${timeLabel} · 펫 · 차고 · 공방`;
    elSceneTag.textContent = '라이프';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = '🐶 펫 · 🚗 차고 · 🔧 장비 강화';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');

    if (state.lifeTab === 'room') {
      elSceneImage.src = 'assets/images/bg_home.jpg?v=65';
      elSceneImage.classList.remove('hidden');
      elSceneCard.classList.add('hidden');
    } else if ((state.carLevel || 0) >= 1 && (state.lifeTab === 'main' || !state.pet.adopted)) {
      elSceneImage.src = `assets/images/bg_car_${Math.min(3, state.carLevel)}.jpg?v=65`;
      elSceneImage.classList.remove('hidden');
      elSceneCard.classList.add('hidden');
    } else if (state.pet.adopted) {
      elSceneImage.src = 'assets/images/pet_walk.jpg';
      elSceneImage.classList.remove('hidden');
      elSceneCard.classList.add('hidden');
    } else {
      showSceneCard(
        '🏡 LIFESTYLE HUB',
        ` 🐶 반려견: ${state.pet.adopted ? `${state.pet.name} Lv.${state.pet.level}` : '미입양 (60P)'}\n` +
        ` 🚗 보유 차량: ${curCar ? curCar.name : '없음 (뚜벅이)'}\n` +
        ` 🔧 장비 레벨: 물총Lv.${state.gearLevels.water_gun} · 확성기Lv.${state.gearLevels.megaphone} · 거울Lv.${state.gearLevels.mirror}`,
        '콩이와 산책/훈련하고, 차를 뽑아 드라이브 데이트를 즐기세요!'
      );
    }

    elBattleLog.textContent = state.log || '원하는 라이프스타일 활동을 선택하세요!';
    elChoicesPanel.className = 'choices-panel grid-2';

    const tabRow = [
      { id: 'main', label: '🐶 펫·🚗·🔧', unlockKey: 'gear', reqCh: 3 },
      { id: 'room', label: `🏠 방(${(state.roomUpgrades || []).length}/4)`, unlockKey: 'room_stock', reqCh: 12 },
      { id: 'stock', label: '📈 주식·🎰', unlockKey: 'room_stock', reqCh: 12 },
      { id: 'costume', label: '🧥 코스튬', unlockKey: 'car_costume', reqCh: 21 },
      { id: 'foundation', label: '🏛️ 재단', unlockKey: 'foundation', reqCh: 24 },
    ];
    const tabWrap = document.createElement('div');
    tabWrap.style.gridColumn = 'span 2';
    tabWrap.style.display = 'flex';
    tabWrap.style.gap = '4px';
    tabRow.forEach((tb) => {
      const ok = isFeatureUnlocked(state, tb.unlockKey);
      const tBtn = document.createElement('button');
      tBtn.className = 'choice-btn';
      tBtn.style.flex = '1';
      tBtn.style.padding = '5px';
      if ((state.lifeTab || 'main') === tb.id) {
        tBtn.style.background = '#e7d5b1';
        tBtn.style.borderColor = '#9e2a2b';
      }
      tBtn.innerHTML = `<span style="font-size:0.74rem;text-align:center;">${ok ? tb.label : `🔒(${tb.reqCh}화)`}</span>`;
      tBtn.addEventListener('click', () => {
        if (!ok) {
          sfx.damage();
          showToast(`🔒 제${tb.reqCh}화 진행 시 [${tb.label}] 탭이 해금됩니다!`, 'warn');
          state.log = `🔒 [${tb.label}] 기능은 제${tb.reqCh}화 이후 이용할 수 있습니다.`;
          render();
          return;
        }
        sfx.click();
        state.lifeTab = tb.id;
        render();
      });
      tabWrap.appendChild(tBtn);
    });
    elChoicesPanel.appendChild(tabWrap);

    if (state.lifeTab === 'room') {
      if (!state.roomUpgrades) state.roomUpgrades = [];
      ROOM_UPGRADES.forEach((ru) => {
        const owned = state.roomUpgrades.includes(ru.id);
        const rBtn = document.createElement('button');
        rBtn.className = 'choice-btn';
        rBtn.disabled = owned;
        rBtn.innerHTML = `<span style="display:flex;align-items:center;">${itemImgHtml(ru.id)}${ru.name}</span><span class="choice-sub">${owned ? '✅ 보유 중' : `${ru.cost}P · ${ru.desc}`}</span>`;
        rBtn.addEventListener('click', () => {
          if (state.points < ru.cost) {
            sfx.damage();
            state.log = `💸 인테리어 비용(${ru.cost} P)이 부족합니다!`;
            render();
            return;
          }
          state.points -= ru.cost;
          state.roomUpgrades.push(ru.id);
          sfx.victory();
          showToast(`🏠 [${ru.name}] 설치 완료!`, 'good');
          state.log = `🏠 [${ru.name}] 업그레이드 완료! (${ru.desc})`;
          saveGame();
          render();
        });
        elChoicesPanel.appendChild(rBtn);
      });
    const backBtn = document.createElement('button');
      backBtn.className = 'choice-btn row-btn';
      backBtn.style.gridColumn = 'span 2';
      backBtn.innerHTML = '<span>◀ 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
      backBtn.addEventListener('click', () => { sfx.click(); state.phase = 'map'; render(); });
      elChoicesPanel.appendChild(backBtn);
      return;
    }

    if (state.lifeTab === 'costume') {
      COSTUMES.forEach((ct) => {
        const unlocked = ct.check(state);
        const equipped = (state.costume || 'default') === ct.id;
        const cBtn = document.createElement('button');
        cBtn.className = 'choice-btn';
        cBtn.disabled = !unlocked || equipped;
        cBtn.innerHTML = `<span style="display:flex;align-items:center;">${itemImgHtml(ct.id)}${equipped ? '✅ ' : (unlocked ? '' : '🔒 ')}${ct.name}</span><span class="choice-sub">${unlocked ? ct.desc : ct.unlockText}</span>`;
        cBtn.addEventListener('click', () => {
          state.costume = ct.id;
          sfx.powerup();
          showToast(`🧥 [${ct.name}] 장착 완료!`, 'good');
          state.log = `🧥 [${ct.name}]을(를) 장착했습니다! (${ct.desc})`;
          saveGame();
          render();
        });
        elChoicesPanel.appendChild(cBtn);
      });
    const backBtn = document.createElement('button');
      backBtn.className = 'choice-btn row-btn';
      backBtn.style.gridColumn = 'span 2';
      backBtn.innerHTML = '<span>◀ 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
      backBtn.addEventListener('click', () => { sfx.click(); state.phase = 'map'; render(); });
      elChoicesPanel.appendChild(backBtn);
      return;
    }

    if (state.lifeTab === 'stock') {
      if (!state.stockPrices) state.stockPrices = { cider_pharma: 30, manner_ent: 45, hanriver_ev: 60 };
      if (!state.stockHoldings) state.stockHoldings = { cider_pharma: 0, manner_ent: 0, hanriver_ev: 0 };

      const capBtn = document.createElement('button');
      capBtn.className = 'choice-btn row-btn';
      capBtn.style.gridColumn = 'span 2';
      capBtn.style.background = 'linear-gradient(180deg, #fff6df 0%, #fde4a6 100%)';
      capBtn.style.borderColor = '#b07d2b';
      capBtn.innerHTML = '<span>🎰 도파민 럭키 캡슐 뽑기 (35P)</span><span class="choice-sub">150P 잭팟 · 영약 · 사이다원액!</span>';
      capBtn.addEventListener('click', () => {
        if (state.points < 35) {
          sfx.damage();
          state.log = '💸 캡슐 뽑기 비용(35 P)이 부족합니다!';
          render();
          return;
        }
        state.points -= 35;
        const totalW = CAPSULE_POOL.reduce((acc, c) => acc + c.weight, 0);
        let r = Math.random() * totalW;
        let picked = CAPSULE_POOL[CAPSULE_POOL.length - 1];
        for (const item of CAPSULE_POOL) {
          r -= item.weight;
          if (r <= 0) { picked = item; break; }
        }
        picked.apply(state);
        sfx.victory();
        showToast(`🎰 뽑기 결과: ${picked.name}`, 'good');
        state.log = `🎰 [도파민 럭키 캡슐!] ${picked.name}`;
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(capBtn);

      STOCKS.forEach((st) => {
        const price = state.stockPrices[st.id] || st.basePrice;
        const hold = state.stockHoldings[st.id] || 0;
        const bBtn = document.createElement('button');
        bBtn.className = 'choice-btn';
        bBtn.innerHTML = `<span>📈 ${st.name} 매수 (${price}P)</span><span class="choice-sub">보유 ${hold}주 (범위 ${st.min}~${st.max}P)</span>`;
        bBtn.addEventListener('click', () => {
          if (state.points < price) {
            sfx.damage();
            state.log = `💸 매수 자금(${price} P)이 부족합니다!`;
            render();
            return;
          }
          state.points -= price;
          state.stockHoldings[st.id] = hold + 1;
          sfx.click();
          state.log = `📈 [${st.name}] 1주 매수 완료! (${price} P · 보유 ${hold + 1}주)`;
          saveGame();
          render();
        });
        elChoicesPanel.appendChild(bBtn);

        const sBtn = document.createElement('button');
        sBtn.className = 'choice-btn';
        sBtn.disabled = hold <= 0;
        const netPrice = Math.round(price * 0.9);
        sBtn.innerHTML = `<span>💰 ${st.name} 매도 (+${netPrice}P)</span><span class="choice-sub">${hold > 0 ? `수수료 10% 차감 (보유 ${hold}주)` : '보유 주식 없음'}</span>`;
        sBtn.addEventListener('click', () => {
          if (hold <= 0) return;
          state.points += netPrice;
          state.stockHoldings[st.id] = hold - 1;
          sfx.powerup();
          state.log = `💰 [${st.name}] 1주 매도 완료! (+${netPrice} P · 남은 ${hold - 1}주)`;
          saveGame();
          render();
        });
        elChoicesPanel.appendChild(sBtn);
      });
    const backBtn = document.createElement('button');
      backBtn.className = 'choice-btn row-btn';
      backBtn.style.gridColumn = 'span 2';
      backBtn.innerHTML = '<span>◀ 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
      backBtn.addEventListener('click', () => { sfx.click(); state.phase = 'map'; render(); });
      elChoicesPanel.appendChild(backBtn);
      return;
    }

    if (state.lifeTab === 'costume') {
      COSTUMES.forEach((ct) => {
        const unlocked = ct.check(state);
        const equipped = (state.costume || 'default') === ct.id;
        const cBtn = document.createElement('button');
        cBtn.className = 'choice-btn';
        cBtn.disabled = !unlocked || equipped;
        cBtn.innerHTML = `<span style="display:flex;align-items:center;">${itemImgHtml(ct.id)}${equipped ? '✅ ' : (unlocked ? '' : '🔒 ')}${ct.name}</span><span class="choice-sub">${unlocked ? ct.desc : ct.unlockText}</span>`;
        cBtn.addEventListener('click', () => {
          state.costume = ct.id;
          sfx.powerup();
          showToast(`🧥 [${ct.name}] 장착 완료!`, 'good');
          state.log = `🧥 [${ct.name}]을(를) 장착했습니다! (${ct.desc})`;
          saveGame();
          render();
        });
        elChoicesPanel.appendChild(cBtn);
      });
      const backBtn = document.createElement('button');
      backBtn.className = 'choice-btn row-btn';
      backBtn.style.gridColumn = 'span 2';
      backBtn.innerHTML = '<span>◀ 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
      backBtn.addEventListener('click', () => { sfx.click(); state.phase = 'map'; render(); });
      elChoicesPanel.appendChild(backBtn);
      return;
    }

    if (state.lifeTab === 'foundation') {
      const fActions = [
        { title: '🗣️ 스피치 아카데미 (250P)', sub: '영구 언변 +2', cost: 250, run: () => { state.stats.speech += 2; } },
        { title: '🥊 프로 복싱 PT (250P)', sub: '영구 배짱 +2', cost: 250, run: () => { state.stats.guts += 2; } },
        { title: '⚖️ 로스쿨 특별 인강 (250P)', sub: '영구 법률 +2', cost: 250, run: () => { state.stats.law += 2; } },
        { title: '❤️ 한방 보약 세트 (250P)', sub: '영구 최대HP +20 & 회복', cost: 250, run: () => { state.maxHp += 20; state.hp = state.maxHp; } },
        { title: '🚨 서울 CCTV 치안 기부 (400P)', sub: '민폐도 -15% · 모범+25 · 팔로워+500', cost: 400, run: () => { state.chaosLevel = clamp((state.chaosLevel ?? 25) - 15, 0, 100); state.lawful += 25; state.followers = (state.followers || 120) + 500; } },
      ];
      fActions.forEach((fa) => {
        const fb = document.createElement('button');
        fb.className = 'choice-btn';
        fb.disabled = state.points < fa.cost;
        fb.innerHTML = `<span>${fa.title}</span><span class="choice-sub">${fa.sub}</span>`;
        fb.addEventListener('click', () => {
          state.points -= fa.cost;
          fa.run();
          sfx.powerup();
          state.log = `🏛️ [${fa.title}] 완료! (${fa.sub})`;
          saveGame();
          render();
        });
        elChoicesPanel.appendChild(fb);
      });
      const stBtn = document.createElement('button');
      stBtn.className = 'choice-btn';
      stBtn.disabled = !!state.statueBuilt || state.points < 1200;
      stBtn.innerHTML = `<span>🗿 시민영웅 명예 동상 (1,200P)</span><span class="choice-sub">${state.statueBuilt ? '✅ 건립 완료' : '모든스탯+3 · 공격+10 · 최대HP+50 (1회)'}</span>`;
      stBtn.addEventListener('click', () => {
        state.points -= 1200;
        state.statueBuilt = true;
        state.stats.speech += 3; state.stats.guts += 3; state.stats.law += 3;
        state.bonusDmg += 10; state.maxHp += 50; state.hp = state.maxHp;
        sfx.victory();
        showToast('🗿 서울 광장에 당신의 명예 동상이 세워졌습니다!!', 'break');
        state.log = '🗿 [시민영웅 명예 동상 건립!] 모든 스탯 +3 · 공격력 +10 · 최대 HP +50!';
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(stBtn);
      const backBtn = document.createElement('button');
      backBtn.className = 'choice-btn row-btn';
      backBtn.style.gridColumn = 'span 2';
      backBtn.innerHTML = '<span>◀ 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
      backBtn.addEventListener('click', () => { sfx.click(); state.phase = 'map'; render(); });
      elChoicesPanel.appendChild(backBtn);
      return;
    }

    // V24.0 콩이 Lv.3+ 특기 전직
    if (state.pet?.adopted && state.pet.level >= 3 && !state.pet.job) {
      PET_JOBS.forEach((pj) => {
        const jBtn = document.createElement('button');
        jBtn.className = 'choice-btn';
        jBtn.style.background = '#f0fdf4';
        jBtn.style.borderColor = '#16a34a';
        jBtn.innerHTML = `<span>${pj.name} 전직</span><span class="choice-sub">${pj.desc}</span>`;
        jBtn.addEventListener('click', () => {
          state.pet.job = pj.id;
          sfx.victory();
          showToast(`🐶 콩이가 [${pj.name}]으로 전직했습니다!`, 'good');
          state.log = `🐶 콩이가 [${pj.name}] 특기를 각성했습니다! (${pj.desc})`;
          saveGame();
          render();
        });
        elChoicesPanel.appendChild(jBtn);
      });
    }

    const petUnlocked = isFeatureUnlocked(state, 'pet');
    const petBtn = document.createElement('button');
    petBtn.className = 'choice-btn';
    if (!petUnlocked) {
      petBtn.innerHTML = '<span>🔒 시바견 콩이 입양 (18화 해금)</span><span class="choice-sub">제18화에서 콩이를 구조하면 해금!</span>';
      petBtn.addEventListener('click', () => {
        sfx.damage();
        showToast('🔒 제18화에서 유기견 콩이를 만나면 입양할 수 있습니다!', 'warn');
        state.log = '🔒 시바견 콩이는 제18화 스토리를 진행하면 입양할 수 있습니다.';
        render();
      });
    } else if (!state.pet.adopted) {
      petBtn.innerHTML = '<span>🐶 시바견 콩이 입양 (60P)</span><span class="choice-sub">전투 지원 + 데이트 호감+5</span>';
      petBtn.addEventListener('click', () => {
        if (state.points < 60) {
          sfx.damage();
          state.log = '💸 입양 비용(60 P)이 부족합니다!';
          render();
          return;
        }
        state.points -= 60;
        state.pet = { adopted: true, name: '콩이', level: 1, exp: 0 };
        sfx.victory();
        checkAchievements();
        state.log = '🐶 시바견 [콩이]를 입양했습니다! 데이트 시 호감도 +5, 전투 시 28% 확률로 발목을 물어줍니다!';
        saveGame();
        render();
      });
    } else {
      const isMax = state.pet.level >= 5;
      petBtn.innerHTML = `<span>🐕 콩이 산책 & 훈련 (25P)</span><span class="choice-sub">${isMax ? '최고 Lv.5 달성!' : `Lv.${state.pet.level} → Lv.${state.pet.level + 1}`} · SP+12</span>`;
      petBtn.addEventListener('click', () => {
        if (state.points < 25) {
          sfx.damage();
          state.log = '💸 간식·산책 비용(25 P)이 부족합니다!';
          render();
          return;
        }
        state.points -= 25;
        state.sp = clamp(state.sp + 12, 0, state.maxSp);
        state.hp = clamp(state.hp + 8, 1, state.maxHp);
        if (state.pet.level < 5) state.pet.level += 1;
        sfx.powerup();
        checkAchievements();
        if (Math.random() < 0.45) {
          state.petWalkEventIdx = Math.floor(Math.random() * PET_WALK_EVENTS.length);
          state.phase = 'pet_walk_event';
          saveGame();
          render();
          return;
        }
        advanceTime();
        state.log = `🐕 콩이와 한강 산책 완료! (콩이 Lv.${state.pet.level} · HP+8 · 사이다+12)`;
        saveGame();
        render();
      });
    }
    elChoicesPanel.appendChild(petBtn);

    const carUnlocked = isFeatureUnlocked(state, 'car_costume');
    const carBtn = document.createElement('button');
    carBtn.className = 'choice-btn';
    if (!carUnlocked) {
      carBtn.innerHTML = '<span>🔒 차량 구매 (21화 해금)</span><span class="choice-sub">제21화 이후 드라이브 차량 해금</span>';
      carBtn.addEventListener('click', () => {
        sfx.damage();
        showToast('🔒 제21화 이후 차량 구매가 개방됩니다!', 'warn');
        state.log = '🔒 차량 구매는 제21화 이후 이용할 수 있습니다.';
        render();
      });
    } else if (nextCar) {
      carBtn.innerHTML = `<span>🚗 ${nextCar.name} 구매 (${nextCar.cost}P)</span><span class="choice-sub">드라이브 데이트 +${nextCar.driveBonus}</span>`;
      carBtn.addEventListener('click', () => {
        if (state.points < nextCar.cost) {
          sfx.damage();
          state.log = `💸 차량 구매 비용(${nextCar.cost} P)이 부족합니다!`;
          render();
          return;
        }
        state.points -= nextCar.cost;
        state.carLevel = nextCar.level;
        sfx.victory();
        checkAchievements();
        state.log = `🚗 [${nextCar.name}] 출고 완료!! 이제 연애 허브에서 [🚗 드라이브 데이트]를 즐길 수 있습니다!`;
        saveGame();
        render();
      });
    } else {
      carBtn.innerHTML = '<span>🏎️ 최고급 슈퍼카 보유 중</span><span class="choice-sub">MAX Tier 3 · 드라이브+9</span>';
      carBtn.disabled = true;
    }
    elChoicesPanel.appendChild(carBtn);

    ['water_gun', 'megaphone', 'mirror'].forEach((gId) => {
      const curLv = state.gearLevels[gId] || 1;
      const list = GEAR_UPGRADES[gId] || [];
      const nextG = list.find((g) => g.lv === curLv + 1);
      const owned = state.inventory.includes(gId);
      const gBtn = document.createElement('button');
      gBtn.className = 'choice-btn';
      if (!owned) {
        gBtn.innerHTML = `<span>🔧 ${list[0]?.name || gId} (미보유)</span><span class="choice-sub">상점에서 먼저 구매하세요</span>`;
        gBtn.disabled = true;
      } else if (!nextG) {
        gBtn.innerHTML = `<span>✨ ${list[list.length - 1].name} (MAX)</span><span class="choice-sub">Lv.3 최종 진화 완료</span>`;
        gBtn.disabled = true;
      } else {
        gBtn.innerHTML = `<span>🔧 ${nextG.name} (${nextG.cost}P)</span><span class="choice-sub">Lv.${curLv}→${nextG.lv} · ${nextG.desc}</span>`;
        gBtn.addEventListener('click', () => {
          if (state.points < nextG.cost) {
            sfx.damage();
            state.log = `💸 강화 비용(${nextG.cost} P)이 부족합니다!`;
            render();
            return;
          }
          state.points -= nextG.cost;
          state.gearLevels[gId] = nextG.lv;
          sfx.powerup();
          checkAchievements();
          state.log = `🔧 [${nextG.name}] 강화 성공! 전투 사용 시 추가 데미지 +${nextG.bonusDmg}!`;
          saveGame();
          render();
        });
      }
      elChoicesPanel.appendChild(gBtn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = 'choice-btn';
    backBtn.innerHTML = '<span>◀ 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
    backBtn.addEventListener('click', () => {
      sfx.click();
      state.phase = 'map';
      render();
    });
    elChoicesPanel.appendChild(backBtn);
    return;
  }

  // 4-R. 연애·어학 미연시 허브
  if (state.phase === 'romance') {
    if (!state.lang) state.lang = { jp: 0, en: 0 };
    if (!state.love) state.love = { yuki: 0, chloe: 0 };
    if (!state.lovers) state.lovers = [];
    if (!state.lastDateDay) state.lastDateDay = { yuki: 0, chloe: 0 };
    if (!state.someCleared) state.someCleared = { yuki: false, chloe: false };
    if (!state.dateCount) state.dateCount = { yuki: 0, chloe: 0 };
    if (!state.sulky) state.sulky = { yuki: false, chloe: false };

    if (!state.lastStudyDay) state.lastStudyDay = { jp: 0, en: 0 };

    const yukiReady = state.love.yuki >= 95 && state.lang.jp >= 6 && (state.dateCount.yuki || 0) >= 3 && state.lawful >= 20 && state.stats.speech >= 5 && !state.lovers.includes('yuki');
    const chloeReady = state.love.chloe >= 95 && state.lang.en >= 6 && (state.dateCount.chloe || 0) >= 3 && state.stats.guts >= 5 && (state.followers || 0) >= 500 && !state.lovers.includes('chloe');
    const yukiCanDate = (state.love.yuki || 0) >= 35;
    const chloeCanDate = (state.love.chloe || 0) >= 35;

    elLocation.textContent = `DAY ${state.day} · ${timeLabel} · 연애 & 어학`;
    elSceneTag.textContent = '미연시';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = '💘 어학 공부 & 데이트';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    showSceneCard(
      '💘 ROMANCE & LANGUAGE',
      `🇯🇵 유키(일어 Lv.${state.lang.jp}/6) 호감 ${state.love.yuki}/100 · 데이트 ${state.dateCount.yuki || 0}/3 ${state.lovers.includes('yuki') ? '💖' : (state.sulky.yuki ? '💢' : '')}\n` +
      `🇺🇸 클로이(영어 Lv.${state.lang.en}/6) 호감 ${state.love.chloe}/100 · 데이트 ${state.dateCount.chloe || 0}/3 ${state.lovers.includes('chloe') ? '💖' : (state.sulky.chloe ? '💢' : '')}\n` +
      `고백: 호감95+어학Lv.6+데이트3회 (유키:모범20·언변5 / 클로이:배짱5·팔로워500)`,
      '호감도 35 미만: 알아가기 단계 · 75: 썸 위기 · 어학 공부 하루 1회!'
    );
    elBattleLog.textContent = state.log || '공부하고 싶은 언어와 만나고 싶은 히로인을 선택하세요!';
    elChoicesPanel.className = 'choices-panel grid-2';

    const tryStartDate = (key, isDrive = false) => {
      const kName = key === 'yuki' ? '유키' : '클로이';
      if (state.sulky?.[key]) {
        state.log = `💢 ${kName}가 지금 단단히 삐져서 연락을 안 받습니다! 아래 [💝 사과 & 달래기]로 먼저 화해하세요.`;
        render();
        return;
      }
      if (state.lastDateDay[key] === state.day) {
        state.log = `📅 오늘은 이미 ${kName}와 만났습니다! 내일(DAY ${state.day + 1}) 다시 신청하세요.`;
        render();
        return;
      }
      if ((state.love[key] || 0) < 35) {
        if (state.points < 15) {
          state.log = '💸 차 한 잔 비용(15 P)이 부족합니다!';
          render();
          return;
        }
        state.points -= 15;
        state.lastDateDay[key] = state.day;
        state.romanceTarget = key;
        if (!state.usedKnowIdx) state.usedKnowIdx = { yuki: [], chloe: [] };
        state.currentQuizIdx = pickNonRepeatingIdx(GETTING_TO_KNOW_EVENTS[key].length, state.usedKnowIdx[key]);
        state.phase = 'getting_to_know';
        render();
        return;
      }
      const cost = isDrive ? 50 : 35;
      if (state.points < cost) {
        state.log = `💸 데이트 비용(${cost} P)이 부족합니다! 알바나 빌런 참교육으로 돈을 모아오세요.`;
        render();
        return;
      }
      state.points -= cost;
      state.lastDateDay[key] = state.day;
      if (!state.lastContactDay) state.lastContactDay = { yuki: state.day, chloe: state.day };
      state.lastContactDay[key] = state.day;
      state.romanceTarget = key;
      state.isDriveDate = isDrive;

      // 썸(호감도 70+) 돌파 위기 이벤트 우선 체크
      if ((state.love[key] || 0) >= 70 && !state.someCleared?.[key]) {
        state.phase = 'some_crisis';
        render();
        return;
      }
      // 호감도 45~85 구간 30% 확률로 연애 라이벌 견제 이벤트
      if ((state.love[key] || 0) >= 45 && (state.love[key] || 0) <= 85 && Math.random() < 0.30) {
        state.phase = 'rival_scene';
        render();
        return;
      }

      state.dateCount[key] = (state.dateCount[key] || 0) + 1;
      if (!state.usedDateIdx) state.usedDateIdx = { yuki: [], chloe: [] };
      const poolLen = DATE_EVENTS[key].normal.length + (key === 'yuki' && state.pet?.adopted ? 1 : 0);
      state.currentQuizIdx = pickNonRepeatingIdx(poolLen, state.usedDateIdx[key]);
      state.phase = 'date_scene';
      render();
    };

    const chloeUnlocked = isFeatureUnlocked(state, 'chloe');
    if (!state.romanceStory) state.romanceStory = { yuki: { ep: 0, cleared: false }, chloe: { ep: 0, cleared: false } };
    const ySt = state.romanceStory.yuki || { ep: 0, cleared: false };
    const cSt = state.romanceStory.chloe || { ep: 0, cleared: false };
    const yFreeUnlocked = ySt.cleared || state.lovers.includes('yuki');
    const cFreeUnlocked = cSt.cleared || state.lovers.includes('chloe');

    const startRomanceStory = (hKey) => {
      const st = state.romanceStory[hKey] || { ep: 0, cleared: false };
      if (!state.lastRomanceEpDay) state.lastRomanceEpDay = { yuki: 0, chloe: 0 };
      if (!st.cleared && state.lastRomanceEpDay[hKey] === state.day) {
        const hNm = hKey === 'yuki' ? '유키' : '클로이';
        sfx.damage();
        showToast(`📅 ${hNm} 연애 스토리는 하루 1화씩! 내일(DAY ${state.day + 1}) 다음 화가 열립니다.`, 'warn');
        state.log = `⏳ 오늘 ${hNm} 연애 스토리를 이미 감상했습니다! 내일(DAY ${state.day + 1}) 다시 만나보세요.`;
        render();
        return;
      }
      const arr = hKey === 'yuki' ? YUKI_ROMANCE_STORY : CHLOE_ROMANCE_STORY;
      const targetEp = st.ep >= arr.length ? 0 : st.ep;
      sfx.powerup();
      state.activeRomanceStory = { heroine: hKey, epIdx: targetEp, sceneIdx: 0 };
      state.phase = 'romance_story';
      render();
    };

    const yDoneToday = !ySt.cleared && state.lastRomanceEpDay?.yuki === state.day;
    const cDoneToday = !cSt.cleared && state.lastRomanceEpDay?.chloe === state.day;
    const rActions = [
      {
        title: ySt.cleared ? '📖 유키 연애 스토리 (20/20 완결 ✅)' : (yDoneToday ? `⏳ 유키 연애 스토리 (${ySt.ep}/20 · 오늘 완료)` : `📖 유키 연애 스토리 (제${ySt.ep + 1}/20화)`),
        sub: ySt.cleared ? '완결! 1화부터 다시 감상 가능' : (yDoneToday ? `내일(DAY ${state.day + 1}) 다음 화 개방!` : '하루 1화 · 미니게임 & 기승전결 스토리!'),
        run: () => startRomanceStory('yuki'),
      },
      {
        title: !chloeUnlocked ? '🔒 클로이 연애 스토리 (17화 해금)' : (cSt.cleared ? '📖 클로이 연애 스토리 (20/20 완결 ✅)' : (cDoneToday ? `⏳ 클로이 연애 스토리 (${cSt.ep}/20 · 오늘 완료)` : `📖 클로이 연애 스토리 (제${cSt.ep + 1}/20화)`)),
        sub: !chloeUnlocked ? '제17화 클로이 합류(또는 2회차) 시 해금' : (cSt.cleared ? '완결! 1화부터 다시 감상 가능' : (cDoneToday ? `내일(DAY ${state.day + 1}) 다음 화 개방!` : '하루 1화 · 미니게임 & 기승전결 스토리!')),
        run: () => {
          if (!chloeUnlocked) {
            sfx.damage();
            showToast('🔒 제17화에서 클로이를 만나면 연애 스토리가 해금됩니다!', 'warn');
            return;
          }
          startRomanceStory('chloe');
        },
      },
      {
        title: '🇯🇵 일본어 공부 (유키)',
        sub: state.lastStudyDay.jp === state.day ? '오늘 공부 완료 (내일 가능)' : `Lv.${state.lang.jp} · 하루 1회 · 호감+4`,
        run: () => {
          if (state.lastStudyDay.jp === state.day) {
            state.log = '📚 오늘은 이미 일본어 공부를 완료했습니다! 내일 다시 공부하세요.';
            render();
            return;
          }
          state.romanceTarget = 'yuki';
          if (!state.usedQuizIdx) state.usedQuizIdx = { jp: [], en: [] };
          state.currentQuizIdx = pickNonRepeatingIdx(LANG_QUIZZES.jp.length, state.usedQuizIdx.jp);
          state.phase = 'lang_quiz';
          render();
        },
      },
      {
        title: chloeUnlocked ? '🇺🇸 영어 공부 (클로이)' : '🔒 영어 공부 (17화 해금)',
        sub: !chloeUnlocked ? '제17화 클로이 합류 시 해금' : (state.lastStudyDay.en === state.day ? '오늘 공부 완료 (내일 가능)' : `Lv.${state.lang.en} · 하루 1회 · 호감+4`),
        run: () => {
          if (!chloeUnlocked) {
            sfx.damage();
            showToast('🔒 제17화에서 클로이를 만나면 영어 공부가 해금됩니다!', 'warn');
            state.log = '🔒 클로이는 제17화에서 합류합니다!';
            render();
            return;
          }
          if (state.lastStudyDay.en === state.day) {
            state.log = '📚 오늘은 이미 영어 공부를 완료했습니다! 내일 다시 공부하세요.';
            render();
            return;
          }
          state.romanceTarget = 'chloe';
          if (!state.usedQuizIdx) state.usedQuizIdx = { jp: [], en: [] };
          state.currentQuizIdx = pickNonRepeatingIdx(LANG_QUIZZES.en.length, state.usedQuizIdx.en);
          state.phase = 'lang_quiz';
          render();
        },
      },
      {
        title: !yFreeUnlocked ? '🔒 유키 자유 데이트 (스토리 20화 완결 해금)' : (yukiReady ? '💖 유키에게 고백하기!' : '🍵 유키와 자유 데이트 (35P)'),
        sub: !yFreeUnlocked ? `연애 스토리 ${ySt.ep}/20화 진행 중` : (state.lastDateDay.yuki === state.day ? '오늘 완료 (내일 가능)' : '하루 1회 · 연인 데이트 & 키스신'),
        run: () => {
          if (!yFreeUnlocked) {
            sfx.damage();
            showToast('📖 유키 연애 스토리 20화를 완결하면 자유 데이트가 열립니다!', 'warn');
            return;
          }
          tryStartDate('yuki');
        },
      },
      {
        title: !chloeUnlocked ? '🔒 클로이 자유 데이트 (17화 해금)' : (!cFreeUnlocked ? '🔒 클로이 자유 데이트 (스토리 20화 완결 해금)' : (chloeReady ? '💖 클로이에게 고백하기!' : '📸 클로이와 자유 데이트 (35P)')),
        sub: !chloeUnlocked ? '제17화 클로이 합류 시 해금' : (!cFreeUnlocked ? `연애 스토리 ${cSt.ep}/20화 진행 중` : (state.lastDateDay.chloe === state.day ? '오늘 완료 (내일 가능)' : '하루 1회 · 연인 데이트 & 키스신')),
        run: () => {
          if (!chloeUnlocked) {
            sfx.damage();
            showToast('🔒 제17화에서 클로이를 만나면 해금됩니다!', 'warn');
            return;
          }
          if (!cFreeUnlocked) {
            sfx.damage();
            showToast('📖 클로이 연애 스토리 20화를 완결하면 자유 데이트가 열립니다!', 'warn');
            return;
          }
          tryStartDate('chloe');
        },
      },
    ];

    rActions.forEach((ra) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span>${ra.title}</span><span class="choice-sub">${ra.sub}</span>`;
      btn.addEventListener('click', () => { sfx.click(); ra.run(); });
      elChoicesPanel.appendChild(btn);
    });

    if ((state.carLevel || 0) >= 1) {
      const carObj = CARS[state.carLevel - 1];
      ['yuki', 'chloe'].forEach((k) => {
        if ((state.love[k] || 0) < 35) return;
        const dBtn = document.createElement('button');
        dBtn.className = 'choice-btn';
        dBtn.style.background = 'linear-gradient(180deg, #eef7ff 0%, #d8ecff 100%)';
        dBtn.style.borderColor = '#4a89c7';
        const nm = k === 'yuki' ? '유키' : '클로이';
        dBtn.innerHTML = `<span style="display:flex;align-items:center;">${itemImgHtml(`car_${state.carLevel || 1}`)}🚗 ${nm} 드라이브 (50P)</span><span class="choice-sub">${carObj.name} · 호감+${carObj.driveBonus}</span>`;
        dBtn.addEventListener('click', () => { sfx.click(); tryStartDate(k, true); });
        elChoicesPanel.appendChild(dBtn);
      });
    }

    if (state.lovers?.includes('yuki') && state.lovers?.includes('chloe') && state.pet?.adopted) {
      const picBtn = document.createElement('button');
      picBtn.className = 'choice-btn row-btn story-main-btn';
      picBtn.style.gridColumn = 'span 2';
      const doneToday = state.lastPicnicDay === state.day;
      picBtn.innerHTML = doneToday
        ? `<span>🧺 한강 트리플 피크닉 (유키·클로이·콩이 · 유대 Lv.${state.partnerBond || 1})</span><span class="choice-sub">오늘 다녀옴 (내일 가능)</span>`
        : `<span>🧺 한강 트리플 피크닉! (유키·클로이·콩이 · 80P)</span><span class="choice-sub">파티 유대 Lv.${state.partnerBond || 1} · 체력MAX · 전스탯+1 · 양쪽 호감+5!</span>`;
      picBtn.disabled = doneToday || state.points < 80;
      picBtn.addEventListener('click', () => {
        if (doneToday || state.points < 80) return;
        sfx.powerup();
        state.points -= 80;
        state.lastPicnicDay = state.day;
        state.phase = 'triple_picnic';
        render();
      });
      elChoicesPanel.appendChild(picBtn);
    }

    const giftBtn = document.createElement('button');
    giftBtn.className = 'choice-btn row-btn';
    giftBtn.style.gridColumn = 'span 2';
    giftBtn.innerHTML = chloeUnlocked
      ? '<span>🎁 취향 맞춤 선물하기 (유키 · 클로이)</span><span class="choice-sub">연인 소홀함 방지 & 호감도 케어</span>'
      : '<span>🎁 취향 맞춤 선물하기 (유키)</span><span class="choice-sub">소홀함 방지 & 호감도 케어</span>';
    giftBtn.addEventListener('click', () => {
      sfx.click();
      state.phase = 'gift_shop';
      render();
    });
    elChoicesPanel.appendChild(giftBtn);

    ['yuki', 'chloe'].forEach((k) => {
      if (!state.sulky?.[k]) return;
      const nm = k === 'yuki' ? '유키' : '클로이';
      const sBtn = document.createElement('button');
      sBtn.className = 'choice-btn row-btn';
      sBtn.style.gridColumn = 'span 2';
      sBtn.style.background = '#fff0f3';
      sBtn.style.borderColor = '#c9184a';
      sBtn.innerHTML = `<span>💝 ${nm} 삐짐 달래기 & 진심 사과 (40P)</span><span class="choice-sub">화해 시 전투 복귀 & 데이트 가능!</span>`;
      sBtn.addEventListener('click', () => {
        if (state.points < 40) {
          sfx.damage();
          state.log = '💸 사과 선물 비용(40 P)이 부족합니다!';
          render();
          return;
        }
        state.points -= 40;
        state.sulky[k] = false;
        state.love[k] = clamp((state.love[k] || 0) + 5, 0, 100);
        sfx.victory();
        state.log = `💝 ${nm}에게 진심으로 사과하고 달콤한 디저트를 건넸습니다! ${nm}가 활짝 웃으며 화해했습니다! (호감도 +5)`;
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(sBtn);
    });

    if (state.lovers.length > 0 && state.lastHomeVisitDay !== state.day) {
      const hBtn = document.createElement('button');
      hBtn.className = 'choice-btn row-btn';
      hBtn.style.gridColumn = 'span 2';
      hBtn.innerHTML = `<span>🏠 연인을 내 방 아지트로 초대하기 (일일 1회)</span><span class="choice-sub">HP+35 · 사이다+30 · 호감도+5</span>`;
      hBtn.addEventListener('click', () => {
        sfx.victory();
        state.lastHomeVisitDay = state.day;
        state.hp = clamp(state.hp + 35, 1, state.maxHp);
        state.sp = clamp(state.sp + 30, 0, state.maxSp);
        state.lovers.forEach((lk) => { state.love[lk] = clamp((state.love[lk] || 0) + 5, 0, 100); });
        state.log = '🏠 연인과 아지트에서 맛있는 야식을 먹으며 오붓한 시간을 보냈습니다! (HP +35 · 사이다 +30 · 연인 호감도 +5)';
        advanceTime();
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(hBtn);
    }

    // V25.0~V25.1 연인 전용: 💋 로맨틱 키스신 모드(1일 1회) & 💑 연인 데이트 10종(1일 1회)
    ['yuki', 'chloe'].forEach((lk) => {
      if (!state.lovers?.includes(lk) || state.sulky?.[lk]) return;
      const nm = lk === 'yuki' ? '유키' : '클로이';
      const kissedToday = (state.lastKissDay?.[lk] || 0) === state.day;
      const datedToday = (state.lastLoverDateDay?.[lk] || 0) === state.day;
      const stampCnt = (state.loverStamps?.[lk] || []).length;

      const kissBtn = document.createElement('button');
      kissBtn.className = 'choice-btn';
      kissBtn.style.background = 'linear-gradient(180deg, #fff0f6 0%, #ffd6e7 100%)';
      kissBtn.style.borderColor = '#e64980';
      kissBtn.disabled = kissedToday;
      kissBtn.innerHTML = `<span>💋 ${nm}와 로맨틱 키스</span><span class="choice-sub">${kissedToday ? '오늘의 키스 완료 ♥ (내일 가능)' : '1일 1회 · 키스신 일러스트 · 호감/회복'}</span>`;
      kissBtn.addEventListener('click', () => {
        sfx.victory();
        state.romanceTarget = lk;
        state.activeKissAction = null;
        state.phase = 'kiss_scene';
        render();
      });
      elChoicesPanel.appendChild(kissBtn);

      const actBtn = document.createElement('button');
      actBtn.className = 'choice-btn';
      actBtn.style.background = 'linear-gradient(180deg, #fff9db 0%, #ffec99 100%)';
      actBtn.style.borderColor = '#f08c00';
      actBtn.innerHTML = `<span>💑 ${nm} 연인 데이트 (${stampCnt}/10)</span><span class="choice-sub">${datedToday ? '오늘 데이트 완료 (도감 열람 가능)' : '1일 1회 · 커플 스프라이트 데이트'}</span>`;
      actBtn.addEventListener('click', () => {
        sfx.click();
        state.romanceTarget = lk;
        state.phase = 'lover_hub';
        render();
      });
      elChoicesPanel.appendChild(actBtn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = 'choice-btn row-btn';
    backBtn.style.gridColumn = 'span 2';
    backBtn.innerHTML = '<span>◀ 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
    backBtn.addEventListener('click', () => {
      sfx.click();
      state.phase = 'map';
      render();
    });
    elChoicesPanel.appendChild(backBtn);
    return;
  }

  // 4-R0-A. V25.2 연인 로맨틱 키스신 모드 (데이트 코스별 1:1 키스신 지원)
  if (state.phase === 'kiss_scene') {
    const key = state.romanceTarget === 'chloe' ? 'chloe' : 'yuki';
    const ks = KISS_SCENES[key];
    const actKiss = state.activeKissAction;
    elLocation.textContent = `DAY ${state.day} · ${actKiss ? actKiss.title : ks.location}`;
    elSceneTag.textContent = '💋 키스신';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = actKiss?.kissTitle || ks.title;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = actKiss?.kissQuote || ks.quote;
    elQuoteBubble.classList.remove('hidden');
    elSceneImage.src = actKiss?.kissImage || ks.image;
    elSceneImage.classList.remove('hidden');
    elBattleLog.textContent = actKiss ? `${actKiss.title}의 여운이 남은 두 사람. 조용히 시선이 마주칩니다.` : ks.text;
    elChoicesPanel.className = 'choices-panel';

    const kissChoices = (actKiss?.id && KISS_SCENE_CHOICES[actKiss.id]) ? KISS_SCENE_CHOICES[actKiss.id] : ks.choices;
    kissChoices.forEach((ch) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn row-btn';
      btn.innerHTML = `<span>${ch.text}</span><span class="choice-sub">💬 대화 선택</span>`;
      btn.addEventListener('click', () => {
        if (!state.kissUnlocked) state.kissUnlocked = { yuki: false, chloe: false };
        if (!state.lastKissDay) state.lastKissDay = { yuki: 0, chloe: 0 };
        if (!state.kissCollection) state.kissCollection = [];
        state.kissUnlocked[key] = true;
        if (actKiss?.id && !state.kissCollection.includes(actKiss.id)) {
          state.kissCollection.push(actKiss.id);
        }
        const alreadyToday = state.lastKissDay[key] === state.day;
        state.lastKissDay[key] = state.day;
        if (!alreadyToday) {
          state.love[key] = clamp((state.love[key] || 0) + (ch.love || 8), 0, 100);
          if (ch.maxHp) state.maxHp += ch.maxHp;
          state.hp = clamp(state.hp + (ch.hp || 40), 1, state.maxHp);
          state.sp = clamp(state.sp + (ch.sp || 40), 0, state.maxSp);
          if (ch.lawful) state.lawful += ch.lawful;
          if (ch.chaotic) state.chaotic += ch.chaotic;
          if (ch.followers) state.followers = (state.followers || 120) + ch.followers;
          if (ch.speech) state.stats.speech += ch.speech;
          if (ch.guts) state.stats.guts += ch.guts;
          if (ch.law) state.stats.law += ch.law;
          if (ch.points) state.points += ch.points;
          if (ch.scrap) state.scrap = (state.scrap || 0) + ch.scrap;
          if (ch.ppRestore) restoreSkillPp(ch.ppRestore);
          state.log = `${ch.log} (📸 추억 앨범에 키스신 저장됨!)`;
        } else {
          state.log = `${ch.log} (오늘 이미 키스 보상을 받아 달콤한 여운만 남습니다 ♥)`;
        }
        sfx.victory();
        showToast(`💋 ${key === 'yuki' ? '유키' : '클로이'} 키스신 감상 완료!`, 'good');
        state.phase = 'romance';
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = 'choice-btn row-btn';
    backBtn.innerHTML = '<span>◀ 연애 메뉴로 돌아가기</span><span class="choice-sub">뒤로</span>';
    backBtn.addEventListener('click', () => { sfx.click(); state.phase = 'romance'; render(); });
    elChoicesPanel.appendChild(backBtn);
    return;
  }

  // 4-R0-B. V25.1 연인 전용 데이트 행동양식 10종 허브 (1일 1회 + 스탬프 도감)
  if (state.phase === 'lover_hub') {
    const key = state.romanceTarget === 'chloe' ? 'chloe' : 'yuki';
    const nm = key === 'yuki' ? '유키' : '클로이';
    const list = LOVER_ACTIONS[key] || [];
    if (!state.lastLoverDateDay) state.lastLoverDateDay = { yuki: 0, chloe: 0 };
    if (!state.loverStamps) state.loverStamps = { yuki: [], chloe: [] };
    if (!state.loverMasterBonus) state.loverMasterBonus = { yuki: false, chloe: false };
    const stamps = state.loverStamps[key] || [];
    const datedToday = (state.lastLoverDateDay[key] || 0) === state.day;

    elLocation.textContent = `DAY ${state.day} · ${nm}와 커플 데이트 (${stamps.length}/10)`;
    elSceneTag.textContent = '연인 모드';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = `💑 ${nm} 커플 데이트 (${stamps.length}/10 스탬프)`;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = datedToday
      ? `"오늘 데이트 진짜 행복했어요! 내일 또 다른 데이트 하러 가요 ♥"`
      : (key === 'yuki'
        ? '"오늘은 우리 둘이 뭐 하고 놀까요? 다 좋아요 ♥"'
        : '"Babe! 오늘 데이트 코스 10개 다 정복해 보자! ♥"');
    elQuoteBubble.classList.remove('hidden');
    elSceneImage.src = HEROINES[key].imgSpecial;
    elSceneImage.classList.remove('hidden');
    if (elFrame) elFrame.classList.add('couple-stage');
    if (elCoupleSprite) {
      elCoupleSprite.src = key === 'yuki' ? 'assets/images/couple_yuki_walk.png' : 'assets/images/couple_chloe_walk.png';
      elCoupleSprite.classList.remove('hidden');
    }
    elBattleLog.textContent = datedToday
      ? `✅ 오늘 ${nm}와의 연인 데이트를 이미 완료했습니다! (하루 1회 제한 · 내일 다시 가능) | 스탬프 10종 올클리어 시 [전스탯+2 · 최대HP+20]`
      : `${nm}와 함께할 연인 데이트 10종입니다. (하루 1회 · 스탬프 ${stamps.length}/10 수집 시 전스탯+2 · 최대HP+20!)`;
    elChoicesPanel.className = 'choices-panel grid-2';

    list.forEach((act, idx) => {
      const done = stamps.includes(act.id);
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.disabled = datedToday || state.points < (act.cost || 0);
      btn.innerHTML = `<span>${done ? '✅' : '⬜'} ${act.title}</span><span class="choice-sub">${datedToday ? '오늘 완료 (내일 가능)' : act.sub}</span>`;
      btn.addEventListener('click', () => {
        if ((state.lastLoverDateDay[key] || 0) === state.day) {
          sfx.damage();
          state.log = '💑 연인 데이트는 하루에 1회만 가능합니다! 내일 또 데이트해요 ♥';
          render();
          return;
        }
        if (state.points < (act.cost || 0)) {
          sfx.damage();
          state.log = '💸 도덕점수가 부족합니다!';
          render();
          return;
        }
        state.points -= (act.cost || 0);
        const ef = act.effect || {};
        if (ef.love) state.love[key] = clamp((state.love[key] || 0) + ef.love, 0, 100);
        if (ef.maxHp) state.maxHp += ef.maxHp;
        if (ef.hp) state.hp = clamp(state.hp + ef.hp, 1, state.maxHp);
        if (ef.sp) state.sp = clamp(state.sp + ef.sp, 0, state.maxSp);
        if (ef.points) state.points += ef.points;
        if (ef.lawful) state.lawful += ef.lawful;
        if (ef.followers) state.followers = (state.followers || 120) + ef.followers;
        if (ef.law) state.stats.law += ef.law;
        if (ef.speech) state.stats.speech += ef.speech;
        if (ef.guts) state.stats.guts += ef.guts;
        if (ef.bonusDmg) state.bonusDmg += ef.bonusDmg;
        if (ef.jp) state.lang.jp = Math.min(10, (state.lang.jp || 0) + ef.jp);
        if (ef.en) state.lang.en = Math.min(10, (state.lang.en || 0) + ef.en);
        state.lastDateDay[key] = state.day;
        state.lastLoverDateDay[key] = state.day;
        if (!state.loverStamps[key].includes(act.id)) {
          state.loverStamps[key].push(act.id);
        }
        let masterMsg = '';
        if (state.loverStamps[key].length >= 10 && !state.loverMasterBonus[key]) {
          state.loverMasterBonus[key] = true;
          state.stats.speech += 2;
          state.stats.guts += 2;
          state.stats.law += 2;
          state.maxHp += 20;
          state.hp = clamp(state.hp + 20, 1, state.maxHp);
          masterMsg = ` 🏆 [${nm} 커플 데이트 10종 올클리어!! 전스탯 +2 · 최대HP +20!]`;
          showToast(`🏆 ${nm} 커플 데이트 올클리어 보너스 획득!`, 'break');
        }
        state.loverActionIdx = idx;
        sfx.victory();
        advanceTime();
        state.log = `${act.log}${masterMsg}`;
        state.phase = 'lover_date_view';
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = 'choice-btn row-btn';
    backBtn.style.gridColumn = 'span 2';
    backBtn.innerHTML = '<span>◀ 연애 메뉴로 돌아가기</span><span class="choice-sub">뒤로</span>';
    backBtn.addEventListener('click', () => { sfx.click(); state.phase = 'romance'; render(); });
    elChoicesPanel.appendChild(backBtn);
    return;
  }

  // 4-R0-C. V25.1 연인 데이트 커플 스프라이트 & FX & 티키타카 연출 뷰
  if (state.phase === 'lover_date_view') {
    const key = state.romanceTarget === 'chloe' ? 'chloe' : 'yuki';
    const list = LOVER_ACTIONS[key] || [];
    const act = list[state.loverActionIdx || 0] || list[0];
    elLocation.textContent = `DAY ${state.day} · 커플 데이트 중 ♥`;
    elSceneTag.textContent = '💑 데이트';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = act.title;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = act.heroLine ? `나: ${act.heroLine}  ↔  ${act.quote}` : act.quote;
    elQuoteBubble.classList.remove('hidden');
    elSceneImage.src = act.bg;
    elSceneImage.classList.remove('hidden');
    if (elFrame) elFrame.classList.add('couple-stage');
    if (act.coupleSprite && elCoupleSprite) {
      elCoupleSprite.src = act.coupleSprite;
      elCoupleSprite.classList.remove('hidden');
    }
    if (elDateFxLayer && act.fx) {
      elDateFxLayer.className = `date-fx-layer fx-${act.fx}`;
      const symMap = { hearts: ['💕', '💖', '✨', '♥'], rain: ['💧', '☔', '💧', '✨'], stars: ['✨', '⭐', '🌟', '💫'], flash: [] };
      const syms = symMap[act.fx] || [];
      elDateFxLayer.innerHTML = syms.map((s, i) => `<span class="fx-particle" style="left:${12 + i * 22}%;top:${act.fx === 'rain' ? 0 : 65}%;animation-delay:${i * 0.45}s;">${s}</span>`).join('');
    }
    elBattleLog.textContent = `${act.log} (${act.sub})`;
    elChoicesPanel.className = 'choices-panel';

    const againBtn = document.createElement('button');
    againBtn.className = 'choice-btn row-btn';
    againBtn.innerHTML = '<span>📖 커플 데이트 스탬프 도감 보기</span><span class="choice-sub">오늘 데이트는 완료!</span>';
    againBtn.addEventListener('click', () => { sfx.click(); state.phase = 'lover_hub'; render(); });
    elChoicesPanel.appendChild(againBtn);

    const kissedToday = (state.lastKissDay?.[key] || 0) === state.day;
    const kissShortBtn = document.createElement('button');
    kissShortBtn.className = 'choice-btn row-btn';
    kissShortBtn.style.background = '#fff0f6';
    kissShortBtn.style.borderColor = '#e64980';
    kissShortBtn.disabled = kissedToday;
    kissShortBtn.innerHTML = `<span>💋 분위기 이어서 로맨틱 키스하기</span><span class="choice-sub">${kissedToday ? '오늘의 키스 완료 ♥' : '1일 1회 키스신 모드'}</span>`;
    kissShortBtn.addEventListener('click', () => { sfx.victory(); state.activeKissAction = act; state.phase = 'kiss_scene'; render(); });
    elChoicesPanel.appendChild(kissShortBtn);

    const mapBtn = document.createElement('button');
    mapBtn.className = 'choice-btn row-btn';
    mapBtn.innerHTML = '<span>🗺️ 지도로 돌아가기</span><span class="choice-sub">완료</span>';
    mapBtn.addEventListener('click', () => { sfx.click(); state.phase = 'map'; render(); });
    elChoicesPanel.appendChild(mapBtn);
    return;
  }

  // 4-R0. V16.0 히로인 취향 선물 가게
  if (state.phase === 'triple_picnic') {
    elLocation.textContent = `DAY ${state.day} · 여의도 한강공원 피크닉`;
    elSceneTag.textContent = '특별 이벤트';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = '🧺 유키·클로이·콩이 한강 트리플 피크닉!';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = '"오늘은 다 같이 아무 걱정 없이 쉬자! / Yay!! Picnic time! / 멍!"';
    elQuoteBubble.classList.remove('hidden');
    elSceneImage.src = 'assets/images/triple_picnic.jpg';
    elSceneImage.classList.remove('hidden');
    elBattleLog.textContent = '벚꽃 흩날리는 한강 잔디밭에 돗자리를 펴고 유키, 클로이, 콩이와 함께 행복한 피크닉을 즐깁니다!';
    elChoicesPanel.className = 'choices-panel';
    [
      {
        text: '🍙 유키의 수제 주먹밥 + 클로이의 폴라로이드 촬영!',
        sub: '파티 유대 +1 · 양쪽 호감 +6 · 인내심 MAX',
        run: () => {
          state.partnerBond = (state.partnerBond || 1) + 1;
          state.love.yuki = clamp((state.love.yuki || 0) + 6, 0, 100);
          state.love.chloe = clamp((state.love.chloe || 0) + 6, 0, 100);
          state.hp = state.maxHp;
          state.sp = state.maxSp;
          state.log = `🧺 [트리플 피크닉 대성공!] 완벽한 추억이 쌓였습니다! (파티 유대 Lv.${state.partnerBond} · 양쪽 호감 +6 · HP/SP MAX!)`;
        },
      },
      {
        text: '🐶 콩이랑 원반 던지기 & 셋이서 체력 단련!',
        sub: '전스탯 +1 · 최대HP +12 · 양쪽 호감 +4',
        run: () => {
          state.stats.speech += 1;
          state.stats.guts += 1;
          state.stats.law += 1;
          state.maxHp += 12;
          state.hp = state.maxHp;
          state.love.yuki = clamp((state.love.yuki || 0) + 4, 0, 100);
          state.love.chloe = clamp((state.love.chloe || 0) + 4, 0, 100);
          state.log = '🐶 [피크닉 특훈 완료!] 콩이와 뛰어놀며 전스탯 +1 · 최대 인내심 +12 상승!';
        },
      },
    ].forEach((ch) => {
      const b = document.createElement('button');
      b.className = 'choice-btn row-btn';
      b.innerHTML = `<span>${ch.text}</span><span class="choice-sub">${ch.sub}</span>`;
      b.addEventListener('click', () => {
        sfx.victory();
        if (!state.lastContactDay) state.lastContactDay = { yuki: state.day, chloe: state.day };
        state.lastContactDay.yuki = state.day;
        state.lastContactDay.chloe = state.day;
        ch.run();
        advanceTime();
        state.phase = 'romance';
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(b);
    });
    return;
  }

  // 4-R0. V16.0 히로인 취향 선물 가게
  if (state.phase === 'gift_shop') {
    elLocation.textContent = `DAY ${state.day} · 선물 가게`;
    elSceneTag.textContent = '선물';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = '🎁 히로인 취향 선물하기';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    const unlockedHeroines = ['yuki', 'chloe'].filter((k) => isFeatureUnlocked(state, k));
    const chloeGiftUnlocked = unlockedHeroines.includes('chloe');
    showSceneCard(
      '🎁 GIFT SHOP',
      ` 🇯🇵 유키 호감도: ${state.love?.yuki || 0}/100\n` +
      (chloeGiftUnlocked ? ` 🇺🇸 클로이 호감도: ${state.love?.chloe || 0}/100\n` : ` 🇺🇸 클로이: 🔒 제17화 합류 후 해금\n`) +
      ` ─────────────────────────\n 선물을 주면 소홀함 페널티가 초기화됩니다!`,
      '취향에 맞는 선물을 골라 마음을 전하세요!'
    );
    elBattleLog.textContent = state.log || '선물과 받을 히로인을 선택하세요!';
    elChoicesPanel.className = chloeGiftUnlocked ? 'choices-panel grid-2' : 'choices-panel';

    HEROINE_GIFTS.forEach((gf) => {
      unlockedHeroines.forEach((k) => {
        const nm = k === 'yuki' ? '🇯🇵유키' : '🇺🇸클로이';
        const gain = k === 'yuki' ? gf.yukiLove : gf.chloeLove;
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `<span>${gf.name} → ${nm}</span><span class="choice-sub">${gf.cost}P · 호감+${gain}</span>`;
        btn.addEventListener('click', () => {
          if (state.points < gf.cost) {
            sfx.damage();
            state.log = `💸 선물 비용(${gf.cost} P)이 부족합니다!`;
            render();
            return;
          }
          state.points -= gf.cost;
          state.love[k] = clamp((state.love[k] || 0) + gain, 0, 100);
          if (!state.lastContactDay) state.lastContactDay = { yuki: state.day, chloe: state.day };
          state.lastContactDay[k] = state.day;
          advanceDailyQuest('care', 1);
          if (!state.dailyStats) state.dailyStats = { wins: 0, loveGain: 0 };
          state.dailyStats.loveGain += gain;
          sfx.victory();
          showToast(`🎁 ${nm}에게 선물 전달! 호감도 +${gain}!`, 'good');
          state.log = `🎁 ${nm}에게 [${gf.name}]을(를) 선물했습니다! (호감도 +${gain} · 연락 갱신!)`;
          state.phase = 'romance';
          saveGame();
          render();
        });
        elChoicesPanel.appendChild(btn);
      });
    });

    const backBtn = document.createElement('button');
    backBtn.className = 'choice-btn row-btn';
    backBtn.style.gridColumn = 'span 2';
    backBtn.innerHTML = '<span>◀ 연애 허브로 돌아가기</span><span class="choice-sub">뒤로</span>';
    backBtn.addEventListener('click', () => { sfx.click(); state.phase = 'romance'; render(); });
    elChoicesPanel.appendChild(backBtn);
    return;
  }

  // 4-R0. V35.0 연애 스토리 모드 (10배 풀볼륨 · 6종 미니게임 · 실시간 FX · 아련한 여운 컷신)
  if (state.phase === 'romance_story') {
    const ars = state.activeRomanceStory || { heroine: 'yuki', epIdx: 0, sceneIdx: 0 };
    const hKey = ars.heroine === 'chloe' ? 'chloe' : 'yuki';
    const arr = hKey === 'yuki' ? YUKI_ROMANCE_STORY : CHLOE_ROMANCE_STORY;
    const epObj = arr[clamp(ars.epIdx || 0, 0, arr.length - 1)];
    const scIdx = clamp(ars.sceneIdx || 0, 0, epObj.scenes.length - 1);
    const sc = epObj.scenes[scIdx];
    const isFinalScene = scIdx === epObj.scenes.length - 1;
    const hName = hKey === 'yuki' ? '🇯🇵 유키' : '🇺🇸 클로이';

    elLocation.textContent = `DAY ${state.day} · ${timeLabel} · ${hName} 연애 스토리`;
    elSceneTag.textContent = `[${epObj.act}] ${epObj.ep}/20화`;
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = epObj.title;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = `💬 ${sc.speaker}`;
    elQuoteBubble.classList.remove('hidden');

    if (epObj.img.endsWith('.png')) {
      setStageBg(hKey === 'yuki' ? 'bg_mapo.jpg' : 'bg_seongsu.jpg');
      if (elFrame) elFrame.classList.add('combat-stage');
      if (epObj.img.includes('couple_')) {
        if (elCoupleSprite) {
          elCoupleSprite.src = `${epObj.img}?v=88`;
          elCoupleSprite.classList.remove('hidden');
        }
      } else {
        elHeroSprite.classList.remove('hidden');
        if (hKey === 'yuki' && elYukiSprite) elYukiSprite.classList.remove('hidden');
        if (hKey === 'chloe' && elChloeSprite) elChloeSprite.classList.remove('hidden');
      }
    } else {
      if (elFrame) elFrame.classList.add('couple-stage');
      elSceneImage.src = `${epObj.img}?v=88`;
      elSceneImage.classList.remove('hidden');
    }

    const fxType = epObj.fx || 'hearts';
    if (elDateFxLayer) {
      elDateFxLayer.className = `date-fx-layer fx-${fxType}`;
      const symMap = { hearts: ['💕', '💖', '🌸', '♥'], rain: ['💧', '☔', '💧', '✨'], stars: ['✨', '⭐', '🌟', '💫'], flash: ['📸', '✨', '⚡', '💫'] };
      const syms = symMap[fxType] || symMap.hearts;
      elDateFxLayer.innerHTML = syms.map((s, i) => `<span class="fx-particle" style="left:${10 + i * 23}%;top:${fxType === 'rain' ? 0 : 62}%;animation-delay:${i * 0.42}s;">${s}</span>`).join('');
    }

    elChoicesPanel.className = 'choices-panel';
    const applyChoiceReward = (ch) => {
      if (!state.love) state.love = { yuki: 0, chloe: 0 };
      if (!state.lovers) state.lovers = [];
      if (!state.someCleared) state.someCleared = { yuki: false, chloe: false };
      if (!state.romanceStory) state.romanceStory = { yuki: { ep: 0, cleared: false }, chloe: { ep: 0, cleared: false } };
      if (!state.lastContactDay) state.lastContactDay = { yuki: state.day, chloe: state.day };
      state.lastContactDay[hKey] = state.day;
      state.love[hKey] = clamp((state.love[hKey] || 0) + (ch.love || 0), 0, 200);
      if (ch.statKey === 'speech') state.stats.speech += ch.statAmt;
      else if (ch.statKey === 'guts') state.stats.guts += ch.statAmt;
      else if (ch.statKey === 'law') state.stats.law += ch.statAmt;
      else if (ch.statKey === 'sp') state.sp = clamp(state.sp + ch.statAmt, 0, state.maxSp);
      else if (ch.statKey === 'hp') state.hp = clamp(state.hp + ch.statAmt, 1, state.maxHp);
      else if (ch.statKey === 'points') state.points += ch.statAmt;
      else if (ch.statKey === 'all') {
        state.stats.speech += ch.statAmt;
        state.stats.guts += ch.statAmt;
        state.stats.law += ch.statAmt;
        state.points += 200;
      }
    };

    // 화별 미니게임 처리 — V35.3 대형 집중 오버레이 무대 (스크롤 제로!)
    if (sc.minigame && !ars.mgDone && elRomMgOverlay && elRomMgPanel) {
      const mg = sc.minigame;
      elBattleLog.textContent = sc.text;
      elRomMgOverlay.classList.remove('hidden');
      const headerHtml = `
        <div style="font-size:11.5px;color:#fde047;font-weight:800;margin-bottom:4px;">🎮 ${epObj.title}</div>
        <div style="font-weight:900;font-size:17px;margin-bottom:4px;">${mg.title}</div>
        <div style="font-size:12.5px;opacity:0.95;line-height:1.45;">${mg.question ? `❓ ${mg.question}` : mg.desc}</div>
      `;

      if (mg.type === 'timing' || mg.type === 'shutter') {
        elRomMgPanel.innerHTML = `
          ${headerHtml}
          <div class="romance-heart-track"><div class="romance-heart-cursor" id="rom-mg-cursor" style="left:50%"></div></div>
          <button class="rom-mg-big-btn" id="rom-mg-go">${mg.type === 'shutter' ? '📸 지금 셔터 누르기!!' : '💗 지금 타이밍 맞추기!!'}</button>
        `;
        let pos = 12;
        let dir = 1;
        const step = (now) => {
          if (state.phase !== 'romance_story' || state.activeRomanceStory?.mgDone) return;
          const dt = Math.min(40, now - (step.last || now));
          step.last = now;
          pos += dir * dt * 0.115;
          if (pos >= 96) { pos = 96; dir = -1; }
          else if (pos <= 4) { pos = 4; dir = 1; }
          const cur = document.getElementById('rom-mg-cursor');
          if (cur) cur.style.left = `${pos.toFixed(1)}%`;
          window._romMgRaf = requestAnimationFrame(step);
        };
        if (window._romMgRaf) cancelAnimationFrame(window._romMgRaf);
        window._romMgRaf = requestAnimationFrame(step);

        document.getElementById('rom-mg-go').onclick = () => {
          if (window._romMgRaf) { cancelAnimationFrame(window._romMgRaf); window._romMgRaf = null; }
          let loveAdd = 3;
          let resTxt = mg.missText;
          if (pos >= 32 && pos <= 68) {
            loveAdd = 6;
            resTxt = mg.perfectText;
            sfx.victory();
            showToast(`✨ PERFECT!! 호감도 +6!`, 'break');
          } else if (pos >= 18 && pos <= 82) {
            loveAdd = 4;
            resTxt = mg.goodText;
            sfx.powerup();
            showToast(`💕 GOOD! 호감도 +4!`, 'good');
          } else {
            sfx.click();
          }
          if (!state.love) state.love = { yuki: 0, chloe: 0 };
          state.love[hKey] = clamp((state.love[hKey] || 0) + loveAdd, 0, 200);
          state.activeRomanceStory = { ...ars, mgDone: true, mgResultText: resTxt };
          render();
        };
        return;
      }

      if (mg.type === 'mash') {
        elRomMgPanel.innerHTML = `
          ${headerHtml}
          <div class="romance-mash-track"><div class="romance-mash-fill" id="rom-mash-fill"></div></div>
          <button class="rom-mg-big-btn" id="rom-mg-mash">⚡ 가볍게 톡톡 연타하기!!</button>
        `;
        let pct = 15;
        let finished = false;
        const finishMash = (isPerfect) => {
          if (finished) return;
          finished = true;
          clearTimeout(timer);
          const loveAdd = isPerfect ? 6 : (pct >= 55 ? 4 : 3);
          const resTxt = isPerfect ? mg.perfectText : (pct >= 55 ? mg.goodText : mg.missText);
          if (isPerfect) { sfx.victory(); showToast('🔥 100% 성공!! 호감도 +6!', 'break'); }
          else { sfx.powerup(); showToast(`💕 호감도 +${loveAdd}!`, 'good'); }
          if (!state.love) state.love = { yuki: 0, chloe: 0 };
          state.love[hKey] = clamp((state.love[hKey] || 0) + loveAdd, 0, 200);
          state.activeRomanceStory = { ...ars, mgDone: true, mgResultText: resTxt };
          render();
        };
        const timer = setTimeout(() => {
          if (state.phase === 'romance_story' && !finished) finishMash(false);
        }, 4200);

        document.getElementById('rom-mg-mash').onclick = () => {
          if (finished) return;
          sfx.click();
          pct = Math.min(100, pct + 16);
          const fill = document.getElementById('rom-mash-fill');
          if (fill) fill.style.width = `${pct}%`;
          if (pct >= 100) finishMash(true);
        };
        return;
      }

      if (mg.type === 'tap_targets') {
        const icons = mg.icons || ['🌸', '💕', '✨', '🎀'];
        let caught = 0;
        let doneTap = false;
        elRomMgPanel.innerHTML = `
          <div style="font-size:11.5px;color:#fde047;font-weight:800;margin-bottom:4px;">🎮 ${epObj.title}</div>
          <div style="font-weight:900;font-size:17px;margin-bottom:4px;">${mg.title} (<span id="rom-tap-cnt">0</span>/${icons.length})</div>
          <div style="font-size:12.5px;opacity:0.95;">${mg.desc}</div>
          <div class="rom-tap-arena" id="rom-tap-arena"></div>
        `;
        const arena = document.getElementById('rom-tap-arena');
        const finishTap = (isPerfect) => {
          if (doneTap) return;
          doneTap = true;
          clearTimeout(tapTimer);
          const loveAdd = isPerfect ? 6 : (caught >= 2 ? 4 : 3);
          const resTxt = isPerfect ? mg.perfectText : (caught >= 2 ? mg.goodText : mg.missText);
          if (isPerfect) { sfx.victory(); showToast('🎯 전부 캐치!! 호감도 +6!', 'break'); }
          else { sfx.powerup(); showToast(`💕 호감도 +${loveAdd}!`, 'good'); }
          if (!state.love) state.love = { yuki: 0, chloe: 0 };
          state.love[hKey] = clamp((state.love[hKey] || 0) + loveAdd, 0, 200);
          state.activeRomanceStory = { ...ars, mgDone: true, mgResultText: resTxt };
          render();
        };
        const tapTimer = setTimeout(() => {
          if (state.phase === 'romance_story' && !doneTap) finishTap(false);
        }, 6500);

        const coords = [
          { l: '12%', t: '32px' },
          { l: '64%', t: '28px' },
          { l: '24%', t: '138px' },
          { l: '68%', t: '142px' },
        ];
        icons.forEach((sym, i) => {
          const btn = document.createElement('button');
          btn.className = 'rom-tap-target';
          btn.textContent = sym;
          btn.style.left = coords[i % coords.length].l;
          btn.style.top = coords[i % coords.length].t;
          btn.onclick = () => {
            if (doneTap || btn.dataset.hit) return;
            btn.dataset.hit = '1';
            btn.style.opacity = '0.2';
            btn.style.transform = 'scale(1.25)';
            sfx.powerup();
            caught += 1;
            const cntEl = document.getElementById('rom-tap-cnt');
            if (cntEl) cntEl.textContent = String(caught);
            if (caught >= icons.length) finishTap(true);
          };
          if (arena) arena.appendChild(btn);
        });
        return;
      }

      if (mg.type === 'memory') {
        const seq = mg.seq || ['🍵', '📖', '🧁'];
        const shuffled = [...seq].sort(() => Math.random() - 0.5);
        let stepIdx = 0;
        let revealed = true;
        elRomMgPanel.innerHTML = `
          <div style="font-size:11.5px;color:#fde047;font-weight:800;margin-bottom:4px;">🎮 ${epObj.title}</div>
          <div style="font-weight:900;font-size:17px;margin-bottom:4px;">${mg.title}</div>
          <div style="font-size:12.5px;color:#fde047;font-weight:700;" id="rom-mem-hint">👀 2초 동안 순서를 기억하세요: ${seq.join(' → ')}</div>
          <div class="rom-mem-row" id="rom-mem-row"></div>
        `;
        const row = document.getElementById('rom-mem-row');
        const cards = shuffled.map((sym) => {
          const c = document.createElement('button');
          c.className = 'rom-mem-card';
          c.textContent = sym;
          c.disabled = true;
          c.onclick = () => {
            if (revealed) return;
            if (sym === seq[stepIdx]) {
              sfx.powerup();
              c.textContent = sym;
              c.classList.add('is-done');
              c.disabled = true;
              stepIdx += 1;
              if (stepIdx >= seq.length) {
                sfx.victory();
                showToast('🧠 완벽한 기억력!! 호감도 +6!', 'break');
                if (!state.love) state.love = { yuki: 0, chloe: 0 };
                state.love[hKey] = clamp((state.love[hKey] || 0) + 6, 0, 200);
                state.activeRomanceStory = { ...ars, mgDone: true, mgResultText: mg.perfectText };
                render();
              }
            } else {
              sfx.click();
              showToast('😅 아쉽! 그래도 호감도 +3!', 'good');
              if (!state.love) state.love = { yuki: 0, chloe: 0 };
              state.love[hKey] = clamp((state.love[hKey] || 0) + 3, 0, 200);
              state.activeRomanceStory = { ...ars, mgDone: true, mgResultText: mg.goodText || mg.missText };
              render();
            }
          };
          if (row) row.appendChild(c);
          return c;
        });
        setTimeout(() => {
          if (state.phase !== 'romance_story') return;
          revealed = false;
          const hEl = document.getElementById('rom-mem-hint');
          if (hEl) hEl.textContent = `👉 이제 기억한 순서대로 누르세요! (${seq.length}개)`;
          cards.forEach((c) => {
            c.textContent = '❓';
            c.disabled = false;
          });
        }, 2000);
        return;
      }

      if (mg.type === 'rps') {
        elRomMgPanel.innerHTML = headerHtml;
        const rpsOpts = [
          { id: 'r', label: '✊ 바위 내기!', beats: 's' },
          { id: 's', label: '✌️ 가위 내기!', beats: 'p' },
          { id: 'p', label: '✋ 보 내기!', beats: 'r' },
        ];
        rpsOpts.forEach((opt) => {
          const rb = document.createElement('button');
          rb.className = 'rom-mg-choice-btn';
          rb.textContent = opt.label;
          rb.onclick = () => {
            const ai = rpsOpts[Math.floor(Math.random() * 3)];
            let loveAdd = 3;
            let resTxt = '';
            if (opt.beats === ai.id) {
              loveAdd = 6;
              sfx.victory();
              showToast(`✌️ 승리! 호감도 +6!`, 'break');
              resTxt = `${mg.perfectText} (${hName}: ${ai.label})`;
            } else if (opt.id === ai.id) {
              loveAdd = 4;
              sfx.powerup();
              showToast(`🤝 무승부! 호감도 +4!`, 'good');
              resTxt = `${mg.goodText}`;
            } else {
              loveAdd = 2;
              sfx.click();
              showToast(`😆 아쉽게 패배! 호감도 +2!`, 'good');
              resTxt = `${mg.missText}`;
            }
            if (!state.love) state.love = { yuki: 0, chloe: 0 };
            state.love[hKey] = clamp((state.love[hKey] || 0) + loveAdd, 0, 200);
            state.activeRomanceStory = { ...ars, mgDone: true, mgResultText: resTxt };
            render();
          };
          elRomMgPanel.appendChild(rb);
        });
        return;
      }

      if (mg.type === 'quiz' || mg.type === 'counter' || mg.type === 'phrase') {
        elRomMgPanel.innerHTML = headerHtml;
        mg.options.forEach((opt) => {
          const ob = document.createElement('button');
          ob.className = 'rom-mg-choice-btn';
          ob.textContent = opt.text;
          ob.onclick = () => {
            const loveAdd = opt.correct ? 6 : 3;
            if (opt.correct) { sfx.victory(); showToast('🎯 대성공!! 호감도 +6!', 'break'); }
            else { sfx.click(); showToast('💕 호감도 +3!', 'good'); }
            if (!state.love) state.love = { yuki: 0, chloe: 0 };
            state.love[hKey] = clamp((state.love[hKey] || 0) + loveAdd, 0, 200);
            state.activeRomanceStory = { ...ars, mgDone: true, mgResultText: opt.reply };
            render();
          };
          elRomMgPanel.appendChild(ob);
        });
        return;
      }
    }

    elBattleLog.textContent = ars.mgDone && ars.mgResultText ? ars.mgResultText : sc.text;

    const finishEpisode = (replyText = '') => {
      sfx.victory();
      advanceDailyQuest('care', 1);
      if (!state.romanceStory) state.romanceStory = { yuki: { ep: 0, cleared: false }, chloe: { ep: 0, cleared: false } };
      if (!state.lovers) state.lovers = [];
      if (!state.someCleared) state.someCleared = { yuki: false, chloe: false };
      if (!state.lastRomanceEpDay) state.lastRomanceEpDay = { yuki: 0, chloe: 0 };
      state.lastRomanceEpDay[hKey] = state.day;
      const st = state.romanceStory[hKey];
      if (epObj.ep > st.ep) st.ep = epObj.ep;
      if (epObj.ep >= arr.length) {
        st.cleared = true;
        state.someCleared[hKey] = true;
        if (!state.lovers.includes(hKey)) state.lovers.push(hKey);
        showToast(`💖 [${hName} 연애 스토리 20화 완결!!] 정식 연인 & 자유 데이트 해금!`, 'break');
      } else {
        showToast(`💕 ${hName} ${epObj.ep}화 클리어!`, 'good');
      }
      state.activeRomanceStory = { heroine: hKey, epIdx: ars.epIdx, reply: replyText };
      state.phase = 'romance_epilogue';
      saveGame();
      render();
    };

    if (!sc.choices) {
      const nxtBtn = document.createElement('button');
      nxtBtn.className = 'choice-btn primary';
      nxtBtn.innerHTML = isFinalScene
        ? `<span class="choice-title">🌙 제${epObj.ep}화 마무리하기 ▶</span><span class="choice-sub">아련한 여운 & 다음 화 예고 보기</span>`
        : `<span class="choice-title">다음 장면으로 ▶</span><span class="choice-sub">${epObj.title} (${scIdx + 1}/${epObj.scenes.length})</span>`;
      nxtBtn.addEventListener('click', () => {
        if (isFinalScene) {
          finishEpisode('');
          return;
        }
        sfx.click();
        state.activeRomanceStory = { heroine: hKey, epIdx: ars.epIdx, sceneIdx: scIdx + 1 };
        render();
      });
      elChoicesPanel.appendChild(nxtBtn);
    } else {
      const pickChoice = (ch) => {
        if (elRomMgOverlay) elRomMgOverlay.classList.add('hidden');
        applyChoiceReward(ch);
        if (!isFinalScene) {
          sfx.powerup();
          showToast(`💕 ${hName}의 마음이 움직였다!`, 'good');
          state.activeRomanceStory = { heroine: hKey, epIdx: ars.epIdx, sceneIdx: scIdx + 1, mgDone: true, mgResultText: ch.reply };
          saveGame();
          render();
          return;
        }
        finishEpisode(ch.reply);
      };
      if (elRomMgOverlay && elRomMgPanel) {
        elRomMgOverlay.classList.remove('hidden');
        elRomMgPanel.innerHTML = `
          <div style="font-size:11.5px;color:#fde047;font-weight:800;margin-bottom:4px;">💗 ${epObj.title}</div>
          <div style="font-size:13.5px;line-height:1.5;margin-bottom:8px;">${sc.text}</div>
          <div id="rom-choice-list"></div>
        `;
        const cList = elRomMgPanel.querySelector('#rom-choice-list');
        sc.choices.forEach((ch) => {
          const ob = document.createElement('button');
          ob.className = 'rom-choice-overlay-btn';
          ob.textContent = ch.label;
          ob.addEventListener('click', () => pickChoice(ch));
          cList.appendChild(ob);
        });
      }
      sc.choices.forEach((ch) => {
        const cb = document.createElement('button');
        cb.className = 'choice-btn';
        cb.innerHTML = `<span class="choice-title">${ch.label}</span><span class="choice-sub">💬 선택 후 반응 확인</span>`;
        cb.addEventListener('click', () => pickChoice(ch));
        elChoicesPanel.appendChild(cb);
      });
    }
    return;
  }

  // 4-R0.5 V35.0 연애 스토리 매 화 아련한 여운 엔딩 컷신
  if (state.phase === 'romance_epilogue') {
    const ars = state.activeRomanceStory || { heroine: 'yuki', epIdx: 0, reply: '' };
    const hKey = ars.heroine === 'chloe' ? 'chloe' : 'yuki';
    const arr = hKey === 'yuki' ? YUKI_ROMANCE_STORY : CHLOE_ROMANCE_STORY;
    const epIdx = clamp(ars.epIdx || 0, 0, arr.length - 1);
    const epObj = arr[epIdx];
    const hName = hKey === 'yuki' ? '🇯🇵 유키' : '🇺🇸 클로이';

    elLocation.textContent = `${timeLabel} · ✨ ${hName} · 제${epObj.ep}화 여운`;
    elSceneTag.textContent = `완결 여운`;
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = `🌙 ${epObj.title} — 끝`;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');

    if (epObj.img.endsWith('.png')) {
      setStageBg(hKey === 'yuki' ? 'bg_mapo.jpg' : 'bg_seongsu.jpg');
      if (elFrame) elFrame.classList.add('combat-stage');
      if (epObj.img.includes('couple_') && elCoupleSprite) {
        elCoupleSprite.src = `${epObj.img}?v=88`;
        elCoupleSprite.classList.remove('hidden');
      } else {
        elHeroSprite.classList.remove('hidden');
        if (hKey === 'yuki' && elYukiSprite) elYukiSprite.classList.remove('hidden');
        if (hKey === 'chloe' && elChloeSprite) elChloeSprite.classList.remove('hidden');
      }
    } else {
      if (elFrame) elFrame.classList.add('couple-stage');
      elSceneImage.src = `${epObj.img}?v=88`;
      elSceneImage.classList.remove('hidden');
    }
    if (elDateFxLayer) {
      elDateFxLayer.className = 'date-fx-layer fx-stars';
      elDateFxLayer.innerHTML = ['✨', '💖', '🌙', '💫'].map((s, i) => `<span class="fx-particle" style="left:${12 + i * 22}%;top:60%;animation-delay:${i * 0.45}s;">${s}</span>`).join('');
    }

    const epText = epObj.epilogue || '서로를 향한 마음이 한 걸음 더 깊어진 밤, 아련한 미소만이 오래도록 남았다.';
    const teaserText = epObj.nextTeaser || (epObj.ep < arr.length ? `제${epObj.ep + 1}화가 이어집니다...` : '🎉 20화 대장정 완결!');
    elBattleLog.innerHTML = `
      <div class="romance-epilogue-card">
        ${ars.reply ? `<div style="font-weight:700;margin-bottom:6px;color:#9f1239;">💬 ${ars.reply}</div>` : ''}
        <div style="font-size:12.5px;margin-bottom:8px;">🌙 ${epText}</div>
        <div style="font-size:11.5px;font-weight:800;color:#be123c;border-top:1px dashed #fda4af;padding-top:6px;">📺 ${teaserText}</div>
      </div>
    `;
    elChoicesPanel.className = 'choices-panel';

    const stNow = state.romanceStory?.[hKey] || { ep: 0, cleared: false };
    const blockedToday = !stNow.cleared && state.lastRomanceEpDay?.[hKey] === state.day;
    if (epIdx + 1 < arr.length) {
      const nextEpBtn = document.createElement('button');
      nextEpBtn.className = blockedToday ? 'choice-btn' : 'choice-btn primary';
      nextEpBtn.disabled = blockedToday;
      nextEpBtn.innerHTML = blockedToday
        ? `<span class="choice-title">⏳ 다음 화(제${epIdx + 2}화)는 내일(DAY ${state.day + 1}) 열립니다!</span><span class="choice-sub">오늘의 연애 스토리를 완료했습니다 (${arr[epIdx + 1].title})</span>`
        : `<span class="choice-title">📖 다음 화 (제${epIdx + 2}화) 바로 이어서 보기 ▶</span><span class="choice-sub">${arr[epIdx + 1].title}</span>`;
      nextEpBtn.onclick = () => {
        if (blockedToday) return;
        sfx.powerup();
        state.activeRomanceStory = { heroine: hKey, epIdx: epIdx + 1, sceneIdx: 0 };
        state.phase = 'romance_story';
        render();
      };
      elChoicesPanel.appendChild(nextEpBtn);
    }

    const hubBtn = document.createElement('button');
    hubBtn.className = 'choice-btn';
    hubBtn.innerHTML = `<span class="choice-title">🏠 연애 허브로 돌아가기</span><span class="choice-sub">오늘의 여운을 간직한 채 다음 일정을 정합니다.</span>`;
    hubBtn.onclick = () => {
      sfx.click();
      state.activeRomanceStory = null;
      state.phase = 'romance';
      state.log = `🌙 [${epObj.title}] 완결! (현재 ${hName} 호감도: ${state.love?.[hKey] || 0})`;
      saveGame();
      render();
    };
    elChoicesPanel.appendChild(hubBtn);
    return;
  }

  // 4-R1. 외국어 공부 퀴즈 화면
  if (state.phase === 'lang_quiz') {
    const isJp = state.romanceTarget === 'yuki';
    const hero = isJp ? HEROINES.yuki : HEROINES.chloe;
    const pool = isJp ? LANG_QUIZZES.jp : LANG_QUIZZES.en;
    const quiz = pool[state.currentQuizIdx % pool.length];

    elLocation.textContent = `DAY ${state.day} · ${timeLabel} · ${hero.langName} 공부`;
    elSceneTag.textContent = `${hero.langName} 퀴즈`;
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = `${hero.name}와(과) 어학 스터디`;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    elSceneImage.src = hero.imgNormal;
    elSceneImage.classList.remove('hidden');
    elBattleLog.textContent = `❓ [문제] ${quiz.q}`;
    elChoicesPanel.className = 'choices-panel';

    quiz.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn row-btn';
      btn.innerHTML = `<span>${idx + 1}. ${opt}</span><span class="choice-sub">선택</span>`;
      btn.addEventListener('click', () => {
        const correct = idx === quiz.answer;
        if (!state.lastStudyDay) state.lastStudyDay = { jp: 0, en: 0 };
        state.lastStudyDay[isJp ? 'jp' : 'en'] = state.day;
        if (correct) {
          sfx.victory();
          vibrate(30);
          if (isJp) {
            state.lang.jp += 1;
            state.love.yuki = clamp(state.love.yuki + 4, 0, state.someCleared?.yuki ? 100 : 75);
            state.stats.speech += 1;
            if (!state.lastContactDay) state.lastContactDay = { yuki: state.day, chloe: state.day };
            state.lastContactDay.yuki = state.day;
          } else {
            state.lang.en += 1;
            state.love.chloe = clamp(state.love.chloe + 4, 0, state.someCleared?.chloe ? 100 : 75);
            state.stats.guts += 1;
            if (!state.lastContactDay) state.lastContactDay = { yuki: state.day, chloe: state.day };
            state.lastContactDay.chloe = state.day;
          }
          state.followers = (state.followers || 120) + 120;
          const dayStudyBonus = state.timeIndex <= 1 ? 5 : 0;
          if (dayStudyBonus > 0) state.points += dayStudyBonus;
          state.log = `🎉 정답!! ${quiz.reactOk.replace(/호감도\+\d+/g, '호감도+4')}${dayStudyBonus > 0 ? '\n☀️ [낮 스터디 보너스] 도덕점수 +5 P!' : ''}`;
        } else {
          sfx.damage();
          if (isJp) state.love.yuki = clamp(state.love.yuki - 5, 0, 100);
          else state.love.chloe = clamp(state.love.chloe - 5, 0, 100);
          state.log = `😅 오답! ${quiz.reactNo}`;
        }
        advanceTime();
        state.phase = 'romance';
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(btn);
    });
    return;
  }

  // 4-R1.2. 알아가는 단계 (호감도 35 미만 · 일러스트 없는 텍스트 중심)
  if (state.phase === 'getting_to_know') {
    const key = state.romanceTarget === 'chloe' ? 'chloe' : 'yuki';
    const pool = GETTING_TO_KNOW_EVENTS[key];
    const ev = pool[(state.currentQuizIdx || 0) % pool.length];
    elLocation.textContent = `DAY ${state.day} · 알아가는 중`;
    elSceneTag.textContent = '첫 만남';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = ev.title;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = ev.quote;
    elQuoteBubble.classList.remove('hidden');
    showSceneCard('💬 GETTING TO KNOW', ev.ascii, '호감도 35 달성 시 정식 데이트 & 일러스트 해금!');
    elBattleLog.textContent = ev.text;
    elChoicesPanel.className = 'choices-panel';

    ev.choices.forEach((ch) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn row-btn';
      btn.innerHTML = `<span>${ch.text}</span><span class="choice-sub">💬 대화 선택</span>`;
      btn.addEventListener('click', () => {
        sfx.victory();
        state.love[key] = clamp((state.love[key] || 0) + (ch.love || 8), 0, 100);
        if (ch.lawful) state.lawful += ch.lawful;
        if (ch.chaotic) state.chaotic += ch.chaotic;
        if (ch.speech) state.stats.speech += ch.speech;
        if (ch.guts) state.stats.guts += ch.guts;
        if (ch.law) state.stats.law += ch.law;
        if (ch.sp) state.sp = clamp(state.sp + ch.sp, 0, state.maxSp);
        if (ch.followers) state.followers = (state.followers || 120) + ch.followers;
        if (!state.lastContactDay) state.lastContactDay = { yuki: state.day, chloe: state.day };
        state.lastContactDay[key] = state.day;
        const unlockedDate = state.love[key] >= 35;
        state.log = `💬 ${ch.reply}${unlockedDate ? `\n🎉 이제 ${key === 'yuki' ? '유키' : '클로이'}와 꽤 친해졌습니다! 정식 데이트가 해금되었습니다!` : ''}`;
        advanceTime();
        state.phase = 'romance';
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(btn);
    });
    return;
  }

  // 4-R1.5. 썸 돌파 위기 이벤트
  if (state.phase === 'some_crisis') {
    const key = state.romanceTarget === 'chloe' ? 'chloe' : 'yuki';
    const ev = SOME_CRISIS_EVENTS[key];
    elLocation.textContent = `DAY ${state.day} · 썸 돌파 위기!`;
    elSceneTag.textContent = '긴급 위기';
    elSceneTag.className = 'scene-tag boss';
    elSceneTitle.textContent = ev.title;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = ev.quote;
    elQuoteBubble.classList.remove('hidden');
    elSceneImage.src = ev.image;
    elSceneImage.classList.remove('hidden');
    elBattleLog.textContent = ev.text;
    elChoicesPanel.className = 'choices-panel';

    ev.choices.forEach((ch) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn row-btn';
      btn.innerHTML = `<span>${ch.text}</span><span class="choice-sub">필요 ${ch.reqStat === 'law' ? '법률' : ch.reqStat === 'guts' ? '배짱' : '언변'} ${ch.reqVal}+</span>`;
      btn.addEventListener('click', () => {
        const ok = (state.stats[ch.reqStat] || 0) >= ch.reqVal;
        if (ok) {
          sfx.victory();
          if (!state.someCleared) state.someCleared = { yuki: false, chloe: false };
          state.someCleared[key] = true;
          state.love[key] = clamp((state.love[key] || 0) + 12, 0, 100);
          if (key === 'yuki') grantClue('clue_cafe');
          else grantClue('clue_cctv');
          state.log = `💖 [썸 돌파 성공!!] ${ch.okLog} (호감도 +12 · 100까지 해금!)`;
        } else {
          sfx.damage();
          state.log = `😅 [아쉬운 대처] ${ch.failLog}`;
        }
        advanceTime();
        state.phase = 'romance';
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(btn);
    });
    return;
  }

  // 4-R1.6. 연애 라이벌 견제 이벤트
  if (state.phase === 'rival_scene') {
    const key = state.romanceTarget === 'chloe' ? 'chloe' : 'yuki';
    const ev = RIVAL_EVENTS[key];
    elLocation.textContent = `DAY ${state.day} · 연애 라이벌 출현`;
    elSceneTag.textContent = '라이벌 견제';
    elSceneTag.className = 'scene-tag boss';
    elSceneTitle.textContent = ev.title;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    elSceneImage.src = HEROINES[key].imgNormal;
    elSceneImage.classList.remove('hidden');
    elBattleLog.textContent = ev.text;
    elChoicesPanel.className = 'choices-panel';

    ev.choices.forEach((ch) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn row-btn';
      btn.innerHTML = `<span>${ch.text}</span><span class="choice-sub">라이벌 대처</span>`;
      btn.addEventListener('click', () => {
        let ok = true;
        if (ch.cost) {
          if (state.points < ch.cost) { sfx.damage(); state.log = '💸 포인트가 부족합니다!'; render(); return; }
          state.points -= ch.cost;
        } else if (ch.reqStat) {
          ok = (state.stats[ch.reqStat] || 0) >= ch.reqVal;
        } else if (ch.reqFollowers) {
          ok = (state.followers || 120) >= ch.reqFollowers;
        }
        if (ok) {
          sfx.victory();
          state.love[key] = clamp((state.love[key] || 0) + 8, 0, state.someCleared?.[key] ? 100 : 75);
          state.log = `✨ ${ch.okText}`;
        } else {
          sfx.damage();
          state.love[key] = clamp((state.love[key] || 0) - 4, 0, 100);
          state.log = `💢 ${ch.failText}`;
        }
        advanceTime();
        state.phase = 'romance';
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(btn);
    });
    return;
  }

  // 4-R2. 데이트 & 고백 미연시 씬
  if (state.phase === 'date_scene') {
    const key = state.romanceTarget === 'chloe' ? 'chloe' : 'yuki';
    if (!state.lastDateDay) state.lastDateDay = { yuki: 0, chloe: 0 };
    state.lastDateDay[key] = state.day;
    const otherKey = key === 'yuki' ? 'chloe' : 'yuki';
    const langKey = key === 'yuki' ? 'jp' : 'en';
    const hero = HEROINES[key];
    const isConfess = key === 'yuki'
      ? (state.love.yuki || 0) >= 95 && (state.lang.jp || 0) >= 6 && (state.dateCount?.yuki || 0) >= 3 && state.lawful >= 20 && state.stats.speech >= 5 && !state.lovers.includes('yuki')
      : (state.love.chloe || 0) >= 95 && (state.lang.en || 0) >= 6 && (state.dateCount?.chloe || 0) >= 3 && state.stats.guts >= 5 && (state.followers || 0) >= 500 && !state.lovers.includes('chloe');
    const normalPool = [...DATE_EVENTS[key].normal];
    if (key === 'yuki' && state.pet?.adopted && DATE_EVENTS.yuki.petDate) {
      normalPool.push(DATE_EVENTS.yuki.petDate);
    }
    const ev = isConfess
      ? DATE_EVENTS[key].confess
      : (state.isDriveDate && DATE_EVENTS[key].drive
        ? DATE_EVENTS[key].drive
        : normalPool[(state.currentQuizIdx || 0) % normalPool.length]);

    elLocation.textContent = `DAY ${state.day} · ${timeLabel} · ${state.isDriveDate ? '드라이브 데이트' : '데이트'}`;
    elSceneTag.textContent = isConfess ? '고백 타임!' : (state.isDriveDate ? '🚗 드라이브' : '데이트');
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = ev.title;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = ev.quote;
    elQuoteBubble.classList.remove('hidden');
    if (isConfess) {
      elSceneImage.src = hero.imgSpecial;
    } else if (state.isDriveDate) {
      const carTier = Math.min(3, Math.max(1, state.carLevel || 1));
      elSceneImage.src = `assets/images/drive_${key}_${carTier}.jpg?v=65`;
    } else {
      elSceneImage.src = ev.image || hero.imgNormal;
    }
    elSceneImage.classList.remove('hidden');
    elBattleLog.textContent = ev.text;
    elChoicesPanel.className = 'choices-panel';

    shuffle(ev.choices).forEach((ch) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn row-btn';
      btn.innerHTML = `<span>${ch.text}</span><span class="choice-sub">💬 대화 선택</span>`;
      btn.addEventListener('click', () => {
        let loveGain = ch.love || 0;
        let extraMsg = '';

        // V14.0: 드라이브 데이트 보너스 & 반려견 콩이 동행 보너스
        if (!isConfess && loveGain > 0 && state.isDriveDate) {
          const dBonus = CARS[(state.carLevel || 1) - 1]?.driveBonus || 4;
          loveGain += dBonus;
          extraMsg += `\n🚗 (드라이브 보너스 +${dBonus}!)`;
        }
        if (!isConfess && loveGain > 0 && state.pet?.adopted) {
          loveGain += 5;
          extraMsg += `\n🐶 (반려견 콩이 애교 보너스 +5!)`;
        }

        // 어학 장벽: Lv.2 미만이면 호감도 상승 절반
        if (!isConfess && loveGain > 0 && (state.lang[langKey] || 0) < 2) {
          loveGain = Math.max(3, Math.floor(loveGain * 0.5));
          extraMsg += `\n🗣️ (어학 Lv.2 미만이라 말이 잘 안 통해 호감도가 ${loveGain}만 올랐습니다!)`;
        }

        if (loveGain < 0) sfx.damage();
        else sfx.victory();
        vibrate([30, 30, 50]);

        const maxLoveCap = state.someCleared?.[key] ? 100 : 75;
        state.love[key] = clamp((state.love[key] || 0) + loveGain, 0, maxLoveCap);
        if (key === 'yuki' && state.love.yuki >= 40) grantClue('clue_cafe');
        if (key === 'chloe' && state.love.chloe >= 40) grantClue('clue_cctv');
        if (ch.lawful) state.lawful += ch.lawful;
        if (ch.chaotic) state.chaotic += ch.chaotic;
        if (ch.maxHp) state.maxHp += ch.maxHp;
        if (ch.hp) state.hp = clamp(state.hp + ch.hp, 1, state.maxHp);
        if (ch.sp) state.sp = clamp(state.sp + ch.sp, 0, state.maxSp);
        if (ch.dmg) state.bonusDmg += ch.dmg;
        if (ch.guts) state.stats.guts += ch.guts;
        if (ch.points) state.points += ch.points;
        if (ch.followers) state.followers = (state.followers || 120) + ch.followers;
        if (ch.becomeLover && !state.lovers.includes(key)) {
          state.lovers.push(key);
        }

        // 양다리 질투 리스크: 상대 호감도 60+ 시 30% 확률로 들킴 + 40% 확률로 삐짐(전투 불참)
        if (!isConfess && (state.love[otherKey] || 0) >= 60 && Math.random() < 0.30) {
          state.love[key] = clamp(state.love[key] - 12, 0, 100);
          state.love[otherKey] = clamp(state.love[otherKey] - 12, 0, 100);
          const otherName = otherKey === 'yuki' ? '유키' : '클로이';
          if (Math.random() < 0.40) {
            if (!state.sulky) state.sulky = { yuki: false, chloe: false };
            state.sulky[otherKey] = true;
            extraMsg += `\n💢 [수라장 발발!!] ${otherName}가 단단히 삐져서 화해 전까지 데이트·전투에 불참합니다!`;
          } else {
            extraMsg += `\n😱 [양다리 질투 발각!!] ${otherName}에게 데이트가 들켜 양쪽 호감도가 -12 깎였습니다!`;
          }
        }

        // V15.0: 성향별 리액션 & 데이트 후 톡방 후일담 발송
        const repInfo = getReputationInfo();
        if (repInfo.mode === 'lawful') {
          extraMsg += key === 'yuki'
            ? '\n😇 (유키: "역시 모범시민 히어로님은 너무 믿음직스러워요~")'
            : '\n😇 (클로이: "진짜 반듯한 히어로네~ 매력 터져!")';
        } else if (repInfo.mode === 'chaotic') {
          extraMsg += key === 'yuki'
            ? '\n😈 (유키: "가끔 눈빛이 무서울 때도 있지만... 저한텐 다정하시네요!")'
            : '\n😈 (클로이: "Haha, 너 그 맑은 눈의 광기 진짜 내 취향이야!")';
        }

        if (loveGain > 0) {
          if (!state.dailyStats) state.dailyStats = { wins: 0, loveGain: 0 };
          state.dailyStats.loveGain += loveGain;
          if (!state.dateMessages) state.dateMessages = [];
          state.dateMessages.unshift({
            sender: key === 'yuki' ? '🇯🇵 유키' : '🇺🇸 클로이',
            title: `DAY ${state.day} · ${ev.title}`,
            body: key === 'yuki'
              ? `"오늘 정말 행복했어요! 조심히 들어가시고 내일 또 봐요 ♥ (호감도 ${state.love.yuki}/100)"`
              : `"오늘 진짜 레전드 데이트였어! 다음엔 더 재밌는 데 가자 ♥ (호감도 ${state.love.chloe}/100)"`,
          });
          if (state.dateMessages.length > 8) state.dateMessages.pop();
          state.unreadMessages += 1;
          showToast(`💬 ${key === 'yuki' ? '유키' : '클로이'}에게서 데이트 후일담 문자가 왔습니다!`, 'good');
        }

        advanceTime();
        state.phase = 'romance';
        state.log = ch.reply + extraMsg;
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(btn);
    });
    return;
  }

  // 4-0. 소설형 메인 스토리 진행 화면
  if (state.phase === 'story') {
    const ch = STORY_CHAPTERS[state.chapterIndex];
    if (!ch) {
      state.phase = 'map';
      render();
      return;
    }
    const sc = ch.scenes[state.storySceneIndex] || ch.scenes[0];
    elLocation.textContent = `DAY ${state.day} · ${timeLabel} · 메인 스토리`;
    elSceneTag.textContent = sc.tag;
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = sc.title;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    if (sc.quote) {
      elQuoteBubble.textContent = sc.quote;
      elQuoteBubble.classList.remove('hidden');
    } else {
      elQuoteBubble.classList.add('hidden');
    }
    elSceneImage.classList.remove('enemy-sprite', 'boss-scale');
    if (sc.image) {
      elSceneImage.src = sc.image;
      elSceneImage.classList.remove('hidden');
      if (sc.image.endsWith('.png')) {
        elFrame.classList.add('story-stage');
      }
    } else {
      showSceneCard(sc.badge, sc.ascii, sc.sub);
    }
    setLogText(sc.text, true);
    elChoicesPanel.className = 'choices-panel';

    sc.choices.forEach((choice) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span>${choice.text}</span><span class="choice-sub">${choice.sub}</span>`;
      btn.addEventListener('click', () => {
        sfx.click();
        if (choice.effect) {
          const ef = choice.effect;
          if (ef.lawful) state.lawful += ef.lawful;
          if (ef.chaotic) state.chaotic += ef.chaotic;
          if (ef.sp) state.sp = clamp(state.sp + ef.sp, 0, state.maxSp);
          if (ef.points) state.points += ef.points;
          if (ef.report) state.pendingReports += ef.report;
          if (ef.speech) state.stats.speech += ef.speech;
          if (ef.guts) state.stats.guts += ef.guts;
          if (ef.law) state.stats.law += ef.law;
          if (ef.loveYuki) state.love.yuki = clamp((state.love.yuki || 0) + ef.loveYuki, 0, 100);
          if (ef.loveChloe) state.love.chloe = clamp((state.love.chloe || 0) + ef.loveChloe, 0, 100);
          if (ef.followers) state.followers = (state.followers || 120) + ef.followers;
        }
        if (choice.completeChapterOnly) {
          sfx.victory();
          const prevCh = state.chapterIndex;
          state.chapterIndex += 1;
          state.storySceneIndex = 0;
          state.unreadMessages += 1;
          gainHeroExp(50);
          notifyNewUnlocks(prevCh, state.chapterIndex);
          advanceTime();
          state.phase = 'map';
          state.log = `✅ [제${ch.chapterNum}화] ${ch.title} 클리어! 다음 이야기가 해금되었습니다.`;
          saveGame();
          render();
        } else if (choice.startBoss) {
          startBattle(ch.bossId);
        } else if (typeof choice.nextScene === 'number') {
          state.storySceneIndex = choice.nextScene;
          saveGame();
          render();
        }
      });
      elChoicesPanel.appendChild(btn);
    });
    return;
  }

  // 4-0.5. 돌발 2단 콤보 미니 이벤트 화면
  if (state.phase === 'mini_event') {
    const ev = MINI_EVENTS.find((e) => e.id === state.currentMiniEventId) || MINI_EVENTS[0];
    elLocation.textContent = `DAY ${state.day} · ${timeLabel} · 돌발`;
    elSceneTag.textContent = '돌발 2단 이벤트';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = ev.title;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    showSceneCard(ev.badge, ev.ascii, ev.sub);
    elBattleLog.textContent = ev.text;
    elChoicesPanel.className = 'choices-panel';

    shuffle(ev.choices).forEach((ch) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn row-btn';
      btn.innerHTML = `<span>${ch.text}</span><span class="choice-sub">💬 대화 선택</span>`;
      btn.addEventListener('click', () => {
        sfx.powerup();
        vibrate(25);
        const ef = ch.effect || {};
        if (ef.points) state.points = Math.max(0, state.points + ef.points);
        if (ef.maxHp) state.maxHp += ef.maxHp;
        if (ef.hp) state.hp = clamp(state.hp + ef.hp, 1, state.maxHp);
        if (ef.sp) state.sp = clamp(state.sp + ef.sp, 0, state.maxSp);
        if (ef.speech) state.stats.speech += ef.speech;
        if (ef.guts) state.stats.guts += ef.guts;
        if (ef.law) state.stats.law += ef.law;
        if (ef.lawful) state.lawful += ef.lawful;
        if (ef.chaotic) state.chaotic += ef.chaotic;
        if (ef.report) state.pendingReports += ef.report;
        if (ef.chaos) state.chaosLevel = clamp((state.chaosLevel ?? 25) + ef.chaos, 0, 100);
        if (ch.feed) {
          state.followers = (state.followers || 120) + 180;
          state.liveFeed = { ...ch.feed, likes: '❤️ 3.4만' };
        }
        state.phase = 'map';
        state.log = ch.msg;
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(btn);
    });
    return;
  }

  // 4-1. 랜덤 거리 이벤트
  if (state.phase === 'random_event') {
    const ev = RANDOM_EVENTS.find((e) => e.id === state.currentEventId) || RANDOM_EVENTS[0];
    elLocation.textContent = `DAY ${state.day} · ${timeLabel} · 돌발`;
    elSceneTag.textContent = '돌발 사건';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = ev.title;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    showSceneCard('⚡ STREET ENCOUNTER', ev.ascii, '선택에 따라 성향과 보상이 달라집니다!');
    elBattleLog.textContent = ev.text;

    elChoicesPanel.className = 'choices-panel';
    shuffle(ev.choices).forEach((ch) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span>${ch.text}</span><span class="choice-sub">💬 대화 선택</span>`;
      btn.addEventListener('click', () => {
        sfx.powerup();
        vibrate(25);
        const ef = ch.effect || {};
        if (ef.hp) state.hp = clamp(state.hp + ef.hp, 1, state.maxHp);
        if (ef.sp) state.sp = clamp(state.sp + ef.sp, 0, state.maxSp);
        if (ef.points) state.points += ef.points;
        if (ef.lawful) state.lawful += ef.lawful;
        if (ef.chaotic) state.chaotic += ef.chaotic;
        if (ef.speech) state.stats.speech += ef.speech;
        if (ef.guts) state.stats.guts += ef.guts;
        if (ef.law) state.stats.law += ef.law;
        if (ef.report) state.pendingReports += ef.report;
        advanceTime();
        state.phase = 'map';
        state.log = ch.result;
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(btn);
    });
    return;
  }

  // 4-2. 알바 & 자기계발
  if (state.phase === 'activity') {
    elLocation.textContent = `DAY ${state.day} · ${timeLabel}`;
    elSceneTag.textContent = '자유 활동';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = '알바 & 자기계발';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    showSceneCard(
      '💼 알바 & 자기계발',
      ' 🏪 편의점 알바  │ 📚 구립 도서관  │ 🏋️ 공원 철봉\n   (+45 P)     │  (언변·법 +1)  │  (깡다구 +1)',
      '시간이 1타임 흐릅니다'
    );
    elBattleLog.textContent = state.log;
    elChoicesPanel.className = 'choices-panel';

    const acts = [
      {
        label: '🏪 편의점 타임 알바 뛰기',
        sub: '+45 P · 인내심 -10 · 시간 +1',
        run: () => {
          sfx.powerup();
          state.points += 45;
          state.hp = clamp(state.hp - 10, 1, state.maxHp);
          advanceTime();
          state.phase = 'map';
          state.log = '💼 편의점 알바를 무사히 마쳐 일당 45 P를 받았습니다!';
        },
      },
      {
        label: '📚 구립 도서관에서 경범죄·화법 공부',
        sub: '언변 +1 · 법지식 +1 · 시간 +1',
        run: () => {
          sfx.powerup();
          state.stats.speech += 1;
          state.stats.law += 1;
          advanceTime();
          state.phase = 'map';
          state.log = '📚 독서 완료! 이제 논리와 법 조항이 머리에 쏙쏙 들어옵니다. (언변+1, 법지식+1)';
        },
      },
      {
        label: '🏋️ 동네 공원 철봉 & 멘탈 단련',
        sub: '깡다구 +1 · 최대 인내심 +5 · 시간 +1',
        run: () => {
          sfx.powerup();
          state.stats.guts += 1;
          state.maxHp += 5;
          state.hp = Math.min(state.maxHp, state.hp + 5);
          advanceTime();
          state.phase = 'map';
          state.log = '💪 턱걸이 50개 완료! 웬만한 진상에는 눈도 깜짝 안 합니다. (깡다구+1, 최대 인내심+5)';
        },
      },
    ];

    acts.forEach((a) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn row-btn';
      btn.innerHTML = `<span>${a.label}</span><span class="choice-sub">${a.sub}</span>`;
      btn.addEventListener('click', () => {
        a.run();
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = 'choice-btn row-btn';
    backBtn.innerHTML = '<span>◀ 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
    backBtn.addEventListener('click', () => {
      sfx.click();
      state.phase = 'map';
      render();
    });
    elChoicesPanel.appendChild(backBtn);
    return;
  }

  // 4-3. 편의점 / 집 휴식 분기
  if (state.phase === 'hub_rest') {
    elLocation.textContent = `DAY ${state.day} · ${timeLabel}`;
    elSceneTag.textContent = '정비';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = '편의점 쇼핑 & 우리 집 휴식';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    showSceneCard(
      '🏠 아지트 & 보급소',
      '  🏪 24시 편의점 (우황청심환·사이다·장비)\n  🛏️ 우리 집 침대 (체력 100% + 다음 날 아침)',
      `보유 포인트: 🏅 ${state.points} P`
    );
    elBattleLog.textContent = state.log;
    elChoicesPanel.className = 'choices-panel';

    const bShop = document.createElement('button');
    bShop.className = 'choice-btn row-btn';
    bShop.innerHTML = `<span>🏪 24시 편의점 들어가기</span><span class="choice-sub">${state.points} P 보유</span>`;
    bShop.addEventListener('click', () => {
      sfx.click();
      state.phase = 'shop';
      state.log = '편의점 알바생: "어서 오세요~ 참교육 보급품 다 있습니다!"';
      render();
    });
    elChoicesPanel.appendChild(bShop);

    const bHome = document.createElement('button');
    bHome.className = 'choice-btn row-btn';
    bHome.innerHTML = '<span>🛏️ 집에서 푹 자기 (인내심 100% + 저장)</span><span class="choice-sub">다음 날 오전</span>';
    bHome.addEventListener('click', () => {
      sfx.powerup();
      vibrate(25);
      state.day += 1;
      state.timeIndex = 0;
      state.hp = state.maxHp;
      state.phase = 'map';
      state.log = `🌅 푹 자고 상쾌한 아침을 맞이했습니다! (DAY ${state.day} · 인내심 완충 & 자동 저장)`;
      saveGame();
      render();
    });
    elChoicesPanel.appendChild(bHome);

    const backBtn = document.createElement('button');
    backBtn.className = 'choice-btn row-btn';
    backBtn.innerHTML = '<span>◀ 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
    backBtn.addEventListener('click', () => {
      sfx.click();
      state.phase = 'map';
      render();
    });
    elChoicesPanel.appendChild(backBtn);
    return;
  }

  // 5. 보스 선택 화면
  if (state.phase === 'boss_select') {
    elLocation.textContent = `DAY ${state.day} · 보스 레이드`;
    elSceneTag.textContent = '보스 선택';
    elSceneTag.className = 'scene-tag boss';
    elSceneTitle.textContent = '진상 연합 4대 보스 토벌';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    const bossLines = BOSSES.map((b) => `${state.defeatedBossIds.includes(b.id) ? '✅' : '🔥'} ${b.name}`).join('\n');
    showSceneCard('📋 4대 보스 지명수배 현황판', bossLines, '전용 일러스트가 있는 4대 악질 보스를 모두 정화하세요!');
    elBattleLog.textContent = '진상 연합 간부들입니다. 4명 모두 처치하면 서울이 정화됩니다!';

    elChoicesPanel.className = 'choices-panel';
    BOSSES.forEach((b) => {
      const cleared = state.defeatedBossIds.includes(b.id);
      const btn = document.createElement('button');
      btn.className = 'choice-btn row-btn';
      btn.disabled = cleared;
      btn.innerHTML = `<span>${cleared ? '✅ [처치완료] ' : ''}${b.name}</span><span class="choice-sub">${cleared ? '정화됨' : `HP ${b.maxHp}`}</span>`;
      btn.addEventListener('click', () => {
        sfx.click();
        startBattle(b.id);
      });
      elChoicesPanel.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = 'choice-btn row-btn';
    backBtn.innerHTML = '<span>◀ 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
    backBtn.addEventListener('click', () => {
      sfx.click();
      state.phase = 'map';
      render();
    });
    elChoicesPanel.appendChild(backBtn);
    return;
  }

  // 6. 24시 편의점 상점
  if (state.phase === 'shop') {
    elLocation.textContent = `DAY ${state.day} · 24시 편의점`;
    elSceneTag.textContent = '상점';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = `참교육 보급소 (보유: ${state.points} P)`;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    showSceneCard(
      '🏪 24H 참교육 보급소',
      '┏━━━━━━━━━━━━━━━━━━━━━━┓\n┃ 💊 청심환 · 🫧 사이다 · 🔫 장비 ┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n    "어서 오세요! 24시 편의점입니다"',
      `현재 보유 도덕점수: 🏅 ${state.points} P`
    );
    elBattleLog.textContent = state.log;

    elChoicesPanel.className = 'choices-panel';
    const shopItems = [
      { id: 'cheongsimhwan', label: '💊 우황청심환 (최대HP 45%+사이다15)', cost: 35 },
      { id: 'cold_soda', label: '🫧 칠성사이다 캔 (사이다65+HP25+공격12)', cost: 30 },
      { id: 'throat_candy', label: '🍬 영웅의 목캔디 (전 기술 PP+4 · 사이다10)', cost: 35 },
      { id: 'ssanghwatang', label: '🍵 특제 쌍화탕 (전 기술 PP100%+HP50+SP25)', cost: 110 },
    ];
    ['water_gun', 'megaphone', 'mirror'].forEach((eqId) => {
      if (!state.inventory.includes(eqId)) {
        shopItems.push({ id: eqId, label: `${ITEMS[eqId].name} (영구 장비)`, cost: 85 });
      }
    });

    shopItems.slice(0, 4).forEach((si) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn row-btn';
      btn.disabled = state.points < si.cost;
      btn.innerHTML = `<span style="display:flex;align-items:center;">${itemImgHtml(si.id)}${si.label}</span><span class="choice-sub">${si.cost} P</span>`;
      btn.addEventListener('click', () => {
        if (state.points < si.cost) return;
        sfx.powerup();
        vibrate(25);
        state.points -= si.cost;
        state.inventory.push(si.id);
        state.log = `[${ITEMS[si.id].name}]을(를) 구매해 가방에 넣었습니다!`;
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = 'choice-btn row-btn';
    backBtn.innerHTML = '<span>◀ 편의점 나가기 (서울 지도)</span><span class="choice-sub">나가기</span>';
    backBtn.addEventListener('click', () => {
      sfx.click();
      state.phase = 'map';
      state.log = '편의점을 나와 다시 서울 거리로 발걸음을 옮겼습니다.';
      render();
    });
    elChoicesPanel.appendChild(backBtn);
    return;
  }

  // 6.9. V24.0 빌런 억지 논리 카운터 설전
  if (state.phase === 'logic_counter') {
    const enemy = getEnemyById(state.currentEnemyId);
    const lc = LOGIC_COUNTERS[(state.logicCounterIdx || 0) % LOGIC_COUNTERS.length];
    elLocation.textContent = `DAY ${state.day} · 긴급 설전!`;
    elSceneTag.textContent = '논리 카운터';
    elSceneTag.className = 'scene-tag boss';
    elSceneTitle.textContent = `🧠 ${enemy.name}의 억지 논리!`;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.remove('hidden');
    renderCombatLevelOverlays(true);
    elEnemyHpLabel.textContent = '💢 빌런 멘탈';
    elEnemyHpText.textContent = `${state.enemyHp} / ${state.enemyMaxHp}`;
    elEnemyHpBar.style.width = `${(state.enemyHp / state.enemyMaxHp) * 100}%`;
    elQuoteBubble.textContent = lc.claim;
    elQuoteBubble.classList.remove('hidden');
    showEnemyVisual(enemy);
    elBattleLog.textContent = '빌런이 말도 안 되는 억지를 부립니다! 정확한 팩트 반박을 골라 한 방에 멘붕시키세요!';
    elChoicesPanel.className = 'choices-panel';
    shuffle(lc.options).forEach((opt) => {
      const b = document.createElement('button');
      b.className = 'choice-btn row-btn';
      b.innerHTML = `<span>${opt.text}</span><span class="choice-sub">반박 선택</span>`;
      b.addEventListener('click', () => {
        state.phase = 'combat';
        if (opt.ok) {
          sfx.victory();
          const cDmg = Math.max(25, Math.round(state.enemyMaxHp * 0.40));
          state.enemyHp = clamp(state.enemyHp - cDmg, 0, state.enemyMaxHp);
          state.enemyBroken = true;
          state.enemyStunned = true;
          state.log = `⚡ [논리 카운터 완벽 적중!!] 빌런의 억지를 산산조각 냈습니다! (멘탈 -${cDmg} · 멘붕 브레이크 & 기절!)`;
          triggerEnemyHit(cDmg, true);
          if (state.enemyHp <= 0) { handleEnemyDefeated(enemy); return; }
          saveGame();
          render();
        } else {
          sfx.damage();
          state.log = '😅 반박이 약해 빌런이 기세등등합니다! (적 반격 돌입)';
          enemyCounterTurn(enemy, true);
        }
      });
      elChoicesPanel.appendChild(b);
    });
    return;
  }

  // 7. 전투 화면
  if (state.phase === 'combat') {
    const enemy = getEnemyById(state.currentEnemyId);
    const isBoss = isBossId(enemy.id) || enemy.id === HIDDEN_BOSS.id;
    if (elBookPage && isBoss) elBookPage.classList.add('boss-aura');
    const rep = getReputationInfo();
    elLocation.textContent = `DAY ${state.day} · ${timeLabel} · ${enemy.location}`;
    elSceneTag.textContent = isBoss ? '보스전' : '빌런 조우';
    elSceneTag.className = `scene-tag ${isBoss ? 'boss' : ''}`;
    const pType = getEnemyPersonality(enemy);
    elSceneTitle.textContent = enemy.name;
    elWeaknessPill.textContent = `${pType.label} (${pType.hint})`;
    elWeaknessPill.classList.remove('hidden');

    elEnemyHpWrap.classList.remove('hidden');
    renderCombatLevelOverlays(true);
    elEnemyHpLabel.textContent = isBoss ? '🔥 보스 멘탈' : '💢 빌런 멘탈';
    elEnemyHpText.textContent = `${state.enemyHp} / ${state.enemyMaxHp}`;
    elEnemyHpBar.style.width = `${(state.enemyHp / state.enemyMaxHp) * 100}%`;

    const intentObj = ENEMY_INTENTS.find((i) => i.id === state.enemyIntent) || ENEMY_INTENTS[0];
    elEnemyIntentBar.classList.remove('hidden');
    elEnemyIntentBar.className = `enemy-intent-bar${intentObj.isDanger ? ' danger' : ''}`;
    const chainTxt = (state.combatChain || 0) >= 2 ? `🔥 ${state.combatChain} CHAIN (x${(1 + Math.min(0.5, (state.combatChain - 1) * 0.1)).toFixed(1)})` : (state.bossPhase2 ? '💢 2페이즈' : '전투 중');
    elEnemyIntentBar.innerHTML = `<span>${intentObj.label}</span><span>${chainTxt}</span>`;

    if (elCombatBadges) {
      elCombatBadges.innerHTML = '';
      const activeBadges = [];
      const passiveBadges = [];
      const gShield = state.enemyGuardShield ?? 3;
      activeBadges.push({ cls: 'is-combo', txt: `🛡️ 가드 ${'◆'.repeat(gShield)}${'◇'.repeat(Math.max(0, 3 - gShield))}` });
      if (state.nextGuaranteedCrit) activeBadges.push({ cls: 'is-break', txt: '📺 다음 타 확정치명!' });
      if (state.snapExposed) activeBadges.push({ cls: 'is-break', txt: '📸 약점노출 1.4배!' });
      if (state.bossGimmick === 'shield' && (state.bossShield || 0) > 0) activeBadges.push({ cls: 'is-break', txt: `🛡️ 보스실드 ${state.bossShield}겹` });
      if (state.bossGimmick === 'countdown') activeBadges.push({ cls: 'is-break', txt: `⏰ 광폭까지 ${state.bossCountdown || 3}턴` });
      if (state.enemyBroken) activeBadges.push({ cls: 'is-break', txt: '💥 멘붕 1.5배!' });
      if (state.enemyStunned) activeBadges.push({ cls: 'is-stun', txt: '💫 기절' });
      if ((state.enemyApologyTurns || 0) > 0) activeBadges.push({ cls: 'is-stun', txt: `📝 반성문(${state.enemyApologyTurns}턴)` });
      if ((state.feverTurns || 0) > 0) {
        activeBadges.push({ cls: 'is-break', txt: `🔥 FEVER(${state.feverTurns}턴·반값!)` });
      } else {
        activeBadges.push({ cls: 'is-combo', txt: `⚡ 피버 ${state.feverGauge || 0}%` });
      }
      if (state.enemyModifier) {
        const modObj = ENEMY_MODIFIERS.find((m) => m.id === state.enemyModifier);
        if (modObj) activeBadges.push({ cls: 'is-break', txt: `기질:${modObj.label}` });
      }
      if (state.streamMission) {
        activeBadges.push({
          cls: 'is-combo',
          txt: state.goldenMission ? `🌟 [황금 +150P·강화석+2] ${state.streamMission.label}` : state.streamMission.label,
        });
      }

      if (state.lovers?.includes('yuki') && !state.sulky?.yuki) passiveBadges.push({ cls: 'is-pet', txt: '💚 유키 HP+6' });
      if (state.lovers?.includes('chloe') && !state.sulky?.chloe) passiveBadges.push({ cls: 'is-combo', txt: '📸 클로이 치명+18%' });
      if ((state.skillChain?.length || 0) > 0) passiveBadges.push({ cls: 'is-combo', txt: `⚡ 체인 ${state.skillChain.length}/3` });
      passiveBadges.push({ cls: '', txt: getWeatherObj().label });
      passiveBadges.push({ cls: 'is-pet', txt: `🏆 ${getHeroRankInfo().grade}` });
      passiveBadges.push({ cls: '', txt: getDiffObj().name.split(' ')[0] + ' ' + getDiffObj().name.split(' ')[1] });
      const eqB = getEquippedBonuses();
      if (eqB.def > 0) passiveBadges.push({ cls: 'is-pet', txt: `🛡️ 방어+${eqB.def}` });
      if ((state.allies?.length || 0) > 0) passiveBadges.push({ cls: 'is-pet', txt: `🤝 영웅단 ${state.allies.length}명` });
      if ((state.weakCombo || 0) > 0) passiveBadges.push({ cls: 'is-combo', txt: `⚡ 약점콤보 ${state.weakCombo}/2` });
      if (state.pet?.adopted) passiveBadges.push({ cls: 'is-pet', txt: `🐶 콩이 Lv.${state.pet.level}` });
      getGearSetSynergy().labels.forEach((lb) => passiveBadges.push({ cls: 'is-pet', txt: lb }));
      if (state.timeIndex >= 5) passiveBadges.push({ cls: '', txt: '🌙 야간+25%' });

      activeBadges.forEach((b) => {
        const sp = document.createElement('span');
        sp.className = `combat-badge ${b.cls}`;
        sp.textContent = b.txt;
        elCombatBadges.appendChild(sp);
      });
      if (passiveBadges.length > 0) {
        const tog = document.createElement('span');
        tog.className = 'combat-badge is-toggle';
        tog.textContent = state.showPassiveBadges ? `✨ 패시브 접기 ▴` : `✨ 패시브 ${passiveBadges.length}개 ▾`;
        tog.addEventListener('click', () => {
          state.showPassiveBadges = !state.showPassiveBadges;
          render();
        });
        elCombatBadges.appendChild(tog);
        if (state.showPassiveBadges) {
          passiveBadges.forEach((b) => {
            const sp = document.createElement('span');
            sp.className = `combat-badge ${b.cls}`;
            sp.textContent = b.txt;
            elCombatBadges.appendChild(sp);
          });
        }
      }
    }

    showEnemyVisual(enemy);
    if (elFrame) elFrame.classList.add('combat-stage');
    elHeroSprite.classList.remove('hidden');
    const hasYuki = !!state.lovers?.includes('yuki') && !state.sulky?.yuki;
    const hasChloe = !!state.lovers?.includes('chloe') && !state.sulky?.chloe;
    const hasPet = !!state.pet?.adopted;
    elHeroSprite.classList.toggle('with-yuki', hasYuki);
    if (elYukiSprite) elYukiSprite.classList.toggle('hidden', !hasYuki);
    if (elChloeSprite) {
      elChloeSprite.classList.toggle('hidden', !hasChloe);
      elChloeSprite.classList.toggle('with-yuki', hasYuki);
    }
    if (elKongiSprite) elKongiSprite.classList.toggle('hidden', !hasPet);
    const eqSpCombat = getSpiritBonuses().spirit;
    if (elSpiritSprite) {
      elSpiritSprite.classList.toggle('hidden', !eqSpCombat);
      if (eqSpCombat) elSpiritSprite.src = `${eqSpCombat.img}?v=71`;
    }
    elQuoteBubble.classList.add('hidden');
    elBattleLog.textContent = (state.quote ? `💬 ${state.quote}\n` : '') + (state.log || '');
    elChoicesPanel.className = 'choices-panel grid-2 is-combat-grid';
    ensureSandboxState();

    // V37.0: 오블리비언식 무혈 외교 (첫 턴 & 최종 보스 제외)
    if (state.isFirstTurn && !state.diplomacyUsed && !enemy.isFinal && !state.towerFloor && !state.nightmareFloor) {
      const dipBtn = document.createElement('button');
      dipBtn.className = 'choice-btn row-btn';
      dipBtn.style.gridColumn = 'span 2';
      dipBtn.style.background = 'linear-gradient(180deg, #f0f9ff 0%, #dbeafe 100%)';
      dipBtn.style.borderColor = '#3b82f6';
      dipBtn.innerHTML = `<span>🗣️ [현장 교섭] 기선제압 시도 (설득 · 협박 · 매수)</span><span class="choice-sub" style="color:#1e40af;">전투당 1회 · 성공 시 적 멘탈/가드 대폭 약화</span>`;
      dipBtn.addEventListener('click', () => {
        sfx.click();
        openDiplomacyModal(enemy);
      });
      elChoicesPanel.appendChild(dipBtn);
    }

    // V37.0: 나만의 커스텀 필살기
    if (state.customSpell) {
      const sp = state.customSpell;
      const csBtn = document.createElement('button');
      csBtn.className = 'choice-btn';
      csBtn.disabled = state.sp < 25;
      csBtn.style.background = 'linear-gradient(180deg, #faf5ff 0%, #f3e8ff 100%)';
      csBtn.style.borderColor = '#9333ea';
      csBtn.innerHTML = `<span>✨ ${sp.name}</span><span class="choice-sub" style="color:#6b21a8;">${state.sp >= 25 ? `SP 25 · ${sp.desc}` : `SP 부족 (${state.sp}/25)`}</span>`;
      csBtn.addEventListener('click', () => {
        useCustomSpellInCombat(enemy);
      });
      elChoicesPanel.appendChild(csBtn);
    }

    // V37.0: 자취방 연금 커스텀 포션
    if ((state.customPotions?.length || 0) > 0) {
      const pot = state.customPotions[0];
      const cpBtn = document.createElement('button');
      cpBtn.className = 'choice-btn';
      cpBtn.style.background = 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)';
      cpBtn.style.borderColor = '#10b981';
      cpBtn.innerHTML = `<span>🧪 ${pot.name} (${state.customPotions.length})</span><span class="choice-sub" style="color:#065f46;">턴 소모 없음 · ${pot.desc}</span>`;
      cpBtn.addEventListener('click', () => {
        useCustomPotionInCombat(enemy);
      });
      elChoicesPanel.appendChild(cpBtn);
    }

    // V26.2 막타 사이다 피니셔 (적 HP 25% 이하)
    if (state.enemyHp > 0 && state.enemyHp <= Math.ceil(state.enemyMaxHp * 0.25)) {
      const finBtn = document.createElement('button');
      finBtn.className = 'choice-btn row-btn story-main-btn';
      finBtn.style.gridColumn = 'span 2';
      finBtn.innerHTML = '<span>💥 [사이다 피니셔!!] 최후의 일격 날리기!</span><span class="choice-sub">즉시 격파 + 보너스 +15P!</span>';
      finBtn.addEventListener('click', () => {
        sfx.hit(true);
        vibrate(55);
        playHeroAnim('attack');
        const finDmg = Math.max(state.enemyHp, 35);
        state.enemyHp = 0;
        state.points += 15;
        triggerEnemyHit(finDmg, true);
        showToast('💥 사이다 피니셔 대성공!! (+15P)', 'break');
        handleEnemyDefeated(enemy);
      });
      elChoicesPanel.appendChild(finBtn);
    } else if (!state.citizenAssistUsed && Math.random() < 0.20) {
      // V26.2 전투 중 돌발 시민 제보 찬스 (턴 소모 없음)
      const tipBtn = document.createElement('button');
      tipBtn.className = 'choice-btn row-btn guard-btn';
      tipBtn.style.gridColumn = 'span 2';
      tipBtn.innerHTML = '<span>📢 [시민 제보 찬스!] 구경하던 학생이 결정적 증거를 넘겨줬다!</span><span class="choice-sub">턴 소모 없음 · 사이다+25 · 채증+1</span>';
      tipBtn.addEventListener('click', () => {
        sfx.powerup();
        state.citizenAssistUsed = true;
        state.sp = clamp(state.sp + 25, 0, state.maxSp);
        state.pendingReports += 1;
        state.log = '📢 [시민 제보 수령!] "저 아저씨 아까부터 저랬어요!" (사이다 +25 · 채증 +1)';
        showToast('📢 시민 제보! 사이다 +25 & 채증 +1!', 'good');
        render();
      });
      elChoicesPanel.appendChild(tipBtn);
    }

    if ((state.feverGauge || 0) >= 100 && !(state.feverTurns > 0)) {
      const feverBtn = document.createElement('button');
      feverBtn.className = 'choice-btn row-btn story-main-btn';
      feverBtn.style.gridColumn = 'span 2';
      feverBtn.innerHTML = '<span>⚡ [노란 완장 풀개방!!] 각성 변신 발동!</span><span class="choice-sub">턴 소모 없음 · 2턴 약점/치명 확정 + 필살기 반값 + SP+20!</span>';
      feverBtn.addEventListener('click', () => {
        sfx.victory();
        vibrate([40, 30, 70]);
        state.feverGauge = 0;
        state.feverTurns = 2;
        state.sp = clamp(state.sp + 20, 0, state.maxSp);
        state.log = '⚡ [노란 완장 풀개방!!] 눈빛이 변했습니다! 2턴간 모든 공격 약점·치명 확정 & 필살기 반값! (SP +20)';
        showToast('🔥 노란 완장 풀개방!! 2턴 각성 모드!', 'break');
        render();
      });
      elChoicesPanel.appendChild(feverBtn);
    }

    if (intentObj.isDanger) {
      const guardBtn = document.createElement('button');
      guardBtn.className = 'choice-btn row-btn guard-btn';
      guardBtn.style.gridColumn = 'span 2';
      guardBtn.innerHTML = `<span>${uiImg('skill_parry')}저스트 패링!! (강공격 90% 차단 + 역관광)</span><span class="choice-sub">피해 -90% · 반격 · 사이다+25 · 피버+30%</span>`;
      guardBtn.addEventListener('click', performGuard);
      elChoicesPanel.appendChild(guardBtn);
    }

    const lawBonus = state.stats.law + state.diceBonus + (rep.mode === 'lawful' ? 2 : 0);

    const muSpeech = getMatchupInfo(enemy, 'speech');
    const muGuts = getMatchupInfo(enemy, 'guts');
    const muLaw = getMatchupInfo(enemy, 'law');
    const muSpec = getMatchupInfo(enemy, 'special');
    const muSnap = getMatchupInfo(enemy, 'snap');
    const muTag = getMatchupInfo(enemy, 'tag');

    const ppMap = ensureSkillPp();
    const mkPpHtml = (k) => {
      const cur = ppMap[k] ?? getMaxSkillPp(k);
      const mx = getMaxSkillPp(k);
      const cls = cur <= 0 ? ' empty' : (cur <= 2 ? ' low' : '');
      return `<span class="pp-pill${cls}">${cur}/${mx}</span>`;
    };

    const skills = [
      {
        title: `${uiImg('skill_fact')}${getEquippedSkill('speech').name}`,
        ppKey: 'speech',
        sub: muSpeech.tag ? `${muSpeech.tag} · ${getEquippedSkill('speech').mechTag}` : `${getEquippedSkill('speech').mechTag}`,
        subClass: muSpeech.cls,
        disabled: (ppMap.speech ?? 1) <= 0,
        action: () => performAttack('speech'),
      },
      {
        title: `${uiImg('skill_mirror')}${getEquippedSkill('guts').name}`,
        ppKey: 'guts',
        sub: muGuts.tag ? `${muGuts.tag} · ${getEquippedSkill('guts').mechTag}` : `${getEquippedSkill('guts').mechTag} · 사이다↑`,
        subClass: muGuts.cls,
        disabled: (ppMap.guts ?? 1) <= 0,
        action: () => performAttack('guts'),
      },
      {
        title: `${uiImg('skill_law')}${getEquippedSkill('law').name}`,
        ppKey: 'law',
        sub: muLaw.tag ? `${muLaw.tag} · ${getEquippedSkill('law').mechTag}` : `${getEquippedSkill('law').mechTag} · 🎲12+ 기절`,
        subClass: muLaw.cls,
        disabled: (ppMap.law ?? 1) <= 0,
        action: () => performAttack('law'),
      },
      {
        title: `${uiImg('skill_cider')}${getSkillEvolution('special').title.replace(/^[^\s]+\s*/, '')}`,
        ppKey: null,
        sub: state.sp >= ((state.feverTurns || 0) > 0 ? 20 : 40)
          ? `사이다 ${(state.feverTurns || 0) > 0 ? '20(피버 반값!)' : '40'}${muSpec.tag ? ` · ${muSpec.tag}` : ' · 가드2칸+기절!'}`
          : `사이다 부족 (${state.sp}/${(state.feverTurns || 0) > 0 ? 20 : 40})`,
        subClass: muSpec.isUp ? 'weak' : 'sp',
        disabled: state.sp < ((state.feverTurns || 0) > 0 ? 20 : 40),
        action: () => { sfx.click(); startTimingMinigame((isPerfect) => performAttack('special', isPerfect)); },
      },
    ];

    skills.forEach((sk) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.disabled = !!sk.disabled;
      const topHtml = sk.ppKey
        ? `<span class="skill-top-row"><span>${sk.title}</span>${mkPpHtml(sk.ppKey)}</span>`
        : `<span>${sk.title}</span>`;
      btn.innerHTML = `${topHtml}<span class="choice-sub ${sk.subClass}">${sk.disabled && sk.ppKey ? '횟수 소진 (휴식/아이템 복구)' : sk.sub}</span>`;
      btn.addEventListener('click', sk.action);
      elChoicesPanel.appendChild(btn);
    });

    // V14.0: 타이밍 채증 셔터 & 합동 필살기
    const snapBtn = document.createElement('button');
    snapBtn.className = 'choice-btn';
    const snapPp = ppMap.snap ?? getMaxSkillPp('snap');
    snapBtn.disabled = snapPp <= 0;
    const skSnap = getEquippedSkill('snap');
    snapBtn.innerHTML = `<span class="skill-top-row"><span>${uiImg('skill_snap')}${skSnap.name}</span>${mkPpHtml('snap')}</span><span class="choice-sub ${muSnap.cls}">${snapPp <= 0 ? '횟수 소진 (휴식/아이템 복구)' : (muSnap.tag ? `${muSnap.tag} · ${skSnap.mechTag}` : `${skSnap.mechTag} · 즉시 발동 + 채증+1`)}</span>`;
    snapBtn.addEventListener('click', () => performAttack('snap'));
    if (false) {
    snapBtn.addEventListener('click', () => {
      const curPp = ensureSkillPp();
      if ((curPp.snap ?? 1) <= 0) return;
      curPp.snap = Math.max(0, (curPp.snap ?? getMaxSkillPp('snap')) - 1);
      sfx.click();
      startTimingMinigame((isPerfect) => {
        const enemy = getEnemyById(state.currentEnemyId);
        const snapMu = getMatchupInfo(enemy, 'snap').mult;
        const spSnap = getSpiritBonuses();
        const evoSnap = getSkillEvolution('law');
        const eqAtkSnap = getEquippedBonuses().atk || 0;
        const snapSpMult = spSnap.element === 'snap' ? (1 + (spSnap.elemBoost || 0)) : 1;
        const rawSnap = isPerfect
          ? Math.round((28 + state.stats.law * 4.5 + state.bonusDmg + eqAtkSnap + (spSnap.atk || 0)) * (evoSnap.dmgMult || 1) * 1.65)
          : Math.round((15 + state.stats.law * 2.5 + state.bonusDmg + eqAtkSnap) * (evoSnap.dmgMult || 1));
        const dmg = Math.round(rawSnap * snapMu * snapSpMult);
        state.enemyHp = clamp(state.enemyHp - dmg, 0, state.enemyMaxHp);
        if (isPerfect) {
          state.pendingReports += 2;
          state.sp = clamp(state.sp + 25, 0, state.maxSp);
          state.perfectSnaps = (state.perfectSnaps || 0) + 1;
          state.enemyExcuseShield = false;
          state.snapExposed = true;
          if (state.bossGimmick === 'shield' && (state.bossShield || 0) > 0) state.bossShield = Math.max(0, state.bossShield - 2);
          state.enemyGuardShield = Math.max(0, (state.enemyGuardShield ?? 3) - 2);
          addFever(35);
          state.log = `📸 [PERFECT 채증!!] 가드 2칸 파쇄 + 약점 노출(다음 타 1.4배)! (멘탈 -${dmg} · 사이다+25)`;
          checkAchievements();
        } else {
          state.pendingReports += 1;
          state.log = `📸 [채증 촬영] 흔들렸지만 증거는 남겼습니다. (멘탈 -${dmg} · 채증+1)`;
        }
        checkStreamMission('snap');
        triggerEnemyHit(dmg, isPerfect);
        if (state.enemyHp <= 0) handleEnemyDefeated(enemy);
        else if (isPerfect && state.enemyGuardShield <= 0) {
          state.enemyBroken = true;
          state.enemyStunned = true;
          state.enemyGuardShield = 3;
          state.log += `\n💥 [MENTAL BREAK!!] 채증으로 가드 완파! 보너스 1턴 획득!!`;
          showToast('💥 MENTAL BREAK! 공짜 보너스 1턴!!', 'break');
          saveGame();
          render();
        }
        else enemyCounterTurn(enemy, false);
      });
    });
    }
    elChoicesPanel.appendChild(snapBtn);

    const tagBtn = document.createElement('button');
    tagBtn.className = 'choice-btn';
    const tagCost = state.costume === 'couple' ? 35 : 50;
    const tagMeta = getTagSkillMeta();
    const tagUsed = !!state.tagSkillUsedThisBattle;
    tagBtn.disabled = tagUsed || state.sp < tagCost;
    tagBtn.innerHTML = `<span>${uiImg('skill_tag')}${tagMeta.title.replace(/^[^\s]+\s*/, '')}</span><span class="choice-sub ${muTag.isUp ? 'weak' : 'sp'}">${tagUsed ? '전투당 1회 사용 완료' : (state.sp >= tagCost ? `사이다 ${tagCost}${muTag.tag ? ` · ${muTag.tag}` : ''} · ${tagMeta.effectSummary}` : `사이다 부족 (${state.sp}/${tagCost})`)}</span>`;
    tagBtn.addEventListener('click', () => performTagSkill());
    elChoicesPanel.appendChild(tagBtn);

    const anyZeroPp = ['speech', 'guts', 'law', 'snap'].some((k) => (ppMap[k] ?? 1) <= 0);
    if (anyZeroPp) {
      const basicBtn = document.createElement('button');
      basicBtn.className = 'choice-btn row-btn';
      basicBtn.style.gridColumn = 'span 2';
      basicBtn.innerHTML = '<span>📢 기본 호루라기 경고 (PP 무제한)</span><span class="choice-sub">약한 피해 + 사이다 +10 충전</span>';
      basicBtn.addEventListener('click', () => {
        playHeroAnim('attack');
        sfx.hit(false);
        const dmg = 12 + state.bonusDmg + Math.floor((state.level || 1) * 1.2);
        state.enemyHp = clamp(state.enemyHp - dmg, 0, state.enemyMaxHp);
        state.sp = clamp(state.sp + 10, 0, state.maxSp);
        state.log = `📢 호루라기를 불며 경고했습니다! (멘탈 -${dmg} · 사이다 +10)`;
        triggerEnemyHit(dmg, false);
        if (state.enemyHp <= 0) handleEnemyDefeated(enemy);
        else enemyCounterTurn(enemy, false);
      });
      elChoicesPanel.appendChild(basicBtn);
    }
    return;
  }

  // 6-9. V26.2 빌런의 찌질한 변명 + 최후의 일갈
  if (state.phase === 'villain_excuse') {
    const vName = state.excuseEnemyName || '민폐 빌런';
    const exc = VILLAIN_EXCUSES[state.excuseIdx || 0] || VILLAIN_EXCUSES[0];
    elLocation.textContent = `참교육 마무리 · ${vName}`;
    elSceneTag.textContent = '최후의 일갈';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = `🎭 ${vName}의 찌질한 변명!`;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = exc;
    elQuoteBubble.classList.remove('hidden');
    showSceneCard(
      'FINAL REBUKE · 참교육 마무리',
      ` 🧎 [${vName}]이(가) 무릎 꿇고 횡설수설 중...\n\n 마지막 한마디로 완벽하게 마무리하세요!`,
      '어느 쪽을 골라도 보너스 보상 후 특성 선택으로 이어집니다'
    );
    setLogText(state.log, true);
    elChoicesPanel.className = 'choices-panel';
    [
      {
        text: '⚖️ "사정은 경찰서에서 말씀하세요! 법대로 처리합니다."',
        sub: '모범 +2 · 포인트 +12P',
        run: () => { state.lawful += 2; state.points += 12; },
      },
      {
        text: '😈 "네~ 다음 빌런 들어오세요. 영상 잘 올라갑니다~"',
        sub: '광인 +2 · 사이다 +15 · 팔로워 +80',
        run: () => { state.chaotic += 2; state.sp = clamp(state.sp + 15, 0, state.maxSp); state.followers = (state.followers || 120) + 80; },
      },
    ].forEach((c) => {
      const b = document.createElement('button');
      b.className = 'choice-btn row-btn';
      b.innerHTML = `<span>${c.text}</span><span class="choice-sub">${c.sub}</span>`;
      b.addEventListener('click', () => {
        sfx.victory();
        c.run();
        state.phase = 'draft';
        state.log = `🔥 [${vName}] 완벽 참교육 완료! 새로운 특성을 1개 선택하세요.`;
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(b);
    });
    return;
  }

  // 6-95. V26.2 순찰 중 수상한 노란 봉투 / 1대 영웅 쪽지 이벤트
  if (state.phase === 'mystery_envelope') {
    elLocation.textContent = `DAY ${state.day} · 돌발 미스터리`;
    elSceneTag.textContent = '미스터리';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = '✉️ 바닥에 떨어진 수상한 노란 봉투!';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = '"봉투 겉면에 [1대 시민영웅 → 후계자에게] 라고 적혀 있다...!"';
    elQuoteBubble.classList.remove('hidden');
    showSceneCard(
      'MYSTERY ENVELOPE · 노란 봉투',
      '  ✉️ [ 누군가 몰래 두고 간 노란 봉투 ]\n\n  선배의 비밀 쪽지일까, 놈들의 함정일까?',
      '선택에 따라 보물, 떡밥, 또는 돌발 전투가 발생합니다'
    );
    setLogText('순찰 중 골목 벤치 위에서 선배의 이니셜이 적힌 노란 봉투를 발견했습니다!', true);
    elChoicesPanel.className = 'choices-panel';

    const openBtn = document.createElement('button');
    openBtn.className = 'choice-btn row-btn story-main-btn';
    openBtn.innerHTML = '<span>✉️ 봉투를 조심스레 열어본다</span><span class="choice-sub">대박 보상 / 선배 비밀 쪽지 / 함정?</span>';
    openBtn.addEventListener('click', () => {
      const r = Math.random();
      if (r < 0.45) {
        sfx.victory();
        state.points += 55;
        state.phase = 'map';
        state.log = '💰 [익명의 시민 감사 봉투!] "항상 동네를 지켜줘서 고마워요!" (+55 P)';
        showToast('💰 시민 감사 봉투 +55 P!', 'good');
      } else if (r < 0.8) {
        sfx.powerup();
        state.sp = clamp(state.sp + 25, 0, state.maxSp);
        state.stats.law += 1;
        state.phase = 'map';
        state.log = '📜 [1대 시민영웅의 비밀 메모!] "블랙튜브 MCN의 자금줄은 여의도에 있다..." (사이다+25 · 법률+1)';
        showToast('📜 선배의 비밀 쪽지 발견! (법률 +1)', 'good');
      } else {
        sfx.damage();
        showToast('🚨 블랙튜브 정찰 스파이의 함정이었다!!', 'break');
        startBattle('shorts_terrorist');
        return;
      }
      saveGame();
      render();
    });
    elChoicesPanel.appendChild(openBtn);

    const passBtn = document.createElement('button');
    passBtn.className = 'choice-btn row-btn';
    passBtn.innerHTML = '<span>🚶 함정일 수 있으니 사진만 찍고 지나친다</span><span class="choice-sub">모범 +1 · 인내심 +10</span>';
    passBtn.addEventListener('click', () => {
      sfx.click();
      state.lawful += 1;
      state.hp = clamp(state.hp + 10, 1, state.maxHp);
      state.phase = 'map';
      state.log = '🚶 신중하게 현장을 기록하고 지나쳤습니다. (모범 +1 · 인내심 +10)';
      saveGame();
      render();
    });
    elChoicesPanel.appendChild(passBtn);
    return;
  }

  // 7-0. V26.0 심야 마계 보스 러시 클리어 화면
  if (state.phase === 'nightmare_clear') {
    const floor = state.nightmareFloor || 1;
    elLocation.textContent = `🌃 심야 마계 보스 러시 · ${floor}층`;
    elSceneTag.textContent = '마계 승리';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = `🌃 마계 보스 ${floor}층 격파!`;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    showSceneCard(
      `🌃 NIGHTMARE BOSS RUSH · ${floor}F CLEAR`,
      ` 현재 연승: ${floor}층 · 역대 최고: ${state.bestNightmareFloor || floor}층\n` +
      ` 유니크 드랍 배율: ${(1 + floor * 0.5).toFixed(1)}배 · 다음 층 보너스: +${(floor + 1) * 25} P\n` +
      ` ─────────────────────────────────\n` +
      ` 더 강한 보스에 도전하시겠습니까?`,
      '연승이 쌓일수록 보스가 강해지지만 전설 장비 드랍률이 폭등합니다!'
    );
    elBattleLog.textContent = state.log;
    elChoicesPanel.className = 'choices-panel';

    const nextNm = document.createElement('button');
    nextNm.className = 'choice-btn row-btn story-main-btn';
    nextNm.innerHTML = `<span>🔥 다음 마계 보스 (${floor + 1}층) 도전!</span><span class="choice-sub">보스 HP+${(floor + 1) * 35} · 유니크 ${(1 + (floor + 1) * 0.5).toFixed(1)}배</span>`;
    nextNm.addEventListener('click', () => {
      sfx.powerup();
      state.nightmareFloor = floor + 1;
      const bossPool = [...BOSSES, HIDDEN_BOSS];
      const pick = bossPool[Math.floor(Math.random() * bossPool.length)];
      startBattle(pick.id);
    });
    elChoicesPanel.appendChild(nextNm);

    const exitNm = document.createElement('button');
    exitNm.className = 'choice-btn row-btn';
    exitNm.innerHTML = '<span>🏙️ 보상 챙기고 안전 귀환</span><span class="choice-sub">지도로 복귀</span>';
    exitNm.addEventListener('click', () => {
      sfx.click();
      state.nightmareFloor = 0;
      state.phase = 'map';
      state.log = `🌃 마계 보스 러시 ${floor}층까지 정복하고 무사 귀환했습니다!`;
      saveGame();
      render();
    });
    elChoicesPanel.appendChild(exitNm);
    return;
  }

  // 7-1. V17.0 배틀타워 층 클리어 화면
  if (state.phase === 'tower_clear') {
    const floor = state.towerFloor || 1;
    elLocation.textContent = `🏢 전국 빌런 배틀타워 · ${floor}층`;
    elSceneTag.textContent = '타워 승리';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = `🏢 ${floor}층 격파 완료!`;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    showSceneCard(
      `🏆 BATTLE TOWER · ${floor}F CLEAR`,
      ` 현재 연승: ${floor}층 · 역대 최고: ${state.bestTowerFloor || floor}층\n` +
      ` 다음 층 보상: 기본 보상 + ${(floor + 1) * 12} P\n` +
      ` ─────────────────────────────────\n` +
      ` 계속 올라가시겠습니까, 아니면 안전하게 귀환할까요?`,
      '무한 연승 도전! 패배 전에 안전 귀환하면 모든 보상을 지킵니다.'
    );
    elBattleLog.textContent = state.log;
    elChoicesPanel.className = 'choices-panel';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'choice-btn row-btn story-main-btn';
    nextBtn.innerHTML = `<span>🔥 ${floor + 1}층 계속 도전하기!</span><span class="choice-sub">더 강한 빌런 · 보상 UP</span>`;
    nextBtn.addEventListener('click', () => {
      sfx.powerup();
      state.towerFloor = floor + 1;
      const pool = [...VILLAINS, ...GUERRILLA_VILLAINS];
      const pick = pool[Math.floor(Math.random() * pool.length)];
      startBattle(pick.id);
    });
    elChoicesPanel.appendChild(nextBtn);

    const exitBtn = document.createElement('button');
    exitBtn.className = 'choice-btn row-btn';
    exitBtn.innerHTML = '<span>🏠 보상 챙기고 지도로 복귀</span><span class="choice-sub">안전 귀환</span>';
    exitBtn.addEventListener('click', () => {
      sfx.click();
      state.towerFloor = 0;
      advanceTime();
      state.phase = 'map';
      state.log = `🏢 배틀타워 ${floor}층까지 정복하고 안전하게 복귀했습니다!`;
      saveGame();
      render();
    });
    elChoicesPanel.appendChild(exitBtn);
    return;
  }

  // 7-2. V17.0 시민 즉결 재판소
  if (state.phase === 'court') {
    const cs = COURT_CASES[(state.courtCaseIdx || 0) % COURT_CASES.length];
    elLocation.textContent = `DAY ${state.day} · ⚖️ 시민 즉결 재판소`;
    elSceneTag.textContent = '재판';
    elSceneTag.className = 'scene-tag boss';
    elSceneTitle.textContent = `⚖️ [피고인] ${cs.villain}`;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = cs.excuse;
    elQuoteBubble.classList.remove('hidden');
    setStageBg('bg_court.jpg');
    showSceneCard(
      '⚖️ CITIZEN COURT · 즉결 심판',
      ` 사건: ${cs.villain} 약식 재판\n 보유 채증: ${state.pendingReports}건\n 성공 시 벌금 2.5배 (${Math.round(state.pendingReports * 25 * 2.5)} P) 몰수!`,
      '피고인의 뻔뻔한 변명을 논리/증거로 반박하세요!'
    );
    elBattleLog.textContent = '피고인의 거짓말을 깨뜨릴 결정적 반박을 선택하세요!';
    elChoicesPanel.className = 'choices-panel';

    cs.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn row-btn';
      btn.innerHTML = `<span>${opt}</span><span class="choice-sub">이의 있음!</span>`;
      btn.addEventListener('click', () => {
        const cnt = state.pendingReports || 1;
        if (idx === cs.answer) {
          const earned = Math.round(cnt * 25 * 2.5);
          state.points += earned;
          state.lawful += 15;
          state.followers = (state.followers || 120) + 400;
          state.chaosLevel = clamp((state.chaosLevel ?? 25) - cnt * 6, 0, 100);
          state.pendingReports = 0;
          sfx.victory();
          showToast(`⚖️ 승소!! 벌금 +${earned} P · 팔로워 +400!`, 'good');
          state.log = `${cs.okMsg}\n(+${earned} P · 모범시민 +15 · 팔로워 +400)`;
        } else {
          state.points += 5;
          state.lawful += 3;
          state.pendingReports = 0;
          sfx.damage();
          state.log = `${cs.failMsg}\n(소송 비용 5 P만 정산되었습니다.)`;
        }
        state.phase = 'map';
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(btn);
    });
    return;
  }

  // 7-3. V17.0 콩이 산책 돌발 참교육
  if (state.phase === 'pet_walk_event') {
    const ev = PET_WALK_EVENTS[(state.petWalkEventIdx || 0) % PET_WALK_EVENTS.length];
    elLocation.textContent = `DAY ${state.day} · 🐶 콩이 산책 돌발`;
    elSceneTag.textContent = '돌발 이벤트';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = ev.title;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    elSceneImage.src = 'assets/images/pet_walk.jpg';
    elSceneImage.classList.remove('hidden');
    elBattleLog.textContent = ev.text;
    elChoicesPanel.className = 'choices-panel';

    ev.choices.forEach((ch) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn row-btn';
      btn.innerHTML = `<span>${ch.text}</span><span class="choice-sub">💬 대화 선택</span>`;
      btn.addEventListener('click', () => {
        const ef = ch.effect || {};
        if (ef.points) state.points += ef.points;
        if (ef.law) state.stats.law += ef.law;
        if (ef.lawful) state.lawful += ef.lawful;
        if (ef.chaotic) state.chaotic += ef.chaotic;
        if (ef.sp) state.sp = clamp(state.sp + ef.sp, 0, state.maxSp);
        if (ef.followers) state.followers = (state.followers || 120) + ef.followers;
        if (ef.yukiLove) state.love.yuki = clamp((state.love.yuki || 0) + ef.yukiLove, 0, 100);
        if (ef.chloeLove) state.love.chloe = clamp((state.love.chloe || 0) + ef.chloeLove, 0, 100);
        sfx.victory();
        showToast('🐶 콩이와 함께 무개념 견주 참교육 완료!', 'good');
        advanceTime();
        state.phase = 'map';
        state.log = ch.reply;
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(btn);
    });
    return;
  }

  // 8. V27.0 참교육 다종 보상 3지선다 뽑기
  if (state.phase === 'draft') {
    const enemy = getEnemyById(state.currentEnemyId);
    elLocation.textContent = `DAY ${state.day} · Lv.${state.level || 1} · 참교육 성공!`;
    elSceneTag.textContent = '보상 선택';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = '🎁 참교육 보상을 선택하세요!';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = enemy.defeatQuote;
    elQuoteBubble.classList.remove('hidden');
    showEnemyVisual(enemy);
    if (elFrame) elFrame.classList.add('combat-stage');
    elHeroSprite.classList.remove('hidden');
    const hasYuki = !!state.lovers?.includes('yuki') && !state.sulky?.yuki;
    const hasChloe = !!state.lovers?.includes('chloe') && !state.sulky?.chloe;
    const hasPet = !!state.pet?.adopted;
    elHeroSprite.classList.toggle('with-yuki', hasYuki);
    if (elYukiSprite) elYukiSprite.classList.toggle('hidden', !hasYuki);
    if (elChloeSprite) {
      elChloeSprite.classList.toggle('hidden', !hasChloe);
      elChloeSprite.classList.toggle('with-yuki', hasYuki);
    }
    if (elKongiSprite) elKongiSprite.classList.toggle('hidden', !hasPet);
    elBattleLog.textContent = state.log;
    elChoicesPanel.className = 'choices-panel';

    const getDraftMeta = (opt) => {
      if (opt.kind === 'trait_new') return { tier: 's', rank: 4, label: '🟨 S급 · 신규 특성', cls: 'draft-card-s' };
      if (opt.kind === 'loot_box') return { tier: 's', rank: 4, label: '🟨 S급 · 장비 보급', cls: 'draft-card-s' };
      if (opt.kind === 'trait_up') {
        const curLv = (state.traits || []).find((x) => x.id === opt.id)?.level || 1;
        return curLv >= 4
          ? { tier: 's', rank: 4, label: '🟨 S급 · 만렙 각성!', cls: 'draft-card-s' }
          : { tier: 'a', rank: 3, label: '🟪 A급 · 특성 강화', cls: 'draft-card-a' };
      }
      if (opt.kind === 'gear_polish') return { tier: 'a', rank: 3, label: '🟪 A급 · 영구 스펙', cls: 'draft-card-a' };
      if (opt.kind === 'first_aid_pack' || opt.kind === 'bounty_bonus') return { tier: 'b', rank: 2, label: '🟦 B급 · 보급/현상금', cls: 'draft-card-b' };
      return { tier: 'c', rank: 1, label: '⬜ C급 · 기초 성장', cls: 'draft-card-c' };
    };
    const bestRank = Math.max(...state.draftOptions.map((o) => getDraftMeta(o).rank));
    let shownRec = false;

    state.draftOptions.forEach((opt) => {
      const meta = getDraftMeta(opt);
      const isRec = !shownRec && meta.rank === bestRank && meta.rank >= 2;
      if (isRec) shownRec = true;
      const btn = document.createElement('button');
      btn.className = `choice-btn ${meta.cls}`;
      btn.innerHTML = `<span><span class="draft-tier-badge ${meta.tier}">${meta.label}</span>${opt.name}${isRec ? ' <b style="color:#b45309;font-size:0.72rem;">✨추천</b>' : ''}</span><span class="choice-sub">${opt.desc}</span>`;
      btn.addEventListener('click', () => {
        sfx.powerup();
        vibrate([25, 25, 50]);
        const msg = applyDraftReward(opt);
        state.phase = (state.pendingStoryAftermath !== null && state.pendingStoryAftermath !== undefined)
          ? 'story_aftermath'
          : (state.pendingActAftermath ? 'act_aftermath' : 'map');
        state.log = `${msg} (상단 📱 버튼으로 톡 알림/안전신문고를 확인해 보세요)`;
        saveGame();
        render();
      });
      elChoicesPanel.appendChild(btn);
    });
    return;
  }

  // 9. 승리 / 패배 엔딩
  elChoicesPanel.className = 'choices-panel';
  elWeaknessPill.classList.add('hidden');
  elEnemyHpWrap.classList.add('hidden');
  elQuoteBubble.classList.add('hidden');

  // V43.0: 전국 5대 액트 비주얼 노벨 스토리 & 승리 후일담
  if (state.phase === 'act_story') {
    const st = state.activeActStory || { actId: 'jeonju', epIdx: 0, sceneIdx: 0 };
    const eps = ACT_STORY_EPISODES[st.actId] || [];
    const ep = eps[st.epIdx] || eps[0];
    if (!ep || !ep.scenes) { state.phase = 'map'; render(); return; }
    const sc = ep.scenes[Math.min(st.sceneIdx || 0, ep.scenes.length - 1)];
    elLocation.textContent = `DAY ${state.day} · ${timeLabel} · ${ep.actName}`;
    elSceneTag.textContent = `${ep.actName} (${ep.ep}/${eps.length}화)`;
    elSceneTag.className = 'scene-tag story';
    elSceneTitle.textContent = ep.title;
    if (elFrame && ep.bg) {
      elFrame.classList.add('story-stage');
      elFrame.style.backgroundImage = `url('${ep.bg}')`;
      elFrame.style.backgroundSize = 'cover';
      elFrame.style.backgroundPosition = 'center';
    }
    if (sc.showSprite && ep.sprite) {
      elSceneImage.src = ep.sprite;
      elSceneImage.className = 'enemy-sprite';
      elSceneImage.classList.remove('hidden');
    } else {
      elSceneImage.classList.add('hidden');
    }
    elBattleLog.textContent = st.reply ? `${st.reply}` : `[${sc.speaker}]\n${sc.text}`;

    if (st.reply || !sc.choices) {
      const isLast = (st.sceneIdx || 0) >= ep.scenes.length - 1;
      const nxt = document.createElement('button');
      nxt.className = 'choice-btn row-btn story-main-btn';
      nxt.style.gridColumn = 'span 2';
      nxt.innerHTML = isLast
        ? `<span>⚔️ 참교육 전투 돌입!! (추천 Lv.${ep.recLv})</span><span class="choice-sub">내 Lv.${state.level || 1} · 승리 시 다음 화 해금!</span>`
        : `<span>다음 장면으로 ▶</span><span class="choice-sub">${ep.title} (${(st.sceneIdx || 0) + 1}/${ep.scenes.length})</span>`;
      nxt.addEventListener('click', () => {
        sfx.powerup();
        if (isLast) {
          startBattle(ep.battleBossId);
        } else {
          state.activeActStory = { ...st, sceneIdx: (st.sceneIdx || 0) + 1, reply: '' };
          render();
        }
      });
      elChoicesPanel.appendChild(nxt);
    } else {
      sc.choices.forEach((ch) => {
        const cb = document.createElement('button');
        cb.className = 'choice-btn row-btn';
        cb.style.gridColumn = 'span 2';
        cb.innerHTML = `<span>${ch.label}</span><span class="choice-sub">${ch.sub}</span>`;
        cb.addEventListener('click', () => {
          ensureSandboxState();
          let preDmg = 0;
          if (ch.effect === 'speech') {
            gainSkillXp('speech', 12);
            state.sp = clamp(state.sp + 20, 0, state.maxSp);
            state.fame = (state.fame || 0) + 1;
          } else if (ch.effect === 'guts') {
            gainSkillXp('combat', 12);
            preDmg = 0.15;
          } else if (ch.effect === 'sneak') {
            gainSkillXp('sneak', 12);
            state.pendingReports = (state.pendingReports || 0) + 1;
            state.points += 20;
          }
          sfx.powerup();
          state.activeActStory = { ...st, reply: ch.reply, preDamagePct: preDmg };
          render();
        });
        elChoicesPanel.appendChild(cb);
      });
    }
    return;
  }

  if (state.phase === 'act_aftermath') {
    const am = state.pendingActAftermath || { actId: 'jeonju', epNum: 1 };
    const eps = ACT_STORY_EPISODES[am.actId] || [];
    const ep = eps.find((e) => e.ep === am.epNum) || eps[0];
    const actObj = KOREA_ACTS.find((a) => a.id === am.actId);
    elLocation.textContent = `DAY ${state.day} · ${timeLabel} · ${actObj?.name || ''}`;
    elSceneTag.textContent = `제${am.epNum}화 클리어!`;
    elSceneTag.className = 'scene-tag victory';
    elSceneTitle.textContent = ep ? ep.title : '사건 해결!';
    if (elFrame && actObj?.bg) {
      elFrame.classList.add('story-stage');
      elFrame.style.backgroundImage = `url('${actObj.bg}')`;
      elFrame.style.backgroundSize = 'cover';
      elFrame.style.backgroundPosition = 'center';
    }
    elBattleLog.textContent = ep?.aftermathText || '현장의 소란이 깔끔하게 정리되었습니다!';
    const doneBtn = document.createElement('button');
    doneBtn.className = 'choice-btn row-btn story-main-btn';
    doneBtn.style.gridColumn = 'span 2';
    doneBtn.innerHTML = am.isBoss
      ? `<span>🏆 ${actObj?.name || '지역'} 제패 완료!! 지도로 복귀 ▶</span><span class="choice-sub">다음 지역 및 신규 시스템 해금!</span>`
      : `<span>✨ 사건 마무리 & 지도로 복귀 ▶</span><span class="choice-sub">다음 화 해금 완료!</span>`;
    doneBtn.addEventListener('click', () => {
      state.pendingActAftermath = null;
      state.phase = 'map';
      sfx.victory();
      saveGame();
      render();
    });
    elChoicesPanel.appendChild(doneBtn);
    return;
  }

  if (state.phase === 'story_aftermath') {
    const chIdx = state.pendingStoryAftermath ?? Math.max(0, (state.chapterIndex || 1) - 1);
    const chObj = STORY_CHAPTERS[chIdx] || { title: `제${chIdx + 1}화` };
    const aft = STORY_AFTERMATHS[chIdx] || STORY_AFTERMATHS[0];
    elLocation.textContent = `${timeLabel} · 📖 제${chIdx + 1}화 완결 · EPISODE AFTERMATH`;
    elSceneTag.textContent = '후일담';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = `🎬 제${chIdx + 1}화 [${chObj.title || ''}] 완결!`;
    if (elFrame) elFrame.classList.add('combat-stage');
    setStageBg(`bg_${state.activeDistrict || 'mapo'}.jpg`);
    elHeroSprite.classList.remove('hidden');
    const hasYuki = !!state.lovers?.includes('yuki') && !state.sulky?.yuki;
    const hasChloe = !!state.lovers?.includes('chloe') && !state.sulky?.chloe;
    const hasPet = !!state.pet?.adopted;
    elHeroSprite.classList.toggle('with-yuki', hasYuki);
    if (elYukiSprite) elYukiSprite.classList.toggle('hidden', !hasYuki);
    if (elChloeSprite) {
      elChloeSprite.classList.toggle('hidden', !hasChloe);
      elChloeSprite.classList.toggle('with-yuki', hasYuki);
    }
    if (elKongiSprite) elKongiSprite.classList.toggle('hidden', !hasPet);

    elBattleLog.textContent =
      `📌 [사건 뒷이야기]\n${aft.epilogue}\n\n` +
      `💬 [동료 반응]\n${aft.partner}\n\n` +
      `📺 [다음 화 예고]\n${aft.teaser}`;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'choice-btn primary';
    nextBtn.innerHTML = `<span class="choice-title">✨ 제${chIdx + 1}화 완결 보너스 받기 (+${aft.bonusP}P · 사이다 +20) ▶</span><span class="choice-sub">다음 이야기가 서울 맵에서 기다리고 있습니다!</span>`;
    nextBtn.addEventListener('click', () => {
      sfx.victory?.();
      state.points += aft.bonusP;
      state.sp = clamp(state.sp + 20, 0, state.maxSp);
      state.pendingStoryAftermath = null;
      state.phase = 'map';
      state.log = `📖 제${chIdx + 1}화 완결! (+${aft.bonusP}P · 사이다 +20) ${aft.teaser}`;
      saveGame();
      render();
    });
    elChoicesPanel.appendChild(nextBtn);
    return;
  }

  if (state.phase === 'epilogue') {
    const spCnt = Object.keys(state.spirits || {}).filter((k) => (state.spirits[k] || 0) > 0).length;
    const epScenes = [
      {
        title: '🌅 에필로그 1/3 · 서울에 찾아온 진짜 아침',
        img: 'assets/images/morning_sunrise.jpg',
        quote: '김순경: "해냈습니다 영웅님!! 블랙튜브의 모든 조작 방송이 중단되고, 서울 시민들이 거리로 나와 박수를 보내고 있어요!"',
        text: '마포의 작은 골목에서 노란 완장 하나로 시작했던 싸움이 마침내 서울 전체를 지켜냈습니다.\n뉴스 속보마다 시민들의 감사 인사가 쏟아지고, 더 이상 억지 진상들에게 눈치 보는 사람은 없습니다.',
      },
      {
        title: '💖 에필로그 2/3 · 소중한 사람들과의 약속',
        img: (state.lovers?.includes('yuki') && state.lovers?.includes('chloe')) ? 'assets/images/triple_picnic.jpg' : (state.lovers?.includes('chloe') ? 'assets/images/chloe_wink.jpg' : 'assets/images/yuki_blush.jpg'),
        quote: state.lovers?.length > 0
          ? '"이제 매일 걱정하던 밤은 끝났네! 앞으로도 우리 곁을 지켜줄 거지, 영웅님? ♥"'
          : '콩이: "멍!! 🐾" (반가운 듯 꼬리를 흔들며 당신의 발치에 기댑니다)',
        text: '위기의 순간마다 힘이 되어준 동료들과 연인, 그리고 작은 반려견 콩이.\n당신은 그들과 함께 따뜻한 햇살 아래 행복한 웃음을 지었습니다.',
      },
      {
        title: '🏆 에필로그 3/3 · 시민영웅 명예의 전당 (엔딩 크레딧)',
        img: null,
        quote: '"당신이 지킨 작은 예절 하나가, 2026년 서울을 기적처럼 바꾸었습니다."',
        text:
          `━━━━━━━━ 🎬 HALL OF FAME ━━━━━━━━\n` +
          `🛡️ 시민영웅 레벨: Lv.${state.level || 1} (${getHeroRankTitle(state.level || 1)})\n` +
          `📅 클리어 일수: DAY ${state.day} · 팔로워 ${(state.followers || 120).toLocaleString()}명\n` +
          `🥊 참교육 횟수: ${state.winCount || 0}회 · 평화구역 ${getClearedDistrictCount(state)}/5\n` +
          `👻 수집 수호정령: ${spCnt}/${SPIRITS_50.length}종 · 💖 연인: ${(state.lovers || []).length}명\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `제작·기획: 마이프렌 × Antigravity · 플레이해주셔서 감사합니다!`,
      },
    ];
    const idx = clamp(state.epilogueIdx || 0, 0, epScenes.length - 1);
    const sc = epScenes[idx];
    elLocation.textContent = `DAY ${state.day} · 대장정 완결`;
    elSceneTag.textContent = '에필로그';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = sc.title;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = sc.quote;
    elQuoteBubble.classList.remove('hidden');
    if (sc.img) {
      elSceneImage.src = sc.img;
      elSceneImage.classList.remove('hidden');
    } else {
      showSceneCard('🏆 CITIZEN HERO · FINALE', '  ✨ 서울의 살아있는 전설 ✨\n  끝나지 않는 영웅의 이야기!', '명예의 전당 헌액 완료!');
    }
    elBattleLog.textContent = sc.text;
    elChoicesPanel.className = 'choices-panel';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'choice-btn row-btn story-main-btn';
    nextBtn.innerHTML = idx < epScenes.length - 1
      ? '<span>▶ 다음 에필로그 보기</span><span class="choice-sub">여운 이어가기</span>'
      : '<span>🏆 엔딩 & 무한 자유모드로 입장!</span><span class="choice-sub">명예의 전당 등록 완료</span>';
    nextBtn.addEventListener('click', () => {
      sfx.victory();
      if (idx < epScenes.length - 1) {
        state.epilogueIdx = idx + 1;
      } else {
        state.epilogueSeen = true;
        const ending = evaluateEnding(state, false);
        state.achievedEndingId = ending.id;
        state.phase = 'victory';
        state.log = buildFullEndingText(ending, state);
      }
      saveGame();
      render();
    });
    elChoicesPanel.appendChild(nextBtn);
    return;
  }

  if (state.phase === 'victory') {
    const ending = ENDINGS.find((e) => e.id === state.achievedEndingId) || ENDINGS[ENDINGS.length - 1];
    elLocation.textContent = `DAY ${state.day} · 엔딩 #${ending.num}/${ENDINGS.length}`;
    elSceneTag.textContent = ending.badge;
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = ending.title;
    if (ending.image) {
      elSceneImage.src = `${ending.image}?v=82`;
      elSceneImage.classList.remove('hidden');
    } else {
      showSceneCard(
        `🏆 ENDING ${ending.num}/${ENDINGS.length} · ${ending.badge}`,
        ending.ascii,
        `총 ${state.day}일차 · 팔로워 ${(state.followers || 120).toLocaleString()}명 · 특성 ${state.traits.length}개`
      );
    }
    state.log = buildFullEndingText(ending, state);
  } else {
    elLocation.textContent = `DAY ${state.day} · 동네 응급실`;
    elSceneTag.textContent = '패배';
    elSceneTag.className = 'scene-tag boss';
    elSceneTitle.textContent = '💥 화병으로 쓰러짐...';
    showSceneCard(
      '🏥 동네 병원 응급실',
      '   ───/\\──/\\──────────  삐—\n    "혈압 220 돌파! 절대 안정 요망"\n   ─────────────────────────\n     다음엔 꼭 참교육에 성공하리라...',
      `도달 일차: DAY ${state.day}`
    );
  }
  elBattleLog.textContent = state.log;

  if (state.phase === 'victory' && (state.storyCleared || state.freePlayMode)) {
    const btnFree = document.createElement('button');
    btnFree.className = 'choice-btn row-btn story-main-btn';
    btnFree.innerHTML = '<span>♾️ 무한 자유모드 계속하기</span><span class="choice-sub">시간 제한 해제 · 배틀타워·마계·올컬렉션</span>';
    btnFree.addEventListener('click', () => {
      sfx.powerup();
      state.freePlayMode = true;
      state.phase = 'map';
      state.log = '♾️ 서울 영웅 무한 자유모드 돌입! 이제 기한 제한 없이 서울을 지켜나가세요!';
      saveGame();
      render();
    });
    elChoicesPanel.appendChild(btnFree);

    // V33.2 스토리 클리어 후 즉시 난이도 선택 2회차(NG+) 시작
    const ngBox = document.createElement('div');
    ngBox.style.cssText = 'display:flex;gap:4px;margin-top:4px;';
    const unlockedCnt = loadUnlockedEndings().length;
    const bonusStat = Math.min(8, Math.max(2, unlockedCnt * 2));
    Object.values(DIFFICULTIES).forEach((df) => {
      const nb = document.createElement('button');
      nb.className = 'choice-btn';
      nb.style.cssText = 'flex:1;padding:7px 4px;background:linear-gradient(180deg,#fffbeb,#fef3c7);border-color:#d97706;';
      nb.innerHTML = `<span style="font-size:0.78rem;font-weight:800;">🔄 ${df.name} 2회차</span><span class="choice-sub" style="font-size:0.65rem;">전스탯+${bonusStat} · 유키/클로이 즉시해금!</span>`;
      nb.addEventListener('click', () => {
        sfx.powerup();
        const nextNg = (state.ngPlus || 0) + 1;
        state = createNewGameState();
        state.difficulty = df.id;
        state.ngPlus = nextNg;
        state.stats.speech += bonusStat;
        state.stats.guts += bonusStat;
        state.stats.law += bonusStat;
        state.points += 120;
        saveGame();
        render();
      });
      ngBox.appendChild(nb);
    });
    elChoicesPanel.appendChild(ngBox);
  }

  const btnTitle = document.createElement('button');
  btnTitle.className = 'choice-btn row-btn';
  btnTitle.innerHTML = '<span>🏠 타이틀 화면으로 돌아가기</span><span class="choice-sub">메인</span>';
  btnTitle.addEventListener('click', () => {
    sfx.click();
    state.phase = 'title';
    render();
  });
  elChoicesPanel.appendChild(btnTitle);
}

// 📱 스마트폰 모달 렌더링
function renderPhoneModal() {
  const rep = getReputationInfo();
  const clearedCount = state.defeatedBossIds.length;
  const unlockedMsgs = STORY_MESSAGES.filter((m) => clearedCount >= m.unlockBossCount).reverse();

  elPhoneBody.innerHTML = '';

  // 1. 성향 & 평판 카드
  const repCard = document.createElement('div');
  repCard.className = 'rep-card';
  const hRank = getHeroRankInfo();
  const wObj = getWeatherObj();
  repCard.innerHTML = `
    <div class="rep-row">
      <span>😇 모범시민: ${state.lawful}</span>
      <span>😈 광인 지수: ${state.chaotic}</span>
    </div>
    <div style="font-size:0.8rem;font-weight:800;">🏆 랭크: ${hRank.title} (공격+${hRank.atkBonus} · 다음: ${hRank.next})</div>
    <div style="font-size:0.74rem;color:#695544;">${wObj.label} — ${wObj.desc}</div>
    <div style="font-size:0.8rem;font-weight:800;">현재 칭호: ${rep.label}</div>
    <div class="rep-perk">✨ ${rep.perkText}</div>
  `;
  elPhoneBody.appendChild(repCard);

  // 2. 안전신문고 앱
  const reportCard = document.createElement('div');
  reportCard.className = 'inv-item';
  reportCard.innerHTML = `
    <div class="inv-info">
      <h4>🚨 안전신문고 앱 (채증 ${state.pendingReports}건)</h4>
      <p>모은 빌런 채증을 일괄 신고해 도덕점수를 받습니다 (건당 +20 P)</p>
    </div>
  `;
  const rBtn = document.createElement('button');
  rBtn.className = 'use-btn';
  rBtn.textContent = state.pendingReports > 0 ? '일괄신고' : '없음';
  rBtn.disabled = state.pendingReports <= 0;
  rBtn.addEventListener('click', () => {
    if (state.pendingReports <= 0) return;
    sfx.powerup();
    vibrate(30);
    const earned = state.pendingReports * 20;
    const reducedChaos = state.pendingReports * 5;
    state.points += earned;
    state.lawful += state.pendingReports * 3;
    state.chaosLevel = clamp((state.chaosLevel ?? 25) - reducedChaos, 0, 100);
    state.followers = (state.followers || 120) + state.pendingReports * 50;
    state.pendingReports = 0;
    state.liveFeed = {
      badge: '📱 안전신문고 포상',
      likes: '❤️ 1.9만',
      title: `신고 일괄 처리 완료! (+${earned} P · 서울 민폐도 -${reducedChaos}%)`,
      comment: '💬 베댓: "금융치료가 진짜 최고의 약이다 ㅋㅋㅋ"',
    };
    saveGame();
    renderPhoneModal();
    render();
  });
  reportCard.appendChild(rBtn);
  if (state.pendingReports >= 2) {
    const courtUnlocked = isFeatureUnlocked(state, 'court');
    const cBtn = document.createElement('button');
    cBtn.className = 'use-btn';
    cBtn.style.background = courtUnlocked ? '#9e2a2b' : '#7a7063';
    cBtn.style.marginLeft = '4px';
    cBtn.textContent = courtUnlocked ? '⚖️즉결재판' : '🔒재판(9화)';
    cBtn.addEventListener('click', () => {
      if (!courtUnlocked) {
        sfx.damage();
        showToast('🔒 제9화 이후 즉결재판이 해금됩니다!', 'warn');
        return;
      }
      sfx.powerup();
      elPhoneModal.classList.add('hidden');
      state.courtCaseIdx = Math.floor(Math.random() * COURT_CASES.length);
      state.phase = 'court';
      render();
    });
    reportCard.appendChild(cBtn);
  }
  elPhoneBody.appendChild(reportCard);

  // 2.5. 엔딩 도감 & 힌트 카드
  const unlockedEndings = loadUnlockedEndings();
  const endCard = document.createElement('div');
  endCard.className = 'inv-item';
  endCard.innerHTML = `
    <div class="inv-info">
      <h4>🏆 엔딩 도감 (${unlockedEndings.length}/16)</h4>
      <p>16가지 멀티 엔딩 달성 조건 힌트와 회상 보기</p>
    </div>
  `;
  const eBtn = document.createElement('button');
  eBtn.className = 'use-btn';
  eBtn.style.background = '#b07d2b';
  eBtn.textContent = '도감';
  eBtn.addEventListener('click', () => {
    sfx.click();
    elPhoneModal.classList.add('hidden');
    openEndingsModal();
  });
  endCard.appendChild(eBtn);
  elPhoneBody.appendChild(endCard);

  // 2.52. V23.0 빌런 도감 & 추억 앨범 버튼
  const allEnemiesList = [...VILLAINS, ...GUERRILLA_VILLAINS, ...BOSSES, HIDDEN_BOSS, ...STORY_BOSSES];
  const metCount = allEnemiesList.filter((v) => (state.villainEncounters?.[v.id] || 0) > 0 || (state.villainWins?.[v.id] || 0) > 0).length;
  const codexCard = document.createElement('div');
  codexCard.className = 'inv-item';
  codexCard.innerHTML = `
    <div class="inv-info">
      <h4>📖 빌런 도감 (${metCount}/${allEnemiesList.length}) & 📸 추억 앨범</h4>
      <p>참교육한 빌런 기록과 유키·클로이·콩이 추억 일러스트</p>
    </div>
  `;
  const vBtn = document.createElement('button');
  vBtn.className = 'use-btn';
  vBtn.style.background = '#59432b';
  vBtn.textContent = '도감';
  vBtn.addEventListener('click', () => { sfx.click(); elPhoneModal.classList.add('hidden'); openVillainCodexModal(); });
  const mBtn = document.createElement('button');
  mBtn.className = 'use-btn';
  mBtn.style.background = '#c9184a';
  mBtn.style.marginLeft = '4px';
  mBtn.textContent = '앨범';
  mBtn.addEventListener('click', () => { sfx.click(); elPhoneModal.classList.add('hidden'); openMemoryAlbumModal(); });
  codexCard.appendChild(vBtn);
  codexCard.appendChild(mBtn);
  elPhoneBody.appendChild(codexCard);

  // 2.53. V24.0 파밍 장비 창고 & 서울 익명 커뮤니티
  const eqBon = getEquippedBonuses();
  const gearCard = document.createElement('div');
  gearCard.className = 'inv-item';
  gearCard.innerHTML = `
    <div class="inv-info">
      <h4>⚔️ 파밍 장비 창고 (${(state.gearBag || []).length}개 보유)</h4>
      <p>장착 보너스: 공격 +${eqBon.atk} · 🛡️ 방어 +${eqBon.def} · 치명 +${Math.round(eqBon.crit * 100)}%</p>
    </div>
  `;
  const gearUnlocked = isFeatureUnlocked(state, 'gear');
  const commUnlocked = isFeatureUnlocked(state, 'community');
  const gBtn = document.createElement('button');
  gBtn.className = 'use-btn';
  gBtn.style.background = gearUnlocked ? '#7e22ce' : '#7a7063';
  gBtn.textContent = gearUnlocked ? '장비' : '🔒(3화)';
  gBtn.addEventListener('click', () => {
    if (!gearUnlocked) {
      sfx.damage();
      showToast('🔒 제3화 클리어 후 파밍 장비 창고가 해금됩니다!', 'warn');
      return;
    }
    sfx.click(); elPhoneModal.classList.add('hidden'); openGearModal();
  });
  const cBtn2 = document.createElement('button');
  cBtn2.className = 'use-btn';
  cBtn2.style.background = commUnlocked ? '#1d4ed8' : '#7a7063';
  cBtn2.style.marginLeft = '4px';
  cBtn2.textContent = commUnlocked ? '커뮤니티' : '🔒(6화)';
  cBtn2.addEventListener('click', () => {
    if (!commUnlocked) {
      sfx.damage();
      showToast('🔒 제6화 클리어 후 서울 익명 커뮤니티가 해금됩니다!', 'warn');
      return;
    }
    sfx.click(); elPhoneModal.classList.add('hidden'); openCommunityModal();
  });
  gearCard.appendChild(gBtn);
  gearCard.appendChild(cBtn2);
  elPhoneBody.appendChild(gearCard);

  // 2.55. V19.0 흑막 추적 & 갱생 동료 카드
  const clueIds = state.clues || [];
  const clueCard = document.createElement('div');
  clueCard.className = 'rep-card';
  const clueHtml = CLUES.map((c) => {
    const has = clueIds.includes(c.id);
    return `<div style="font-size:0.74rem;margin-top:3px;color:${has ? '#2d6a4f' : '#8c7352'};">${has ? '✅' : '🔒'} ${c.num}. ${has ? `${c.title} — ${c.desc}` : `미확보 (${c.source})`}</div>`;
  }).join('');
  const allyIds = state.allies || [];
  const allyHtml = REFORMED_ALLIES.map((a) => {
    const has = allyIds.includes(a.id);
    return `<div style="font-size:0.74rem;margin-top:2px;color:${has ? '#1d3557' : '#8c7352'};">${has ? '🤝' : '⬜'} ${a.name}: ${a.desc}</div>`;
  }).join('');
  clueCard.innerHTML = `
    <div style="font-size:0.8rem;font-weight:800;">🕵️ [블랙 튜브 MCN] 흑막 단서 (${clueIds.length}/5)</div>
    ${clueHtml}
    <div style="font-size:0.8rem;font-weight:800;margin-top:8px;">🤝 시민영웅단 갱생 동료 (${allyIds.length}/3)</div>
    ${allyHtml}
  `;
  elPhoneBody.appendChild(clueCard);

  // 2.6. V14.0 업적 도감 카드
  const achCount = (state.unlockedAch || []).length;
  const achCard = document.createElement('div');
  achCard.className = 'inv-item';
  achCard.innerHTML = `
    <div class="inv-info">
      <h4>🏅 업적 도감 (${achCount}/${ACHIEVEMENTS.length})</h4>
      <p>달성 시 영구 스탯 & 포인트 보너스 자동 지급</p>
    </div>
  `;
  const aBtn = document.createElement('button');
  aBtn.className = 'use-btn';
  aBtn.style.background = '#5b8c38';
  aBtn.textContent = '업적';
  aBtn.addEventListener('click', () => {
    sfx.click();
    elPhoneModal.classList.add('hidden');
    openAchievementsModal();
  });
  achCard.appendChild(aBtn);
  elPhoneBody.appendChild(achCard);

  // 3. 데이트 후일담 & 톡방 스토리 메시지
  (state.dateMessages || []).forEach((dm) => {
    const mc = document.createElement('div');
    mc.className = 'msg-card';
    mc.style.borderLeft = '3px solid #d46a92';
    mc.innerHTML = `
      <div class="msg-sender">${dm.sender}</div>
      <div class="msg-title">${dm.title}</div>
      <div class="msg-body">${dm.body}</div>
    `;
    elPhoneBody.appendChild(mc);
  });

  unlockedMsgs.forEach((m) => {
    const mc = document.createElement('div');
    mc.className = 'msg-card';
    mc.innerHTML = `
      <div class="msg-sender">${m.sender}</div>
      <div class="msg-title">${m.title}</div>
      <div class="msg-body">${m.body}</div>
    `;
    elPhoneBody.appendChild(mc);
  });
}

// Modals & Listeners
btnPhone.addEventListener('click', () => {
  sfx.click();
  state.unreadMessages = 0;
  saveGame();
  renderPhoneModal();
  elPhoneModal.classList.remove('hidden');
  render();
});

btnClosePhone.addEventListener('click', () => elPhoneModal.classList.add('hidden'));
elPhoneModal.addEventListener('click', (e) => { if (e.target === elPhoneModal) elPhoneModal.classList.add('hidden'); });

function openSettingsModal() {
  btnToggleSound.textContent = settings.sound ? '켜짐' : '꺼짐';
  if (btnToggleBgm) btnToggleBgm.textContent = settings.bgm !== false ? '켜짐' : '꺼짐';
  btnToggleVibrate.textContent = settings.vibrate ? '켜짐' : '꺼짐';
  elSettingsModal.classList.remove('hidden');
}

btnSettings.addEventListener('click', () => {
  sfx.click();
  openSettingsModal();
});

btnToggleSound.addEventListener('click', () => {
  settings.sound = !settings.sound;
  sfx.enabled = settings.sound;
  saveSettings();
  btnToggleSound.textContent = settings.sound ? '켜짐' : '꺼짐';
  if (settings.sound) sfx.click();
});

if (btnToggleBgm) {
  btnToggleBgm.addEventListener('click', () => {
    settings.bgm = settings.bgm === false;
    sfx.bgmEnabled = settings.bgm;
    saveSettings();
    btnToggleBgm.textContent = settings.bgm ? '켜짐' : '꺼짐';
    if (settings.bgm) {
      sfx.click();
      updateBgmForPhase();
    } else {
      sfx.stopBgm();
    }
  });
}

function updateBgmForPhase() {
  if (!settings.bgm && settings.bgm !== undefined) return;
  if (state.phase === 'combat') sfx.setBgm('combat');
  else if (['romance', 'lang_quiz', 'date_scene'].includes(state.phase)) sfx.setBgm('romance');
  else if (state.phase === 'victory') sfx.setBgm('victory');
  else if (state.phase === 'title' || state.phase === 'gameover') sfx.setBgm('none');
  else sfx.setBgm('map');
}

btnToggleVibrate.addEventListener('click', () => {
  settings.vibrate = !settings.vibrate;
  saveSettings();
  btnToggleVibrate.textContent = settings.vibrate ? '켜짐' : '꺼짐';
  if (settings.vibrate) vibrate(30);
});

btnGoTitle.addEventListener('click', () => {
  sfx.click();
  saveGame();
  elSettingsModal.classList.add('hidden');
  state.phase = 'title';
  render();
});

btnInventory.addEventListener('click', () => {
  sfx.click();
  elInvList.innerHTML = '';
  if (state.inventory.length === 0) {
    elInvList.innerHTML = '<p style="text-align:center;color:#695544;padding:14px 0;">가방이 비어 있습니다.</p>';
  } else {
    state.inventory.forEach((id, idx) => {
      const item = ITEMS[id];
      if (!item) return;
      const used = !item.consumable && state.usedEquipThisBattle.includes(id);
      const tagHtml = item.consumable
        ? '<span class="inv-tag heal">💊 소모품</span>'
        : '<span class="inv-tag equip">⚔️ 영구장비</span>';
      const card = document.createElement('div');
      card.className = 'inv-item';
      card.innerHTML = `${itemImgHtml(id, 'item-thumb')}<div class="inv-info"><h4>${item.name}${tagHtml}</h4><p>${item.desc}</p></div>`;
      const uBtn = document.createElement('button');
      uBtn.className = 'use-btn';
      uBtn.textContent = used ? '사용완료' : '사용';
      uBtn.disabled = used;
      uBtn.addEventListener('click', () => useItem(id, idx));
      card.appendChild(uBtn);
      elInvList.appendChild(card);
    });
  }
  elInvModal.classList.remove('hidden');
});

btnTraits.addEventListener('click', () => {
  sfx.click();
  elTraitsList.innerHTML = '';
  if (state.traits.length === 0) {
    elTraitsList.innerHTML = '<p style="text-align:center;color:#695544;padding:14px 0;">아직 획득한 특성이 없습니다.</p>';
  } else {
    state.traits.forEach((t) => {
      const card = document.createElement('div');
      card.className = 'inv-item';
      card.innerHTML = `<div class="inv-info"><h4>${t.name}</h4><p>${t.desc}</p></div>`;
      elTraitsList.appendChild(card);
    });
  }
  elTraitsModal.classList.remove('hidden');
});

btnCloseInv.addEventListener('click', () => elInvModal.classList.add('hidden'));
btnCloseTraits.addEventListener('click', () => elTraitsModal.classList.add('hidden'));
btnCloseSettings.addEventListener('click', () => elSettingsModal.classList.add('hidden'));
btnCloseActivity.addEventListener('click', () => elActivityModal.classList.add('hidden'));
btnCloseSave.addEventListener('click', () => elSaveModal.classList.add('hidden'));
btnCloseEndings.addEventListener('click', () => elEndingsModal.classList.add('hidden'));
if (btnCloseAch) btnCloseAch.addEventListener('click', () => elAchModal.classList.add('hidden'));
elInvModal.addEventListener('click', (e) => { if (e.target === elInvModal) elInvModal.classList.add('hidden'); });
elTraitsModal.addEventListener('click', (e) => { if (e.target === elTraitsModal) elTraitsModal.classList.add('hidden'); });
elSettingsModal.addEventListener('click', (e) => { if (e.target === elSettingsModal) elSettingsModal.classList.add('hidden'); });
elActivityModal.addEventListener('click', (e) => { if (e.target === elActivityModal) elActivityModal.classList.add('hidden'); });
elSaveModal.addEventListener('click', (e) => { if (e.target === elSaveModal) elSaveModal.classList.add('hidden'); });
elEndingsModal.addEventListener('click', (e) => { if (e.target === elEndingsModal) elEndingsModal.classList.add('hidden'); });
if (elAchModal) elAchModal.addEventListener('click', (e) => { if (e.target === elAchModal) elAchModal.classList.add('hidden'); });

function checkAchievements() {
  if (!state.unlockedAch) state.unlockedAch = [];
  let newlyUnlocked = [];
  ACHIEVEMENTS.forEach((ach) => {
    if (!state.unlockedAch.includes(ach.id) && ach.check(state)) {
      state.unlockedAch.push(ach.id);
      ach.reward(state);
      newlyUnlocked.push(ach.name);
    }
  });
  if (newlyUnlocked.length > 0) {
    state.log = (state.log || '') + `\n🏅 [업적 달성!] ${newlyUnlocked.join(', ')} (보상 자동 지급!)`;
    showToast(`🏅 업적 달성: ${newlyUnlocked.join(', ')}!`, 'good');
  }
}

function openAchievementsModal() {
  if (!elAchModal) return;
  const unlocked = state.unlockedAch || [];
  elAchModalTitle.textContent = `🏅 업적 도감 (${unlocked.length}/${ACHIEVEMENTS.length})`;
  elAchList.innerHTML = '';
  ACHIEVEMENTS.forEach((ach) => {
    const isOpen = unlocked.includes(ach.id);
    const card = document.createElement('div');
    card.className = 'inv-item';
    card.style.opacity = isOpen ? '1' : '0.65';
    card.innerHTML = `
      <div class="inv-info">
        <h4>${isOpen ? '✅' : '🔒'} ${ach.name}</h4>
        <p>${ach.desc} · 보상: ${ach.rewardDesc}</p>
      </div>
    `;
    elAchList.appendChild(card);
  });
  elAchModal.classList.remove('hidden');
}

function startTimingMinigame(onFinish) {
  if (!elTimingModal || !elTimingCursor || !btnTimingTap) {
    onFinish(false);
    return;
  }
  elTimingModal.classList.remove('hidden');
  let pos = 5;
  let dir = 1;
  const timer = setInterval(() => {
    pos += dir * 4;
    if (pos >= 95) { pos = 95; dir = -1; }
    if (pos <= 5) { pos = 5; dir = 1; }
    elTimingCursor.style.left = `${pos}%`;
  }, 22);

  const handleTap = () => {
    clearInterval(timer);
    btnTimingTap.removeEventListener('click', handleTap);
    elTimingModal.classList.add('hidden');
    const wide = getSpiritBonuses().perkId === 'snap_wide';
    const isPerfect = wide ? (pos >= 32 && pos <= 68) : (pos >= 38 && pos <= 62);
    onFinish(isPerfect);
  };
  btnTimingTap.addEventListener('click', handleTap);
}

function openVillainCodexModal() {
  const regularEnemies = [...VILLAINS, ...GUERRILLA_VILLAINS, ...BOSSES, HIDDEN_BOSS];
  const allEnemies = [...regularEnemies, ...STORY_BOSSES];
  const storyBossSet = new Set(STORY_BOSSES.map((s) => s.id));
  const wins = state.villainWins || {};
  const encounters = state.villainEncounters || {};
  const isMet = (v) => (encounters[v.id] || 0) > 0 || (wins[v.id] || 0) > 0;
  const metRegular = regularEnemies.filter(isMet);
  const metStory = STORY_BOSSES.filter(isMet);
  const totalMet = metRegular.length + metStory.length;

  elEndingsModalTitle.textContent = `📖 빌런 도감 (${totalMet}/${allEnemies.length})`;
  elEndingsList.innerHTML = '';

  const renderGroup = (title, list) => {
    if (list.length === 0) return;
    const hdr = document.createElement('div');
    hdr.style.cssText = 'font-size:0.78rem;font-weight:700;color:#6b4e2e;margin:8px 0 4px;padding-bottom:3px;border-bottom:1px dashed var(--paper-border);';
    hdr.textContent = title;
    elEndingsList.appendChild(hdr);
    list.forEach((v) => {
      const winCnt = wins[v.id] || 0;
      const encCnt = Math.max(encounters[v.id] || 0, winCnt);
      const isStory = storyBossSet.has(v.id);
      const card = document.createElement('div');
      card.className = 'inv-item';
      card.innerHTML = `
        ${v.image ? `<img src="${v.image}" class="item-thumb" style="border-radius:4px;object-fit:cover;" alt="" />` : `<div style="font-size:1.5rem;width:40px;text-align:center;flex-shrink:0;margin-right:8px;">${v.emoji || '💢'}</div>`}
        <div class="inv-info">
          <h4>${isStory ? '🎬 ' : ''}${v.name}</h4>
          <p>${v.weaknessLabel || ''} · 👀 조우 ${encCnt}회 · ✅ 참교육 ${winCnt}회</p>
        </div>
      `;
      elEndingsList.appendChild(card);
    });
  };

  if (totalMet === 0) {
    const empty = document.createElement('div');
    empty.className = 'inv-item';
    empty.innerHTML = `
      <div class="inv-info">
        <h4>🕵️ 아직 인카운트한 빌런이 없습니다</h4>
        <p>순찰이나 스토리 진행으로 빌런과 조우하면 자동으로 도감에 등록됩니다!</p>
      </div>
    `;
    elEndingsList.appendChild(empty);
  } else {
    renderGroup(`🚨 일반·거점 빌런 (${metRegular.length}/${regularEnemies.length})`, metRegular);
    renderGroup(`🎬 스토리 전용 보스 (${metStory.length}/${STORY_BOSSES.length})`, metStory);
  }

  const remaining = allEnemies.length - totalMet;
  if (remaining > 0) {
    const hint = document.createElement('div');
    hint.style.cssText = 'font-size:0.74rem;color:#7a6652;text-align:center;padding:10px 6px 4px;';
    hint.textContent = `🔒 미조우 빌런 ${remaining}명 — 실제 인카운트(전투 조우) 시 도감에 공개됩니다.`;
    elEndingsList.appendChild(hint);
  }

  elEndingsModal.classList.remove('hidden');
}

function openMiniStatsHelpModal() {
  if (!state.allocatedStats) state.allocatedStats = { speech: 0, guts: 0, law: 0, hp: 0 };
  const spPts = state.skillPoints || 0;
  const s = state.stats || { speech: 2, guts: 2, law: 2 };
  const eq = typeof getEquippedBonuses === 'function' ? getEquippedBonuses() : { atk: 0, sp: 0, crit: 0, dice: 0 };
  const speechDmg = 18 + s.speech * 4 + (state.bonusDmg || 0) + (eq.atk || 0);
  const gutsDmg = 16 + s.guts * 4 + (state.bonusDmg || 0) + (eq.atk || 0);
  const lawDmg = 24 + s.law * 5 + (state.bonusDmg || 0) + (eq.atk || 0);
  const spDmg = 45 + (state.spDmgBonus || 0) + (state.bonusDmg || 0) + (eq.atk || 0) + (s.speech + s.guts + s.law) * 2;
  const lv = state.level || 1;
  const curExp = state.exp || 0;
  const needExp = lv >= 50 ? 0 : getExpToNextLevel(lv);
  const rankTitle = getHeroRankTitle(lv);

  elEndingsModalTitle.textContent = `📊 Lv.${lv}/50 · 스탯 분배 & 도덕P`;
  elEndingsList.innerHTML = '';

  const totalAlloc = (state.allocatedStats.speech || 0) + (state.allocatedStats.guts || 0) + (state.allocatedStats.law || 0) + (state.allocatedStats.hp || 0);
  const spBanner = document.createElement('div');
  spBanner.className = 'inv-item';
  spBanner.style.background = spPts > 0 ? 'rgba(217, 119, 6, 0.12)' : '';
  spBanner.innerHTML = `
    <div class="inv-info">
      <h4>✨ 보유 스킬포인트: <span style="color:#b45309;">${spPts} pt</span></h4>
      <p>레벨업마다 +2 pt 지급! 원하는 스탯에 자유롭게 투자하세요.</p>
    </div>
  `;
  const resetBtn = document.createElement('button');
  resetBtn.className = 'use-btn';
  resetBtn.style.background = '#695544';
  resetBtn.textContent = '리셋(100P)';
  resetBtn.disabled = totalAlloc <= 0 || state.points < 100;
  resetBtn.addEventListener('click', () => {
    sfx.click();
    const al = state.allocatedStats;
    const refund = (al.speech || 0) + (al.guts || 0) + (al.law || 0) + (al.hp || 0);
    if (refund <= 0 || state.points < 100) return;
    state.points -= 100;
    state.stats.speech = Math.max(1, state.stats.speech - (al.speech || 0));
    state.critBonus = Math.max(0, (state.critBonus || 0) - (al.speech || 0) * 0.02);
    state.stats.guts = Math.max(1, state.stats.guts - (al.guts || 0));
    state.maxHp = Math.max(80, state.maxHp - (al.guts || 0) * 6 - (al.hp || 0) * 15);
    state.stats.law = Math.max(1, state.stats.law - (al.law || 0));
    state.bonusDmg = Math.max(0, (state.bonusDmg || 0) - (al.law || 0) * 2);
    state.flatDef = Math.max(0, (state.flatDef || 0) - (al.hp || 0));
    state.hp = Math.min(state.hp, state.maxHp);
    state.skillPoints = (state.skillPoints || 0) + refund;
    state.allocatedStats = { speech: 0, guts: 0, law: 0, hp: 0 };
    showToast(`🔄 스탯 초기화 완료! (+${refund} pt 환급)`, 'good');
    saveGame();
    openMiniStatsHelpModal();
    render();
  });
  spBanner.appendChild(resetBtn);
  elEndingsList.appendChild(spBanner);

  const evoGuide = document.createElement('div');
  evoGuide.className = 'inv-item';
  evoGuide.style.background = 'rgba(126, 34, 206, 0.08)';
  evoGuide.style.borderColor = '#a855f7';
  const tierTxt = (v) => (v >= 50 ? '🌟초월(50+)' : (v >= 25 ? '⚡각성(25+)' : '기본'));
  evoGuide.innerHTML = `
    <div class="inv-info">
      <h4>⚡ 스킬 진화: 각성(25+) & 🌟 초월(50+)</h4>
      <p>언변·깡다구·법지식이 <b>25+</b>면 [각성], <b>50+</b>면 [초월]로 자동 진화해 피해·상성 배율·최대 PP가 대폭 오릅니다!<br/>현재: 언변 <b>${tierTxt(s.speech)}</b> · 깡다구 <b>${tierTxt(s.guts)}</b> · 법지식 <b>${tierTxt(s.law)}</b></p>
    </div>
  `;
  elEndingsList.appendChild(evoGuide);

  const items = [
    {
      emoji: '🏅',
      title: `영웅 레벨 Lv.${lv} / 50 (${rankTitle})`,
      desc: lv >= 50
        ? `최고 레벨 달성! 기본 방어력 +${Math.floor((lv - 1) / 3)} 적용 중!`
        : `경험치 ${curExp} / ${needExp} EXP · 레벨업 시 최대HP+5, 공+1, 스킬P+2 (3Lv마다 방어+1, 5Lv마다 전스탯+1)`,
    },
    {
      emoji: '🗣️',
      allocKey: 'speech',
      allocHint: '+1 투자 (언변+1 · 치명+2%)',
      title: `언변 (Speech) — 현재 ${s.speech}`,
      desc: `[팩트폭력] 위력(약 ${speechDmg}) 증가 & 사이다 +10. 투자 시 언변+1, 치명타+2%!`,
    },
    {
      emoji: '🦁',
      allocKey: 'guts',
      allocHint: '+1 투자 (깡다구+1 · HP+6)',
      title: `깡다구 (Guts) — 현재 ${s.guts}`,
      desc: `[거울치료] 위력(약 ${gutsDmg}) 증가 & 사이다 +15+. 투자 시 깡다구+1, 최대HP+6!`,
    },
    {
      emoji: '⚖️',
      allocKey: 'law',
      allocHint: '+1 투자 (법지식+1 · 공+2)',
      title: `법지식 (Law) — 현재 ${s.law}`,
      desc: `[법전] 주사위 성공률/위력(약 ${lawDmg} + 기절) 상승. 투자 시 법지식+1, 모든 공격+2!`,
    },
    {
      emoji: '❤️',
      allocKey: 'hp',
      allocHint: '+1 투자 (HP+15 · 방어+1)',
      title: `인내심 단련 — 최대 ${state.maxHp} / 방어 +${(state.flatDef || 0) + Math.floor((lv - 1) / 3)}`,
      desc: `보스전 생존력 강화! 투자 시 최대 인내심 +15(즉시+15), 고정 방어력 +1!`,
    },
    {
      emoji: '🫧',
      title: `사이다 필살기 연동 — 총합 ${s.speech + s.guts + s.law}`,
      desc: `3개 스탯 총합×2가 필살기 위력에 합산됨 (예상 위력: 약 ${spDmg}, 피버 타임 시 사이다 반값!)`,
    },
    {
      emoji: '💰',
      title: `도덕점수 (도덕P) — 현재 ${state.points}P`,
      desc: `편의점·장비 강화·자기계발·오락실 등에 쓰이는 핵심 활동 자금입니다.`,
    },
  ];

  items.forEach((it) => {
    const card = document.createElement('div');
    card.className = 'inv-item';
    card.innerHTML = `
      <div style="font-size:1.45rem;width:34px;text-align:center;flex-shrink:0;margin-right:8px;">${it.emoji}</div>
      <div class="inv-info">
        <h4>${it.title}</h4>
        <p style="white-space:pre-line;line-height:1.4;">${it.desc}</p>
      </div>
    `;
    if (it.allocKey) {
      const btn = document.createElement('button');
      btn.className = 'use-btn';
      btn.style.background = spPts > 0 ? '#d97706' : '#8c7a6b';
      btn.textContent = '+1';
      btn.title = it.allocHint;
      btn.disabled = spPts <= 0;
      btn.addEventListener('click', () => {
        if ((state.skillPoints || 0) <= 0) return;
        sfx.powerup();
        state.skillPoints -= 1;
        state.allocatedStats[it.allocKey] = (state.allocatedStats[it.allocKey] || 0) + 1;
        if (it.allocKey === 'speech') {
          state.stats.speech += 1;
          state.critBonus = (state.critBonus || 0) + 0.02;
        } else if (it.allocKey === 'guts') {
          state.stats.guts += 1;
          state.maxHp += 6;
          state.hp = Math.min(state.maxHp, state.hp + 6);
        } else if (it.allocKey === 'law') {
          state.stats.law += 1;
          state.bonusDmg = (state.bonusDmg || 0) + 2;
        } else if (it.allocKey === 'hp') {
          state.maxHp += 15;
          state.hp = Math.min(state.maxHp, state.hp + 15);
          state.flatDef = (state.flatDef || 0) + 1;
        }
        saveGame();
        openMiniStatsHelpModal();
        render();
      });
      card.appendChild(btn);
    }
    elEndingsList.appendChild(card);
  });

  elEndingsModal.classList.remove('hidden');
}

if (elMiniStatsBtn) {
  elMiniStatsBtn.addEventListener('click', () => {
    sfx.click();
    openMiniStatsHelpModal();
  });
  elMiniStatsBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      sfx.click();
      openMiniStatsHelpModal();
    }
  });
}

function openMemoryAlbumModal() {
  elEndingsModalTitle.textContent = '📸 유키·클로이·콩이 추억 앨범';
  elEndingsList.innerHTML = '';
  const items = [
    { img: 'assets/images/yuki_normal.jpg', title: '🇯🇵 유키 — 홍대 북카페의 미소', unlock: (state.love?.yuki || 0) >= 35, desc: '호감도 35 이상(정식 데이트) 달성 시 해금!' },
    { img: 'assets/images/yuki_blush.jpg', title: '💖 유키 — 두근두근 고백의 순간', unlock: !!state.lovers?.includes('yuki'), desc: '유키와 정식 연인이 되면 해금!' },
    { img: 'assets/images/kiss_yuki.jpg', title: '💋 유키 — 노을빛 북카페 키스', unlock: !!state.kissUnlocked?.yuki || !!state.lovers?.includes('yuki'), desc: '유키와 연인이 되어 로맨틱 키스 시 해금!' },
    { img: 'assets/images/chloe_normal.jpg', title: '🇺🇸 클로이 — 성수동의 카메라 렌즈', unlock: (state.love?.chloe || 0) >= 35, desc: '호감도 35 이상(정식 데이트) 달성 시 해금!' },
    { img: 'assets/images/chloe_wink.jpg', title: '💖 클로이 — 눈부신 윙크 고백', unlock: !!state.lovers?.includes('chloe'), desc: '클로이와 정식 연인이 되면 해금!' },
    { img: 'assets/images/kiss_chloe.jpg', title: '💋 클로이 — 성수동 한강 노을 키스', unlock: !!state.kissUnlocked?.chloe || !!state.lovers?.includes('chloe'), desc: '클로이와 연인이 되어 로맨틱 키스 시 해금!' },
    { img: 'assets/images/kongi_sprite.png', title: '🐶 시바견 콩이 — 든든한 마스코트', unlock: !!state.pet?.adopted, desc: '유기견 보호소에서 콩이 입양 시 해금!' },
    ...[...LOVER_ACTIONS.yuki, ...LOVER_ACTIONS.chloe].map((a) => ({
      img: a.kissImage,
      title: a.kissTitle,
      unlock: !!(state.kissCollection || []).includes(a.id),
      desc: `[${a.title}] 데이트 후 키스 시 해금!`,
    })),
  ];
  items.forEach((it) => {
    const card = document.createElement('div');
    card.className = 'inv-item';
    card.innerHTML = `
      ${it.unlock ? `<img src="${it.img}" class="item-thumb" style="width:52px;height:52px;border-radius:6px;object-fit:cover;" alt="" />` : '<div style="font-size:1.6rem;width:52px;text-align:center;flex-shrink:0;margin-right:8px;">🔒</div>'}
      <div class="inv-info">
        <h4>${it.title}</h4>
        <p>${it.unlock ? '✨ 소중한 추억이 앨범에 저장되었습니다!' : it.desc}</p>
      </div>
    `;
    elEndingsList.appendChild(card);
  });
  elEndingsModal.classList.remove('hidden');
}

let currentGearFilter = 'all';

function openGearModal(filterRarity = currentGearFilter) {
  currentGearFilter = filterRarity || 'all';
  if (!state.gearBag) state.gearBag = [];
  if (!state.equipped) state.equipped = { weapon: null, armor: null, acc: null };
  if (!state.gearPlus) state.gearPlus = {};
  const eqBon = getEquippedBonuses();
  const scrapCount = state.scrap || 0;
  elEndingsModalTitle.textContent = `⚔️ 장비 창고 (공+${eqBon.atk}·방+${eqBon.def}·🔨${scrapCount})`;
  elEndingsList.innerHTML = '';

  const slotNames = { weapon: '⚔️ 무기', armor: '🧥 방어구', acc: '🎖️ 악세서리' };
  const scrapMap = { common: 1, rare: 2, epic: 4, unique: 8 };

  const guideBar = document.createElement('div');
  guideBar.className = 'gear-guide-bar';
  const synLabels = getGearSetSynergy().labels;
  guideBar.textContent = synLabels.length > 0
    ? `✨ 발동 세트: ${synLabels.join(' · ')}`
    : '등급: ⬜일반 ★1(C) < 🟦레어 ★2(B) < 🟪에픽 ★3(A) < 🟨유니크 ★4(S)';
  elEndingsList.appendChild(guideBar);

  const gachaBtn = document.createElement('button');
  gachaBtn.className = 'gear-quick-btn';
  gachaBtn.style.cssText = 'width:100%;margin-bottom:6px;padding:9px 8px;background:linear-gradient(90deg,#7e22ce 0%,#b45309 100%);';
  gachaBtn.textContent = '🎁 암시장 전설 상자 뽑기 (3,000P · 에픽72%/유니크28%)';
  gachaBtn.disabled = state.points < 3000;
  gachaBtn.addEventListener('click', () => {
    if (state.points < 3000) return;
    sfx.victory();
    state.points -= 3000;
    const rar = Math.random() < 0.28 ? 'unique' : 'epic';
    const lv = Math.max(15, state.level || 1);
    let pool = GEAR_LOOT_POOL.filter((x) => x.rarity === rar && (x.minDropLv || 1) <= lv);
    if (pool.length === 0) pool = GEAR_LOOT_POOL.filter((x) => x.rarity === rar);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) {
      state.gearBag.push(pick.id);
      const rLab = RARITY_INFO[rar]?.label || rar;
      showToast(`🎁 [암시장 대박!!] ${rLab} ${pick.name} 획득!`, rar === 'unique' ? 'break' : 'good');
    }
    saveGame();
    openGearModal(currentGearFilter);
    render();
  });
  elEndingsList.appendChild(gachaBtn);

  const mythicBtn = document.createElement('button');
  mythicBtn.className = 'gear-quick-btn';
  mythicBtn.style.cssText = 'width:100%;margin-bottom:8px;padding:9px 8px;background:linear-gradient(90deg,#b45309 0%,#dc2626 100%);';
  mythicBtn.textContent = '💎 신화 영웅 패키지 (5,000P · 유니크 ★4 확정 + 강화석 5개!)';
  mythicBtn.disabled = state.points < 5000;
  mythicBtn.addEventListener('click', () => {
    if (state.points < 5000) return;
    sfx.victory();
    state.points -= 5000;
    state.scrap = (state.scrap || 0) + 5;
    const pool = GEAR_LOOT_POOL.filter((x) => x.rarity === 'unique');
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) {
      state.gearBag.push(pick.id);
      showToast(`💎 [신화 패키지 대박!!] 🟨 ${pick.name} + 강화석 5개!`, 'break');
    }
    saveGame();
    openGearModal(currentGearFilter);
    render();
  });
  elEndingsList.appendChild(mythicBtn);

  if (state.gearBag.length === 0) {
    const emptyP = document.createElement('p');
    emptyP.style.cssText = 'text-align:center;color:#695544;padding:16px 0;';
    emptyP.textContent = '아직 파밍한 장비가 없습니다. 빌런/보스를 처치해 레어~유니크 장비를 획득하세요!';
    elEndingsList.appendChild(emptyP);
  } else {
    const counts = { all: 0, unique: 0, epic: 0, rare: 0, common: 0 };
    state.gearBag.forEach((gid) => {
      const item = GEAR_LOOT_POOL.find((x) => x.id === gid);
      if (item) {
        counts.all += 1;
        if (counts[item.rarity] !== undefined) counts[item.rarity] += 1;
      }
    });

    const tabsWrap = document.createElement('div');
    tabsWrap.className = 'gear-tabs';
    [
      { id: 'all', label: `전체(${counts.all})` },
      { id: 'unique', label: `🟨유니크(${counts.unique})` },
      { id: 'epic', label: `🟪에픽(${counts.epic})` },
      { id: 'rare', label: `🟦레어(${counts.rare})` },
      { id: 'common', label: `⬜일반(${counts.common})` },
    ].forEach((t) => {
      const tb = document.createElement('button');
      tb.className = `gear-tab${currentGearFilter === t.id ? ' active' : ''}`;
      tb.textContent = t.label;
      tb.addEventListener('click', () => {
        sfx.click();
        openGearModal(t.id);
      });
      tabsWrap.appendChild(tb);
    });
    elEndingsList.appendChild(tabsWrap);

    const quickWrap = document.createElement('div');
    quickWrap.className = 'gear-quick-actions';
    const autoEqBtn = document.createElement('button');
    autoEqBtn.className = 'gear-quick-btn';
    autoEqBtn.style.background = '#15803d';
    autoEqBtn.textContent = '⚡ 부위별 최강 자동 장착';
    autoEqBtn.addEventListener('click', () => {
      sfx.powerup();
      ['weapon', 'armor', 'acc'].forEach((slot) => {
        let bestId = null;
        let bestScore = -1;
        state.gearBag.forEach((gid) => {
          const item = GEAR_LOOT_POOL.find((x) => x.id === gid);
          if (!item || item.slot !== slot) return;
          const sc = getGearPowerScore(item, state.gearPlus?.[item.id] || 0);
          if (sc > bestScore) { bestScore = sc; bestId = item.id; }
        });
        if (bestId) state.equipped[slot] = bestId;
      });
      showToast('⚡ 부위별 최강 장비로 자동 세팅 완료!', 'good');
      saveGame();
      openGearModal(currentGearFilter);
      render();
    });
    const bulkSalBtn = document.createElement('button');
    bulkSalBtn.className = 'gear-quick-btn';
    bulkSalBtn.style.background = '#9e2a2b';
    bulkSalBtn.textContent = '🔨 미장착 일반·레어 일괄분해';
    bulkSalBtn.addEventListener('click', () => {
      let cnt = 0;
      let ptsGain = 0;
      let scrapGain = 0;
      const kept = [];
      state.gearBag.forEach((gid) => {
        const item = GEAR_LOOT_POOL.find((x) => x.id === gid);
        const isCurrentlyEq = item && state.equipped?.[item.slot] === item.id;
        if (item && !isCurrentlyEq && (item.rarity === 'common' || item.rarity === 'rare')) {
          cnt += 1;
          ptsGain += RARITY_INFO[item.rarity]?.salvageP || 15;
          scrapGain += scrapMap[item.rarity] || 1;
        } else {
          kept.push(gid);
        }
      });
      if (cnt === 0) {
        showToast('분해할 미장착 일반·레어 장비가 없습니다.', 'warn');
        return;
      }
      sfx.powerup();
      state.gearBag = kept;
      state.points += ptsGain;
      state.scrap = (state.scrap || 0) + scrapGain;
      showToast(`🔨 ${cnt}개 일괄 분해! +${ptsGain}P · 강화석 +${scrapGain}개`, 'good');
      saveGame();
      openGearModal(currentGearFilter);
      render();
    });
    quickWrap.appendChild(autoEqBtn);
    quickWrap.appendChild(bulkSalBtn);
    elEndingsList.appendChild(quickWrap);

    const indexed = state.gearBag
      .map((gid, idx) => ({ gid, idx, g: GEAR_LOOT_POOL.find((x) => x.id === gid) }))
      .filter((entry) => entry.g && (currentGearFilter === 'all' || entry.g.rarity === currentGearFilter))
      .sort((a, b) => {
        const eqA = state.equipped[a.g.slot] === a.g.id ? 1 : 0;
        const eqB = state.equipped[b.g.slot] === b.g.id ? 1 : 0;
        if (eqA !== eqB) return eqB - eqA;
        const tA = RARITY_INFO[a.g.rarity]?.tier || 1;
        const tB = RARITY_INFO[b.g.rarity]?.tier || 1;
        if (tA !== tB) return tB - tA;
        return (state.gearPlus[b.g.id] || 0) - (state.gearPlus[a.g.id] || 0);
      });

    if (indexed.length === 0) {
      const noneP = document.createElement('p');
      noneP.style.cssText = 'text-align:center;color:#695544;padding:16px 0;';
      noneP.textContent = '해당 등급 보관함에 장비가 없습니다.';
      elEndingsList.appendChild(noneP);
    }

    indexed.forEach(({ g, idx }) => {
      const rInfo = RARITY_INFO[g.rarity] || RARITY_INFO.common;
      const isEq = state.equipped[g.slot] === g.id;
      const plus = state.gearPlus[g.id] || 0;
      const eqGearId = state.equipped[g.slot];
      const eqGear = eqGearId ? GEAR_LOOT_POOL.find((x) => x.id === eqGearId) : null;
      let cmpBadge = '';
      if (!isEq && eqGear) {
        const curSc = getGearPowerScore(eqGear, state.gearPlus?.[eqGear.id] || 0);
        const thisSc = getGearPowerScore(g, plus);
        const atkDiff = ((g.atk || 0) + plus * 3) - ((eqGear.atk || 0) + (state.gearPlus?.[eqGear.id] || 0) * 3);
        const defDiff = ((g.def || 0) + plus * 2) - ((eqGear.def || 0) + (state.gearPlus?.[eqGear.id] || 0) * 2);
        const diffStr = `${atkDiff >= 0 ? `공+${atkDiff}` : `공${atkDiff}`}·${defDiff >= 0 ? `방+${defDiff}` : `방${defDiff}`}`;
        cmpBadge = thisSc > curSc
          ? `<span class="gear-cmp-up">▲ UP (${diffStr})</span>`
          : `<span class="gear-cmp-down">▼ 하위 (${diffStr})</span>`;
      }
      const needScrap = 1 + Math.floor(plus / 2);
      const needPts = 30 + plus * 20;
      const gainScrap = scrapMap[g.rarity] || 1;
      const encId = state.gearEnchants?.[g.id];
      const encObj = encId ? GEAR_ENCHANTS.find((e) => e.id === encId) : null;
      const encBadge = encObj ? ` <span style="font-size:0.68rem;background:#fef3c7;color:#92400e;border:1px solid #f59e0b;padding:1px 5px;border-radius:99px;">${encObj.label}</span>` : '';
      const card = document.createElement('div');
      card.className = 'inv-item gear-card-v2';
      card.style.borderColor = rInfo.color;
      card.innerHTML = `
        <div class="gear-card-top">
          ${itemImgHtml(g.icon, 'item-thumb')}
          <div class="inv-info">
            <h4 style="color:${rInfo.color};">[${rInfo.label}] ${g.name}${plus > 0 ? ` +${plus}` : ''} ${isEq ? '✅장착중' : ''}${encBadge}${cmpBadge}</h4>
            <p>${slotNames[g.slot]} · ${g.desc}${plus > 0 ? ` (강화: 공+${plus * 3}, 방+${plus * 2})` : ''}${encObj ? ` · ${encObj.desc}` : ''}</p>
          </div>
        </div>
      `;
      const actionsRow = document.createElement('div');
      actionsRow.className = 'gear-card-actions';
      const eqBtn = document.createElement('button');
      eqBtn.className = 'use-btn';
      eqBtn.textContent = isEq ? '해제' : '장착';
      eqBtn.addEventListener('click', () => {
        sfx.click();
        state.equipped[g.slot] = isEq ? null : g.id;
        saveGame();
        openGearModal(currentGearFilter);
        render();
      });
      const upBtn = document.createElement('button');
      upBtn.className = 'use-btn';
      upBtn.style.background = '#d97706';
      upBtn.textContent = plus >= 10 ? 'MAX' : `강화(🔨${needScrap})`;
      upBtn.title = plus >= 10 ? '최대 강화' : `강화석 ${needScrap}개 + ${needPts}P 필요`;
      upBtn.disabled = plus >= 10 || scrapCount < needScrap || state.points < needPts;
      upBtn.addEventListener('click', () => {
        if (plus >= 10 || (state.scrap || 0) < needScrap || state.points < needPts) return;
        sfx.powerup();
        state.scrap -= needScrap;
        state.points -= needPts;
        state.gearPlus[g.id] = plus + 1;
        showToast(`🔨 [${g.name}] +${plus + 1} 강화 성공! (공+3·방+2)`, 'good');
        saveGame();
        openGearModal(currentGearFilter);
        render();
      });
      const salBtn = document.createElement('button');
      salBtn.className = 'use-btn';
      salBtn.style.background = '#9e2a2b';
      salBtn.textContent = `분해(+🔨${gainScrap})`;
      salBtn.disabled = isEq;
      salBtn.addEventListener('click', () => {
        sfx.powerup();
        state.gearBag.splice(idx, 1);
        state.points += rInfo.salvageP;
        state.scrap = (state.scrap || 0) + gainScrap;
        showToast(`🔨 분해 완료! +${rInfo.salvageP}P · 강화석 +${gainScrap}개`, 'good');
        saveGame();
        openGearModal(currentGearFilter);
        render();
      });
      const encBtn = document.createElement('button');
      encBtn.className = 'use-btn';
      encBtn.style.background = '#7e22ce';
      encBtn.textContent = encObj ? '재각인(1500)' : '✨각인(1500)';
      encBtn.disabled = state.points < 1500;
      encBtn.addEventListener('click', () => {
        if (state.points < 1500) return;
        sfx.powerup();
        state.points -= 1500;
        if (!state.gearEnchants) state.gearEnchants = {};
        const pickEnc = GEAR_ENCHANTS[Math.floor(Math.random() * GEAR_ENCHANTS.length)];
        state.gearEnchants[g.id] = pickEnc.id;
        showToast(`✨ [${g.name}]에 ${pickEnc.label} (${pickEnc.desc}) 각인 성공!`, 'break');
        saveGame();
        openGearModal(currentGearFilter);
        render();
      });
      actionsRow.appendChild(eqBtn);
      actionsRow.appendChild(upBtn);
      actionsRow.appendChild(encBtn);
      actionsRow.appendChild(salBtn);
      card.appendChild(actionsRow);
      elEndingsList.appendChild(card);
    });
  }
  elEndingsModal.classList.remove('hidden');
}

function openSpiritModal(filterEl = 'all') {
  if (!state.spirits) state.spirits = {};
  const ownedCount = Object.keys(state.spirits).filter((k) => (state.spirits[k] || 0) > 0).length;
  const eqBon = getSpiritBonuses();
  elEndingsModalTitle.textContent = `👻 예절 수호정령 (${ownedCount}/${SPIRITS_50.length})`;
  elEndingsList.innerHTML = '';

  const summonBtn = document.createElement('button');
  summonBtn.className = 'gear-quick-btn';
  summonBtn.style.cssText = 'width:100%;margin-bottom:8px;padding:9px 8px;background:linear-gradient(90deg,#0284c7 0%,#7e22ce 100%);';
  summonBtn.textContent = `✨ 수호정령 소환 (600P · 일반55%/레어32%/에픽11%/유니크2%)`;
  summonBtn.disabled = state.points < 600;
  summonBtn.addEventListener('click', () => {
    if (state.points < 600) return;
    sfx.powerup?.();
    state.points -= 600;
    const r = Math.random();
    let rar = 'common';
    if (r < 0.02) rar = 'unique';
    else if (r < 0.13) rar = 'epic';
    else if (r < 0.45) rar = 'rare';
    const pool = SPIRITS_50.filter((x) => x.rarity === rar);
    const pick = pool[Math.floor(Math.random() * pool.length)] || SPIRITS_50[0];
    if (typeof elEndingsModal !== 'undefined' && elEndingsModal) elEndingsModal.classList.add('hidden');
    state.pendingSpiritEncounter = pick.id;
    state.spiritCaptureResult = { status: 'resonating', label: '신비한 소환진', isSummon: true };
    state.phase = 'spirit_encounter';
    saveGame();
    render();
    setTimeout(() => {
      if (state.phase !== 'spirit_encounter' || state.pendingSpiritEncounter !== pick.id) return;
      const res = grantSpirit(pick.id, false);
      sfx.victory?.();
      state.spiritCaptureResult = {
        status: 'caught',
        isSummon: true,
        isNew: res.isNew,
        awakeLv: res.count,
        growthLv: getSpiritProgress(pick.id).lv,
      };
      saveGame();
      render();
    }, 850);
  });
  elEndingsList.appendChild(summonBtn);

  const tabsWrap = document.createElement('div');
  tabsWrap.className = 'gear-tabs';
  [
    { id: 'all', label: `전체(${ownedCount}/${SPIRITS_50.length})` },
    { id: 'speech', label: '🗣️언변' },
    { id: 'guts', label: '🦁깡다구' },
    { id: 'law', label: '⚖️법질서' },
    { id: 'snap', label: '📸진실' },
    { id: 'cider', label: '🫧사이다' },
  ].forEach((t) => {
    const tb = document.createElement('button');
    tb.className = `gear-tab${filterEl === t.id ? ' active' : ''}`;
    tb.textContent = t.label;
    tb.addEventListener('click', () => { sfx.click(); openSpiritModal(t.id); });
    tabsWrap.appendChild(tb);
  });
  elEndingsList.appendChild(tabsWrap);

  const list = SPIRITS_50
    .filter((sp) => filterEl === 'all' || sp.element === filterEl)
    .sort((a, b) => {
      const eqA = state.equippedSpirit === a.id ? 1 : 0;
      const eqB = state.equippedSpirit === b.id ? 1 : 0;
      if (eqA !== eqB) return eqB - eqA;
      const ownA = (state.spirits[a.id] || 0) > 0 ? 1 : 0;
      const ownB = (state.spirits[b.id] || 0) > 0 ? 1 : 0;
      if (ownA !== ownB) return ownB - ownA;
      return b.num - a.num;
    });

  list.forEach((sp) => {
    const lv = state.spirits[sp.id] || 0;
    const isEq = state.equippedSpirit === sp.id;
    const rInfo = RARITY_INFO[sp.rarity] || RARITY_INFO.common;
    const elInfo = SPIRIT_ELEMENTS[sp.element];
    const card = document.createElement('div');
    card.className = 'inv-item';
    card.style.borderColor = lv > 0 ? elInfo.color : '#d4c4a8';
    card.style.opacity = lv > 0 ? '1' : '0.68';
    if (lv > 0) {
      const prog = getSpiritProgress(sp.id);
      const expPct = prog.lv >= 20 ? 100 : Math.min(100, Math.round((prog.exp / prog.maxExp) * 100));
      const spLive = getSpiritBonuses(sp.id);
      const spMs = prog.lv >= 20 ? '🌟만렙각성(협공1.5배)' : (prog.lv >= 10 ? '⚡시작SP+15' : (prog.lv >= 5 ? '💥협공률+10%' : 'Lv.5 협공↑'));
      card.innerHTML = `
        <img src="${sp.img}?v=72" alt="${sp.name}" class="item-thumb" style="width:44px;height:44px;object-fit:contain;" />
        <div class="inv-info">
          <h4 style="color:${rInfo.color};">[${rInfo.short}] ${getSpiritDisplayName(sp)} <span style="color:#0369a1;">Lv.${prog.lv}/20</span> · ★${lv}/5 ${isEq ? '✅동행중' : ''}</h4>
          <p><b style="color:#0f766e;">⚡ 현재 버프: 공격 +${spLive.atk}${spLive.spRegen ? ` · 사이다+${spLive.spRegen}` : ''}${spLive.crit ? ` · 치명+${(spLive.crit * 100).toFixed(1)}%` : ''} · 속성+${Math.round(spLive.elemBoost * 100)}%</b> <span style="font-size:0.68rem;color:#b45309;">[${spMs}]</span><br/>${sp.desc}<br/><span style="color:#1e40af;font-size:0.68rem;">📍 출몰: ${sp.zoneHint}</span></p>
          <div class="spirit-exp-track"><div class="spirit-exp-fill" style="width:${expPct}%"></div></div>
        </div>
      `;
      const btnCol = document.createElement('div');
      btnCol.style.cssText = 'display:flex;flex-direction:column;gap:4px;flex-shrink:0;';
      const eqBtn = document.createElement('button');
      eqBtn.className = 'use-btn';
      eqBtn.textContent = isEq ? '해제' : '동행';
      eqBtn.addEventListener('click', () => {
        sfx.powerup();
        state.equippedSpirit = isEq ? null : sp.id;
        saveGame();
        openSpiritModal(filterEl);
        render();
      });
      btnCol.appendChild(eqBtn);
      if (prog.lv < 20) {
        const candyBtn = document.createElement('button');
        candyBtn.className = 'use-btn';
        candyBtn.style.cssText = 'background:#f59e0b;font-size:0.68rem;padding:4px 6px;';
        candyBtn.textContent = '🍪사탕150P';
        candyBtn.disabled = state.points < 150;
        candyBtn.addEventListener('click', () => {
          if (state.points < 150) return;
          state.points -= 150;
          sfx.powerup();
          gainSpiritExp(sp.id, 100);
          saveGame();
          openSpiritModal(filterEl);
          render();
        });
        btnCol.appendChild(candyBtn);
      }
      card.appendChild(btnCol);
    } else {
      card.innerHTML = `
        <div class="inv-info">
          <h4>🔒 #${sp.num} 미발견 [${elInfo.label} · ${rInfo.short}]</h4>
          <p>📍 출몰: ${sp.zoneHint} · ★특수: ${sp.perkDesc}</p>
        </div>
      `;
    }
    elEndingsList.appendChild(card);
  });
  elEndingsModal.classList.remove('hidden');
}

function openCommunityModal() {
  elEndingsModalTitle.textContent = '💬 서울 익명 커뮤니티 (에타·블라인드)';
  elEndingsList.innerHTML = '';
  const posts = generateCommunityPosts(state);
  posts.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'inv-item';
    card.innerHTML = `
      <div class="inv-info">
        <h4>[${p.tag}] ${p.author} · ${p.likes}</h4>
        <p>${p.text}</p>
      </div>
    `;
    elEndingsList.appendChild(card);
  });
  elEndingsModal.classList.remove('hidden');
}

function getTagSkillMeta() {
  const hasYuki = !!state.lovers?.includes('yuki') && !state.sulky?.yuki;
  const hasChloe = !!state.lovers?.includes('chloe') && !state.sulky?.chloe;
  const hasPet = !!state.pet?.adopted;

  if (hasYuki && hasChloe && hasPet) {
    return {
      title: '🌟 풀파티 궁극기',
      effectSummary: '유키·클로이·콩 1.65배+기절(1회)',
      mult: 1.65,
      spRefund: 15,
      enemyWeakenTurns: 2,
      quote: '"다 같이 힘을 합치자! / Let\'s finish this!! / 멍멍!!"',
      logPrefix: '🌟 [유키·클로이·콩이 풀파티 궁극기!!]',
      hasYuki, hasChloe, hasPet,
    };
  }
  if (hasYuki && hasChloe) {
    return {
      title: '💖 더블 합동 필살기 (유키·클로이)',
      effectSummary: '1.4배 극딜+기절+SP12(1회)',
      mult: 1.40,
      spRefund: 12,
      quote: '"다이스키! / Let\'s crush this villain together!"',
      logPrefix: '💖 [유키 & 클로이 더블 합동 필살기!!]',
      hasYuki, hasChloe, hasPet,
    };
  }
  if (hasYuki && hasPet) {
    return {
      title: '🐾 합동 필살기 (유키·콩이)',
      effectSummary: '1.35배 극딜+기절+SP10+적약화(1회)',
      mult: 1.35,
      spRefund: 10,
      enemyWeakenTurns: 2,
      quote: '"유키랑 콩이가 지켜줄게요! 멍!"',
      logPrefix: '🐾 [유키 & 콩이 합동 필살기!!]',
      hasYuki, hasChloe, hasPet,
    };
  }
  if (hasChloe && hasPet) {
    return {
      title: '🐾 합동 필살기 (클로이·콩이)',
      effectSummary: '1.5배 치명극딜+기절+적약화+P↑(1회)',
      mult: 1.50,
      bonusPts: 20,
      bonusFollowers: 150,
      enemyWeakenTurns: 2,
      quote: '"Flash & Bite Combo!! / 멍!"',
      logPrefix: '🐾 [클로이 & 콩이 합동 필살기!!]',
      hasYuki, hasChloe, hasPet,
    };
  }
  if (hasYuki) {
    return {
      title: '💚 합동 필살기 (유키)',
      effectSummary: '1.15배 극딜+기절+SP10(1회)',
      mult: 1.15,
      spRefund: 10,
      quote: '"다이스키! 우리 같이 혼내주자!"',
      logPrefix: '💚 [유키 합동 필살기!!]',
      hasYuki, hasChloe, hasPet,
    };
  }
  if (hasChloe) {
    return {
      title: '📸 합동 필살기 (클로이)',
      effectSummary: '1.25배 치명극딜+기절+보상↑!',
      mult: 1.25,
      bonusPts: 15,
      bonusFollowers: 120,
      quote: '"Let\'s crush this villain together!"',
      logPrefix: '📸 [클로이 합동 필살기!!]',
      hasYuki, hasChloe, hasPet,
    };
  }
  if (hasPet) {
    return {
      title: '🐾 합동 필살기 (김순경·콩이)',
      effectSummary: '1.25배 극딜+기절+적약화!',
      mult: 1.25,
      enemyWeakenTurns: 2,
      quote: '"시민영웅님, 지원 사격 들어갑니다! 멍!"',
      logPrefix: '🐾 [김순경 & 콩이 합동 필살기!!]',
      hasYuki, hasChloe, hasPet,
    };
  }
  return {
    title: '🤝 합동 필살기 (김순경)',
    effectSummary: '극딜+확정기절!',
    mult: 1.0,
    quote: '"시민영웅님, 지원 사격 들어갑니다!"',
    logPrefix: '🤝 [김순경 합동 필살기!!]',
    hasYuki, hasChloe, hasPet,
  };
}

function performTagSkill() {
  const tagCost = state.costume === 'couple' ? 35 : 50;
  if (state.tagSkillUsedThisBattle || state.sp < tagCost) return;
  state.tagSkillUsedThisBattle = true;
  const enemy = getEnemyById(state.currentEnemyId);
  const meta = getTagSkillMeta();
  state.sp = clamp(state.sp - tagCost, 0, state.maxSp);

  const evoTag = getSkillEvolution('speech');
  const eqAtkTag = getEquippedBonuses().atk || 0;
  const spTag = getSpiritBonuses();
  const baseDmg = (70 + (state.stats.speech + state.stats.guts + state.stats.law) * 3.6 + state.bonusDmg + eqAtkTag + (spTag.atk || 0)) * (evoTag.dmgMult || 1);
  const tagMu = getMatchupInfo(enemy, 'tag');
  const chainMultTag = (state.combatChain || 0) >= 2 ? (1 + Math.min(0.5, (state.combatChain - 1) * 0.1)) : 1;
  const breakMultTag = state.enemyBroken ? 1.5 : 1;
  const exposeMultTag = state.snapExposed ? 1.4 : 1;
  state.enemyBroken = true;
  state.snapExposed = false;
  state.enemyExcuseShield = false;
  state.enemyGuardShield = 3;
  if (state.bossGimmick === 'shield' && (state.bossShield || 0) > 0) state.bossShield = 0;
  const dmg = Math.round(baseDmg * (meta.mult || 1) * Math.max(1.25, tagMu.mult) * chainMultTag * breakMultTag * exposeMultTag);
  state.enemyHp = clamp(state.enemyHp - dmg, 0, state.enemyMaxHp);
  state.enemyStunned = true;

  const extraEffects = [];
  if (meta.healPct) {
    const heal = Math.round(state.maxHp * meta.healPct);
    state.hp = clamp(state.hp + heal, 1, state.maxHp);
    extraEffects.push(`인내심 +${heal}`);
  }
  if (meta.spRefund) {
    state.sp = clamp(state.sp + meta.spRefund, 0, state.maxSp);
    extraEffects.push(`사이다 +${meta.spRefund} 페이백`);
  }
  if (meta.enemyWeakenTurns) {
    state.enemyApologyTurns = (state.enemyApologyTurns || 0) + meta.enemyWeakenTurns;
    extraEffects.push(`적 공격력 ${meta.enemyWeakenTurns}턴 -40%`);
  }
  if (meta.bonusPts) {
    state.points += meta.bonusPts;
    state.followers = (state.followers || 120) + (meta.bonusFollowers || 0);
    extraEffects.push(`+${meta.bonusPts}P · 팔로워 +${meta.bonusFollowers}`);
  }

  state.quote = meta.quote;
  state.log = `${meta.logPrefix} 가드 일격 완파 + 초극딜 합동 궁극기!! (멘탈 -${dmg} · 확정 기절 + 공짜 보너스 1턴!${extraEffects.length ? ` · ${extraEffects.join(' · ')}` : ''})`;
  showToast('🌟 합동 궁극기!! 가드 일격 완파 + 보너스 1턴!!', 'break');
  if (meta.hasYuki) triggerPartnerCallout('yuki', '합동 필살기!! 💖', true);
  if (meta.hasChloe) triggerPartnerCallout('chloe', 'Combo Finisher!! ⚡', true);
  if (meta.hasPet) triggerPartnerCallout('kongi', '왕! 필살 발목 물기! 🐾', true);
  playHeroAnim('attack');
  triggerEnemyHit(dmg, true);
  if (state.enemyHp <= 0) handleEnemyDefeated(enemy);
  else {
    saveGame();
    render();
  }
}

btnOpenSlots.addEventListener('click', () => {
  sfx.click();
  elSettingsModal.classList.add('hidden');
  openSaveModal(state.phase !== 'title' && state.phase !== 'gameover');
});

function openSaveModal(allowSave) {
  const slots = loadSaveSlots();
  elSaveSlotsList.innerHTML = '';
  slots.forEach((slot, idx) => {
    const card = document.createElement('div');
    card.className = 'inv-item';
    card.innerHTML = `
      <div class="inv-info">
        <h4>슬롯 ${idx + 1} ${slot ? `(${slot.savedAt})` : '(비어 있음)'}</h4>
        <p>${slot ? slot.summary : '저장된 데이터가 없습니다'}</p>
      </div>
    `;
    const btnGroup = document.createElement('div');
    btnGroup.style.display = 'flex';
    btnGroup.style.gap = '4px';

    if (allowSave) {
      const sBtn = document.createElement('button');
      sBtn.className = 'use-btn';
      sBtn.textContent = '저장';
      sBtn.addEventListener('click', () => {
        sfx.powerup();
        saveToSlot(idx);
        openSaveModal(allowSave);
      });
      btnGroup.appendChild(sBtn);
    }

    if (slot) {
      const lBtn = document.createElement('button');
      lBtn.className = 'use-btn';
      lBtn.style.background = '#1f7a8c';
      lBtn.textContent = '로드';
      lBtn.addEventListener('click', () => {
        sfx.powerup();
        if (loadFromSlot(idx)) {
          elSaveModal.classList.add('hidden');
          render();
        }
      });
      btnGroup.appendChild(lBtn);
    }

    card.appendChild(btnGroup);
    elSaveSlotsList.appendChild(card);
  });
  elSaveModal.classList.remove('hidden');
}

function openEndingsModal() {
  const unlocked = loadUnlockedEndings();
  elEndingsModalTitle.textContent = `🏆 엔딩 도감 (${unlocked.length}/${ENDINGS.length})`;
  elEndingsList.innerHTML = '';
  const sorted = [...ENDINGS].sort((a, b) => a.num - b.num);
  sorted.forEach((end) => {
    const isOpen = unlocked.includes(end.id);
    const card = document.createElement('div');
    card.className = `ending-card${isOpen ? '' : ' locked'}`;
    if (isOpen) {
      card.innerHTML = `
        ${end.image ? `<img src="${end.image}?v=82" alt="${end.title}" style="width:100%;max-height:145px;object-fit:cover;border-radius:8px;margin-bottom:6px;" />` : ''}
        <span class="ending-badge">#${end.num} ${end.badge}</span>
        <h4>${end.title}</h4>
        <p style="white-space:pre-line;">${end.story}</p>
      `;
    } else {
      card.innerHTML = `<span class="ending-badge">#${end.num} 미해금</span><h4>🔒 ??? (엔딩 ${end.num})</h4><p>💡 힌트: ${end.hint}</p>`;
    }
    elEndingsList.appendChild(card);
  });
  elEndingsModal.classList.remove('hidden');
}

function openDistrictsModal() {
  elActivityModalTitle.textContent = `🏙️ 전국 5대 도시 치안 (${getClearedDistrictCount(state)}/5 평화도시)`;
  elActivityModalImg.classList.add('hidden');
  elActivityList.innerHTML = '';
  const dState = state.districts || {};
  SEOUL_DISTRICTS.forEach((d) => {
    const pct = Math.min(100, dState[d.id] || 0);
    const cleared = pct >= 100;
    const zDiff = getZoneDifficultyInfo(d.minLv || 1, d.maxLv || 50, state.level || 1);
    const card = document.createElement('div');
    card.className = 'inv-item';
    card.innerHTML = `
      <div class="inv-info">
        <h4>${cleared ? '🕊️' : '🚨'} ${d.name} (Lv.${d.minLv || 1}~${d.maxLv || 50}) <span class="zone-diff-badge ${zDiff.cls}">${zDiff.label}</span></h4>
        <p>치안 ${pct}%${cleared ? ' · 평화구역' : ''} · 영구 버프: <b>${d.buffDesc}</b>${cleared ? ' ✅' : ''}</p>
      </div>
    `;
    const btn = document.createElement('button');
    btn.className = 'use-btn';
    btn.textContent = cleared ? '순찰' : '출동';
    btn.addEventListener('click', () => {
      sfx.powerup();
      elActivityModal.classList.add('hidden');
      const mobPool = VILLAINS.filter((v) => getDistrictIdForEnemy(v.id) === d.id).map((v) => v.id);
      const bossPool = (d.villains || []).filter((id) => GUERRILLA_VILLAINS.some((v) => v.id === id) || BOSSES.some((b) => b.id === id));
      const pool = [...mobPool, ...bossPool];
      const pickId = pool.length ? pool[Math.floor(Math.random() * pool.length)] : 'shorts_terrorist';
      startBattle(pickId);
    });
    card.appendChild(btn);
    elActivityList.appendChild(card);
  });
  elActivityModal.classList.remove('hidden');
}

function openActivityModal(cat) {
  elActivityModalTitle.textContent = cat.title;
  if (cat.image) {
    elActivityModalImg.src = cat.image;
    elActivityModalImg.classList.remove('hidden');
  } else {
    elActivityModalImg.classList.add('hidden');
  }
  elActivityList.innerHTML = '';
  cat.items.forEach((act) => {
    const ownedUnique = act.uniqueItem && state.inventory.includes(act.uniqueItem);
    const ownedFlag = act.flag && (state.flags || []).includes(act.flag);
    const lowPoints = act.cost && state.points < act.cost;
    const lowHp = act.minHp && state.hp <= act.minHp;
    const disabled = ownedUnique || ownedFlag || lowPoints || lowHp;

    const card = document.createElement('div');
    card.className = 'inv-item';
    let diffTag = '';
    if (act.battleDistrict) {
      const dInfo = SEOUL_DISTRICTS.find((d) => d.id === act.battleDistrict);
      const zDiff = getZoneDifficultyInfo(dInfo?.minLv || act.minLv || 1, dInfo?.maxLv || 50, state.level || 1);
      diffTag = `<span class="zone-diff-badge ${zDiff.cls}">${zDiff.label}</span>`;
    }
    card.innerHTML = `<div class="inv-info"><h4>${act.name}${diffTag}</h4><p>${act.desc}</p></div>`;

    const btn = document.createElement('button');
    btn.className = 'use-btn';
    if (ownedUnique || ownedFlag) {
      btn.textContent = '보유중';
    } else if (act.cost) {
      btn.textContent = `${act.cost}P`;
    } else {
      btn.textContent = '실행';
    }
    btn.disabled = !!disabled;
    btn.addEventListener('click', () => {
      elActivityModal.classList.add('hidden');
      executeActivity(act, cat);
    });
    card.appendChild(btn);
    elActivityList.appendChild(card);
  });
  elActivityModal.classList.remove('hidden');
}

function executeActivity(act, cat) {
  if (!state.flags) state.flags = [];
  if (act.cost) {
    if (state.points < act.cost) {
      state.log = '포인트가 부족합니다!';
      render();
      return;
    }
    state.points -= act.cost;
  }

  state.activityCount = (state.activityCount || 0) + 1;
  if (act.isPatrol) {
    state.patrolCount = (state.patrolCount || 0) + 1;
    advanceDailyQuest('patrol', 1);
  }
  if (act.sleep || cat?.id === 'heal') {
    advanceDailyQuest('care', 1);
    if (cat?.id === 'heal' && !act.sleep) {
      const ppGain = act.id === 'heal_sauna' ? 6 : 4;
      restoreSkillPp(ppGain);
      showToast(`✨ 휴식으로 전 기술 PP +${ppGain} 회복!`, 'good');
    }
  }
  if (cat && cat.id) state.mapLoc = cat.id;
  if (cat && cat.image) {
    state.lastCutscene = { image: cat.image, animClass: cat.animClass || '' };
  }

  if (act.battleDistrict) {
    state.lastCutscene = null;
    sfx.click();
    if (Math.random() < 0.20) {
      triggerRandomEvent();
      return;
    }
    const pool = VILLAINS.filter((v) => getDistrictIdForEnemy(v.id) === act.battleDistrict);
    const picked = pool[Math.floor(Math.random() * pool.length)] || VILLAINS[0];
    startBattle(picked.id);
    return;
  }

  if (act.battleZone) {
    state.lastCutscene = null;
    sfx.click();
    if (Math.random() < 0.25) {
      triggerRandomEvent();
      return;
    }
    const pool = VILLAINS.filter((v) => v.zone === act.battleZone);
    const picked = pickLevelAppropriateVillain(pool, state.level || 1);
    startBattle(picked.id, true);
    return;
  }

  if (act.forceEvent) {
    sfx.click();
    triggerRandomEvent();
    return;
  }

  if (act.sleep) {
    sfx.powerup();
    state.hp = state.maxHp;
    state.sp = clamp(state.sp + 20, 0, state.maxSp);
    restoreSkillPp('full');
    handleNewDayRollover();
    const hTier = state.houseTier || 0;
    if (hTier >= 3) {
      state.hp = state.maxHp;
      state.sp = state.maxSp;
    } else if (hTier > 0) {
      state.hp = clamp(state.hp + hTier * 15, 1, state.maxHp);
      state.sp = clamp(state.sp + hTier * 12, 0, state.maxSp);
    }
    if ((state.lottoTickets || 0) > 0 && state.day % 7 === 0) {
      let winTotal = 0;
      for (let i = 0; i < state.lottoTickets; i++) {
        const r = Math.random();
        if (r < 0.08) winTotal += 500;
        else if (r < 0.35) winTotal += 60;
      }
      state.lottoTickets = 0;
      if (winTotal > 0) {
        state.points += winTotal;
        showToast(`🎟️ 주간 서울 로또 당첨!! +${winTotal}P 획득!`, 'break');
      } else {
        showToast('🎟️ 이번 주 서울 로또는 아쉽게 꽝이었습니다...', 'warn');
      }
    }
    state.log = act.msg + ' (전 기술 PP 100% 완충!)';
    saveGame();
    render();
    return;
  }

  if (act.gamble) {
    let extraMsg = '';
    if (act.gamble === 'lotto') {
      const r = Math.random();
      if (r < 0.15) {
        state.points += 80;
        sfx.victory();
        extraMsg = '🎉 3등 당첨!! (+80 P 대박!)';
      } else if (r < 0.45) {
        state.points += 20;
        sfx.powerup();
        extraMsg = '✨ 5등 당첨! (+20 P)';
      } else {
        sfx.damage();
        extraMsg = '💨 꽝! 다음 기회에...';
      }
    } else if (act.gamble === 'minji') {
      if (Math.random() < 0.5) {
        state.points += 50;
        sfx.powerup();
        extraMsg = '🪙 가위바위보 승리! (+50 P)';
      } else {
        sfx.damage();
        extraMsg = '😭 가위바위보 패배! 용돈만 날렸습니다.';
      }
    } else if (act.gamble === 'claw') {
      if (Math.random() < 0.45) {
        state.inventory.push('cheongsimhwan');
        sfx.powerup();
        extraMsg = '🧸 인형 뽑기 대성공! [청심환] 1개 획득!';
      } else {
        sfx.damage();
        extraMsg = '🤏 집게가 힘없이 풀렸습니다... 꽝!';
      }
    } else if (act.gamble === 'vlog') {
      if (Math.random() < 0.55) {
        state.points += 60;
        state.chaotic += 8;
        sfx.victory();
        extraMsg = '🔥 알고리즘 떡상! 조회수 50만 돌파 (+60 P · 광인 +8)';
      } else {
        state.hp = clamp(state.hp - 8, 1, state.maxHp);
        sfx.damage();
        extraMsg = '💬 악플 세례를 받았습니다... (HP -8)';
      }
    } else if (act.gamble === 'radio') {
      if (Math.random() < 0.5) {
        state.points += 35;
        state.sp = clamp(state.sp + 20, 0, state.maxSp);
        sfx.powerup();
        extraMsg = '📻 사연 채택! 백화점 상품권 +35 P & 사이다 +20!';
      } else {
        sfx.click();
        state.sp = clamp(state.sp + 5, 0, state.maxSp);
        extraMsg = '📻 사연은 안 읽혔지만 라디오가 재밌습니다. (SP +5)';
      }
    }
    advanceTime();
    state.log = `${act.msg}\n${extraMsg}`;
    saveGame();
    render();
    return;
  }

  sfx.powerup();
  if (act.addItem) state.inventory.push(act.addItem);
  if (act.uniqueItem && !state.inventory.includes(act.uniqueItem)) state.inventory.push(act.uniqueItem);
  if (act.flag && !state.flags.includes(act.flag)) state.flags.push(act.flag);

  if (act.effect) {
    const ef = act.effect;
    if (ef.maxHp) state.maxHp += ef.maxHp;
    if (ef.hp) state.hp = clamp(state.hp + ef.hp, 1, state.maxHp);
    if (ef.sp) state.sp = clamp(state.sp + ef.sp, 0, state.maxSp);
    if (ef.points) state.points += ef.points;
    if (ef.speech) state.stats.speech += ef.speech;
    if (ef.guts) state.stats.guts += ef.guts;
    if (ef.law) state.stats.law += ef.law;
    if (ef.lawful) state.lawful += ef.lawful;
    if (ef.chaotic) state.chaotic += ef.chaotic;
    if (ef.report) state.pendingReports += ef.report;
    if (ef.crit) state.critBonus += ef.crit;
    if (ef.dice) state.diceBonus += ef.dice;
    if (ef.dmg) state.bonusDmg += ef.dmg;
    if (ef.chaos) state.chaosLevel = clamp((state.chaosLevel ?? 25) + ef.chaos, 0, 100);
  }

  advanceTime();
  state.log = act.msg;

  // V10.0: 민폐 오염도 100% 도달 시 혼돈의 서울(히든 배드엔딩) 발동!
  if ((state.chaosLevel ?? 25) >= 100) {
    const badEnd = evaluateEnding(state, true);
    state.achievedEndingId = badEnd.id;
    unlockEnding(badEnd.id);
    state.phase = 'victory';
    state.log = badEnd.story;
    saveGame();
    render();
    return;
  }

  // V8.0: 30% 확률로 2단 돌발 이벤트 발동 (또는 민폐도 90% 이상 시 35% 확률로 빌런 기습!)
  if ((state.chaosLevel ?? 25) >= 90 && Math.random() < 0.35) {
    const picked = pickLevelAppropriateVillain(VILLAINS, state.level || 1);
    state.log = `🚨 [서울 민폐도 비상!] 거리가 난장판이 되어 [${picked.name}]이(가) 기습했습니다!`;
    startBattle(picked.id, true);
    return;
  }

  if (Math.random() < 0.22) {
    state.phase = 'mystery_envelope';
    saveGame();
    render();
    return;
  }

  if (Math.random() < 0.30) {
    triggerMiniEvent();
    return;
  }

  saveGame();
  render();
}

// ============================================================
// V37.0: 오블리비언 스타일 초고자유도 샌드박스 & 6대 미니맵 핀 인터랙션
// ============================================================
const INGREDIENT_META = {
  bacchus: { name: '⚡ 박카스 원액', desc: '피로회복 베이스' },
  capsaicin: { name: '🌶️ 캡사이신 소스', desc: '매운맛 극대화' },
  red_ginseng: { name: '🫚 홍삼 엑기스', desc: '고농축 기력' },
  spirit_dust: { name: '✨ 정령의 가루', desc: '신비한 촉매' },
  cold_brew: { name: '☕ 심야 콜드브루', desc: '각성 카페인' },
};

function ensureSandboxState() {
  if (typeof state.fame !== 'number') state.fame = 0;
  if (typeof state.infamy !== 'number') state.infamy = 0;
  if (!state.skills) state.skills = { sneak: 1, speech: 1, alchemy: 1, combat: 1 };
  if (!state.skillXp) state.skillXp = { sneak: 0, speech: 0, alchemy: 0, combat: 0 };
  if (!state.ingredients) state.ingredients = { bacchus: 1, capsaicin: 1, red_ginseng: 0, spirit_dust: 0, cold_brew: 0 };
  if (!Array.isArray(state.customPotions)) state.customPotions = [];
  if (!state.sideQuest) state.sideQuest = { id: null, step: 0, done: [] };
}

function gainSkillXp(skillKey, amount = 10) {
  ensureSandboxState();
  const names = { sneak: '🤫 은신', speech: '🗣️ 화술', alchemy: '🧪 연금', combat: '🥊 격투' };
  state.skillXp[skillKey] = (state.skillXp[skillKey] || 0) + amount;
  let lv = state.skills[skillKey] || 1;
  let need = lv * 25;
  while (state.skillXp[skillKey] >= need) {
    state.skillXp[skillKey] -= need;
    lv += 1;
    state.skills[skillKey] = lv;
    need = lv * 25;
    sfx.powerup();
    showToast(`📈 [숙련도 UP!] ${names[skillKey] || skillKey} Lv.${lv} 달성!`, 'good');
  }
}

function gainIngredient(id, count = 1) {
  ensureSandboxState();
  state.ingredients[id] = (state.ingredients[id] || 0) + count;
}

function setRumor(txt) {
  state.rumor = txt;
}

function openOblivionSheetModal() {
  ensureSandboxState();
  elActivityModalTitle.textContent = '📜 시민영웅 자유도 · 숙련도 시트';
  if (elActivityModalImg) elActivityModalImg.classList.add('hidden');
  elActivityList.innerHTML = '';

  const info = document.createElement('div');
  info.className = 'oblivion-banner';
  const ingText = Object.entries(INGREDIENT_META)
    .map(([k, v]) => `${v.name.split(' ')[0]} ${state.ingredients[k] || 0}`)
    .join(' · ');
  info.innerHTML = `
    <div><b>🏅 명성:</b> ${state.fame} &nbsp;|&nbsp; <b>😈 악명:</b> ${state.infamy} ${(state.infamy >= 5) ? '(🕶️ 암시장 해금!)' : '(악명 5+ 시 암시장)'}</div>
    <div style="margin-top:4px;"><b>📈 숙련도:</b> 🤫은신 Lv.${state.skills.sneak} · 🗣️화술 Lv.${state.skills.speech} · 🧪연금 Lv.${state.skills.alchemy} · 🥊격투 Lv.${state.skills.combat}</div>
    <div style="margin-top:4px;"><b>🎒 재료:</b> ${ingText}</div>
    <div style="margin-top:4px;"><b>✨ 커스텀 필살기:</b> ${state.customSpell ? `${state.customSpell.name} (${state.customSpell.desc})` : '미제작'}</div>
    <div style="margin-top:4px;"><b>🧪 보유 포션:</b> ${state.customPotions.length}개</div>
  `;
  elActivityList.appendChild(info);

  const alchBtn = document.createElement('button');
  alchBtn.className = 'activity-item-btn';
  alchBtn.innerHTML = '<div class="act-title">🧪 자취방 연금·요리 조합소</div><div class="act-desc">재료 2개를 자유롭게 섞어 나만의 포션/투척물 제작!</div>';
  alchBtn.addEventListener('click', () => { sfx.click(); openAlchemyModal(); });
  elActivityList.appendChild(alchBtn);

  const spellBtn = document.createElement('button');
  spellBtn.className = 'activity-item-btn';
  spellBtn.innerHTML = '<div class="act-title">✨ 나만의 필살기 제작소 (60P)</div><div class="act-desc">효과와 이름을 직접 조합해 세상에 하나뿐인 필살기 창조!</div>';
  spellBtn.addEventListener('click', () => { sfx.click(); openSpellmakingModal(); });
  elActivityList.appendChild(spellBtn);

  elActivityModal.classList.remove('hidden');
}

function openAlchemyModal(firstPick = null) {
  ensureSandboxState();
  elActivityModalTitle.textContent = firstPick
    ? `🧪 두 번째 재료 선택 (1차: ${INGREDIENT_META[firstPick].name})`
    : '🧪 자취방 연금·요리 조합소 (재료 2개 선택)';
  if (elActivityModalImg) elActivityModalImg.classList.add('hidden');
  elActivityList.innerHTML = '';

  const banner = document.createElement('div');
  banner.className = 'oblivion-banner';
  banner.textContent = `연금 숙련도 Lv.${state.skills.alchemy} (보유 커스텀 포션: ${state.customPotions.length}/5) — 아무 재료나 2개 조합해보세요!`;
  elActivityList.appendChild(banner);

  Object.entries(INGREDIENT_META).forEach(([key, meta]) => {
    const qty = state.ingredients[key] || 0;
    const needed = firstPick === key ? 2 : 1;
    const btn = document.createElement('button');
    btn.className = 'activity-item-btn';
    btn.disabled = qty < needed || state.customPotions.length >= 5;
    btn.innerHTML = `<div class="act-title">${meta.name} (보유 ${qty}개)</div><div class="act-desc">${meta.desc}${state.customPotions.length >= 5 ? ' · 포션 가방 가득 참(최대 5개)' : ''}</div>`;
    btn.addEventListener('click', () => {
      if (!firstPick) {
        sfx.click();
        openAlchemyModal(key);
        return;
      }
      state.ingredients[firstPick] -= 1;
      state.ingredients[key] -= 1;
      gainSkillXp('alchemy', 14);
      const alchLv = state.skills.alchemy;
      const isOffensive = firstPick === 'capsaicin' || key === 'capsaicin';
      const isMystic = firstPick === 'spirit_dust' || key === 'spirit_dust';
      const power = 25 + alchLv * 12 + (isMystic ? 18 : 0);
      const potion = isOffensive
        ? { name: `🔥 불지옥 ${meta.name.split(' ')[1]} 폭탄`, type: 'bomb', power, desc: `적 멘탈 -${power} & 기절` }
        : { name: `🧪 특제 ${INGREDIENT_META[firstPick].name.split(' ')[1]} 엘릭서`, type: 'heal', power, desc: `인내심 +${power} · 사이다 +25` };
      state.customPotions.push(potion);
      sfx.victory();
      showToast(`🧪 [${potion.name}] 조합 성공!`, 'good');
      setRumor(`자취방에서 수상한 비법 물약을 제조 중이라는 소문`);
      saveGame();
      openOblivionSheetModal();
    });
    elActivityList.appendChild(btn);
  });

  elActivityModal.classList.remove('hidden');
}

function openSpellmakingModal() {
  ensureSandboxState();
  elActivityModalTitle.textContent = '✨ 나만의 필살기 제작소';
  if (elActivityModalImg) elActivityModalImg.classList.add('hidden');
  elActivityList.innerHTML = '';

  const styles = [
    { id: 'burst', title: '⚡ 사이다 벼락 (단타 극딜)', desc: '단일 적에게 엄청난 멘탈 피해 + 방어 파괴', mult: 1.55, prefix: '초고압' },
    { id: 'vamp', title: '🩸 정의의 흡혈 (피해 + 회복)', desc: '적에게 피해 + 내 인내심 40% 회복', mult: 1.15, prefix: '불굴의' },
    { id: 'stun', title: '💫 참교육 스턴 (피해 + 기절)', desc: '적에게 피해 + 1턴 확정 기절', mult: 1.1, prefix: '뇌정' },
    { id: 'combo', title: '🌪️ 무한 콤보 연타 (3연타)', desc: '콤보 게이지 대폭 충전 + 3회 타격', mult: 1.35, prefix: '질풍' },
  ];

  const banner = document.createElement('div');
  banner.className = 'oblivion-banner';
  banner.textContent = `제작 비용: 60P (보유 ${state.points}P). 원하는 스타일을 고르면 직접 이름을 붙일 수 있습니다!`;
  elActivityList.appendChild(banner);

  styles.forEach((st) => {
    const btn = document.createElement('button');
    btn.className = 'activity-item-btn';
    btn.disabled = state.points < 60;
    btn.innerHTML = `<div class="act-title">${st.title}</div><div class="act-desc">${st.desc}</div>`;
    btn.addEventListener('click', () => {
      const customName = window.prompt('새 필살기의 이름을 지어주세요!', `${st.prefix} 노란완장 펀치`);
      if (!customName || !customName.trim()) return;
      state.points -= 60;
      state.customSpell = {
        name: customName.trim().slice(0, 18),
        style: st.id,
        mult: st.mult,
        desc: st.desc,
      };
      gainSkillXp('combat', 12);
      sfx.victory();
      showToast(`✨ 나만의 필살기 [${state.customSpell.name}] 완성!`, 'break');
      setRumor(`시민영웅이 독창적인 필살기 '${state.customSpell.name}'을(를) 창시했다는 소문`);
      elActivityModal.classList.add('hidden');
      saveGame();
      render();
    });
    elActivityList.appendChild(btn);
  });

  elActivityModal.classList.remove('hidden');
}

function useCustomSpellInCombat(enemy) {
  if (!state.customSpell || state.sp < 25) return;
  const sp = state.customSpell;
  state.sp -= 25;
  gainSkillXp('combat', 12);
  playHeroAnim('attack');
  sfx.hit(true);
  const base = 26 + (state.skills?.combat || 1) * 4 + (state.stats?.guts || 5) * 1.6 + state.bonusDmg;
  const dmg = Math.round(base * (sp.mult || 1.3));
  state.enemyHp = clamp(state.enemyHp - dmg, 0, state.enemyMaxHp);
  let extra = '';
  if (sp.style === 'vamp') {
    const heal = Math.round(dmg * 0.4);
    state.hp = clamp(state.hp + heal, 1, state.maxHp);
    extra = ` · 인내심 +${heal}`;
  } else if (sp.style === 'stun') {
    state.enemyStunned = true;
    extra = ' · 적 기절!';
  } else if (sp.style === 'burst') {
    state.enemyGuardShield = 0;
    extra = ' · 가드 완파!';
  } else if (sp.style === 'combo') {
    addFever(25);
    extra = ' · 피버 +25%';
  }
  state.log = `✨ [${sp.name}!!] 나만의 필살기 작렬! (멘탈 -${dmg}${extra})`;
  triggerEnemyHit(dmg, true);
  if (state.enemyHp <= 0) handleEnemyDefeated(enemy);
  else enemyCounterTurn(enemy, false);
}

function useCustomPotionInCombat(enemy) {
  if (!state.customPotions || state.customPotions.length === 0) return;
  const pot = state.customPotions.shift();
  sfx.powerup();
  if (pot.type === 'bomb') {
    state.enemyHp = clamp(state.enemyHp - pot.power, 0, state.enemyMaxHp);
    state.enemyStunned = true;
    state.log = `🧪 [${pot.name}] 투척!! 적 멘탈 -${pot.power} & 기절! (턴 소모 없음)`;
    triggerEnemyHit(pot.power, true);
    if (state.enemyHp <= 0) { handleEnemyDefeated(enemy); return; }
  } else {
    state.hp = clamp(state.hp + pot.power, 1, state.maxHp);
    state.sp = clamp(state.sp + 25, 0, state.maxSp);
    state.log = `🧪 [${pot.name}] 원샷! 인내심 +${pot.power} · 사이다 +25! (턴 소모 없음)`;
  }
  showToast(`🧪 ${pot.name} 사용!`, 'good');
  saveGame();
  render();
}

function openDiplomacyModal(enemy) {
  ensureSandboxState();
  elActivityModalTitle.textContent = `🗣️ 현장 교섭 (기선제압) — ${enemy.name}`;
  if (elActivityModalImg) elActivityModalImg.classList.add('hidden');
  elActivityList.innerHTML = '';

  const speechChance = clamp(25 + state.skills.speech * 6 + Math.floor((state.stats.speech || 5) * 0.8), 25, 65);
  const intimChance = clamp(20 + state.infamy * 4 + Math.floor((state.stats.guts || 5) * 0.8), 20, 60);

  const pBtn = document.createElement('button');
  pBtn.className = 'activity-item-btn';
  pBtn.innerHTML = `<div class="act-title">🗣️ 논리적 설득 (성공률 ${speechChance}%)</div><div class="act-desc">화술 Lv.${state.skills.speech} · 성공 시 적 멘탈 -30% + 가드 1칸 파쇄 + 명성 +1</div>`;
  pBtn.addEventListener('click', () => {
    elActivityModal.classList.add('hidden');
    state.diplomacyUsed = true;
    gainSkillXp('speech', 14);
    if (Math.random() * 100 < speechChance) {
      const dmg = Math.max(15, Math.round((state.enemyMaxHp || 100) * 0.30));
      state.fame += 1;
      state.enemyHp = Math.max(1, state.enemyHp - dmg);
      state.enemyGuardShield = Math.max(0, (state.enemyGuardShield ?? 3) - 1);
      sfx.victory();
      showToast(`🗣️ 설득 성공! 적 멘탈 -${dmg} & 가드 1칸 파쇄!`, 'good');
      state.log = `🗣️ 정곡을 찌르는 논리에 [${enemy.name}]의 멘탈이 크게 흔들렸습니다! (멘탈 -${dmg} · 가드-1 · 명성+1)`;
      triggerEnemyHit(dmg, true);
      saveGame();
      render();
    } else {
      sfx.damage();
      showToast('💦 설득 실패! 적의 반격!', 'warn');
      state.log = `🗣️ 말로 타일러 보려 했으나 [${enemy.name}]이(가) 코웃음 칩니다!`;
      enemyCounterTurn(enemy, false);
    }
  });
  elActivityList.appendChild(pBtn);

  const iBtn = document.createElement('button');
  iBtn.className = 'activity-item-btn';
  iBtn.innerHTML = `<div class="act-title">😈 노란 완장 협박 (성공률 ${intimChance}%)</div><div class="act-desc">악명(${state.infamy})·깡 · 성공 시 적 멘탈 -20% + 1턴 기절 (악명 +1)</div>`;
  iBtn.addEventListener('click', () => {
    elActivityModal.classList.add('hidden');
    state.diplomacyUsed = true;
    gainSkillXp('combat', 10);
    if (Math.random() * 100 < intimChance) {
      const dmg = Math.max(12, Math.round((state.enemyMaxHp || 100) * 0.20));
      state.infamy += 1;
      state.enemyHp = Math.max(1, state.enemyHp - dmg);
      state.enemyStunned = true;
      sfx.powerup();
      showToast(`😈 협박 성공! 적 멘탈 -${dmg} & 1턴 기절!`, 'warn');
      state.log = `😈 서늘한 눈빛에 [${enemy.name}]이(가) 얼어붙었습니다! (멘탈 -${dmg} · 1턴 기절 · 악명+1)`;
      triggerEnemyHit(dmg, true);
      saveGame();
      render();
    } else {
      sfx.damage();
      state.infamy += 1;
      showToast('💢 협박 실패! 적이 분노했습니다!', 'warn');
      state.log = `😈 협박이 안 먹혔습니다! [${enemy.name}]이(가) 덤벼듭니다!`;
      enemyCounterTurn(enemy, false);
    }
  });
  elActivityList.appendChild(iBtn);

  const bBtn = document.createElement('button');
  bBtn.className = 'activity-item-btn';
  bBtn.disabled = state.points < 150;
  bBtn.innerHTML = `<div class="act-title">💰 뒷거래 약화 (150P)</div><div class="act-desc">적 멘탈 -40% + 공격력 20% 약화 + 랜덤 재료 1개</div>`;
  bBtn.addEventListener('click', () => {
    elActivityModal.classList.add('hidden');
    state.diplomacyUsed = true;
    state.points -= 150;
    gainSkillXp('speech', 10);
    const dmg = Math.max(20, Math.round((state.enemyMaxHp || 100) * 0.40));
    state.enemyHp = Math.max(1, state.enemyHp - dmg);
    state.currentEnemyAtk = Math.max(5, Math.round((state.currentEnemyAtk || enemy.atk || 14) * 0.8));
    const keys = Object.keys(INGREDIENT_META);
    const pickIng = keys[Math.floor(Math.random() * keys.length)];
    gainIngredient(pickIng, 1);
    sfx.powerup();
    showToast(`💰 거래 성사! 적 멘탈 -${dmg} · 공격력 약화 · ${INGREDIENT_META[pickIng].name}!`, 'good');
    state.log = `💰 150P를 찔러주자 [${enemy.name}]이(가) 살살 싸우기로 했습니다! (멘탈 -${dmg} · 공격력 20%↓)`;
    triggerEnemyHit(dmg, false);
    saveGame();
    render();
  });
  elActivityList.appendChild(bBtn);

  elActivityModal.classList.remove('hidden');
}

function openLocationMenu(locId) {
  ensureSandboxState();
  state.mapLoc = locId;
  const cat = ACTIVITY_CATEGORIES.find((c) => c.id === locId);
  const timeName = TIME_SLOTS[state.timeIndex || 0] || TIME_SLOTS[0];
  const locNames = {
    patrol: '🚓 골목순찰 인터랙션',
    work: '💼 알바터 인터랙션',
    train: '🏋️ 철봉공원 인터랙션',
    heal: '🏠 우리집 인터랙션',
    shop: '🏪 24시 편의점 인터랙션',
    luck: '🕹️ 오락실 인터랙션',
  };
  elActivityModalTitle.textContent = locNames[locId] || '📍 장소 메뉴';
  if (elActivityModalImg) {
    if (cat?.image) {
      elActivityModalImg.src = cat.image;
      elActivityModalImg.classList.remove('hidden');
    } else {
      elActivityModalImg.classList.add('hidden');
    }
  }
  elActivityList.innerHTML = '';

  const banner = document.createElement('div');
  banner.className = 'oblivion-banner';
  banner.innerHTML = `<b>🕒 ${timeName}</b> · 🏅명성 ${state.fame} · 😈악명 ${state.infamy}${state.rumor ? `<br>📰 ${state.rumor}` : ''}`;
  elActivityList.appendChild(banner);

  const addAction = (title, desc, fn, disabled = false) => {
    const btn = document.createElement('button');
    btn.className = 'activity-item-btn';
    btn.disabled = !!disabled;
    btn.innerHTML = `<div class="act-title">${title}</div><div class="act-desc">${desc}</div>`;
    btn.addEventListener('click', () => {
      elActivityModal.classList.add('hidden');
      fn();
    });
    elActivityList.appendChild(btn);
  };

  if (locId === 'patrol') {
    addAction('🕵️ 골목 잠복 수색 (은신↑)', `은신 Lv.${state.skills.sneak} · 희귀 재료 수색 or 선제 기습!`, () => {
      gainSkillXp('sneak', 14);
      const keys = Object.keys(INGREDIENT_META);
      const got = keys[Math.floor(Math.random() * keys.length)];
      gainIngredient(got, 1);
      if (state.sideQuest.id === null && Math.random() < 0.4) {
        state.sideQuest = { id: 'lost_wallet', step: 1, done: [] };
        state.log = `🕵️ 골목 잠복 중 떨어져 있는 [고급 가죽 지갑]을 발견했습니다! (히든 퀘스트 시작 · 편의점이나 경찰서에 문의해보세요)`;
      } else {
        state.points += 18;
        state.log = `🕵️ 은밀히 골목을 수색해 [${INGREDIENT_META[got].name}] 1개와 +18P를 확보했습니다! (은신 XP +14)`;
      }
      advanceTime();
      saveGame();
      render();
    });
    addAction('💬 시민 탐문 & 제보 받기 (화술↑ · 명성↑)', `화술 Lv.${state.skills.speech} · 동네 소문 수집 & 명성 +2`, () => {
      gainSkillXp('speech', 12);
      state.fame += 2;
      state.points += 15;
      if (state.sideQuest.id === 'lost_wallet' && state.sideQuest.step === 1) {
        state.sideQuest.step = 2;
        state.points += 120;
        state.fame += 5;
        state.sideQuest.id = null;
        state.sideQuest.done.push('lost_wallet');
        setRumor('잃어버린 회장님 지갑을 돌려준 청렴한 시민영웅 미담 확산');
        state.log = '💼 [히든 퀘스트 완료!!] 지갑 주인이 대기업 회장이었습니다! 사례금 +120P & 명성 +5!';
        showToast('🎉 히든 퀘스트 클리어! +120P!', 'break');
      } else {
        setRumor('친절한 노란 완장이 주민들과 다정히 소통하고 있다는 미담');
        state.log = '💬 동네 주민들과 수다를 떨며 민원을 해결했습니다! (+15P · 명성 +2 · 화술 XP +12)';
      }
      advanceTime();
      saveGame();
      render();
    });
    addAction('😈 뒷골목 불심검문 · 삥뜯기 (악명+3)', '권력 남용으로 돈과 재료를 뜯어냅니다 (명성 -1 · 악명 +3)', () => {
      state.infamy += 3;
      state.fame = Math.max(0, state.fame - 1);
      state.points += 45;
      gainIngredient('capsaicin', 1);
      gainSkillXp('combat', 10);
      setRumor('밤길 노란 완장이 양아치들 주머니를 털고 다닌다는 흉흉한 소문');
      sfx.damage();
      state.log = '😈 골목 불량배들을 험악하게 제압해 용돈을 뜯었습니다! (+45P · 캡사이신 +1 · 악명 +3)';
      advanceTime();
      saveGame();
      render();
    });
    addAction('🎭 이중생활 정체 위기 대처', '시민이 "어, 이 목소리 어제 그 알바생?" 하며 알아봅니다!', () => {
      openDoubleLifeModal();
    });
  } else if (locId === 'work') {
    addAction('🤝 사장님과 시급 협상 (화술↑)', `화술 Lv.${state.skills.speech} · 말빨로 특별 보너스 수당 획득!`, () => {
      gainSkillXp('speech', 14);
      const bonus = 25 + state.skills.speech * 8;
      state.points += bonus;
      state.log = `🤝 "사장님, 제가 요즘 동네 치안까지 챙기잖아요~" 협상 성공! (+${bonus}P · 화술 XP +14)`;
      sfx.powerup();
      advanceTime();
      saveGame();
      render();
    });
    addAction('🤫 몰래 농땡이 & 탕비실 털기 (은신↑)', '체력 소모 없이 탕비실 재료(박카스/콜드브루) 챙기기!', () => {
      gainSkillXp('sneak', 12);
      const got = Math.random() < 0.5 ? 'bacchus' : 'cold_brew';
      gainIngredient(got, 1);
      state.sp = clamp(state.sp + 15, 0, state.maxSp);
      state.log = `🤫 사장님 눈을 피해 탕비실에서 [${INGREDIENT_META[got].name}] 1개를 슬쩍했습니다! (사이다 +15 · 은신 XP +12)`;
      advanceTime();
      saveGame();
      render();
    });
  } else if (locId === 'train') {
    addAction('👴 동네 어르신과 장기 한 판 (화술/인내↑)', '인생 지혜를 배우며 최대 인내심 +5 & 명성 +1', () => {
      gainSkillXp('speech', 10);
      state.maxHp += 5;
      state.hp = clamp(state.hp + 15, 1, state.maxHp);
      state.fame += 1;
      state.log = '👴 "자네, 완장 찼다고 급하게 덤비지 말게." 장군 멍군! (최대 인내심 +5 · 명성 +1)';
      sfx.powerup();
      advanceTime();
      saveGame();
      render();
    });
    addAction('🌙 철봉 비밀 특훈 (격투↑)', `격투 Lv.${state.skills.combat} · 빡센 철봉 루틴으로 전투 숙련도 대폭 상승!`, () => {
      gainSkillXp('combat', 18);
      state.bonusDmg += 1;
      state.hp = clamp(state.hp - 8, 1, state.maxHp);
      state.log = '🥊 손바닥에 굳은살이 박히도록 특훈했습니다! (공격력 +1 · 격투 XP +18 · 인내심 -8)';
      advanceTime();
      saveGame();
      render();
    });
  } else if (locId === 'heal') {
    const curHouse = HOUSING_TIERS[state.houseTier || 0] || HOUSING_TIERS[0];
    if (elActivityModalImg) {
      elActivityModalImg.src = curHouse.img;
      elActivityModalImg.classList.remove('hidden');
    }
    addAction(`🚚 내 집 마련 · 부동산 이사 (${curHouse.name})`, '포인트로 오피스텔·성수 로프트·한강뷰 펜트하우스로 이사!', () => {
      openHousingModal();
    });
    addAction('🧪 자취방 연금·요리 조합소', `보유 재료로 커스텀 포션/폭탄 제작 (연금 Lv.${state.skills.alchemy})`, () => {
      openAlchemyModal();
    });
    addAction('✨ 나만의 필살기 제작소 (60P)', '효과와 이름을 직접 정하는 커스텀 필살기 창조', () => {
      openSpellmakingModal();
    });
    addAction('📜 내 숙련도 · 명성/악명 시트', '숙련도 · 명성/악명 및 서울 소문 확인', () => {
      openOblivionSheetModal();
    });
  } else if (locId === 'shop') {
    addAction('🎟️ 주간 서울 로또 구매 (30P)', `보유 ${state.lottoTickets || 0}장 · 7일마다 추첨 (최대 500P 대박!)`, () => {
      if (state.points < 30) { showToast('30P가 필요합니다!', 'warn'); return; }
      state.points -= 30;
      state.lottoTickets = (state.lottoTickets || 0) + 1;
      sfx.powerup();
      state.log = `🎟️ 주간 서울 로또를 1장 구매했습니다! (보유 ${state.lottoTickets}장 · 7의 배수 날 아침 자동 추첨!)`;
      saveGame();
      render();
    });
    addAction('🍱 폐기 도시락 눈치껏 얻기 (화술/은신↑)', '알바생과 친분으로 공짜 회복 + 재료 획득!', () => {
      gainSkillXp('speech', 10);
      state.hp = clamp(state.hp + 25, 1, state.maxHp);
      gainIngredient('cold_brew', 1);
      state.log = '🍱 알바생이 "영웅님 드세요!" 하며 폐기 도시락과 콜드브루를 챙겨줬습니다! (HP +25 · 콜드브루 +1)';
      sfx.powerup();
      advanceTime();
      saveGame();
      render();
    });
    addAction('🗯️ 진상 손님 말빨 참교육 (화술↑ · 명성+2)', '주먹 없이 논리로 진상 손님을 퇴치합니다!', () => {
      gainSkillXp('speech', 15);
      state.fame += 2;
      state.points += 28;
      setRumor('편의점 진상을 3단 논법으로 울려서 보냈다는 목격담');
      state.log = '🗯️ 영수증과 소비자법을 읊어주자 진상이 꼬리를 말고 도망쳤습니다! (+28P · 명성 +2)';
      sfx.victory();
      advanceTime();
      saveGame();
      render();
    });
    if (state.infamy >= 5 || state.timeIndex >= 5) {
      addAction('🕶️ 뒷문 암시장 거래 (40P → 정령가루+홍삼)', '심야 또는 악명 5+ 전용 비밀 상인!', () => {
        if (state.points < 40) { showToast('40P가 필요합니다!', 'warn'); return; }
        state.points -= 40;
        gainIngredient('spirit_dust', 1);
        gainIngredient('red_ginseng', 1);
        state.infamy += 1;
        state.log = '🕶️ 검은 후드 상인에게서 [정령의 가루]와 [홍삼 엑기스]를 밀수했습니다! (악명 +1)';
        sfx.powerup();
        saveGame();
        render();
      });
    }
  } else if (locId === 'luck') {
    addAction('🃏 지하 VIP 주사위 포커판 (배팅 50P)', '심야/고수 전용! 이기면 120P, 빚지면 악명↑', () => {
      openUndergroundPokerModal();
    });
    addAction('🏆 오락실 고수 도장깨기 (격투/명성↑)', '철권/리듬게임 고수를 꺾고 상금 획득!', () => {
      gainSkillXp('combat', 12);
      if (Math.random() < 0.65) {
        state.points += 35;
        state.fame += 1;
        setRumor('오락실 30연승 기록을 갈아치운 정체불명의 노란 완장');
        state.log = '🏆 완벽한 프레임 싸움으로 오락실 1위를 탈환했습니다! (+35P · 명성 +1)';
        sfx.victory();
      } else {
        state.points = Math.max(0, state.points - 10);
        state.log = '😭 동네 초딩 고수에게 퍼펙트 KO 당했습니다... (-10P)';
        sfx.damage();
      }
      advanceTime();
      saveGame();
      render();
    });
    addAction('🔍 고장난 기계 뒤적거리기 (은신/연금↑)', '동전 떨어짐 & 수상한 부품(재료) 회수!', () => {
      gainSkillXp('sneak', 10);
      gainSkillXp('alchemy', 8);
      gainIngredient('spirit_dust', 1);
      state.points += 15;
      state.log = '🔍 오락실 구석에서 [정령의 가루] 1개와 동전 15P를 주웠습니다!';
      advanceTime();
      saveGame();
      render();
    });
  }

  if (cat) {
    addAction(`📋 기존 [${cat.title.replace(/^[^\s]+\s*/, '')}] 활동 목록 열기`, cat.sub, () => {
      openActivityModal(cat);
    });
  }
  elActivityModal.classList.remove('hidden');
}

// ============================================================
// V38.0: 내 집 마련(부동산 이사) · 히로인 선톡(DM) · 이중생활 · 지하 포커판
// ============================================================
const HOUSING_TIERS = [
  { tier: 0, name: '🏚️ 반지하 원룸', cost: 0, img: 'assets/images/ui/house_1_banjiha.jpg?v=98', desc: '초심의 자취방 · 기본 아침 회복' },
  { tier: 1, name: '🏢 역세권 복층 오피스텔', cost: 350, img: 'assets/images/ui/house_2_officetel.jpg?v=98', desc: '매일 아침 HP+15 / SP+12 추가 회복' },
  { tier: 2, name: '🌆 성수동 루프탑 로프트', cost: 900, img: 'assets/images/ui/house_3_loft.jpg?v=98', desc: '매일 아침 HP+30 / SP+24 · 알바/협상 수익 +15%' },
  { tier: 3, name: '🏙️ 한강뷰 펜트하우스', cost: 2000, img: 'assets/images/ui/house_4_penthouse.jpg?v=98', desc: '매일 아침 풀회복 · 히로인 집들이 이벤트 해금!' },
];

function openHousingModal() {
  const curTier = state.houseTier || 0;
  const cur = HOUSING_TIERS[curTier] || HOUSING_TIERS[0];
  elActivityModalTitle.textContent = '🚚 내 집 마련 · 서울 부동산';
  if (elActivityModalImg) {
    elActivityModalImg.src = cur.img;
    elActivityModalImg.classList.remove('hidden');
  }
  elActivityList.innerHTML = '';

  const banner = document.createElement('div');
  banner.className = 'oblivion-banner';
  banner.innerHTML = `<b>현재 거주지:</b> ${cur.name}<br>${cur.desc} (보유 포인트: ${state.points}P)`;
  elActivityList.appendChild(banner);

  HOUSING_TIERS.forEach((h) => {
    const owned = h.tier <= curTier;
    const isNext = h.tier === curTier + 1;
    const btn = document.createElement('button');
    btn.className = 'activity-item-btn';
    btn.disabled = owned || (!isNext) || state.points < h.cost;
    const tag = owned ? '✅ 거주중/보유' : (isNext ? `🚚 ${h.cost}P로 이사하기` : `🔒 이전 집 먼저 이사 (${h.cost}P)`);
    btn.innerHTML = `<div class="act-title">${h.name} · <span style="color:#b45309;">${tag}</span></div><div class="act-desc">${h.desc}</div>`;
    btn.addEventListener('click', () => {
      state.points -= h.cost;
      state.houseTier = h.tier;
      state.maxHp += 10;
      state.hp = state.maxHp;
      state.sp = state.maxSp;
      sfx.victory();
      showToast(`🎉 [${h.name}] 이사 완료!!`, 'break');
      setRumor(`시민영웅이 드디어 ${h.name}으로 성공적으로 이사했다는 화제의 소문`);
      state.lastCutscene = { image: h.img, animClass: '' };
      if (h.tier === 3) {
        if (!state.love) state.love = { yuki: 0, chloe: 0 };
        state.love.yuki = clamp((state.love.yuki || 0) + 10, 0, 200);
        state.love.chloe = clamp((state.love.chloe || 0) + 10, 0, 200);
        state.log = `🏙️ [한강뷰 펜트하우스 입성!!] 유키와 클로이가 집들이 선물과 함께 찾아와 밤새 축하 파티를 열었습니다! (인내심·사이다 풀회복 · 전원 호감도 +10)`;
      } else {
        state.log = `🚚 [${h.name}] 이사 대성공!! 새로운 보금자리에서 의지가 불타오릅니다! (최대 인내심 +10 · 풀회복)`;
      }
      elActivityModal.classList.add('hidden');
      saveGame();
      render();
    });
    elActivityList.appendChild(btn);
  });

  elActivityModal.classList.remove('hidden');
}

function openHeroineDmModal() {
  const hKey = state.pendingDm === 'chloe' ? 'chloe' : 'yuki';
  const hName = hKey === 'chloe' ? '🇺🇸 클로이' : '🇯🇵 유키';
  const pool = hKey === 'chloe' ? CHLOE_DMS_50 : YUKI_DMS_50;
  if (!state.usedDmIdx) state.usedDmIdx = { yuki: [], chloe: [] };
  const idx = pickNonRepeatingIdx(pool.length, state.usedDmIdx[hKey]);
  const dm = pool[idx] || pool[0];

  elActivityModalTitle.textContent = `📱 ${hName}의 실시간 카톡 (#${idx + 1}/50)`;
  if (elActivityModalImg) elActivityModalImg.classList.add('hidden');
  elActivityList.innerHTML = '';

  const banner = document.createElement('div');
  banner.className = 'oblivion-banner';
  banner.textContent = `"${dm.prompt}"`;
  elActivityList.appendChild(banner);

  dm.replies.forEach((r) => {
    const btn = document.createElement('button');
    btn.className = 'activity-item-btn';
    btn.innerHTML = `<div class="act-title">${r.label}</div><div class="act-desc">💬 답장 보내기</div>`;
    btn.addEventListener('click', () => {
      state.pendingDm = null;
      if (!state.love) state.love = { yuki: 0, chloe: 0 };
      state.love[hKey] = clamp((state.love[hKey] || 0) + r.love, 0, 200);
      state.sp = clamp(state.sp + (r.sp || 0), 0, state.maxSp);
      if (r.pp) restoreSkillPp(r.pp);
      elActivityModal.classList.add('hidden');
      if (r.meet) {
        sfx.victory();
        if (!state.lastDateDay) state.lastDateDay = { yuki: 0, chloe: 0 };
        state.lastDateDay[hKey] = state.day;
        if (!state.romanceStory) state.romanceStory = { yuki: { ep: 0, cleared: false }, chloe: { ep: 0, cleared: false } };
        const rSt = state.romanceStory[hKey] || { ep: 0, cleared: false };
        const epDoneToday = (state.lastRomanceEpDay?.[hKey] || 0) === state.day;
        if (!rSt.cleared && !epDoneToday && rSt.ep < 20) {
          state.activeRomanceStory = { heroine: hKey, epIdx: rSt.ep, sceneIdx: 0 };
          state.phase = 'romance_story';
          showToast(`💘 ${hName} 만나러 출발! 연애 스토리 제${rSt.ep + 1}화 시작!`, 'good');
        } else {
          state.romanceTarget = hKey;
          state.isDriveDate = false;
          if (!state.dateCount) state.dateCount = { yuki: 0, chloe: 0 };
          state.dateCount[hKey] = (state.dateCount[hKey] || 0) + 1;
          if (!state.usedDateIdx) state.usedDateIdx = { yuki: [], chloe: [] };
          const dLen = DATE_EVENTS[hKey].normal.length;
          state.currentQuizIdx = pickNonRepeatingIdx(dLen, state.usedDateIdx[hKey]);
          state.phase = 'date_scene';
          showToast(`💘 ${hName}와(과) 깜짝 데이트 성사!!`, 'good');
        }
        saveGame();
        render();
        return;
      }
      sfx.powerup();
      showToast(`💕 ${hName}에게 답장 전송!`, 'good');
      state.log = `📱 [${hName} 선톡] ${r.msg}`;
      saveGame();
      render();
    });
    elActivityList.appendChild(btn);
  });

  elActivityModal.classList.remove('hidden');
}

function openLevelUpModal() {
  const lu = state.pendingLevelUp;
  if (!lu) return;
  ensureSkillsState();
  elActivityModalTitle.textContent = `🎉 LEVEL UP!! Lv.${state.level} 달성!`;
  if (elActivityModalImg) elActivityModalImg.classList.add('hidden');
  elActivityList.innerHTML = '';

  const banner = document.createElement('div');
  banner.className = 'oblivion-banner';
  banner.innerHTML = `<b>축하합니다!</b> Lv.${lu.newLv} 달성! · 남은 스탯 포인트: <b style="color:#b45309;">${state.skillPoints || 0}P</b><br>아래에서 스탯을 올리고, 새로 습득한 기술을 바로 장착해보세요!`;
  elActivityList.appendChild(banner);

  const statGrid = document.createElement('div');
  statGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;';
  [
    { k: 'speech', lbl: `🗣️ 언변 +1 (현재 ${state.stats.speech})` },
    { k: 'guts', lbl: `🥊 깡다구 +1 (현재 ${state.stats.guts})` },
    { k: 'law', lbl: `⚖️ 법지식 +1 (현재 ${state.stats.law})` },
    { k: 'hp', lbl: `❤️ 최대HP +15 (현재 ${state.maxHp})` },
  ].forEach((st) => {
    const b = document.createElement('button');
    b.className = 'activity-item-btn';
    b.style.margin = '0';
    b.disabled = (state.skillPoints || 0) <= 0;
    b.innerHTML = `<div class="act-title" style="font-size:0.82rem;">${st.lbl}</div><div class="act-desc" style="font-size:0.7rem;">1P 투자</div>`;
    b.addEventListener('click', () => {
      if ((state.skillPoints || 0) <= 0) return;
      state.skillPoints -= 1;
      if (st.k === 'hp') { state.maxHp += 15; state.hp = clamp(state.hp + 15, 1, state.maxHp); }
      else state.stats[st.k] += 1;
      sfx.powerup();
      saveGame();
      openLevelUpModal();
    });
    statGrid.appendChild(b);
  });
  elActivityList.appendChild(statGrid);

  const newIds = lu.newSkills || [];
  if (newIds.length > 0) {
    newIds.forEach((skId) => {
      const sk = getSkillById(skId);
      if (!sk) return;
      const isEq = state.equippedSkills?.[sk.slot] === sk.id;
      const row = document.createElement('div');
      row.className = 'inv-item';
      row.innerHTML = `<div class="inv-info"><h4>⚡ 새 기술: ${sk.name} <span style="font-size:0.72rem;color:#0369a1;">(위력×${sk.mult} · PP ${sk.maxPp})</span></h4><p>${sk.desc}</p></div>`;
      const eqBtn = document.createElement('button');
      eqBtn.className = 'use-btn';
      eqBtn.disabled = isEq;
      eqBtn.textContent = isEq ? '장착됨' : '바로장착';
      eqBtn.addEventListener('click', () => {
        state.equippedSkills[sk.slot] = sk.id;
        if (state.skillPp) state.skillPp[sk.slot] = getMaxSkillPp(sk.slot);
        sfx.victory();
        showToast(`⚡ [${sk.name}] 즉시 장착!`, 'good');
        saveGame();
        openLevelUpModal();
      });
      row.appendChild(eqBtn);
      elActivityList.appendChild(row);
    });
  }

  const closeBtn = document.createElement('button');
  closeBtn.className = 'activity-item-btn';
  closeBtn.style.cssText = 'margin-top:8px;background:#fef3c7;border-color:#d97706;text-align:center;';
  closeBtn.innerHTML = '<div class="act-title">✅ 확인 완료 & 계속하기</div>';
  closeBtn.addEventListener('click', () => {
    state.pendingLevelUp = null;
    elActivityModal.classList.add('hidden');
    saveGame();
    render();
  });
  elActivityList.appendChild(closeBtn);
  elActivityModal.classList.remove('hidden');
}

function openDoubleLifeModal() {
  ensureSandboxState();
  elActivityModalTitle.textContent = '🎭 낮과 밤의 이중생활 — 정체 위기!';
  if (elActivityModalImg) elActivityModalImg.classList.add('hidden');
  elActivityList.innerHTML = '';

  const banner = document.createElement('div');
  banner.className = 'oblivion-banner';
  banner.textContent = '순찰 도중 동네 주민이 스마트폰을 들며 묻습니다. "잠깐... 그 노란 완장, 낮에 편의점 알바하던 총각 아니야?!"';
  elActivityList.appendChild(banner);

  const opts = [
    {
      title: `🤫 은신으로 그림자처럼 사라지기 (은신 Lv.${state.skills.sneak})`,
      desc: '연막처럼 골목으로 빠져나가 정체를 완벽히 숨깁니다',
      fn: () => {
        gainSkillXp('sneak', 15);
        state.fame += 1;
        state.log = '🤫 눈 깜짝할 새 골목 모퉁이로 사라졌습니다! "어? 귀신인가?" (은신 XP +15 · 명성 +1)';
      },
    },
    {
      title: `🗣️ 능청스럽게 딴청 피우기 (화술 Lv.${state.skills.speech})`,
      desc: '"아이고, 제가 좀 흔한 관상이라서요~" 말빨로 위기 모면',
      fn: () => {
        gainSkillXp('speech', 15);
        state.points += 20;
        state.log = '🗣️ 완벽한 연기력에 주민이 고개를 갸웃하며 돌아갔습니다! (+20P · 화술 XP +15)';
      },
    },
    {
      title: '📸 "맞습니다, 제가 시민영웅입니다!" 정체 공개',
      desc: '정체를 밝혀 팔로워 대폭발! (+150명 · 명성 +3)',
      fn: () => {
        state.followers = (state.followers || 120) + 150;
        state.fame += 3;
        setRumor('노란 완장 시민영웅의 진짜 정체가 SNS에서 대폭발 중!');
        state.log = '📸 당당히 정체를 공개하자 순식간에 인증샷 인파가 몰렸습니다! (팔로워 +150명 · 명성 +3)';
      },
    },
  ];
  opts.forEach((o) => {
    const btn = document.createElement('button');
    btn.className = 'activity-item-btn';
    btn.innerHTML = `<div class="act-title">${o.title}</div><div class="act-desc">${o.desc}</div>`;
    btn.addEventListener('click', () => {
      elActivityModal.classList.add('hidden');
      sfx.powerup();
      o.fn();
      advanceTime();
      saveGame();
      render();
    });
    elActivityList.appendChild(btn);
  });

  elActivityModal.classList.remove('hidden');
}

function openUndergroundPokerModal() {
  ensureSandboxState();
  elActivityModalTitle.textContent = '🃏 지하 VIP 주사위 포커판 (배팅 50P)';
  if (elActivityModalImg) elActivityModalImg.classList.add('hidden');
  elActivityList.innerHTML = '';

  const banner = document.createElement('div');
  banner.className = 'oblivion-banner';
  banner.textContent = `수상한 지하실에 모인 타짜들! 보유: ${state.points}P (주사위 2개 합이 딜러보다 높으면 +120P, 화술/은신 숙련도 보정!)`;
  elActivityList.appendChild(banner);

  const playBtn = document.createElement('button');
  playBtn.className = 'activity-item-btn';
  playBtn.disabled = state.points < 50;
  playBtn.innerHTML = '<div class="act-title">🎲 50P 걸고 한 판 승부!</div><div class="act-desc">승리 시 +120P 대박! 패배 시 -50P & 악명 +1</div>';
  playBtn.addEventListener('click', () => {
    elActivityModal.classList.add('hidden');
    state.points -= 50;
    const bonus = Math.floor((state.skills.sneak + state.skills.speech) / 3);
    const playerRoll = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + bonus;
    const dealerRoll = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
    if (playerRoll >= dealerRoll) {
      state.points += 120;
      gainSkillXp('sneak', 10);
      sfx.victory();
      showToast(`🃏 승리! (${playerRoll} vs ${dealerRoll}) +120P!`, 'break');
      state.log = `🃏 [지하 포커 승리!!] 내 패 ${playerRoll} vs 딜러 ${dealerRoll}! 칩을 싹쓸이했습니다! (+70P 순이익)`;
    } else {
      state.infamy += 1;
      sfx.damage();
      showToast(`💸 패배... (${playerRoll} vs ${dealerRoll})`, 'warn');
      state.log = `🃏 [지하 포커 패배...] 내 패 ${playerRoll} vs 딜러 ${dealerRoll}. 50P를 잃었습니다! (악명 +1)`;
    }
    advanceTime();
    saveGame();
    render();
  });
  elActivityList.appendChild(playBtn);

  elActivityModal.classList.remove('hidden');
}

// ============================================================
// V38.1: 모바일 안드로이드 뒤로가기(<) 실수 종료 방어 & 모달/서브화면 복귀
// ============================================================
(function setupBackButtonGuard() {
  if (typeof window === 'undefined' || !window.history?.pushState) return;
  let guardArmed = false;
  let lastBackAt = 0;
  const armGuard = () => {
    if (guardArmed) return;
    guardArmed = true;
    try {
      window.history.pushState({ chGuard: 1 }, '');
    } catch {}
  };
  armGuard();
  window.addEventListener('pointerdown', armGuard, { passive: true, once: true });

  window.addEventListener('popstate', () => {
    const openModals = Array.from(document.querySelectorAll('.modal-backdrop:not(.hidden)'))
      .filter((m) => m.id !== 'timing-modal');
    if (openModals.length > 0) {
      openModals.forEach((m) => m.classList.add('hidden'));
      if (state.pendingMorningSummary) state.pendingMorningSummary = null;
      try { window.history.pushState({ chGuard: 1 }, ''); } catch {}
      sfx.click();
      return;
    }

    if (['romance', 'lifestyle', 'shop', 'boss_select', 'lover_hub', 'gift_shop'].includes(state.phase)) {
      state.phase = 'map';
      render();
      try { window.history.pushState({ chGuard: 1 }, ''); } catch {}
      sfx.click();
      return;
    }

    const now = Date.now();
    if (now - lastBackAt > 2200) {
      lastBackAt = now;
      try { window.history.pushState({ chGuard: 1 }, ''); } catch {}
      showToast('🛡️ 실수 종료 방어! 나가려면 2초 안에 뒤로가기를 한 번 더 누르세요.', 'warn');
    }
  });

  window.addEventListener('beforeunload', (e) => {
    if (state.phase === 'combat') {
      e.preventDefault();
      e.returnValue = '';
    }
  });
})();

// ============================================================
// V40.0: 전국 5대 액트 대장정 · 보부상 무역 · 미로 던전 · 지부 파견 · 정령석 소켓
// ============================================================
function ensureNationalState() {
  if (!state.currentAct) state.currentAct = 'seoul';
  if (!Array.isArray(state.clearedActs)) state.clearedActs = [];
  if (!state.actStoryStep) state.actStoryStep = {};
  if (!state.tradeCargo) state.tradeCargo = {};
  if (!state.marketRates) rollMarketRates();
  if (!state.dispatchedActs) state.dispatchedActs = {};
  if (!Array.isArray(state.ownedRunes)) state.ownedRunes = [];
  if (!state.socketedRunes) state.socketedRunes = { weapon: null, armor: null, acc: null };
}

function rollMarketRates() {
  const rates = {};
  KOREA_ACTS.forEach((act) => {
    rates[act.id] = {};
    REGIONAL_GOODS.forEach((g) => {
      const isOrigin = g.origin === act.id;
      const mult = isOrigin ? (0.7 + Math.random() * 0.25) : (1.25 + Math.random() * 0.65);
      rates[act.id][g.id] = Math.round(g.basePrice * mult);
    });
  });
  state.marketRates = rates;
}

function openKoreaWorldModal() {
  ensureNationalState();
  const curAct = KOREA_ACTS.find((a) => a.id === state.currentAct) || KOREA_ACTS[4];
  elActivityModalTitle.textContent = `📍 현재 위치: ${curAct.name}`;
  if (elActivityModalImg && curAct.bg) { elActivityModalImg.src = curAct.bg; elActivityModalImg.classList.remove('hidden'); }
  if (elActivityModalImg) elActivityModalImg.classList.add('hidden');
  elActivityList.innerHTML = '';

  const banner = document.createElement('div');
  banner.className = 'oblivion-banner';
  banner.innerHTML = `<b>${curAct.name}</b> · ${curAct.recLvRange || ''}<br>🏆 제패 <b>${state.clearedActs.length}/5</b> · 👥 지부 <b>${Object.keys(state.dispatchedActs).length}곳</b> · 💎 룬 <b>${state.ownedRunes.length}개</b>`;
  elActivityList.appendChild(banner);

  const curEps = ACT_STORY_EPISODES[curAct.id] || [];
  const curStep = Math.min(state.actStoryStep?.[curAct.id] || 0, Math.max(0, curEps.length - 1));
  const items = [
    { t: `📖 스토리 진행 (${curStep + 1}/${curEps.length}화) ▶`, d: curAct.buffDesc, fn: () => openActStoryModal(curAct.id), full: true },
    { t: '🗺️ 지역 이동', d: '5대 도시 열차/차량', fn: openActTravelModal },
    { t: '🕸️ 미로 던전', d: '4층 탐험 & 정령석', fn: () => startActDungeon(curAct) },
    { t: '🚚 무역 · 릴레이', d: '시세차익 · 도시의뢰', fn: openTradeAndRelayHub },
    { t: '💎 지부 · 정령석', d: '지부파견 · 룬각인', fn: openDispatchAndRuneHub },
  ];
  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;';
  items.forEach((it) => {
    const btn = document.createElement('button');
    btn.className = 'activity-item-btn';
    btn.style.margin = '0';
    if (it.full) { btn.style.gridColumn = 'span 2'; btn.style.background = 'linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)'; btn.style.borderColor = '#d97706'; }
    btn.innerHTML = `<div class="act-title" style="font-size:0.86rem;">${it.t}</div><div class="act-desc" style="font-size:0.74rem;">${it.d}</div>`;
    btn.addEventListener('click', () => { sfx.click(); it.fn(); });
    grid.appendChild(btn);
  });
  elActivityList.appendChild(grid);
  elActivityModal.classList.remove('hidden');
}

function openTradeAndRelayHub() {
  elActivityModalTitle.textContent = '🚚 보부상 무역 · 도시 릴레이';
  elActivityList.innerHTML = '';
  const tBtn = document.createElement('button');
  tBtn.className = 'activity-item-btn';
  tBtn.innerHTML = '<div class="act-title">🚚 보부상 특산품 무역</div><div class="act-desc">도시별 실시간 시세로 싸게 사서 비싸게 매도</div>';
  tBtn.addEventListener('click', () => { sfx.click(); openTradeModal(); });
  elActivityList.appendChild(tBtn);
  const rBtn = document.createElement('button');
  rBtn.className = 'activity-item-btn';
  rBtn.innerHTML = '<div class="act-title">🔗 도시 간 릴레이 의뢰</div><div class="act-desc">전주↔인천↔평택↔동탄↔서울 연결 특급 의뢰</div>';
  rBtn.addEventListener('click', () => { sfx.click(); openRelayModal(); });
  elActivityList.appendChild(rBtn);
}

function openDispatchAndRuneHub() {
  elActivityModalTitle.textContent = '💎 자경단 지부 · 정령석 소켓';
  elActivityList.innerHTML = '';
  const dBtn = document.createElement('button');
  dBtn.className = 'activity-item-btn';
  dBtn.innerHTML = '<div class="act-title">👥 자경단 지부 파견</div><div class="act-desc">제패한 도시에 지부 개설 시 턴당 자동 +10P</div>';
  dBtn.addEventListener('click', () => { sfx.click(); openDispatchModal(); });
  elActivityList.appendChild(dBtn);
  const sBtn = document.createElement('button');
  sBtn.className = 'activity-item-btn';
  sBtn.innerHTML = `<div class="act-title">💎 장비 정령석(룬) 소켓 (보유 ${state.ownedRunes.length}개)</div><div class="act-desc">무기·방어구·장신구에 정령석 각인</div>`;
  sBtn.addEventListener('click', () => { sfx.click(); openRuneSocketModal(); });
  elActivityList.appendChild(sBtn);
}

function openActTravelModal() {
  ensureNationalState();
  elActivityModalTitle.textContent = '🚄 대한민국 전국 이동';
  elActivityList.innerHTML = '';

  KOREA_ACTS.forEach((act) => {
    const isHere = state.currentAct === act.id;
    const cleared = state.clearedActs.includes(act.id);
    const lvOk = (state.level || 1) >= act.minLv || act.id === 'seoul' || act.id === 'jeonju';
    const btn = document.createElement('button');
    btn.className = 'activity-item-btn';
    btn.disabled = isHere || !lvOk;
    btn.innerHTML = `<div class="act-title">${act.name} ${cleared ? '✅제패' : ''} ${isHere ? '📍현재위치' : ''}</div><div class="act-desc">${act.sub} · ${lvOk ? act.desc : `🔒 Lv.${act.minLv} 이상 해금`}</div>`;
    btn.addEventListener('click', () => {
      openTravelChoiceModal(act);
      return;
      sfx.powerup();
      showToast(`🚄 [${act.name}] 도착!`, 'good');
      state.log = `🚄 고속열차를 타고 [${act.name}]에 도착했습니다! (${act.sub})`;
      advanceTime();
      saveGame();
      openKoreaWorldModal();
    });
    elActivityList.appendChild(btn);
  });
}

function openActStoryModal(actId) {
  ensureNationalState();
  const eps = ACT_STORY_EPISODES[actId] || ACT_STORY_EPISODES.seoul;
  const step = Math.min(state.actStoryStep[actId] || 0, eps.length - 1);
  const ep = eps[step];
  if (ep && ep.scenes) {
    elActivityModal.classList.add('hidden');
    state.activeActStory = { actId, epIdx: step, sceneIdx: 0, reply: '', preDamagePct: 0 };
    state.phase = 'act_story';
    render();
    return;
  }
  const curActObj = KOREA_ACTS.find((a) => a.id === actId);
  if (elActivityModalImg && curActObj?.bg) {
    elActivityModalImg.src = curActObj.bg;
    elActivityModalImg.classList.remove('hidden');
  }
  elActivityModalTitle.textContent = `${ep.title} (${step + 1}/${eps.length}화)`;
  elActivityList.innerHTML = '';

  const banner = document.createElement('div');
  banner.className = 'oblivion-banner';
  banner.textContent = ep.text;
  elActivityList.appendChild(banner);

  if (ep.battleBossId) {
    const bBtn = document.createElement('button');
    bBtn.className = 'activity-item-btn';
    bBtn.innerHTML = `<div class="act-title">${ep.isBoss ? '👑 지역 보스 결전 돌입!!' : `⚔️ 제${ep.ep || step + 1}화 빌런 참교육 시작!`}</div><div class="act-desc">추천 Lv.${ep.recLv || 1} (내 Lv.${state.level || 1}) · 승리 시 다음 화 해금!</div>`;
    bBtn.addEventListener('click', () => {
      elActivityModal.classList.add('hidden');
      startBattle(ep.battleBossId);
    });
    elActivityList.appendChild(bBtn);
    elActivityModal.classList.remove('hidden');
  } else if (ep.choices) {
    ep.choices.forEach((ch) => {
      const cBtn = document.createElement('button');
      cBtn.className = 'activity-item-btn';
      cBtn.innerHTML = `<div class="act-title">${ch.label}</div><div class="act-desc">${ch.sub}</div>`;
      cBtn.addEventListener('click', () => {
        if (ch.fame) state.fame = (state.fame || 0) + ch.fame;
        if (ch.infamy) state.infamy = (state.infamy || 0) + ch.infamy;
        if (ch.points) state.points += ch.points;
        if (ch.followers) state.followers = (state.followers || 120) + ch.followers;
        if (ch.spFull) state.sp = state.maxSp;
        if (ch.ing) gainIngredient(ch.ing, 1);
        if (ch.skill) gainSkillXp(ch.skill, 15);
        state.actStoryStep[actId] = Math.min(eps.length - 1, step + 1);
        sfx.powerup();
        saveGame();
        openActStoryModal(actId);
      });
      elActivityList.appendChild(cBtn);
    });
  }
}

function startActDungeon(act, depth = 1) {
  ensureNationalState();
  elActivityModalTitle.textContent = `🕸️ ${act.dungeonName} (${depth}/4층)`;
  elActivityList.innerHTML = '';

  const banner = document.createElement('div');
  banner.className = 'oblivion-banner';
  banner.textContent = depth >= 4
    ? '🚨 던전 최심부 도착! 앞에는 보스방의 기운이 느껴집니다!'
    : `갈림길 ${depth}층: 어느 통로로 진입할까요? (은신/화술/전투에 따라 보상 변화!)`;
  elActivityList.appendChild(banner);

  if (depth >= 4) {
    const bossBtn = document.createElement('button');
    bossBtn.className = 'activity-item-btn';
    bossBtn.innerHTML = '<div class="act-title">👑 던전 보스방 돌입!!</div><div class="act-desc">지역 보스 격파 & 정령석 획득 찬스!</div>';
    bossBtn.addEventListener('click', () => {
      elActivityModal.classList.add('hidden');
      startBattle(act.bossId);
    });
    elActivityList.appendChild(bossBtn);
    return;
  }

  const dirs = [
    { label: '⬆️ 직진 통로', desc: '빌런 매복 or 보물상자 확률 높음' },
    { label: '⬅️ 왼쪽 좁은 샛길', desc: '은신·함정 해체로 포인트/재료 파밍' },
    { label: '➡️ 오른쪽 수상한 네온 골목', desc: '비밀 상인 또는 정령석 발견 찬스' },
  ];
  dirs.forEach((d) => {
    const btn = document.createElement('button');
    btn.className = 'activity-item-btn';
    btn.innerHTML = `<div class="act-title">${d.label}</div><div class="act-desc">${d.desc}</div>`;
    btn.addEventListener('click', () => {
      const r = Math.random();
      if (r < 0.35) {
        const mob = ACT_VILLAINS.find((v) => v.actId === act.id && !v.isActBoss) || VILLAINS[0];
        elActivityModal.classList.add('hidden');
        showToast('⚔️ 던전 매복 빌런 출현!', 'warn');
        startBattle(mob.id, true);
        return;
      } else if (r < 0.52) {
        const rPick = RUNE_STONES.find((x) => x.id === `rune_${act.id}`) || RUNE_STONES[0];
        state.ownedRunes.push(rPick.id);
        sfx.victory();
        showToast(`💎 [${rPick.name}] 발견!!`, 'break');
      } else {
        const pGain = 25 + depth * 12;
        state.points += pGain;
        gainSkillXp('sneak', 8);
        sfx.powerup();
        showToast(`💰 던전 보물상자! +${pGain}P`, 'good');
      }
      saveGame();
      startActDungeon(act, depth + 1);
    });
    elActivityList.appendChild(btn);
  });
}

function openTradeModal() {
  ensureNationalState();
  const actId = state.currentAct || 'seoul';
  const curAct = KOREA_ACTS.find((a) => a.id === actId) || KOREA_ACTS[4];
  const rates = state.marketRates[actId] || {};
  elActivityModalTitle.textContent = `🚚 보부상 무역 — ${curAct.name}`;
  elActivityList.innerHTML = '';

  const banner = document.createElement('div');
  banner.className = 'oblivion-banner';
  banner.textContent = `보유: ${state.points}P | 산지에서는 싸고, 타 도시에서는 비싸게 팔립니다! (시간대 이동 시 시세 갱신)`;
  elActivityList.appendChild(banner);

  REGIONAL_GOODS.forEach((g) => {
    const price = rates[g.id] || g.basePrice;
    const held = state.tradeCargo[g.id] || 0;
    const isOrigin = g.origin === actId;
    const row = document.createElement('div');
    row.className = 'inv-item';
    row.innerHTML = `<div class="inv-info"><h4>${g.name} (${held}개) ${isOrigin ? '🏷️산지특가' : '📈고수익'}</h4><p>현재 시세: ${price}P · ${g.desc}</p></div>`;
    const buyBtn = document.createElement('button');
    buyBtn.className = 'use-btn';
    buyBtn.textContent = `구매 ${price}P`;
    buyBtn.disabled = state.points < price;
    buyBtn.addEventListener('click', () => {
      state.points -= price;
      state.tradeCargo[g.id] = (state.tradeCargo[g.id] || 0) + 1;
      sfx.click();
      saveGame();
      openTradeModal();
    });
    const sellBtn = document.createElement('button');
    sellBtn.className = 'use-btn';
    sellBtn.style.marginLeft = '4px';
    sellBtn.textContent = `판매 +${price}P`;
    sellBtn.disabled = held <= 0;
    sellBtn.addEventListener('click', () => {
      state.tradeCargo[g.id] -= 1;
      state.points += price;
      gainSkillXp('speech', 6);
      sfx.powerup();
      saveGame();
      openTradeModal();
    });
    row.appendChild(buyBtn);
    row.appendChild(sellBtn);
    elActivityList.appendChild(row);
  });
}

function openDispatchModal() {
  ensureNationalState();
  elActivityModalTitle.textContent = '👥 자경단 지부 파견 관리';
  elActivityList.innerHTML = '';

  const banner = document.createElement('div');
  banner.className = 'oblivion-banner';
  banner.textContent = '제패한 도시에 자경단 지부를 세워두면 시간이 흐를 때마다 자동으로 +10P씩 수익이 들어옵니다!';
  elActivityList.appendChild(banner);

  KOREA_ACTS.forEach((act) => {
    const cleared = state.clearedActs.includes(act.id) || act.id === 'seoul';
    const active = !!state.dispatchedActs[act.id];
    const btn = document.createElement('button');
    btn.className = 'activity-item-btn';
    btn.disabled = !cleared || active;
    btn.innerHTML = `<div class="act-title">${act.name} 지부 ${active ? '✅ 파견 가동중 (+10P/턴)' : ''}</div><div class="act-desc">${cleared ? (active ? '자동 치안 유지 및 후원금 수금 중' : '터치해 자경단 지부 파견 시작 (50P)') : '🔒 먼저 해당 액트 보스를 격파하세요'}</div>`;
    btn.addEventListener('click', () => {
      if (state.points < 50) { showToast('파견 설치비 50P 필요!', 'warn'); return; }
      state.points -= 50;
      state.dispatchedActs[act.id] = true;
      sfx.victory();
      showToast(`👥 [${act.name}] 자경단 지부 개설 완료!`, 'good');
      saveGame();
      openDispatchModal();
    });
    elActivityList.appendChild(btn);
  });
}

function openRuneSocketModal() {
  ensureNationalState();
  elActivityModalTitle.textContent = '💎 장비 정령석(룬) 소켓 각인';
  elActivityList.innerHTML = '';

  const slots = [
    { key: 'weapon', label: '⚔️ 무기 소켓' },
    { key: 'armor', label: '🛡️ 방어구 소켓' },
    { key: 'acc', label: '💍 장신구 소켓' },
  ];
  const banner = document.createElement('div');
  banner.className = 'oblivion-banner';
  banner.innerHTML = slots.map((s) => {
    const r = RUNE_STONES.find((x) => x.id === state.socketedRunes[s.key]);
    return `<b>${s.label}:</b> ${r ? `${r.name} (${r.desc})` : '비어있음'}`;
  }).join('<br>');
  elActivityList.appendChild(banner);

  if (state.ownedRunes.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'oblivion-banner';
    empty.textContent = '아직 보유한 정령석이 없습니다! 5대 액트 던전이나 지역 보스 격파로 획득하세요.';
    elActivityList.appendChild(empty);
    return;
  }

  state.ownedRunes.forEach((rId, idx) => {
    const r = RUNE_STONES.find((x) => x.id === rId);
    if (!r) return;
    const row = document.createElement('div');
    row.className = 'inv-item';
    row.innerHTML = `<div class="inv-info"><h4>${r.name}</h4><p>${r.desc}</p></div>`;
    slots.forEach((sl) => {
      const b = document.createElement('button');
      b.className = 'use-btn';
      b.style.marginLeft = '4px';
      b.textContent = sl.key === 'weapon' ? '무기' : (sl.key === 'armor' ? '방어' : '장신');
      b.addEventListener('click', () => {
        const old = state.socketedRunes[sl.key];
        state.socketedRunes[sl.key] = r.id;
        state.ownedRunes.splice(idx, 1);
        if (old) state.ownedRunes.push(old);
        sfx.powerup();
        showToast(`💎 [${r.name}] ${sl.label} 각인 완료!`, 'good');
        saveGame();
        openRuneSocketModal();
      });
      row.appendChild(b);
    });
    elActivityList.appendChild(row);
  });
}

function openTravelChoiceModal(act) {
  ensureNationalState();
  elActivityModalTitle.textContent = `🚄 [${act.name}] 이동 수단 선택`;
  if (elActivityModalImg && act.bg) {
    elActivityModalImg.src = act.bg;
    elActivityModalImg.classList.remove('hidden');
  }
  elActivityList.innerHTML = '';

  const banner = document.createElement('div');
  banner.className = 'oblivion-banner';
  banner.textContent = `${act.name}(으)로 이동합니다! 이동 방식에 따라 돌발 이벤트와 컨디션이 달라집니다.`;
  elActivityList.appendChild(banner);

  const busBtn = document.createElement('button');
  busBtn.className = 'activity-item-btn';
  busBtn.innerHTML = '<div class="act-title">🚌 일반 고속버스 / 지하철 (무료 · 시간+1)</div><div class="act-desc">이동 중 45% 확률로 돌발 열차 이벤트 or 민폐 빌런 조우!</div>';
  busBtn.addEventListener('click', () => executeTravel(act, 'bus'));
  elActivityList.appendChild(busBtn);

  const hasCar = (state.carLevel || 0) >= 1;
  const gtxFree = !!state.freeGtxPass && ['dongtan', 'seoul'].includes(act.id) && ['dongtan', 'seoul'].includes(state.currentAct);
  const fastCost = (hasCar || gtxFree) ? 0 : 20;
  const fastBtn = document.createElement('button');
  fastBtn.className = 'activity-item-btn';
  fastBtn.disabled = state.points < fastCost;
  fastBtn.innerHTML = hasCar
    ? `<div class="act-title">🚗 내 차(T${state.carLevel}) 드라이브 (무료 · 시간 소모 없음!)</div><div class="act-desc">쾌속 직행 + 인내심/사이다 +15 회복!</div>`
    : `<div class="act-title">🚄 KTX 특실 쾌속 이동 (${gtxFree ? 'VIP 무료!' : '20P'} · 시간 소모 없음)</div><div class="act-desc">쾌속 직행 + 인내심/사이다 +15 회복!</div>`;
  fastBtn.addEventListener('click', () => executeTravel(act, 'fast', fastCost));
  elActivityList.appendChild(fastBtn);
}

function executeTravel(act, mode, fastCost = 0) {
  state.currentAct = act.id;
  if (mode === 'fast') {
    state.points -= fastCost;
    state.hp = clamp(state.hp + 15, 1, state.maxHp);
    state.sp = clamp(state.sp + 15, 0, state.maxSp);
    sfx.powerup();
    showToast(`🚄 [${act.name}] 쾌속 도착! (HP/SP +15)`, 'good');
    state.log = `🚄 쾌속 이동으로 [${act.name}]에 상쾌하게 도착했습니다!`;
    elActivityModal.classList.add('hidden');
    saveGame();
    render();
    return;
  }

  advanceTime();
  const r = Math.random();
  if (r < 0.28) {
    const mob = ACT_VILLAINS.find((v) => v.actId === act.id && !v.isActBoss) || VILLAINS[0];
    elActivityModal.classList.add('hidden');
    showToast('🚨 [이동 중 돌발!!] 열차/버스 민폐 빌런 출현!', 'warn');
    state.log = `🚌 [${act.name}]으로 가는 길, 차내 소란 빌런을 만났습니다!`;
    startBattle(mob.id, true);
    return;
  } else if (r < 0.55) {
    const keys = Object.keys(INGREDIENT_META);
    const ing = keys[Math.floor(Math.random() * keys.length)];
    gainIngredient(ing, 1);
    state.points += 20;
    sfx.powerup();
    showToast(`🎁 이동 중 옆자리 어르신이 [${INGREDIENT_META[ing].name}] & +20P 선물!`, 'good');
    state.log = `🚌 [${act.name}]행 버스에서 훈훈한 인심을 얻었습니다! (+20P · ${INGREDIENT_META[ing].name})`;
  } else {
    sfx.click();
    showToast(`🚌 [${act.name}] 도착!`, 'good');
    state.log = `🚌 대중교통을 타고 [${act.name}]에 도착했습니다!`;
  }
  elActivityModal.classList.add('hidden');
  saveGame();
  render();
}

function openRelayModal() {
  ensureNationalState();
  if (!Array.isArray(state.relayItems)) state.relayItems = [];
  if (!Array.isArray(state.relayDone)) state.relayDone = [];
  const curId = state.currentAct || 'seoul';
  elActivityModalTitle.textContent = '🔗 도시 간 릴레이 의뢰 (나비효과)';
  if (elActivityModalImg) elActivityModalImg.classList.add('hidden');
  elActivityList.innerHTML = '';

  const banner = document.createElement('div');
  banner.className = 'oblivion-banner';
  banner.textContent = '출발 도시에서 특산 물품을 챙긴 뒤, 도착 도시로 이동해 납품하면 영구 스탯·특전을 얻습니다!';
  elActivityList.appendChild(banner);

  RELAY_QUESTS.forEach((rq) => {
    const isDone = state.relayDone.includes(rq.id);
    const hasItem = state.relayItems.includes(rq.id);
    const btn = document.createElement('button');
    btn.className = 'activity-item-btn';
    if (isDone) {
      btn.disabled = true;
      btn.innerHTML = `<div class="act-title">✅ ${rq.title} (완료)</div><div class="act-desc">${rq.rewardDesc}</div>`;
    } else if (!hasItem) {
      btn.disabled = curId !== rq.from;
      const fromName = KOREA_ACTS.find((a) => a.id === rq.from)?.name || rq.from;
      btn.innerHTML = `<div class="act-title">${rq.title}</div><div class="act-desc">${curId === rq.from ? `📦 지금 [${rq.itemName}] 수령 가능!` : `🔒 ${fromName}에서 먼저 수령하세요`} · 보상: ${rq.rewardDesc}</div>`;
      btn.addEventListener('click', () => {
        state.relayItems.push(rq.id);
        sfx.powerup();
        showToast(`📦 [${rq.itemName}] 수령! 이제 도착 도시로 이동하세요!`, 'good');
        saveGame();
        openRelayModal();
      });
    } else {
      btn.disabled = curId !== rq.to;
      const toName = KOREA_ACTS.find((a) => a.id === rq.to)?.name || rq.to;
      btn.innerHTML = `<div class="act-title">🚚 ${rq.title} (보유중!)</div><div class="act-desc">${curId === rq.to ? `🎁 지금 납품하고 보상 받기! (${rq.rewardDesc})` : `📍 ${toName}로 이동해서 납품하세요!`}</div>`;
      btn.addEventListener('click', () => {
        state.relayItems = state.relayItems.filter((x) => x !== rq.id);
        state.relayDone.push(rq.id);
        state.points += rq.rewardPoints || 0;
        if (rq.rewardAtk) state.bonusDmg += rq.rewardAtk;
        if (rq.rewardDef) state.flatDef = (state.flatDef || 0) + rq.rewardDef;
        if (rq.freeGtx) state.freeGtxPass = true;
        if (rq.rewardRune) state.ownedRunes.push(rq.rewardRune);
        if (rq.id === 'relay_jj_ic') {
          if (!Array.isArray(state.customPotions)) state.customPotions = [];
          state.customPotions.push(
            { name: '🔥 마계 불지옥 엘릭서', type: 'bomb', power: 85, desc: '적 멘탈 -85 & 기절' },
            { name: '🔥 마계 불지옥 엘릭서', type: 'bomb', power: 85, desc: '적 멘탈 -85 & 기절' }
          );
        }
        sfx.victory();
        showToast(`🎉 릴레이 의뢰 완료!! ${rq.rewardDesc}`, 'break');
        saveGame();
        openRelayModal();
      });
    }
    elActivityList.appendChild(btn);
  });
}

// ============================================================
// V44.0: 100종 스킬 도감 & 4슬롯 자유 교체 모달
// ============================================================
function openSkillEquipModal(activeTab = 'speech') {
  ensureSkillsState();
  elActivityModalTitle.textContent = `⚡ 100종 스킬 덱 (${state.unlockedSkills.length}/100 해금)`;
  if (elActivityModalImg) elActivityModalImg.classList.add('hidden');
  elActivityList.innerHTML = '';

  const eq = state.equippedSkills;
  const curSummary = [
    `🗣️ ${getEquippedSkill('speech').name}`,
    `🥊 ${getEquippedSkill('guts').name}`,
    `⚖️ ${getEquippedSkill('law').name}`,
    `📸 ${getEquippedSkill('snap').name}`,
  ].join(' | ');
  const banner = document.createElement('div');
  banner.className = 'oblivion-banner';
  banner.innerHTML = `<b>현재 장착 4슬롯:</b><br>${curSummary}`;
  elActivityList.appendChild(banner);

  const tabs = document.createElement('div');
  tabs.className = 'gear-tabs';
  [
    { id: 'speech', label: '🗣️ 언변(25)' },
    { id: 'guts', label: '🥊 깡다구(25)' },
    { id: 'law', label: '⚖️ 법질서(25)' },
    { id: 'snap', label: '📸 채증(25)' },
  ].forEach((t) => {
    const tb = document.createElement('button');
    tb.className = `gear-tab${activeTab === t.id ? ' active' : ''}`;
    tb.textContent = t.label;
    tb.addEventListener('click', () => { sfx.click(); openSkillEquipModal(t.id); });
    tabs.appendChild(tb);
  });
  elActivityList.appendChild(tabs);

  const list = SKILLS_100.filter((s) => s.slot === activeTab);
  list.forEach((sk) => {
    const unlocked = state.unlockedSkills.includes(sk.id);
    const isEquipped = eq[sk.slot] === sk.id;
    const row = document.createElement('div');
    row.className = 'inv-item';
    row.style.opacity = unlocked ? '1' : '0.6';
    row.innerHTML = `<div class="inv-info"><h4>${isEquipped ? '✅ ' : ''}${sk.name} <span style="font-size:0.72rem;color:#0369a1;">(해금 Lv.${sk.reqLv} · 위력×${sk.mult} · PP ${sk.maxPp})</span></h4><p>${sk.desc}</p></div>`;
    const btn = document.createElement('button');
    btn.className = 'use-btn';
    btn.disabled = !unlocked || isEquipped;
    btn.textContent = !unlocked ? `🔒Lv.${sk.reqLv}` : (isEquipped ? '장착중' : '장착');
    btn.addEventListener('click', () => {
      state.equippedSkills[sk.slot] = sk.id;
      if (state.skillPp) state.skillPp[sk.slot] = Math.min(state.skillPp[sk.slot] ?? sk.maxPp, getMaxSkillPp(sk.slot));
      sfx.powerup();
      showToast(`⚡ [${sk.name}] 장착 완료!`, 'good');
      saveGame();
      openSkillEquipModal(activeTab);
    });
    row.appendChild(btn);
    elActivityList.appendChild(row);
  });

  elActivityModal.classList.remove('hidden');
}

if (elSeoulMinimap && !elSeoulMinimap.dataset.pinBound) {
  elSeoulMinimap.dataset.pinBound = '1';
  elSeoulMinimap.addEventListener('click', (e) => {
    const pin = e.target.closest('.map-pin');
    if (!pin) return;
    const locId = pin.dataset.loc;
    if (!locId) return;
    sfx.click();
    openLocationMenu(locId);
  });
}

render();
