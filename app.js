'use strict';

// ===== 多言語対応 =====
let currentLanguage = 'en'; // デフォルトは英語

const i18n = {
  en: {
    appSubtitle: 'Turn off all the switches',
    play: 'PLAY',
    howToPlay: 'How to Play',
    settings: 'Settings',
    cleared: 'Cleared',
    stages: 'Stages',
    stageSelect: 'Stage Select',
    stage: 'STAGE',
    moves: 'Moves',
    remaining: 'Left',
    hint: 'Hint',
    reset: 'Reset',
    clear: 'CLEAR!',
    nextStage: 'Next Stage',
    minMoves: 'Best',
    movesGoal: 'Moves Goal',
    
    // 遊び方
    howtoGoal: 'Goal',
    howtoGoalText: 'Turn all switches <strong>OFF (dark state)</strong>!',
    howtoRule: 'Rule',
    howtoRuleText: 'Tap a switch to flip it and its <strong>adjacent switches (up, down, left, right)</strong>.',
    howtoDemoHint: '↑ Tap the center',
    howtoStages: 'Stages',
    howtoStagesText: '<strong>100 stages</strong> in total. The larger the grid, the harder it gets.',
    
    // ヒント
    hintDialogText: 'Light up the next move.<br>Is that OK?',
    hintDialogNote: '※ An ad will be displayed',
    hintDialogCancel: 'Cancel',
    hintDialogOk: 'OK',
    hintDescRemaining: 'With this hint, you can clear in {n} more move(s).',
    hintDescFinal: 'With this hint, you can clear in the next move.',
    
    // 設定
    settingsTitle: 'Settings',
    settingsLanguage: 'Language',
    settingsLanguageDesc: 'Change app language',
    languageEn: 'English',
    languageJa: '日本語',
    back: 'Back'
  },
  ja: {
    appSubtitle: 'すべてのスイッチを消せ',
    play: 'PLAY',
    howToPlay: '遊び方',
    settings: '設定',
    cleared: 'クリア',
    stages: 'ステージ',
    stageSelect: 'ステージ選択',
    stage: 'STAGE',
    moves: '手数',
    remaining: '残り',
    hint: 'ヒント',
    reset: 'リセット',
    clear: 'CLEAR!',
    nextStage: '次のステージ',
    minMoves: '最短',
    movesGoal: '手数基準',
    
    // 遊び方
    howtoGoal: '目標',
    howtoGoalText: 'すべてのスイッチを<strong>OFF（暗い状態）</strong>にしよう！',
    howtoRule: 'ルール',
    howtoRuleText: 'スイッチをタップすると、そのスイッチと<strong>上下左右のスイッチが反転</strong>します。',
    howtoDemoHint: '↑ 真ん中をタップしてみよう',
    howtoStages: 'ステージ',
    howtoStagesText: '全<strong>100ステージ</strong>。グリッドサイズが変わるほど難しくなります。',
    
    // ヒント
    hintDialogText: '次の1手を光らせます。<br>よろしいですか？',
    hintDialogNote: '※広告が表示されます',
    hintDialogCancel: 'キャンセル',
    hintDialogOk: 'OK',
    hintDescRemaining: 'ヒントを使うとあと{n}手で<br>クリアできます。',
    hintDescFinal: 'ヒントを使うと次の1手で<br>クリアできます。',
    
    // 設定
    settingsTitle: '設定',
    settingsLanguage: '言語',
    settingsLanguageDesc: 'アプリの表示言語を変更',
    languageEn: 'English',
    languageJa: '日本語',
    back: '戻る'
  }
};

function t(key) {
  return i18n[currentLanguage][key] || key;
}

function loadLanguage() {
  const saved = localStorage.getItem('togglen_language');
  if (saved) {
    currentLanguage = saved;
  } else {
    // 端末の言語を判定（日本語ならja、それ以外はen）
    const deviceLang = navigator.language || navigator.userLanguage;
    currentLanguage = deviceLang.startsWith('ja') ? 'ja' : 'en';
  }
}

function saveLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('togglen_language', lang);
  updateUILanguage();
  updateLanguageButtons();
}

