'use strict';

// ===== ステージデータ =====
// 各ステージ: { size: グリッドサイズ, state: ON=1/OFF=0 の配列 }
// stateはランダム生成済み（解が存在することを保証）

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

  // 手数ベースでステージを生成（全OFF状態からランダムにタップして初期状態を作る）
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

  // 固定シードで再現性のある乱数（100個）
  const seeds = [
    // 1-10
    42, 137, 256, 89, 314, 512, 77, 199, 333, 421,
    // 11-20
    88, 600, 711, 822, 933, 144, 255, 366, 477, 588,
    // 21-30
    699, 810, 921, 132, 243, 354, 465, 576, 999, 798,
    // 31-40
    909, 120, 231, 342, 453, 564, 675, 786, 897, 108,
    // 41-50
    219, 330, 441, 552, 663, 774, 885, 996, 107, 218,
    // 51-60
    329, 440, 551, 662, 773, 884, 995, 106, 217, 328,
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
  let s = seed >>> 0; // 符号なし32bit整数に正規化
  return function() {
    // xorshift32: 範囲外にならない安定した疑似乱数
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s = s >>> 0; // 符号なし32bit
    return s / 0x100000000; // [0, 1) に正規化（絶対に1.0にならない）
  };
}

function generateStage(size, taps, seed) {
  const n = size * size;
  const state = new Array(n).fill(0);
  const rand = seededRandom(seed);
  const solution = []; // 解のタップ列（生成時と逆順にタップすれば全OFFに戻る）

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

  // すべてOFFになってしまった場合は別のセルを追加
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
// ベストスコア: { stageIndex: { moves, stars } }
let bestScores = {};
// 連続クリア数（インタースティシャル広告用）
let consecutiveClear = 0;

// ===== 初期化 =====
function init() {
  loadProgress();
  updateHomeStats();
  buildStageGrid();
  buildDemoGrid();
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
    // 少し遅延してアニメーション
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
  // デモを初期状態にリセットしてから表示
  demoState = [0, 1, 0, 1, 1, 1, 0, 1, 0];
  buildDemoGrid();
  showScreen('screen-howto');
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

  document.getElementById('game-stage-label').textContent = `STAGE ${stageIndex + 1}`;
  document.getElementById('move-count').textContent = '0';

  // 星基準表示
  const m = stage.minMoves;
  const criteriaEl = document.getElementById('game-criteria');
  if (criteriaEl) {
    criteriaEl.innerHTML =
      `<span class="cr-label">手数基準</span><span class="cr-gold">★★★${m}</span><span class="cr-sep">/</span><span class="cr-silver">★★${Math.ceil(m * 1.5)}</span><span class="cr-sep">/</span><span class="cr-bronze">★${m * 2}</span>`;
  }

  buildBoard(stage.size);
  updateBoard();
  updateGameInfo();

  showScreen('screen-game');
}

// ボードサイズ計算
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

  // セル一覧取得（ヒント点滅停止 + フラッシュアニメーションで共用）
  const cells = document.querySelectorAll('.toggle-cell');

  // どのセルをタップしても点滅を止める
  stopHintBlink();

  // フラッシュアニメーション
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
      void cells[i].offsetWidth; // reflow
      cells[i].classList.add('flash');
    }
  });

  updateBoard();
  updateGameInfo();

  // クリア判定
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
let hintStep = 0; // 何手目まで案内済みか

function requestHint() {
  const dialog = document.getElementById('hint-dialog');
  if (!dialog) return;

  const stage = STAGES[currentStage];
  const remaining = stage.minMoves - hintStep - 1;

  const descEl = document.getElementById('hint-desc');
  if (descEl) {
    if (remaining > 0) {
      descEl.innerHTML = `ヒントを使うとあと${remaining}手で<br>クリアできます。`;
    } else {
      descEl.innerHTML = `ヒントを使うと次の1手で<br>クリアできます。`;
    }
  }

  dialog.classList.add('active');
}

function closeHintDialog() {
  const dialog = document.getElementById('hint-dialog');
  if (dialog) dialog.classList.remove('active');
}

function confirmHint() {
  closeHintDialog();
  // リワード広告を見てからヒントを実行（広告が閉じた後に点滅開始）
  showRewardedAd(() => { applyHint(); });
}

function applyHint() {
  const stage = STAGES[currentStage];
  const solution = stage.solution;

  // 全ステップ案内済みなら何もしない
  if (hintStep >= solution.length) return;

  // 初期状態から hintStep 手分だけ再現
  currentState = [...stage.state];
  for (let i = 0; i < hintStep; i++) {
    applyToggle(currentState, stage.size, solution[i]);
  }
  moveCount = hintStep;
  updateBoard();
  updateGameInfo();

  // 次の1手を光らせる（タップするか次の操作まで点滅し続ける）
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

  // ベストスコア更新
  const prev = bestScores[currentStage];
  if (!prev || stars > prev.stars || (stars === prev.stars && moveCount < prev.moves)) {
    bestScores[currentStage] = { moves: moveCount, stars };
  }

  clearedStages.add(currentStage);
  saveProgress();

  // 連続クリアカウント
  consecutiveClear++;
  if (consecutiveClear % 5 === 0) {
    // インタースティシャル広告
    showInterstitialAd();
  }

  document.getElementById('clear-stage-label').textContent = `STAGE ${currentStage + 1}`;
  document.getElementById('clear-moves').textContent = moveCount;
  document.getElementById('clear-min-moves').textContent = stage.minMoves;

  // 星表示
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
let demoState = [0, 1, 0, 1, 1, 1, 0, 1, 0]; // 十字型ON

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
    // スイッチ要素が無ければ追加
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
    // showRewardVideoAd は広告が閉じた後に resolve し、報酬情報を返す
    const rewardItem = await AdMob.showRewardVideoAd();
    if (rewardItem) {
      onRewarded();
    }
  } catch (e) {
    // 広告取得失敗時もヒントは実行する
    onRewarded();
  }
}

// ===== 起動 =====
document.addEventListener('DOMContentLoaded', () => {
  init();
  initAdMob();
});
