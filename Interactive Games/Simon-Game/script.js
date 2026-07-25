const pads = [...document.querySelectorAll('.pad')];
const startButton = document.querySelector('#startButton');
const instruction = document.querySelector('#instruction');
const levelDisplay = document.querySelector('#level');
const bestDisplay = document.querySelector('#best');
const soundButton = document.querySelector('#soundButton');
const card = document.querySelector('.game-card');

let pattern = [];
let playerIndex = 0;
let level = 0;
let playing = false;
let acceptingInput = false;
let soundOn = true;
let best = Number(localStorage.getItem('simonBest') || 0);
bestDisplay.textContent = String(best).padStart(2, '0');

const tones = { green: 329.63, red: 261.63, yellow: 392.0, blue: 493.88 };
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function updateLevel() { levelDisplay.textContent = String(level).padStart(2, '0'); }
function playTone(color) {
  if (!soundOn) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audio = new AudioContext(); const oscillator = audio.createOscillator(); const gain = audio.createGain();
  oscillator.frequency.value = tones[color]; gain.gain.setValueAtTime(.045, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .22);
  oscillator.connect(gain).connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + .23);
}
async function flash(color) {
  const pad = document.querySelector(`[data-color="${color}"]`);
  pad.classList.add('active'); playTone(color); await sleep(350); pad.classList.remove('active');
}
async function showPattern() {
  acceptingInput = false; instruction.textContent = 'Watch carefully…'; await sleep(500);
  for (const color of pattern) { await flash(color); await sleep(180); }
  acceptingInput = true; instruction.textContent = 'Your turn — repeat the pattern.';
}
async function nextLevel() {
  level++; playerIndex = 0; updateLevel();
  pattern.push(pads[Math.floor(Math.random() * pads.length)].dataset.color);
  await showPattern();
}
async function startGame() {
  if (playing) return;
  playing = true; pattern = []; level = 0; startButton.textContent = 'Game in Progress'; startButton.disabled = true;
  await nextLevel();
}
async function gameOver() {
  acceptingInput = false; playing = false; card.classList.add('wrong'); setTimeout(() => card.classList.remove('wrong'), 380);
  instruction.textContent = `Game over! You reached level ${level}.`;
  if (level > best) { best = level; localStorage.setItem('simonBest', best); bestDisplay.textContent = String(best).padStart(2, '0'); }
  startButton.disabled = false; startButton.innerHTML = '<span class="play-icon">↻</span> Play Again';
}
pads.forEach(pad => pad.addEventListener('click', async () => {
  if (!acceptingInput) return;
  const color = pad.dataset.color; await flash(color);
  if (color !== pattern[playerIndex]) { gameOver(); return; }
  playerIndex++;
  if (playerIndex === pattern.length) { acceptingInput = false; instruction.textContent = 'Great job! Next level…'; await sleep(650); nextLevel(); }
}));
startButton.addEventListener('click', startGame);
document.addEventListener('keydown', event => { if (!playing && (event.code === 'Space' || event.code === 'Enter')) { event.preventDefault(); startGame(); } });
soundButton.addEventListener('click', () => { soundOn = !soundOn; soundButton.textContent = soundOn ? '♪' : '×'; soundButton.setAttribute('aria-label', soundOn ? 'Mute game sounds' : 'Turn on game sounds'); });
