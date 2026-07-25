/* ══════════════════════════════════════════════════════════
   CALCULATOR PRO — standalone build
   No external dependencies. Everything below is self-contained.
   ══════════════════════════════════════════════════════════ */

// ── storage helpers ──────────────────────────────────────────
const STORAGE_PREFIX = 'calcpro-';
function save(key, val) {
  try { localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ }
}
function load(key, def = null) {
  try {
    const v = localStorage.getItem(STORAGE_PREFIX + key);
    return v !== null ? JSON.parse(v) : def;
  } catch (e) { return def; }
}

// ── toast ─────────────────────────────────────────────────────
let _toastTimer;
function toast(msg, dur = 2400) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), dur);
}

// ── theme ─────────────────────────────────────────────────────
function toggleTheme() {
  const light = document.documentElement.dataset.theme === 'light';
  document.documentElement.dataset.theme = light ? 'dark' : 'light';
  document.getElementById('theme-btn').textContent = light ? '🌙' : '☀️';
  save('theme', light ? 'dark' : 'light');
}
(function initTheme() {
  if (load('theme', 'dark') === 'light') {
    document.documentElement.dataset.theme = 'light';
    const btn = document.getElementById('theme-btn');
    if (btn) btn.textContent = '☀️';
  }
})();

// ── state ─────────────────────────────────────────────────────
let expr = '';
let ans = 0;
let memory = load('memory', 0) || 0;
let sci = false;
let angleMode = load('angle-mode', 'deg');
let history = load('history', []) || [];

// ── keypad layouts ───────────────────────────────────────────
const STD = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['MC', 'MR', 'MS', '='],
  ['0', '.', 'ANS', '⌫'],
];
const SCI = [
  ['sin', 'cos', 'tan', 'log', 'ln'],
  ['x²', 'x³', '√', '∛', 'xʸ'],
  ['π', '(', ')', '1/x', '!'],
  ['C', '±', '%', '÷', '×'],
  ['7', '8', '9', '−', '+'],
  ['4', '5', '6', '=', '⌫'],
  ['1', '2', '3', '0', '.'],
];
const FN_KEYS = ['C', '±', '%', 'sin', 'cos', 'tan', 'log', 'ln', '√', '∛', 'x²', 'x³', '1/x', '!', 'π', 'e'];
const OP_KEYS = ['÷', '×', '−', '+', 'xʸ'];
const MEM_KEYS = ['MC', 'MR', 'MS'];

function classify(k) {
  if (k === '=') return 'calc-btn-eq';
  if (OP_KEYS.includes(k)) return 'calc-btn-op';
  if (MEM_KEYS.includes(k)) return 'calc-btn-mem';
  if (k === '⌫') return 'calc-btn-del';
  if (FN_KEYS.includes(k)) return 'calc-btn-fn';
  return 'calc-btn-num';
}
function makeBtn(k) {
  const b = document.createElement('button');
  b.textContent = k;
  b.className = 'calc-btn ' + classify(k);
  b.setAttribute('aria-label', k);
  b.addEventListener('click', () => calcInput(k));
  return b;
}
function buildPad() {
  const sp = document.getElementById('calc-std-pad');
  const xp = document.getElementById('calc-sci-pad');
  sp.innerHTML = '';
  xp.innerHTML = '';
  STD.flat().forEach(k => sp.appendChild(makeBtn(k)));
  SCI.flat().forEach(k => xp.appendChild(makeBtn(k)));
}

// ── mode switching ───────────────────────────────────────────
function setMode(m) {
  sci = m === 'sci';
  document.getElementById('calc-std-pad').style.display = sci ? 'none' : 'grid';
  document.getElementById('calc-sci-pad').style.display = sci ? 'grid' : 'none';
  document.getElementById('mode-std').classList.toggle('mode-btn-active', !sci);
  document.getElementById('mode-std').setAttribute('aria-selected', String(!sci));
  document.getElementById('mode-sci').classList.toggle('mode-btn-active', sci);
  document.getElementById('mode-sci').setAttribute('aria-selected', String(sci));
  document.getElementById('calc-mode-label').textContent = sci ? 'SCIENTIFIC MODE' : 'STANDARD MODE';
  document.querySelector('.calc-screen').classList.toggle('sci-mode', sci);
  save('mode', m);
}
function toggleAngleMode() {
  angleMode = angleMode === 'deg' ? 'rad' : 'deg';
  document.getElementById('angle-toggle').textContent = angleMode.toUpperCase();
  save('angle-mode', angleMode);
  livePreview();
}

