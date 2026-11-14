import { TIME_SLOTS, ITEMS, TRAITS, VILLAINS, BOSSES, RANDOM_EVENTS, STORY_MESSAGES } from './data/gameData.js';
import { STORY_CHAPTERS } from './data/storyChapters.js';
import { ACTIVITY_CATEGORIES } from './data/activities.js';
import { MINI_EVENTS, ENEMY_INTENTS, createFeedForVictory } from './data/liveEvents.js';
import { ENDINGS, evaluateEnding } from './data/endings.js';
import { HEROINES, LANG_QUIZZES, DATE_EVENTS } from './data/romance.js';
import { CARS, GEAR_UPGRADES, ACHIEVEMENTS } from './data/lifestyle.js';
import { STREAM_MISSIONS, ROOM_UPGRADES, GUERRILLA_VILLAINS, STOCKS, HEROINE_GIFTS } from './data/v16Systems.js';
import { COURT_CASES, COSTUMES, CAPSULE_POOL, PET_WALK_EVENTS } from './data/v17Systems.js';
import { sfx } from './sound.js';

const SAVE_KEY = 'citizen_hero_gta_save_v4';
const SAVE_SLOTS_KEY = 'citizen_hero_gta_slots_v1';
const ENDINGS_KEY = 'citizen_hero_endings_v1';
const SETTINGS_KEY = 'citizen_hero_gta_settings_v1';

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
    summary: `DAY ${state.day} · 제${Math.min(12, state.chapterIndex + 1)}화 · ${rep.label} · ${state.points}P`,
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
const btnWipeSave = document.getElementById('btn-wipe-save');
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
const elYukiSprite = document.getElementById('yuki-sprite');
const elChloeSprite = document.getElementById('chloe-sprite');
const elKongiSprite = document.getElementById('kongi-sprite');
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
  const pill = document.createElement('div');
  pill.className = `toast-pill${type ? ` ${type}` : ''}`;
  pill.textContent = msg;
  elToastContainer.appendChild(pill);
  setTimeout(() => pill.remove(), 2400);
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