function updateLanguageButtons() {
  const buttons = document.querySelectorAll('.language-btn');
  buttons.forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    if (btnLang === currentLanguage) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function updateUILanguage() {
  // ホーム画面
  document.querySelector('.app-subtitle').textContent = t('appSubtitle');
  const homeButtons = document.querySelectorAll('#screen-home .btn-primary span, #screen-home .btn-secondary');
  if (homeButtons[0]) homeButtons[0].textContent = t('play');
  if (homeButtons[1]) homeButtons[1].textContent = t('howToPlay');
  if (homeButtons[2]) homeButtons[2].textContent = t('settings');
  
  const statLabels = document.querySelectorAll('.stat-label');
  if (statLabels[0]) statLabels[0].textContent = t('cleared');
  if (statLabels[1]) statLabels[1].textContent = t('stages');
  
  // ステージ選択
  const screenTitles = document.querySelectorAll('.screen-title');
  if (screenTitles[0]) screenTitles[0].textContent = t('stageSelect');
  
  // ゲーム画面
  const infoLabels = document.querySelectorAll('.info-label');
  if (infoLabels[0]) infoLabels[0].textContent = t('moves');
  if (infoLabels[1]) infoLabels[1].textContent = t('remaining');
  
  const btnHint = document.querySelector('.btn-hint');
  if (btnHint) btnHint.textContent = t('hint');
  
  // ヒントダイアログ
  const dialogText = document.querySelector('.dialog-text');
  if (dialogText) dialogText.innerHTML = t('hintDialogText');
  
  const dialogNote = document.querySelector('.dialog-note');
  if (dialogNote) dialogNote.textContent = t('hintDialogNote');
  
  const dialogButtons = document.querySelectorAll('.dialog-btn-cancel, .dialog-btn-ok');
  if (dialogButtons[0]) dialogButtons[0].textContent = t('hintDialogCancel');
  if (dialogButtons[1]) dialogButtons[1].textContent = t('hintDialogOk');
  
  // クリア画面
  const clearTitle = document.querySelector('.clear-title');
  if (clearTitle) clearTitle.textContent = t('clear');
  
  const btnNextSpan = document.querySelector('#btn-next-stage span');
  if (btnNextSpan) btnNextSpan.textContent = t('nextStage');
  
  const clearStatLabels = document.querySelectorAll('.clear-stat-label');
  if (clearStatLabels[0]) clearStatLabels[0].textContent = t('moves');
  if (clearStatLabels[1]) clearStatLabels[1].textContent = t('minMoves');
  
  const clearBtnSecondary = document.querySelector('#screen-clear .btn-secondary');
  if (clearBtnSecondary) clearBtnSecondary.textContent = t('stageSelect');
  
  // 遊び方
  if (screenTitles[1]) screenTitles[1].textContent = t('howToPlay');
  
  const howtoSections = document.querySelectorAll('.howto-section');
  if (howtoSections[0]) {
    howtoSections[0].querySelector('h3').textContent = t('howtoGoal');
    howtoSections[0].querySelector('p').innerHTML = t('howtoGoalText');
  }
  if (howtoSections[1]) {
    howtoSections[1].querySelector('h3').textContent = t('howtoRule');
    howtoSections[1].querySelector('p').innerHTML = t('howtoRuleText');
  }
  if (howtoSections[2]) {
    howtoSections[2].querySelector('h3').textContent = t('howtoStages');
    howtoSections[2].querySelector('p').innerHTML = t('howtoStagesText');
  }
  
  const demoHint = document.querySelector('.demo-hint');
  if (demoHint) demoHint.textContent = t('howtoDemoHint');
  
  // 設定画面
  if (screenTitles[2]) screenTitles[2].textContent = t('settingsTitle');
  
  const settingLabel = document.querySelector('.setting-label');
  if (settingLabel) settingLabel.textContent = t('settingsLanguage');
  
  const settingDesc = document.querySelector('.setting-desc');
  if (settingDesc) settingDesc.textContent = t('settingsLanguageDesc');
  
  // ステージラベルと星基準も更新
  if (currentStage !== null && currentStage !== undefined) {
    const gameStageLabel = document.getElementById('game-stage-label');
    if (gameStageLabel) gameStageLabel.textContent = `${t('stage')} ${currentStage + 1}`;
    
    const clearStageLabel = document.getElementById('clear-stage-label');
    if (clearStageLabel) clearStageLabel.textContent = `${t('stage')} ${currentStage + 1}`;
    
    // 星基準の更新
    const stage = STAGES[currentStage];
    const m = stage.minMoves;
    const criteriaEl = document.getElementById('game-criteria');
    if (criteriaEl) {
      criteriaEl.innerHTML =
        `<span class="cr-label">${t('movesGoal')}</span><span class="cr-gold">★★★${m}</span><span class="cr-sep">/</span><span class="cr-silver">★★${Math.ceil(m * 1.5)}</span><span class="cr-sep">/</span><span class="cr-bronze">★${m * 2}</span>`;
    }
  }
  
  // ヒント説明の更新
  updateHintDescription();
}

function updateHintDescription() {
  const stage = STAGES[currentStage];
  if (!stage) return;
  
  const remaining = stage.minMoves - hintStep - 1;
  const descEl = document.getElementById('hint-desc');
  if (descEl) {
    if (remaining > 0) {
      descEl.innerHTML = t('hintDescRemaining').replace('{n}', remaining);
    } else {
      descEl.innerHTML = t('hintDescFinal');
    }
  }
}

// ===== ステージデータ =====
const STAGES = generateAllStages();

function generateAllStages() {
  const configs = [
    // ステージ1-10: 3×3（易しい）
    { size: 3 }, { size: 3 }, { size: 3 }, { size: 3 }, { size: 3 },
    { size: 3 }, { size: 3 }, { size: 3 }, { size: 3 }, { size: 3 },
    // ステージ11-30: 4×4（普通）
    { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 },
    { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 },
    { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 },
    { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 },
    // ステージ31-60: 4×4（難しめ）
    { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 },
    { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 },
    { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 },
    { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 },
    { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 },
    { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 }, { size: 4 },
    // ステージ61-85: 5×5（普通）
    { size: 5 }, { size: 5 }, { size: 5 }, { size: 5 }, { size: 5 },
    { size: 5 }, { size: 5 }, { size: 5 }, { size: 5 }, { size: 5 },
    { size: 5 }, { size: 5 }, { size: 5 }, { size: 5 }, { size: 5 },
    { size: 5 }, { size: 5 }, { size: 5 }, { size: 5 }, { size: 5 },
    { size: 5 }, { size: 5 }, { size: 5 }, { size: 5 }, { size: 5 },
    // ステージ86-100: 5×5（難しめ）
    { size: 5 }, { size: 5 }, { size: 5 }, { size: 5 }, { size: 5 },
    { size: 5 }, { size: 5 }, { size: 5 }, { size: 5 }, { size: 5 },
    { size: 5 }, { size: 5 }, { size: 5 }, { size: 5 }, { size: 5 },
  ];

  const tapCounts = [
    // 3×3 易しい (1-10): 3〜7手
    3, 3, 4, 4, 5, 5, 6, 6, 7, 7,
    // 4×4 普通 (11-30): 4〜9手
    4, 4, 5, 5, 5, 6, 6, 6, 7, 7,
    7, 8, 8, 8, 9, 9, 9, 9, 9, 9,
    // 4×4 難しめ (31-60): 10〜14手
    10, 10, 10, 11, 11, 11, 11, 12, 12, 12,
    12, 12, 13, 13, 13, 13, 13, 14, 14, 14,
    14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
    // 5×5 普通 (61-85): 6〜12手
    6, 6, 7, 7, 7, 8, 8, 8, 9, 9,
    9, 10, 10, 10, 11, 11, 11, 12, 12, 12,
    12, 12, 12, 12, 12,
    // 5×5 難しめ (86-100): 13〜20手
    13, 13, 14, 14, 15, 15, 16, 16, 17, 17,
    18, 18, 19, 19, 20,
  ];

  const seeds = [
    // 1-10
    42, 137, 256, 1789, 314, 512, 77, 199, 333, 421,
    // 11-20
    88, 600, 711, 822, 933, 144, 255, 366, 477, 588,
    // 21-30
    699, 810, 921, 132, 243, 354, 465, 576, 999, 798,
    // 31-40
    909, 120, 231, 342, 453, 564, 675, 786, 897, 108,
    // 41-50
    2345, 330, 441, 552, 663, 774, 885, 996, 107, 3456,
    // 51-60
    4567, 440, 551, 662, 773, 884, 995, 106, 217, 328,
    // 61-70
    439, 550, 661, 772, 883, 994, 105, 216, 327, 438,
    // 71-80
    549, 660, 771, 882, 993, 104, 215, 326, 437, 548,
    // 81-90
    659, 770, 881, 992, 103, 214, 325, 436, 547, 658,
    // 91-100
    769, 880, 991, 102, 213, 324, 435, 546, 657, 768,
  ];

  return configs.map((cfg, i) => {
    const { state, solution } = generateStage(cfg.size, tapCounts[i], seeds[i]);
    return { size: cfg.size, state, solution, minMoves: tapCounts[i] };
  });
}

function seededRandom(seed) {
  let s = seed >>> 0;
  return function() {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s = s >>> 0;
    return s / 0x100000000;
  };
}

function generateStage(size, taps, seed) {
  const n = size * size;
  const state = new Array(n).fill(0);
  const rand = seededRandom(seed);
  const solution = [];

  const used = new Set();
  let count = 0;
  let safety = 0;

  while (count < taps && safety < 10000) {
    safety++;
    const idx = Math.floor(rand() * n);
    if (used.has(idx)) continue;
    used.add(idx);
    applyToggle(state, size, idx);
    solution.push(idx);
    count++;
  }

  if (state.every(v => v === 0)) {
    for (let i = 0; i < n; i++) {
      if (!used.has(i)) {
        applyToggle(state, size, i);
        solution.push(i);
        break;
      }
    }
  }

  return { state, solution };
}

function applyToggle(state, size, idx) {
  const row = Math.floor(idx / size);
  const col = idx % size;
  const neighbors = [
    [row, col],
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ];
  neighbors.forEach(([r, c]) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      const i = r * size + c;
      state[i] = state[i] === 1 ? 0 : 1;
    }
  });
}