// ── display helpers ──────────────────────────────────────────
function updateDisplay() {
  document.getElementById('calc-disp').textContent = expr === '' ? '0' : expr;
}
function livePreview() {
  const h = document.getElementById('calc-hist');
  if (!expr || /[×÷−+(.]$/.test(expr) || /[a-zA-Z]$/.test(expr)) { h.textContent = ''; return; }
  try {
    h.textContent = '= ' + formatResult(evaluateExpr(expr));
  } catch (e) { h.textContent = ''; }
}
function flashDisplay() {
  const d = document.getElementById('calc-disp');
  d.classList.add('flash');
  setTimeout(() => d.classList.remove('flash'), 500);
}

// ── math engine ──────────────────────────────────────────────
function evaluateExpr(str) {
  if (!str || !str.trim()) return 0;
  let raw = str.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\^/g, '**');
  const opens = (raw.match(/\(/g) || []).length - (raw.match(/\)/g) || []).length;
  if (opens > 0) raw += ')'.repeat(opens);

  const toRad = x => (angleMode === 'deg' ? (x * Math.PI) / 180 : x);
  const sin = x => Math.sin(toRad(x));
  const cos = x => Math.cos(toRad(x));
  const tan = x => Math.tan(toRad(x));
  const log = x => Math.log10(x);
  const ln = x => Math.log(x);
  const sqrt = x => Math.sqrt(x);
  const cbrt = x => Math.cbrt(x);

  const fn = new Function('sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'cbrt', '"use strict";return(' + raw + ')');
  const result = fn(sin, cos, tan, log, ln, sqrt, cbrt);
  if (typeof result !== 'number' || Number.isNaN(result)) throw new Error('Invalid expression');
  return result;
}
function formatResult(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) return 'Error';
  if (!isFinite(n)) return n > 0 ? '∞' : '-∞';
  if (n === 0) return '0';
  return String(parseFloat(n.toPrecision(12)));
}

// ── input handling ───────────────────────────────────────────
function appendDigit(d) {
  expr += d;
  updateDisplay();
  livePreview();
}
function appendDecimal() {
  const seg = expr.split(/[×÷−+()]/).pop();
  expr += seg.includes('.') ? '' : (seg === '' ? '0.' : '.');
  updateDisplay();
  livePreview();
}
function appendOperator(tok) {
  if (expr === '') {
    if (tok === '−') expr = '−';
    updateDisplay();
    return;
  }
  const last = expr.slice(-1);
  if (['÷', '×', '−', '+'].includes(last)) {
    expr = (tok === '−' && last !== '−') ? expr + tok : expr.slice(0, -1) + tok;
  } else if (last === '(') {
    if (tok === '−') expr += tok;
  } else {
    expr += tok;
  }
  updateDisplay();
  livePreview();
}
function insertParen(p) { expr += p; updateDisplay(); livePreview(); }
function insertFn(name) { expr += name + '('; updateDisplay(); livePreview(); }
function insertConst(c) { expr += String(c === 'π' ? Math.PI : Math.E); updateDisplay(); livePreview(); }
function insertPower() { expr += '^'; updateDisplay(); livePreview(); }
function insertAns() { expr += String(ans); updateDisplay(); livePreview(); }
function backspace() { expr = expr.slice(0, -1); updateDisplay(); livePreview(); }
function clearAll() {
  expr = '';
  document.getElementById('calc-hist').textContent = '';
  updateDisplay();
}
function negate() {
  try { expr = formatResult(-evaluateExpr(expr || '0')); updateDisplay(); livePreview(); } catch (e) { /* ignore */ }
}
function percent() {
  try { expr = formatResult(evaluateExpr(expr || '0') / 100); updateDisplay(); livePreview(); } catch (e) { /* ignore */ }
}

// ── memory ───────────────────────────────────────────────────
function memClear() {
  memory = 0;
  document.getElementById('calc-mem').textContent = '';
  save('memory', 0);
  toast('Memory cleared');
}
function memRecall() {
  expr = String(memory);
  updateDisplay();
  livePreview();
}
function memStore() {
  try {
    memory = evaluateExpr(expr || '0');
    document.getElementById('calc-mem').textContent = 'M = ' + formatResult(memory);
    save('memory', memory);
    toast('Saved to memory');
  } catch (e) { toast('Nothing to store'); }
}