function advanceTime() {
  state.timeIndex += 1;
  if (state.timeIndex >= TIME_SLOTS.length) {
    state.timeIndex = 0;
    state.day += 1;
    const ds = state.dailyStats || { wins: 0, loveGain: 0 };

    // V16.0: 자취방 인테리어 패시브 회복
    if (state.roomUpgrades?.includes('mattress')) {
      state.hp = clamp(state.hp + 15, 1, state.maxHp);
    }
    if (state.roomUpgrades?.includes('soundproof')) {
      state.sp = clamp(state.sp + 12, 0, state.maxSp);
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
      const gPick = GUERRILLA_VILLAINS[Math.floor(Math.random() * GUERRILLA_VILLAINS.length)];
      state.guerrilla = { villainId: gPick.id, expiresDay: state.day + 1 };
      showToast(`🚨 지명수배 출몰: ${gPick.name}!`, 'break');
    }

    // V16.0: 연인 방치 페널티 (2일+ 소홀 시 호감도 -6, 50 미만 시 이별)
    if (state.lovers && state.lovers.length > 0) {
      if (!state.lastContactDay) state.lastContactDay = { yuki: state.day, chloe: state.day };
      [...state.lovers].forEach((lk) => {
        const gap = state.day - (state.lastContactDay[lk] || state.day);
        if (gap >= 2) {
          state.love[lk] = clamp((state.love[lk] || 0) - 6, 0, 100);
          const nm = lk === 'yuki' ? '유키' : '클로이';
          if (!state.dateMessages) state.dateMessages = [];
          state.dateMessages.unshift({
            sender: lk === 'yuki' ? '🇯🇵 유키' : '🇺🇸 클로이',
            title: `DAY ${state.day} · 💔 서운함 경고`,
            body: `"요즘 ${gap}일째 너무 소홀한 거 아니에요...? (호감도 -6 → ${state.love[lk]}/100)"`,
          });
          state.unreadMessages += 1;
          if (state.love[lk] < 50) {
            state.lovers = state.lovers.filter((x) => x !== lk);
            showToast(`💔 ${nm}와(과) 소홀해져 이별했습니다...`, 'break');
          } else {
            showToast(`💔 ${nm}에게 소홀해 호감도 -6!`, 'break');
          }
        }
      });
    }

    showToast(`🌙 하루 결산 · 참교육 ${ds.wins}회 · 호감 +${ds.loveGain} (DAY ${state.day} 시작!)`, 'good');
    state.dailyStats = { wins: 0, loveGain: 0 };
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
    elBookPage.classList.remove('hit-flash');
    void elBookPage.offsetWidth;
    elBookPage.classList.add('hit-flash');
  }
  showFloatingText(isCrit ? `약점/치명 -${dmg}!` : `-${dmg}`, isCrit ? 'crit' : 'hit');
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

function getEnemyById(id) {
  return BOSSES.find((b) => b.id === id)
    || GUERRILLA_VILLAINS.find((g) => g.id === id)
    || VILLAINS.find((v) => v.id === id)
    || VILLAINS[0];
}

function isBossId(id) {
  return BOSSES.some((b) => b.id === id);
}

function showSceneCard(badge, ascii, sub = '') {
  elSceneImage.classList.add('hidden');
  elWantedPoster.classList.add('hidden');
  elSceneCard.classList.remove('hidden');
  elSceneCardBadge.textContent = badge;
  elSceneCardAscii.textContent = ascii;
  elSceneCardSub.textContent = sub;
}

function showEnemyVisual(enemy) {
  elSceneCard.classList.add('hidden');
  if (enemy.image) {
    elSceneImage.src = enemy.image;
    elSceneImage.classList.remove('hidden');
    elWantedPoster.classList.add('hidden');
  } else {
    elSceneImage.classList.add('hidden');
    elWantedPoster.classList.remove('hidden');
    elWantedEmoji.textContent = enemy.wanted?.emoji || '🚨';
    elWantedName.textContent = enemy.name;
    elWantedCrime.textContent = enemy.wanted?.crime || '공공질서 파괴';
    elWantedStars.textContent = `위험도: ${enemy.wanted?.stars || '★★★☆☆'}`;
  }
}

function startBattle(enemyId) {
  const baseEnemy = getEnemyById(enemyId);
  const floor = state.towerFloor || 0;
  const enemy = floor > 0
    ? {
        ...baseEnemy,
        name: `[타워 ${floor}층] ${baseEnemy.name}`,
        maxHp: baseEnemy.maxHp + floor * 18,
        atk: baseEnemy.atk + floor * 2,
        reward: 25 + floor * 12,
      }
    : baseEnemy;
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
  state.enemyHp = startHp;
  state.enemyMaxHp = enemy.maxHp;
  state.enemyStunned = false;
  state.enemyIntent = 'normal';
  state.weakCombo = 0;
  state.enemyBroken = false;
  state.bossPhase2 = false;
  state.usedEquipThisBattle = [];
  state.streamMission = STREAM_MISSIONS[Math.floor(Math.random() * STREAM_MISSIONS.length)];
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

  // 보스/강적 50% 이하 2페이즈 각성
  if (!state.bossPhase2 && state.enemyHp <= Math.round(state.enemyMaxHp * 0.5)) {
    state.bossPhase2 = true;
    state.enemyIntent = 'heavy';
    state.log += `\n🔥 [${enemy.name}] 2페이즈 광폭화!! 다음 턴 강공격을 준비합니다!`;
  }

  if (state.enemyStunned) {
    state.enemyStunned = false;
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
    triggerEnemyHit(petDmg, petStun);
    if (state.enemyHp <= 0) {
      handleEnemyDefeated(enemy);
      return;
    }
  }

  const intentObj = ENEMY_INTENTS.find((i) => i.id === state.enemyIntent) || ENEMY_INTENTS[0];
  const chaosMult = (state.chaosLevel ?? 25) >= 70 ? 1.2 : 1.0;
  let dmg = Math.round((enemy.atk + Math.floor(Math.random() * 5) - 2) * intentObj.mult * chaosMult);
  if (isGuarding) {
    dmg = Math.max(2, Math.round(dmg * 0.25));
  }

  state.hp = clamp(state.hp - dmg, 0, state.maxHp);
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

  if (state.hp <= 0) {
    state.phase = 'gameover';
    state.log = `혈압이 한계치를 돌파했습니다... (${enemy.name}에게 패배)`;
    vibrate([200, 80, 200]);
  }
  saveGame();
  render();
}

function handleEnemyDefeated(enemy) {
  state.quote = enemy.defeatQuote;
  const nightBonus = state.timeIndex >= 2 ? Math.round(enemy.reward * 0.25) : 0;
  state.points += enemy.reward + nightBonus;
  state.pendingReports += 1;
  state.winCount = (state.winCount || 0) + 1;
  state.enemyBroken = false;
  if (state.guerrilla && state.guerrilla.villainId === enemy.id) {
    state.guerrilla = null;
    state.points += 40;
    showToast('🚨 지명수배 빌런 검거 완료! 현상금 +40 P!', 'good');
  }
  if (!state.dailyStats) state.dailyStats = { wins: 0, loveGain: 0 };
  state.dailyStats.wins += 1;
  state.chaosLevel = clamp((state.chaosLevel ?? 25) - (isBossId(enemy.id) ? 18 : 10), 0, 100);
  state.followers = (state.followers || 120) + (isBossId(enemy.id) ? 1200 : 280);
  state.liveFeed = createFeedForVictory(enemy.name, getReputationInfo().mode);
  if (nightBonus > 0) showToast(`🌙 야간 순찰 보너스 +${nightBonus} P!`, 'good');
  checkAchievements();
  sfx.victory();
  vibrate([50, 40, 50, 40, 150]);

  if ((state.towerFloor || 0) > 0) {
    const cleared = state.towerFloor;
    state.points += cleared * 12;
    if (cleared > (state.bestTowerFloor || 0)) state.bestTowerFloor = cleared;
    state.phase = 'tower_clear';
    state.log = `🏢 [배틀타워 ${cleared}층 격파!!] 보너스 +${cleared * 12} P! 다음 층으로 올라갈까요?`;
    saveGame();
    render();
    return;
  }

  advanceTime();

  const currentCh = STORY_CHAPTERS[state.chapterIndex];
  if (currentCh && currentCh.bossId === enemy.id) {
    state.chapterIndex += 1;
    state.storySceneIndex = 0;
    if (state.chapterIndex < STORY_CHAPTERS.length) {
      state.unreadMessages += 1;
    }
  }

  if (isBossId(enemy.id) && !state.defeatedBossIds.includes(enemy.id)) {
    state.defeatedBossIds.push(enemy.id);
  }

  if (state.defeatedBossIds.length >= BOSSES.length) {
    const ending = evaluateEnding(state, false);
    state.achievedEndingId = ending.id;
    unlockEnding(ending.id);
    state.phase = 'victory';
    state.log = ending.story;
    saveGame();
    render();
    return;
  }

  const ownedIds = state.traits.map((t) => t.id);
  const available = TRAITS.filter((t) => !ownedIds.includes(t.id) || t.id === 'first_aid');
  state.draftOptions = shuffle(available).slice(0, 3);
  state.phase = 'draft';
  state.log = `✅ [${enemy.name}] 참교육 성공! (+${enemy.reward} P · 채증 +1)\n보상으로 새로운 특성을 1개 선택하세요.`;
  saveGame();
  render();
}

function performGuard() {
  const enemy = getEnemyById(state.currentEnemyId);
  const counterDmg = 14 + state.stats.guts * 3 + state.bonusDmg;
  state.sp = clamp(state.sp + 18, 0, state.maxSp);
  state.enemyHp = clamp(state.enemyHp - counterDmg, 0, state.enemyMaxHp);
  state.weakCombo = (state.weakCombo || 0) + 1;
  playHeroAnim('guard');
  sfx.hit(true);
  state.log = `🛡️ 완벽 가드 & 카운터! (반격 -${counterDmg} · 사이다 +18)`;
  if (state.weakCombo >= 2) {
    state.enemyBroken = true;
    state.enemyStunned = true;
    state.weakCombo = 0;
    state.log += `\n💥 [카운터 브레이크!!] 빌런이 멘붕하여 다음 공격 1.5배 + 기절!`;
    showToast('💥 카운터 브레이크! 다음 공격 피해 1.5배!', 'break');
  }
  triggerEnemyHit(counterDmg, true);
  enemyCounterTurn(enemy, true);
}

function checkStreamMission(actionId) {
  if (!state.streamMission || state.streamMission.id !== actionId) return;
  const mult = state.roomUpgrades?.includes('desk') ? 1.35 : 1;
  const p = Math.round(state.streamMission.rewardP * mult);
  const f = Math.round(state.streamMission.rewardF * mult);
  state.points += p;
  state.followers = (state.followers || 120) + f;
  state.log += `\n📺 [시청자 미션 성공!] 도네이션 +${p} P · 팔로워 +${f}!`;
  showToast(`📺 도네이션 +${p} P · 팔로워 +${f}!`, 'good');
  state.streamMission = STREAM_MISSIONS[Math.floor(Math.random() * STREAM_MISSIONS.length)];
}

function performAttack(type) {
  playHeroAnim('attack');
  const enemy = getEnemyById(state.currentEnemyId);
  const rep = getReputationInfo();
  let dmg = 0;
  let isCrit = false;
  let hitWeakness = false;

  if (type === 'speech') {
    const base = 18 + state.stats.speech * 4 + state.bonusDmg;
    const isWeak = enemy.weakness === 'speech';
    hitWeakness = isWeak;
    const critRoll = Math.random() < (0.15 + state.critBonus);
    dmg = Math.round(base * (isWeak ? 1.45 : 1) * (critRoll ? 1.5 : 1));
    isCrit = isWeak || critRoll;
    state.sp = clamp(state.sp + 10, 0, state.maxSp);
    state.lawful += 5;
    state.log = `🗣️ 논리정연한 팩트폭력! (적 멘탈 -${dmg}${isWeak ? ' · 약점 적중!' : ''})`;
  } else if (type === 'guts') {
    const base = 16 + state.stats.guts * 4 + state.bonusDmg;
    const isWeak = enemy.weakness === 'guts';
    hitWeakness = isWeak;
    dmg = Math.round(base * (isWeak ? 1.45 : 1));
    isCrit = isWeak;
    const spGain = 15 + state.gutsSpBonus;
    state.sp = clamp(state.sp + spGain, 0, state.maxSp);
    state.chaotic += 10;
    state.log = `🪞 뻔뻔한 거울치료 시전! (적 멘탈 -${dmg}, 사이다 +${spGain}, 광인 +10)`;
  } else if (type === 'law') {
    sfx.dice();
    const roll = Math.floor(Math.random() * 20) + 1;
    const repBonus = rep.mode === 'lawful' ? 2 : 0;
    const costumeLawBonus = state.costume === 'police' ? 3 : 0;
    const total = roll + state.stats.law + state.diceBonus + repBonus + costumeLawBonus;
    const isWeak = enemy.weakness === 'law';
    hitWeakness = isWeak;
    state.lawful += 10;
    if (total >= 12) {
      dmg = Math.round((24 + state.stats.law * 5 + state.bonusDmg) * (isWeak ? 1.4 : 1));
      isCrit = true;
      state.enemyStunned = true;
      state.log = `⚖️ [주사위 ${roll} + 보정 = ${total}] 법 조항 들이밀기 대성공! (멘탈 -${dmg} & 기절!)`;
    } else {
      dmg = 10 + state.bonusDmg;
      state.log = `⚖️ [주사위 ${roll} + 보정 = ${total}] 법 조항이 가물가물... (적 멘탈 -${dmg})`;
    }
  } else if (type === 'special') {
    if (state.sp < 40) return;
    state.sp -= 40;
    dmg = 45 + state.spDmgBonus + state.bonusDmg + (state.stats.speech + state.stats.guts + state.stats.law) * 2;
    isCrit = true;
    hitWeakness = true;
    state.enemyStunned = true;
    state.lawful += 8;
    state.log = `🫧 [사이다 필살기] 112·보건소 신고 + 공개 참교육!! (멘탈 -${dmg} & 기절!)`;
  }

  if (state.enemyBroken) {
    dmg = Math.round(dmg * 1.5);
    isCrit = true;
    state.enemyBroken = false;
    state.log += `\n💥 [멘붕 브레이크 추격!!] 1.5배 폭딜 적중!`;
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

  state.enemyHp = clamp(state.enemyHp - dmg, 0, state.enemyMaxHp);
  checkStreamMission(type);
  triggerEnemyHit(dmg, isCrit);
  enemyCounterTurn(enemy);
}

function useItem(itemId, invIndex) {
  const item = ITEMS[itemId];
  if (!item) return;

  if (item.consumable) {
    sfx.powerup();
    vibrate(30);
    if (item.useEffect.hp) state.hp = clamp(state.hp + item.useEffect.hp, 0, state.maxHp);
    if (item.useEffect.sp) state.sp = clamp(state.sp + item.useEffect.sp, 0, state.maxSp);
    state.inventory.splice(invIndex, 1);
    state.log = `[${item.name}]을(를) 사용했습니다! 기운이 솟아납니다.`;
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
    elBookPage.classList.toggle('night-mode', state.timeIndex >= 2 && state.phase !== 'title');
  }
  elHpText.textContent = `${state.hp} / ${state.maxHp}`;
  elHpBar.style.width = `${(state.hp / state.maxHp) * 100}%`;
  elSpText.textContent = `${state.sp} / ${state.maxSp}`;
  elSpBar.style.width = `${(state.sp / state.maxSp) * 100}%`;
  elStatSpeech.textContent = state.stats.speech;
  elStatGuts.textContent = state.stats.guts;
  elStatLaw.textContent = state.stats.law;
  elStatPoints.textContent = state.points;
  elInvCount.textContent = state.inventory.length;
  elTraitCount.textContent = state.traits.length;

  const badgeCount = state.unreadMessages + (state.pendingReports > 0 ? 1 : 0);
  if (badgeCount > 0 && state.phase !== 'title') {
    elPhoneBadge.textContent = badgeCount;
    elPhoneBadge.classList.remove('hidden');
  } else {
    elPhoneBadge.classList.add('hidden');
  }

  elChoicesPanel.innerHTML = '';
  elWantedPoster.classList.add('hidden');
  elSceneCard.classList.add('hidden');
  elSceneImage.classList.add('hidden');
  elSceneImage.className = '';
  if (elFrame) elFrame.classList.remove('combat-stage');
  elHeroSprite.classList.add('hidden');
  elHeroSprite.classList.remove('with-yuki');
  if (elYukiSprite) elYukiSprite.classList.add('hidden');
  if (elChloeSprite) {
    elChloeSprite.classList.add('hidden');
    elChloeSprite.classList.remove('with-yuki');
  }
  if (elKongiSprite) elKongiSprite.classList.add('hidden');
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

  const timeLabel = TIME_SLOTS[state.timeIndex] || TIME_SLOTS[0];
  updateBgmForPhase();

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

    const btnNew = document.createElement('button');
    btnNew.className = 'choice-btn row-btn';
    btnNew.innerHTML = '<span>▶ 새 게임 시작 (스토리 프롤로그)</span><span class="choice-sub">NEW GAME</span>';
    btnNew.addEventListener('click', () => {
      sfx.click();
      vibrate(25);
      state = createNewGameState();
      render();
    });
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

  // 2. 프롤로그 1
  if (state.phase === 'prologue_1') {
    elLocation.textContent = '프롤로그 · 토요일 오전';
    elSceneTag.textContent = '스토리';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = '참을 만큼 참았다...';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = '"쿵! 쿵! 쿵! (새벽 2시부터 시작된 윗집 502호의 발망치)"';
    elQuoteBubble.classList.remove('hidden');
    showSceneCard(
      'PROLOGUE · 오전 8:00',
      '   🏢 [ 윗집 502호 ]   \n     🔨  쿵!  쿵!  쿵!  \n   ━━━━━━━━━━━━━━━━━━  \n   🛏️ 😵 (수면 3시간째...)\n   "이대로 당하고 살 순 없어!"',
      '휴대폰에 파출소 김순경의 긴급 톡이 도착했다'
    );
    elBattleLog.textContent =
      '윗집 층간소음 때문에 잠을 설친 아침. 마침 파출소 김순경에게서도 "서울에 진상 연합이 퍼지고 있다"는 톡이 왔습니다.\n' +
      '더 이상 참지 않기로 결심한 당신은 거리를 정화하러 나섭니다!';

    elChoicesPanel.className = 'choices-panel';
    const btnNext = document.createElement('button');
    btnNext.className = 'choice-btn row-btn';
    btnNext.innerHTML = '<span>🚶 현관문을 열고 참교육 장비를 고른다</span><span class="choice-sub">다음 ▶</span>';
    btnNext.addEventListener('click', () => {
      sfx.click();
      state.phase = 'prologue_2';
      render();
    });
    elChoicesPanel.appendChild(btnNext);
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
  if (state.phase === 'map') {
    const rep = getReputationInfo();
    elLocation.textContent = `DAY ${state.day} · ${timeLabel}`;
    elSceneTag.textContent = '서울 맵';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = `어디로 이동할까요? (${rep.label})`;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    const bTag = (id) => (state.defeatedBossIds.includes(id) ? '✅' : '🔥');
    const chaos = state.chaosLevel ?? 25;
    const chaosTag = chaos >= 90 ? '🚨비상!' : chaos >= 70 ? '⚠️경계' : chaos <= 30 ? '✨쾌적' : '보통';
    elSeoulMinimap.classList.remove('hidden');
    elMinimapChaos.textContent = `🌆${chaos}%(${chaosTag})`;
    elMinimapFollowers.textContent = `📱${(state.followers || 120).toLocaleString()}명`;
    elMinimapBosses.textContent = `${bTag('street_smoker')}홍대 ${bTag('subway_manspreader')}2호선 ${bTag('cinema_boss')}영화관 ${bTag('cafe_boss')}카페(${state.defeatedBossIds.length}/4)`;

    const activeLoc = state.mapLoc || 'heal';
    elSeoulMinimap.querySelectorAll('.map-pin').forEach((pin) => {
      pin.classList.toggle('active-pin', pin.dataset.loc === activeLoc);
    });
    animateChibiTo(activeLoc);

    elBattleLog.textContent = state.log || '서울 시내 지도입니다. 미션을 달성해 스토리를 해금하고 자유행동으로 이동하세요!';

    elChoicesPanel.className = 'choices-panel grid-2';

    if (state.guerrilla) {
      const gv = getEnemyById(state.guerrilla.villainId);
      const dLeft = Math.max(0, state.guerrilla.expiresDay - state.day);
      const gBtn = document.createElement('button');
      gBtn.className = 'choice-btn row-btn guard-btn';
      gBtn.style.gridColumn = 'span 2';
      gBtn.innerHTML = `<span>🚨 [지명수배 D-${dLeft}] ${gv.name}</span><span class="choice-sub">현상금 +40P · 방치 시 민폐도+15%!</span>`;
      gBtn.addEventListener('click', () => {
        sfx.powerup();
        startBattle(gv.id);
      });
      elChoicesPanel.appendChild(gBtn);
    }

    const currentCh = STORY_CHAPTERS[state.chapterIndex];
    if (currentCh) {
      const mState = checkChapterMission(currentCh.mission);
      const storyBtn = document.createElement('button');
      storyBtn.style.gridColumn = 'span 2';
      if (mState.done) {
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

    ACTIVITY_CATEGORIES.forEach((cat) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span>${cat.title}</span><span class="choice-sub">${cat.sub}</span>`;
      btn.addEventListener('click', () => {
        sfx.click();
        openActivityModal(cat);
      });
      elChoicesPanel.appendChild(btn);
    });

    const yukiLove = state.love?.yuki || 0;
    const chloeLove = state.love?.chloe || 0;
    const romanceBtn = document.createElement('button');
    romanceBtn.className = 'choice-btn';
    romanceBtn.style.background = 'linear-gradient(180deg, #fff0f5 0%, #ffe0ec 100%)';
    romanceBtn.style.borderColor = '#d46a92';
    romanceBtn.innerHTML = `<span>💘 연애·어학</span><span class="choice-sub" style="color:#9d2d57;">🇯🇵${yukiLove} · 🇺🇸${chloeLove}</span>`;
    romanceBtn.addEventListener('click', () => {
      sfx.powerup();
      state.phase = 'romance';
      state.log = '외국어를 공부하고 유키·클로이와 설레는 데이트를 즐겨보세요!';
      render();
    });
    elChoicesPanel.appendChild(romanceBtn);

    const petTxt = state.pet?.adopted ? `🐶Lv.${state.pet.level}` : '🐶미입양';
    const carTxt = (state.carLevel || 0) >= 1 ? `🚗T${state.carLevel}` : '🚗뚜벅이';
    const lifeBtn = document.createElement('button');
    lifeBtn.className = 'choice-btn';
    lifeBtn.style.background = 'linear-gradient(180deg, #f3fbe9 0%, #dff2cc 100%)';
    lifeBtn.style.borderColor = '#5b8c38';
    lifeBtn.innerHTML = `<span>🐶 펫·🚗 차고·🔧 강화</span><span class="choice-sub" style="color:#37611a;">${petTxt} · ${carTxt}</span>`;
    lifeBtn.addEventListener('click', () => {
      sfx.click();
      state.phase = 'lifestyle';
      state.lifeTab = 'main';
      state.log = '반려견 콩이·차고·강화·자취방·주식을 관리하세요!';
      render();
    });
    elChoicesPanel.appendChild(lifeBtn);

    const towerBtn = document.createElement('button');
    towerBtn.className = 'choice-btn row-btn';
    towerBtn.style.gridColumn = 'span 2';
    towerBtn.style.background = 'linear-gradient(180deg, #f9ecec 0%, #f1d4d4 100%)';
    towerBtn.style.borderColor = '#9e2a2b';
    towerBtn.innerHTML = `<span>🏢 서울 빌런 배틀타워 (최고 ${state.bestTowerFloor || 0}층)</span><span class="choice-sub" style="color:#9e2a2b;">무한 연승 도전 ▶</span>`;
    towerBtn.addEventListener('click', () => {
      sfx.powerup();
      state.towerFloor = 1;
      const pool = [...VILLAINS, ...GUERRILLA_VILLAINS];
      const pick = pool[Math.floor(Math.random() * pool.length)];
      startBattle(pick.id);
    });
    elChoicesPanel.appendChild(towerBtn);
    return;
  }

  // 4-L. V14.0 라이프스타일 허브 (펫·차고·장비 강화)
  if (state.phase === 'lifestyle') {
    if (!state.pet) state.pet = { adopted: false, name: '콩이', level: 0, exp: 0 };
    if (!state.gearLevels) state.gearLevels = { water_gun: 1, megaphone: 1, mirror: 1 };
    const curCar = (state.carLevel || 0) >= 1 ? CARS[state.carLevel - 1] : null;
    const nextCar = CARS[state.carLevel || 0] || null;

    elLocation.textContent = `DAY ${state.day} · 펫 · 차고 · 공방`;
    elSceneTag.textContent = '라이프';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = '🐶 펫 · 🚗 차고 · 🔧 장비 강화';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');

    if (state.pet.adopted) {
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
      { id: 'main', label: '🐶 펫·🚗·🔧' },
      { id: 'room', label: `🏠 방(${(state.roomUpgrades || []).length}/4)` },
      { id: 'stock', label: '📈 주식·🎰' },
      { id: 'costume', label: '🧥 코스튬' },
    ];
    const tabWrap = document.createElement('div');
    tabWrap.style.gridColumn = 'span 2';
    tabWrap.style.display = 'flex';
    tabWrap.style.gap = '4px';
    tabRow.forEach((tb) => {
      const tBtn = document.createElement('button');
      tBtn.className = 'choice-btn';
      tBtn.style.flex = '1';
      tBtn.style.padding = '5px';
      if ((state.lifeTab || 'main') === tb.id) {
        tBtn.style.background = '#e7d5b1';
        tBtn.style.borderColor = '#9e2a2b';
      }
      tBtn.innerHTML = `<span style="font-size:0.74rem;text-align:center;">${tb.label}</span>`;
      tBtn.addEventListener('click', () => {
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
        rBtn.innerHTML = `<span>${ru.name}</span><span class="choice-sub">${owned ? '✅ 보유 중' : `${ru.cost}P · ${ru.desc}`}</span>`;
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
      backBtn.innerHTML = '<span>◀ 서울 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
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
        cBtn.innerHTML = `<span>${equipped ? '✅ ' : (unlocked ? '' : '🔒 ')}${ct.name}</span><span class="choice-sub">${unlocked ? ct.desc : ct.unlockText}</span>`;
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
      backBtn.innerHTML = '<span>◀ 서울 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
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
        sBtn.innerHTML = `<span>💰 ${st.name} 매도 (+${price}P)</span><span class="choice-sub">${hold > 0 ? `1주 매도 가능 (보유 ${hold}주)` : '보유 주식 없음'}</span>`;
        sBtn.addEventListener('click', () => {
          if (hold <= 0) return;
          state.points += price;
          state.stockHoldings[st.id] = hold - 1;
          sfx.powerup();
          state.log = `💰 [${st.name}] 1주 매도 완료! (+${price} P · 남은 ${hold - 1}주)`;
          saveGame();
          render();
        });
        elChoicesPanel.appendChild(sBtn);
      });
      const backBtn = document.createElement('button');
      backBtn.className = 'choice-btn row-btn';
      backBtn.style.gridColumn = 'span 2';
      backBtn.innerHTML = '<span>◀ 서울 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
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
        cBtn.innerHTML = `<span>${equipped ? '✅ ' : (unlocked ? '' : '🔒 ')}${ct.name}</span><span class="choice-sub">${unlocked ? ct.desc : ct.unlockText}</span>`;
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
      backBtn.innerHTML = '<span>◀ 서울 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
      backBtn.addEventListener('click', () => { sfx.click(); state.phase = 'map'; render(); });
      elChoicesPanel.appendChild(backBtn);
      return;
    }

    const petBtn = document.createElement('button');
    petBtn.className = 'choice-btn';
    if (!state.pet.adopted) {
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

    const carBtn = document.createElement('button');
    carBtn.className = 'choice-btn';
    if (nextCar) {
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
    backBtn.innerHTML = '<span>◀ 서울 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
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

    const yukiReady = state.love.yuki >= 90 && state.lang.jp >= 4 && !state.lovers.includes('yuki');
    const chloeReady = state.love.chloe >= 90 && state.lang.en >= 4 && !state.lovers.includes('chloe');

    elLocation.textContent = `DAY ${state.day} · 연애 & 어학`;
    elSceneTag.textContent = '미연시';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = '💘 어학 공부 & 데이트';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.classList.add('hidden');
    showSceneCard(
      '💘 ROMANCE & LANGUAGE',
      ` 🇯🇵 유키 (일본어 Lv.${state.lang.jp}) — 호감도 ${state.love.yuki}/100 ${state.lovers.includes('yuki') ? '💖연인' : ''}\n` +
      ` 🇺🇸 클로이 (영어 Lv.${state.lang.en}) — 호감도 ${state.love.chloe}/100 ${state.lovers.includes('chloe') ? '💖연인' : ''}\n` +
      ` ─────────────────────────────────\n` +
      ` 데이트 비용: 35 P (하루 1회) · 고백: 호감도90 & 어학Lv.4`,
      '어학 장벽(Lv.2 미만) 시 호감도 상승 절반 · 양다리 시 질투 발각 주의!'
    );
    elBattleLog.textContent = state.log || '공부하고 싶은 언어와 만나고 싶은 히로인을 선택하세요!';
    elChoicesPanel.className = 'choices-panel grid-2';

    const tryStartDate = (key, isDrive = false) => {
      if (state.lastDateDay[key] === state.day) {
        state.log = `📅 오늘은 이미 ${key === 'yuki' ? '유키' : '클로이'}와 데이트했습니다! 내일(DAY ${state.day + 1}) 다시 신청하세요.`;
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
      if (!state.usedDateIdx) state.usedDateIdx = { yuki: [], chloe: [] };
      const poolLen = DATE_EVENTS[key].normal.length + (key === 'yuki' && state.pet?.adopted ? 1 : 0);
      state.currentQuizIdx = pickNonRepeatingIdx(poolLen, state.usedDateIdx[key]);
      state.phase = 'date_scene';
      render();
    };

    const rActions = [
      {
        title: '🇯🇵 일본어 공부 (유키)',
        sub: `Lv.${state.lang.jp} · 정답+10 / 오답-5`,
        run: () => {
          state.romanceTarget = 'yuki';
          if (!state.usedQuizIdx) state.usedQuizIdx = { jp: [], en: [] };
          state.currentQuizIdx = pickNonRepeatingIdx(LANG_QUIZZES.jp.length, state.usedQuizIdx.jp);
          state.phase = 'lang_quiz';
          render();
        },
      },
      {
        title: '🇺🇸 영어 공부 (클로이)',
        sub: `Lv.${state.lang.en} · 정답+10 / 오답-5`,
        run: () => {
          state.romanceTarget = 'chloe';
          if (!state.usedQuizIdx) state.usedQuizIdx = { jp: [], en: [] };
          state.currentQuizIdx = pickNonRepeatingIdx(LANG_QUIZZES.en.length, state.usedQuizIdx.en);
          state.phase = 'lang_quiz';
          render();
        },
      },
      {
        title: yukiReady ? '💖 유키에게 고백하기!' : '🍵 유키와 데이트 (35P)',
        sub: state.lastDateDay.yuki === state.day ? '오늘 완료 (내일 가능)' : '하루 1회 · 취향 공략',
        run: () => tryStartDate('yuki'),
      },
      {
        title: chloeReady ? '💖 클로이에게 고백하기!' : '📸 클로이와 데이트 (35P)',
        sub: state.lastDateDay.chloe === state.day ? '오늘 완료 (내일 가능)' : '하루 1회 · 취향 공략',
        run: () => tryStartDate('chloe'),
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
        const dBtn = document.createElement('button');
        dBtn.className = 'choice-btn';
        dBtn.style.background = 'linear-gradient(180deg, #eef7ff 0%, #d8ecff 100%)';
        dBtn.style.borderColor = '#4a89c7';
        const nm = k === 'yuki' ? '유키' : '클로이';
        dBtn.innerHTML = `<span>🚗 ${nm} 드라이브 (50P)</span><span class="choice-sub">${carObj.name} · 호감+${carObj.driveBonus}</span>`;
        dBtn.addEventListener('click', () => { sfx.click(); tryStartDate(k, true); });
        elChoicesPanel.appendChild(dBtn);
      });
    }

    const giftBtn = document.createElement('button');
    giftBtn.className = 'choice-btn row-btn';
    giftBtn.style.gridColumn = 'span 2';
    giftBtn.innerHTML = '<span>🎁 취향 맞춤 선물하기 (유키 · 클로이)</span><span class="choice-sub">연인 소홀함 방지 & 호감도 케어</span>';
    giftBtn.addEventListener('click', () => {
      sfx.click();
      state.phase = 'gift_shop';
      render();
    });
    elChoicesPanel.appendChild(giftBtn);

    const backBtn = document.createElement('button');
    backBtn.className = 'choice-btn row-btn';
    backBtn.style.gridColumn = 'span 2';
    backBtn.innerHTML = '<span>◀ 서울 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
    backBtn.addEventListener('click', () => {
      sfx.click();
      state.phase = 'map';
      render();
    });
    elChoicesPanel.appendChild(backBtn);
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
    showSceneCard(
      '🎁 GIFT SHOP',
      ` 🇯🇵 유키 호감도: ${state.love?.yuki || 0}/100\n 🇺🇸 클로이 호감도: ${state.love?.chloe || 0}/100\n ─────────────────────────\n 선물을 주면 소홀함 페널티가 초기화됩니다!`,
      '취향에 맞는 선물을 골라 마음을 전하세요!'
    );
    elBattleLog.textContent = state.log || '선물과 받을 히로인을 선택하세요!';
    elChoicesPanel.className = 'choices-panel grid-2';

    HEROINE_GIFTS.forEach((gf) => {
      ['yuki', 'chloe'].forEach((k) => {
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

  // 4-R1. 외국어 공부 퀴즈 화면
  if (state.phase === 'lang_quiz') {
    const isJp = state.romanceTarget === 'yuki';
    const hero = isJp ? HEROINES.yuki : HEROINES.chloe;
    const pool = isJp ? LANG_QUIZZES.jp : LANG_QUIZZES.en;
    const quiz = pool[state.currentQuizIdx % pool.length];

    elLocation.textContent = `DAY ${state.day} · ${hero.langName} 공부`;
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
        if (correct) {
          sfx.victory();
          vibrate(30);
          if (isJp) {
            state.lang.jp += 1;
            state.love.yuki = clamp(state.love.yuki + 10, 0, 100);
            state.stats.speech += 1;
            if (!state.lastContactDay) state.lastContactDay = { yuki: state.day, chloe: state.day };
            state.lastContactDay.yuki = state.day;
          } else {
            state.lang.en += 1;
            state.love.chloe = clamp(state.love.chloe + 10, 0, 100);
            state.stats.guts += 1;
            if (!state.lastContactDay) state.lastContactDay = { yuki: state.day, chloe: state.day };
            state.lastContactDay.chloe = state.day;
          }
          state.followers = (state.followers || 120) + 120;
          const dayStudyBonus = state.timeIndex <= 1 ? 5 : 0;
          if (dayStudyBonus > 0) state.points += dayStudyBonus;
          state.log = `🎉 정답!! ${quiz.reactOk}${dayStudyBonus > 0 ? '\n☀️ [낮 스터디 보너스] 도덕점수 +5 P!' : ''}`;
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

  // 4-R2. 데이트 & 고백 미연시 씬
  if (state.phase === 'date_scene') {
    const key = state.romanceTarget === 'chloe' ? 'chloe' : 'yuki';
    const otherKey = key === 'yuki' ? 'chloe' : 'yuki';
    const langKey = key === 'yuki' ? 'jp' : 'en';
    const hero = HEROINES[key];
    const isConfess = (state.love[key] || 0) >= 90 && (state.lang[langKey] || 0) >= 4 && !state.lovers.includes(key);
    const normalPool = [...DATE_EVENTS[key].normal];
    if (key === 'yuki' && state.pet?.adopted && DATE_EVENTS.yuki.petDate) {
      normalPool.push(DATE_EVENTS.yuki.petDate);
    }
    const ev = isConfess
      ? DATE_EVENTS[key].confess
      : (state.isDriveDate && DATE_EVENTS[key].drive
        ? DATE_EVENTS[key].drive
        : normalPool[(state.currentQuizIdx || 0) % normalPool.length]);

    elLocation.textContent = `DAY ${state.day} · ${state.isDriveDate ? '드라이브 데이트' : '데이트'}`;
    elSceneTag.textContent = isConfess ? '고백 타임!' : (state.isDriveDate ? '🚗 드라이브' : '데이트');
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = ev.title;
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = ev.quote;
    elQuoteBubble.classList.remove('hidden');
    elSceneImage.src = isConfess ? hero.imgSpecial : (ev.image || hero.imgNormal);
    elSceneImage.classList.remove('hidden');
    elBattleLog.textContent = ev.text;
    elChoicesPanel.className = 'choices-panel';

    shuffle(ev.choices).forEach((ch) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn row-btn';
      btn.innerHTML = `<span>${ch.text}</span><span class="choice-sub">${ch.sub}</span>`;
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

        state.love[key] = clamp((state.love[key] || 0) + loveGain, 0, 100);
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

        // 양다리 질투 리스크: 상대 호감도 50+ 시 30% 확률로 들킴
        if (!isConfess && (state.love[otherKey] || 0) >= 50 && Math.random() < 0.30) {
          state.love[key] = clamp(state.love[key] - 12, 0, 100);
          state.love[otherKey] = clamp(state.love[otherKey] - 12, 0, 100);
          const otherName = otherKey === 'yuki' ? '유키' : '클로이';
          extraMsg += `\n😱 [양다리 질투 발각!!] ${otherName}에게 데이트가 들켜 양쪽 호감도가 -12 깎였습니다!`;
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
    if (sc.image) {
      elSceneImage.src = sc.image;
      elSceneImage.classList.remove('hidden');
    } else {
      showSceneCard(sc.badge, sc.ascii, sc.sub);
    }
    elBattleLog.textContent = sc.text;
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
        }
        if (choice.completeChapterOnly) {
          sfx.victory();
          state.chapterIndex += 1;
          state.storySceneIndex = 0;
          state.unreadMessages += 1;
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
      btn.innerHTML = `<span>${ch.text}</span><span class="choice-sub">${ch.sub}</span>`;
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
      btn.innerHTML = `<span>${ch.text}</span><span class="choice-sub">${ch.sub}</span>`;
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
    backBtn.innerHTML = '<span>◀ 서울 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
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
    backBtn.innerHTML = '<span>◀ 서울 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
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
    backBtn.innerHTML = '<span>◀ 서울 지도로 돌아가기</span><span class="choice-sub">뒤로</span>';
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
      { id: 'cheongsimhwan', label: '💊 우황청심환 (인내심 +40)', cost: 30 },
      { id: 'cold_soda', label: '🫧 칠성사이다 캔 (사이다 +45)', cost: 25 },
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
      btn.innerHTML = `<span>${si.label}</span><span class="choice-sub">${si.cost} P</span>`;
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

  // 7. 전투 화면
  if (state.phase === 'combat') {
    const enemy = getEnemyById(state.currentEnemyId);
    const isBoss = isBossId(enemy.id);
    const rep = getReputationInfo();
    elLocation.textContent = `DAY ${state.day} · ${enemy.location}`;
    elSceneTag.textContent = isBoss ? '보스전' : '빌런 조우';
    elSceneTag.className = `scene-tag ${isBoss ? 'boss' : ''}`;
    elSceneTitle.textContent = enemy.name;
    elWeaknessPill.textContent = enemy.weaknessLabel;
    elWeaknessPill.classList.remove('hidden');

    elEnemyHpWrap.classList.remove('hidden');
    elEnemyHpLabel.textContent = isBoss ? '🔥 보스 멘탈' : '💢 빌런 멘탈';
    elEnemyHpText.textContent = `${state.enemyHp} / ${state.enemyMaxHp}`;
    elEnemyHpBar.style.width = `${(state.enemyHp / state.enemyMaxHp) * 100}%`;

    const intentObj = ENEMY_INTENTS.find((i) => i.id === state.enemyIntent) || ENEMY_INTENTS[0];
    elEnemyIntentBar.classList.remove('hidden');
    elEnemyIntentBar.className = `enemy-intent-bar${intentObj.isDanger ? ' danger' : ''}`;
    const comboText = (state.weakCombo || 0) > 0 ? `🔥 콤보 x${state.weakCombo}` : (state.bossPhase2 ? '💢 2페이즈' : '전투 중');
    elEnemyIntentBar.innerHTML = `<span>${intentObj.label}</span><span>${comboText}</span>`;

    if (elCombatBadges) {
      elCombatBadges.innerHTML = '';
      const badges = [];
      if (state.enemyBroken) badges.push({ cls: 'is-break', txt: '💥 멘붕 브레이크 (피해 1.5배!)' });
      if (state.enemyStunned) badges.push({ cls: 'is-stun', txt: '💫 기절 (행동불능)' });
      if ((state.weakCombo || 0) > 0) badges.push({ cls: 'is-combo', txt: `⚡ 약점콤보 ${state.weakCombo}/2` });
      if (state.pet?.adopted) badges.push({ cls: 'is-pet', txt: `🐶 콩이 Lv.${state.pet.level} 지원` });
      if (state.timeIndex >= 2) badges.push({ cls: '', txt: '🌙 야간 보너스 +25%' });
      if (state.streamMission) badges.push({ cls: 'is-combo', txt: state.streamMission.label });
      badges.forEach((b) => {
        const sp = document.createElement('span');
        sp.className = `combat-badge ${b.cls}`;
        sp.textContent = b.txt;
        elCombatBadges.appendChild(sp);
      });
    }

    showEnemyVisual(enemy);
    if (elFrame) elFrame.classList.add('combat-stage');
    elHeroSprite.classList.remove('hidden');
    const hasYuki = !!state.lovers?.includes('yuki');
    const hasChloe = !!state.lovers?.includes('chloe');
    const hasPet = !!state.pet?.adopted;
    elHeroSprite.classList.toggle('with-yuki', hasYuki);
    if (elYukiSprite) elYukiSprite.classList.toggle('hidden', !hasYuki);
    if (elChloeSprite) {
      elChloeSprite.classList.toggle('hidden', !hasChloe);
      elChloeSprite.classList.toggle('with-yuki', hasYuki);
    }
    if (elKongiSprite) elKongiSprite.classList.toggle('hidden', !hasPet);
    elQuoteBubble.textContent = state.quote;
    elQuoteBubble.classList.remove('hidden');
    elBattleLog.textContent = state.log;
    elChoicesPanel.className = 'choices-panel grid-2';

    if (intentObj.isDanger) {
      const guardBtn = document.createElement('button');
      guardBtn.className = 'choice-btn row-btn guard-btn';
      guardBtn.style.gridColumn = 'span 2';
      guardBtn.innerHTML = '<span>🛡️ 완벽 가드 & 카운터 (필살기 방어!)</span><span class="choice-sub">피해 -75% · 반격 · 사이다+18</span>';
      guardBtn.addEventListener('click', performGuard);
      elChoicesPanel.appendChild(guardBtn);
    }

    const lawBonus = state.stats.law + state.diceBonus + (rep.mode === 'lawful' ? 2 : 0);

    const skills = [
      {
        title: '🗣️ 팩트폭력',
        sub: enemy.weakness === 'speech' ? '약점 1.45배!' : `언변 ${state.stats.speech} 기반`,
        subClass: enemy.weakness === 'speech' ? 'weak' : '',
        action: () => performAttack('speech'),
      },
      {
        title: '🪞 거울치료',
        sub: enemy.weakness === 'guts' ? '약점 + 광인↑' : '사이다+15 · 광인↑',
        subClass: enemy.weakness === 'guts' ? 'weak' : '',
        action: () => performAttack('guts'),
      },
      {
        title: '⚖️ 법전 들이밀기',
        sub: `🎲 12+ 기절 (+${lawBonus}) · 모범↑`,
        subClass: enemy.weakness === 'law' ? 'weak' : '',
        action: () => performAttack('law'),
      },
      {
        title: '🫧 사이다 필살기',
        sub: state.sp >= 40 ? '사이다 40 · 확정기절!' : `사이다 부족 (${state.sp}/40)`,
        subClass: 'sp',
        disabled: state.sp < 40,
        action: () => performAttack('special'),
      },
    ];

    skills.forEach((sk) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.disabled = !!sk.disabled;
      btn.innerHTML = `<span>${sk.title}</span><span class="choice-sub ${sk.subClass}">${sk.sub}</span>`;
      btn.addEventListener('click', sk.action);
      elChoicesPanel.appendChild(btn);
    });

    // V14.0: 타이밍 채증 셔터 & 합동 필살기
    const snapBtn = document.createElement('button');
    snapBtn.className = 'choice-btn';
    snapBtn.innerHTML = '<span>📸 채증 셔터</span><span class="choice-sub">타이밍 1.8배 · 채증+2</span>';
    snapBtn.addEventListener('click', () => {
      sfx.click();
      startTimingMinigame((isPerfect) => {
        const enemy = getEnemyById(state.currentEnemyId);
        const dmg = isPerfect
          ? Math.round((20 + state.stats.law * 4 + state.bonusDmg) * 1.8)
          : (12 + state.stats.law * 2 + state.bonusDmg);
        state.enemyHp = clamp(state.enemyHp - dmg, 0, state.enemyMaxHp);
        if (isPerfect) {
          state.pendingReports += 2;
          state.sp = clamp(state.sp + 20, 0, state.maxSp);
          state.perfectSnaps = (state.perfectSnaps || 0) + 1;
          state.log = `📸 [PERFECT 채증!!] 결정적 순간 포착! (멘탈 -${dmg} · 채증+2 · 사이다+20)`;
          checkAchievements();
        } else {
          state.pendingReports += 1;
          state.log = `📸 [채증 촬영] 흔들렸지만 증거는 남겼습니다. (멘탈 -${dmg} · 채증+1)`;
        }
        checkStreamMission('snap');
        triggerEnemyHit(dmg, isPerfect);
        if (state.enemyHp <= 0) handleEnemyDefeated(enemy);
        else enemyCounterTurn(enemy, false);
      });
    });
    elChoicesPanel.appendChild(snapBtn);

    const tagBtn = document.createElement('button');
    tagBtn.className = 'choice-btn';
    const tagCost = state.costume === 'couple' ? 35 : 50;
    tagBtn.disabled = state.sp < tagCost;
    const partnerLabel = state.lovers?.includes('yuki') ? '유키' : (state.lovers?.includes('chloe') ? '클로이' : '김순경');
    tagBtn.innerHTML = `<span>🤝 합동 필살기 (${partnerLabel})</span><span class="choice-sub sp">${state.sp >= tagCost ? `사이다 ${tagCost} · 극딜+기절!` : `사이다 부족 (${state.sp}/${tagCost})`}</span>`;
    tagBtn.addEventListener('click', () => performTagSkill());
    elChoicesPanel.appendChild(tagBtn);
    return;
  }

  // 7-1. V17.0 배틀타워 층 클리어 화면
  if (state.phase === 'tower_clear') {
    const floor = state.towerFloor || 1;
    elLocation.textContent = `🏢 서울 빌런 배틀타워 · ${floor}층`;
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
    exitBtn.innerHTML = '<span>🏠 보상 챙기고 서울 지도로 복귀</span><span class="choice-sub">안전 귀환</span>';
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
      btn.innerHTML = `<span>${ch.text}</span><span class="choice-sub">${ch.sub}</span>`;
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

  // 8. 특성 3지선다 뽑기
  if (state.phase === 'draft') {
    const enemy = getEnemyById(state.currentEnemyId);
    elLocation.textContent = `DAY ${state.day} · 참교육 성공!`;
    elSceneTag.textContent = '레벨업';
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = '✨ 새로운 특성을 선택하세요!';
    elWeaknessPill.classList.add('hidden');
    elEnemyHpWrap.classList.add('hidden');
    elQuoteBubble.textContent = enemy.defeatQuote;
    elQuoteBubble.classList.remove('hidden');
    showEnemyVisual(enemy);
    if (elFrame) elFrame.classList.add('combat-stage');
    elHeroSprite.classList.remove('hidden');
    const hasYuki = !!state.lovers?.includes('yuki');
    const hasChloe = !!state.lovers?.includes('chloe');
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

    state.draftOptions.forEach((trait) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span>${trait.name}</span><span class="choice-sub">${trait.desc}</span>`;
      btn.addEventListener('click', () => {
        sfx.powerup();
        vibrate([25, 25, 50]);
        trait.apply(state);
        if (trait.id !== 'first_aid') {
          state.traits.push({ id: trait.id, name: trait.name, desc: trait.desc });
        }
        state.phase = 'map';
        state.log = `[${trait.name}] 특성 습득! (상단 📱 버튼으로 톡 알림/안전신문고를 확인해 보세요)`;
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

  if (state.phase === 'victory') {
    const ending = ENDINGS.find((e) => e.id === state.achievedEndingId) || ENDINGS[ENDINGS.length - 1];
    elLocation.textContent = `DAY ${state.day} · 엔딩 #${ending.num}`;
    elSceneTag.textContent = ending.badge;
    elSceneTag.className = 'scene-tag event';
    elSceneTitle.textContent = ending.title;
    if (ending.image) {
      elSceneImage.src = ending.image;
      elSceneImage.classList.remove('hidden');
    } else {
      showSceneCard(
        `🏆 ENDING ${ending.num}/15 · ${ending.badge}`,
        ending.ascii,
        `총 ${state.day}일차 · 팔로워 ${(state.followers || 120).toLocaleString()}명 · 특성 ${state.traits.length}개`
      );
    }
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
  repCard.innerHTML = `
    <div class="rep-row">
      <span>😇 모범시민: ${state.lawful}</span>
      <span>😈 광인 지수: ${state.chaotic}</span>
    </div>
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
    const cBtn = document.createElement('button');
    cBtn.className = 'use-btn';
    cBtn.style.background = '#9e2a2b';
    cBtn.style.marginLeft = '4px';
    cBtn.textContent = '⚖️즉결재판';
    cBtn.addEventListener('click', () => {
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
      <h4>🏆 엔딩 도감 (${unlockedEndings.length}/15)</h4>
      <p>15가지 멀티 엔딩 달성 조건 힌트와 회상 보기</p>
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

btnWipeSave.addEventListener('click', () => {
  if (confirm('저장된 모든 데이터를 삭제하고 타이틀 화면으로 갈까요?')) {
    localStorage.removeItem(SAVE_KEY);
    elSettingsModal.classList.add('hidden');
    state = createNewGameState();
    state.phase = 'title';
    render();
  }
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
      const card = document.createElement('div');
      card.className = 'inv-item';
      card.innerHTML = `<div class="inv-info"><h4>${item.name}</h4><p>${item.desc}</p></div>`;
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
    const isPerfect = pos >= 38 && pos <= 62;
    onFinish(isPerfect);
  };
  btnTimingTap.addEventListener('click', handleTap);
}

function performTagSkill() {
  const tagCost = state.costume === 'couple' ? 35 : 50;
  if (state.sp < tagCost) return;
  const enemy = getEnemyById(state.currentEnemyId);
  state.sp = clamp(state.sp - tagCost, 0, state.maxSp);
  const hasYuki = state.lovers?.includes('yuki');
  const hasChloe = state.lovers?.includes('chloe');
  const partnerName = hasYuki ? '🇯🇵 유키' : (hasChloe ? '🇺🇸 클로이' : '👮 김순경');
  const dmg = 45 + (state.stats.speech + state.stats.guts + state.stats.law) * 3 + state.bonusDmg;
  state.enemyHp = clamp(state.enemyHp - dmg, 0, state.enemyMaxHp);
  state.enemyStunned = true;
  state.quote = hasYuki
    ? '"다이스키! 우리 같이 혼내주자!"'
    : (hasChloe ? '"Let\'s crush this villain together!"' : '"시민영웅님, 지원 사격 들어갑니다!"');
  state.log = `🤝 [${partnerName} 합동 필살기!!] 완벽한 호흡으로 빌런을 제압했습니다! (멘탈 -${dmg} · 확정 기절!)`;
  playHeroAnim('attack');
  triggerEnemyHit(dmg, true);
  if (state.enemyHp <= 0) handleEnemyDefeated(enemy);
  else enemyCounterTurn(enemy, false);
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

      const dBtn = document.createElement('button');
      dBtn.className = 'use-btn';
      dBtn.style.background = '#9e2a2b';
      dBtn.textContent = '삭제';
      dBtn.addEventListener('click', () => {
        sfx.click();
        deleteSlot(idx);
        openSaveModal(allowSave);
      });
      btnGroup.appendChild(dBtn);
    }

    card.appendChild(btnGroup);
    elSaveSlotsList.appendChild(card);
  });
  elSaveModal.classList.remove('hidden');
}

function openEndingsModal() {
  const unlocked = loadUnlockedEndings();
  elEndingsModalTitle.textContent = `🏆 엔딩 도감 (${unlocked.length}/15)`;
  elEndingsList.innerHTML = '';
  const sorted = [...ENDINGS].sort((a, b) => a.num - b.num);
  sorted.forEach((end) => {
    const isOpen = unlocked.includes(end.id);
    const card = document.createElement('div');
    card.className = `ending-card${isOpen ? '' : ' locked'}`;
    card.innerHTML = isOpen
      ? `<span class="ending-badge">#${end.num} ${end.badge}</span><h4>${end.title}</h4><p>${end.story}</p>`
      : `<span class="ending-badge">#${end.num} 미해금</span><h4>🔒 ??? (엔딩 ${end.num})</h4><p>💡 힌트: ${end.hint}</p>`;
    elEndingsList.appendChild(card);
  });
  elEndingsModal.classList.remove('hidden');
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
    card.innerHTML = `<div class="inv-info"><h4>${act.name}</h4><p>${act.desc}</p></div>`;

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
  if (act.isPatrol) state.patrolCount = (state.patrolCount || 0) + 1;
  if (cat && cat.id) state.mapLoc = cat.id;
  if (cat && cat.image) {
    state.lastCutscene = { image: cat.image, animClass: cat.animClass || '' };
  }

  if (act.battleZone) {
    state.lastCutscene = null;
    sfx.click();
    if (Math.random() < 0.25) {
      triggerRandomEvent();
      return;
    }
    const pool = VILLAINS.filter((v) => v.zone === act.battleZone);
    const picked = pool[Math.floor(Math.random() * pool.length)] || VILLAINS[0];
    startBattle(picked.id);
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
    state.timeIndex = 0;
    state.day += 1;
    state.log = act.msg;
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
    const ambushPool = VILLAINS;
    const picked = ambushPool[Math.floor(Math.random() * ambushPool.length)];
    state.log = `🚨 [서울 민폐도 비상!] 거리가 난장판이 되어 [${picked.name}]이(가) 기습했습니다!`;
    startBattle(picked.id);
    return;
  }

  if (Math.random() < 0.30) {
    triggerMiniEvent();
    return;
  }

  saveGame();
  render();
}

render();