// ===== ゲーム状態 =====
let currentStage = 0;
let currentState = [];
let moveCount = 0;
let clearedStages = new Set();
let bestScores = {};
let consecutiveClear = 0;

// ===== 初期化 =====
function init() {
  loadLanguage();
  loadProgress();
  updateHomeStats();
  buildStageGrid();
  buildDemoGrid();
  updateUILanguage();
  updateLanguageButtons();
}

function loadProgress() {
  try {
    const saved = localStorage.getItem('togglen_cleared');
    if (saved) {
      clearedStages = new Set(JSON.parse(saved));
    }
    const savedBest = localStorage.getItem('togglen_best');
    if (savedBest) {
      bestScores = JSON.parse(savedBest);
    }
  } catch (e) {}
}

function saveProgress() {
  try {
    localStorage.setItem('togglen_cleared', JSON.stringify([...clearedStages]));
    localStorage.setItem('togglen_best', JSON.stringify(bestScores));
  } catch (e) {}
}

function updateHomeStats() {
  const el = document.getElementById('stat-cleared');
  if (el) el.textContent = clearedStages.size;
}

// ===== 画面遷移 =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    requestAnimationFrame(() => {
      target.classList.add('active');
    });
  }
}

function showHome() {
  consecutiveClear = 0;
  updateHomeStats();
  showScreen('screen-home');
}