// ── immediate unary operations (√ x² x³ 1/x !) ─────────────────
function applyImmediate(fn, labelFn) {
  try {
    const v = evaluateExpr(expr || '0');
    const r = fn(v);
    if (typeof r !== 'number' || Number.isNaN(r) || !isFinite(r)) throw new Error('bad');
    const out = formatResult(r);
    addHistory(labelFn(formatResult(v)), out);
    expr = out;
    updateDisplay();
    document.getElementById('calc-hist').textContent = '';
  } catch (e) {
    document.getElementById('calc-disp').textContent = 'Error';
    expr = '';
  }
}
const unarySqrt = () => applyImmediate(v => Math.sqrt(v), s => '√(' + s + ')');
const unaryCbrt = () => applyImmediate(v => Math.cbrt(v), s => '∛(' + s + ')');
const unarySquare = () => applyImmediate(v => v * v, s => '(' + s + ')²');
const unaryCube = () => applyImmediate(v => v * v * v, s => '(' + s + ')³');
const unaryRecip = () => applyImmediate(v => { if (v === 0) throw new Error('div0'); return 1 / v; }, s => '1/(' + s + ')');
const unaryFactorial = () => applyImmediate(v => {
  if (v < 0 || !Number.isInteger(v) || v > 170) throw new Error('bad');
  let f = 1; for (let i = 2; i <= v; i++) f *= i; return f;
}, s => s + '!');

// ── equals ───────────────────────────────────────────────────
function equals() {
  if (!expr) return;
  try {
    const out = formatResult(evaluateExpr(expr));
    if (out === 'Error' || out === '∞' || out === '-∞') {
      document.getElementById('calc-disp').textContent = out;
      document.getElementById('calc-hist').textContent = '';
      expr = '';
      return;
    }
    addHistory(expr, out);
    document.getElementById('calc-hist').textContent = expr + ' =';
    ans = parseFloat(out);
    expr = out;
    updateDisplay();
    flashDisplay();
  } catch (e) {
    document.getElementById('calc-disp').textContent = 'Error';
    document.getElementById('calc-hist').textContent = '';
    expr = '';
  }
}

// ── dispatch ─────────────────────────────────────────────────
function calcInput(k) {
  if (/^[0-9]$/.test(k)) return appendDigit(k);
  switch (k) {
    case 'C': return clearAll();
    case '⌫': return backspace();
    case '±': return negate();
    case '%': return percent();
    case 'MC': return memClear();
    case 'MR': return memRecall();
    case 'MS': return memStore();
    case 'ANS': return insertAns();
    case '=': return equals();
    case '.': return appendDecimal();
    case '÷': case '×': case '−': case '+': return appendOperator(k);
    case '(': case ')': return insertParen(k);
    case 'sin': case 'cos': case 'tan': case 'log': case 'ln': return insertFn(k);
    case '√': return unarySqrt();
    case '∛': return unaryCbrt();
    case 'x²': return unarySquare();
    case 'x³': return unaryCube();
    case '1/x': return unaryRecip();
    case '!': return unaryFactorial();
    case 'xʸ': return insertPower();
    case 'π': return insertConst('π');
    case 'e': return insertConst('e');
  }
}

// ── history ──────────────────────────────────────────────────
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function addHistory(exprStr, result) {
  history.unshift({ expr: exprStr, result, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
  history = history.slice(0, 20);
  save('history', history);
  renderHistory();
}
function renderHistory() {
  const el = document.getElementById('calc-history-list');
  if (!history.length) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">📋</div><p>No calculations yet</p></div>';
    return;
  }
  el.innerHTML = '';
  history.forEach(h => {
    const btn = document.createElement('button');
    btn.className = 'hist-item';
    btn.innerHTML = `<div><div class="hist-expr">${escapeHtml(h.expr)} =</div><div class="hist-result">${escapeHtml(String(h.result))}</div></div><div class="hist-time">${escapeHtml(h.time)}</div>`;
    btn.addEventListener('click', () => { expr = String(h.result); updateDisplay(); livePreview(); });
    el.appendChild(btn);
  });
}
function clearHistory() {
  if (!history.length) return;
  history = [];
  save('history', history);
  renderHistory();
  toast('History cleared');
}

// ── copy result ──────────────────────────────────────────────
function copyResult() {
  const text = document.getElementById('calc-disp').textContent;
  if (!text || text === '0') return;
  navigator.clipboard?.writeText(text)
    .then(() => toast('✅ Copied ' + text))
    .catch(() => toast('⚠ Copy failed'));
}

// ── keyboard support ─────────────────────────────────────────
document.addEventListener('keydown', e => {
  const map = { Enter: '=', Backspace: '⌫', Escape: 'C', '/': '÷', '*': '×', '-': '−', '+': '+', '%': '%' };
  if (e.key in map) { e.preventDefault(); calcInput(map[e.key]); return; }
  if (/^[0-9]$/.test(e.key)) { calcInput(e.key); return; }
  if (e.key === '.' || e.key === '(' || e.key === ')') { calcInput(e.key); return; }
});

// ── init ─────────────────────────────────────────────────────
buildPad();
document.getElementById('angle-toggle').textContent = angleMode.toUpperCase();
setMode(load('mode', 'std'));
if (memory) document.getElementById('calc-mem').textContent = 'M = ' + formatResult(memory);
renderHistory();
updateDisplay();