function showStageSelect() {
  consecutiveClear = 0;
  buildStageGrid();
  showScreen('screen-stage');
}

function showHowTo() {
  demoState = [0, 1, 0, 1, 1, 1, 0, 1, 0];
  buildDemoGrid();
  showScreen('screen-howto');
}

function showSettings() {
  updateLanguageButtons();
  showScreen('screen-settings');
}

// ===== 星評価計算 =====
function calcStars(moves, minMoves) {
  if (moves <= minMoves) return 3;
  if (moves <= Math.ceil(minMoves * 1.5)) return 2;
  if (moves <= minMoves * 2) return 1;
  return 0;
}

function starsLabel(stars) {
  if (stars === 3) return '★★★';
  if (stars === 2) return '★★';
  if (stars === 1) return '★';
  return '';
}

// ===== ステージ選択グリッド =====
function buildStageGrid() {
  const grid = document.getElementById('stage-grid');
  if (!grid) return;
  grid.innerHTML = '';

  STAGES.forEach((stage, i) => {
    const cell = document.createElement('div');
    cell.className = 'stage-cell';
    if (clearedStages.has(i)) cell.classList.add('cleared');

    const best = bestScores[i];
    const starStr = best ? starsLabel(best.stars) : '';
    const starClass = best ? `stage-star stars-${best.stars}` : '';

    cell.innerHTML = `
      <span class="stage-num">${i + 1}</span>
      <span class="stage-size">${stage.size}×${stage.size}</span>
      ${starStr ? `<span class="${starClass}">${starStr}</span>` : ''}
    `;
    cell.addEventListener('click', () => startStage(i));
    grid.appendChild(cell);
  });
}

// ===== ゲーム開始 =====
function startStage(stageIndex) {
  currentStage = stageIndex;
  const stage = STAGES[stageIndex];
  currentState = [...stage.state];
  moveCount = 0;
  hintStep = 0;

  document.getElementById('game-stage-label').textContent = `${t('stage')} ${stageIndex + 1}`;
  document.getElementById('move-count').textContent = '0';

  const m = stage.minMoves;
  const criteriaEl = document.getElementById('game-criteria');
  if (criteriaEl) {
    criteriaEl.innerHTML =
      `<span class="cr-label">${t('movesGoal')}</span><span class="cr-gold">★★★${m}</span><span class="cr-sep">/</span><span class="cr-silver">★★${Math.ceil(m * 1.5)}</span><span class="cr-sep">/</span><span class="cr-bronze">★${m * 2}</span>`;
  }

  buildBoard(stage.size);
  updateBoard();
  updateGameInfo();

  showScreen('screen-game');
}

function calcBoardMaxSize() {
  return Math.min(
    Math.min(window.innerWidth, 430) - 80,
    window.innerHeight * 0.50
  );
}

function buildBoard(size) {
  const board = document.getElementById('toggle-board');
  if (!board) return;

  const gap = 10;
  const maxSize = calcBoardMaxSize();
  const cellSize = Math.floor((maxSize - gap * (size - 1)) / size);

  board.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
  board.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`;
  board.style.gap = `${gap}px`;
  board.innerHTML = '';

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement('div');
    cell.className = 'toggle-cell off';
    cell.style.width = `${cellSize}px`;
    cell.style.height = `${cellSize}px`;

    const icon = document.createElement('div');
    icon.className = 'cell-switch';
    cell.appendChild(icon);

    cell.addEventListener('click', () => onCellTap(i));
    board.appendChild(cell);
  }
}

function onCellTap(idx) {
  const stage = STAGES[currentStage];
  applyToggle(currentState, stage.size, idx);
  moveCount++;

  const cells = document.querySelectorAll('.toggle-cell');

  stopHintBlink();

  const row = Math.floor(idx / stage.size);
  const col = idx % stage.size;
  const affected = [
    [row, col],
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ];
  affected.forEach(([r, c]) => {
    if (r >= 0 && r < stage.size && c >= 0 && c < stage.size) {
      const i = r * stage.size + c;
      cells[i].classList.remove('flash');
      void cells[i].offsetWidth;
      cells[i].classList.add('flash');
    }
  });

  updateBoard();
  updateGameInfo();

  if (currentState.every(v => v === 0)) {
    setTimeout(() => showClear(), 300);
  }
}

function updateBoard() {
  const cells = document.querySelectorAll('.toggle-cell');
  currentState.forEach((val, i) => {
    const cell = cells[i];
    if (!cell) return;
    if (val === 1) {
      cell.classList.add('on');
      cell.classList.remove('off');
    } else {
      cell.classList.add('off');
      cell.classList.remove('on');
    }
  });
}

function updateGameInfo() {
  const onCount = currentState.filter(v => v === 1).length;
  const total = currentState.length;

  document.getElementById('move-count').textContent = moveCount;
  document.getElementById('on-count').textContent = onCount;

  const progress = total > 0 ? ((total - onCount) / total) * 100 : 0;
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = `${progress}%`;
}

function resetStage() {
  stopHintBlink();
  startStage(currentStage);
}

// ===== ヒント点滅管理 =====
let hintBlinkInterval = null;
let hintBlinkCell = null;
let hintStep = 0;

function startHintBlink(cell) {
  stopHintBlink();
  hintBlinkCell = cell;
  cell.classList.add('hint');
  let on = true;
  hintBlinkInterval = setInterval(() => {
    if (!hintBlinkCell) return;
    on = !on;
    if (on) {
      hintBlinkCell.classList.add('hint-on');
    } else {
      hintBlinkCell.classList.remove('hint-on');
    }
  }, 300);
}

function stopHintBlink() {
  if (hintBlinkInterval) {
    clearInterval(hintBlinkInterval);
    hintBlinkInterval = null;
  }
  if (hintBlinkCell) {
    hintBlinkCell.classList.remove('hint', 'hint-on');
    hintBlinkCell = null;
  }
}

// ===== ヒント =====
function requestHint() {
  const dialog = document.getElementById('hint-dialog');
  if (!dialog) return;

  updateHintDescription();
  dialog.classList.add('active');
}

function closeHintDialog() {
  const dialog = document.getElementById('hint-dialog');
  if (dialog) dialog.classList.remove('active');
}

function confirmHint() {
  closeHintDialog();
  showRewardedAd(() => { applyHint(); });
}

function applyHint() {
  const stage = STAGES[currentStage];
  const solution = stage.solution;

  if (hintStep >= solution.length) return;

  currentState = [...stage.state];
  for (let i = 0; i < hintStep; i++) {
    applyToggle(currentState, stage.size, solution[i]);
  }
  moveCount = hintStep;
  updateBoard();
  updateGameInfo();

  const hintIdx = solution[hintStep];
  const cells = document.querySelectorAll('.toggle-cell');
  const cell = cells[hintIdx];
  if (cell) {
    startHintBlink(cell);
  }

  hintStep++;
}

function showClear() {
  const stage = STAGES[currentStage];
  const stars = calcStars(moveCount, stage.minMoves);

  const prev = bestScores[currentStage];
  if (!prev || stars > prev.stars || (stars === prev.stars && moveCount < prev.moves)) {
    bestScores[currentStage] = { moves: moveCount, stars };
  }

  clearedStages.add(currentStage);
  saveProgress();

  consecutiveClear++;
  if (consecutiveClear % 5 === 0) {
    showInterstitialAd();
  }

  document.getElementById('clear-stage-label').textContent = `${t('stage')} ${currentStage + 1}`;
  document.getElementById('clear-moves').textContent = moveCount;
  document.getElementById('clear-min-moves').textContent = stage.minMoves;

  const starsEl = document.getElementById('clear-stars');
  if (starsEl) {
    starsEl.textContent = stars === 3 ? '★★★' : stars === 2 ? '★★' : stars === 1 ? '★' : '';
    starsEl.className = 'clear-stars stars-' + stars;
  }

  const btnNext = document.getElementById('btn-next-stage');
  if (btnNext) {
    btnNext.style.display = currentStage < STAGES.length - 1 ? 'flex' : 'none';
  }

  showScreen('screen-clear');
}

function nextStage() {
  if (currentStage < STAGES.length - 1) {
    startStage(currentStage + 1);
  }
}

// ===== 遊び方デモ =====
let demoState = [0, 1, 0, 1, 1, 1, 0, 1, 0];

function buildDemoGrid() {
  const grid = document.getElementById('demo-grid');
  if (!grid) return;
  grid.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'demo-cell ' + (demoState[i] === 1 ? 'on' : 'off');
    const sw = document.createElement('div');
    sw.className = 'cell-switch';
    cell.appendChild(sw);
    cell.addEventListener('click', () => onDemoTap(i));
    grid.appendChild(cell);
  }
}

function onDemoTap(idx) {
  applyToggle(demoState, 3, idx);
  const cells = document.querySelectorAll('.demo-cell');
  demoState.forEach((val, i) => {
    cells[i].className = 'demo-cell ' + (val === 1 ? 'on' : 'off');
    if (!cells[i].querySelector('.cell-switch')) {
      const sw = document.createElement('div');
      sw.className = 'cell-switch';
      cells[i].appendChild(sw);
    }
  });
}

// ===== AdMob =====
const ADMOB_INTERSTITIAL_ID = 'ca-app-pub-8707369701475326/5795483275';
const ADMOB_REWARD_ID       = 'ca-app-pub-8707369701475326/5320615215';

async function initAdMob() {
  try {
    const { AdMob } = Capacitor.Plugins;
    if (!AdMob) return;
    await AdMob.initialize({ requestTrackingAuthorization: false });
  } catch (e) {}
}

async function showInterstitialAd() {
  try {
    const { AdMob } = Capacitor.Plugins;
    if (!AdMob) return;
    await AdMob.prepareInterstitial({ adId: ADMOB_INTERSTITIAL_ID });
    await AdMob.showInterstitial();
  } catch (e) {}
}

async function showRewardedAd(onRewarded) {
  try {
    const { AdMob } = Capacitor.Plugins;
    if (!AdMob) {
      onRewarded();
      return;
    }
    await AdMob.prepareRewardVideoAd({ adId: ADMOB_REWARD_ID });
    const rewardItem = await AdMob.showRewardVideoAd();
    if (rewardItem) {
      onRewarded();
    }
  } catch (e) {
    onRewarded();
  }
}

// ===== 起動 =====
document.addEventListener('DOMContentLoaded', () => {
  init();
  initAdMob();
});
