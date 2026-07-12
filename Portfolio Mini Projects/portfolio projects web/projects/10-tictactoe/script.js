// ── SHARED UTILITIES ──────────────────────────────────────────
let _toastT;
function toast(msg,dur=2400,type=''){
  const el=document.getElementById('toast');
  el.textContent=msg;
  el.className='show';
  clearTimeout(_toastT);
  _toastT=setTimeout(()=>el.className='',dur);
}
function toggleTheme(){
  const light=document.documentElement.dataset.theme==='light';
  document.documentElement.dataset.theme=light?'dark':'light';
  document.getElementById('theme-btn').textContent=light?'🌙':'☀️';
  localStorage.setItem('devos-theme',light?'dark':'light');
}
(function initTheme(){
  const t=localStorage.getItem('devos-theme')||'dark';
  if(t==='light'){document.documentElement.dataset.theme='light';document.getElementById('theme-btn').textContent='☀️';}
})();
function save(key,val){try{localStorage.setItem('devos-'+key,JSON.stringify(val));}catch(e){}}
function load(key,def=null){try{const v=localStorage.getItem('devos-'+key);return v!==null?JSON.parse(v):def;}catch(e){return def;}}
function animateIn(selector){document.querySelectorAll(selector).forEach((el,i)=>{el.style.opacity='0';el.style.transform='translateY(14px)';setTimeout(()=>{el.style.transition='opacity .4s ease,transform .4s ease';el.style.opacity='1';el.style.transform='none';},i*60);});}
function copyText(text,msg='Copied!'){navigator.clipboard?.writeText(text).then(()=>toast('✅ '+msg)).catch(()=>toast('⚠ Copy failed'));}
function formatNum(n){return n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':String(n);}
function formatDate(d){return new Date(d).toLocaleDateString('en',{month:'short',day:'numeric',year:'numeric'});}
function debounce(fn,ms=300){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms);};}

let board=Array(9).fill(''),tttTurn='X',tttOn=true,tttAI=true;
let scores=load('ttt-scores')||{w:0,d:0,l:0};
let tttHist=load('ttt-history')||[];
const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function renderBoard(){
  document.getElementById('ttt-board').innerHTML=board.map((v,i)=>`
  <button onclick="tttMove(${i})" style="aspect-ratio:1;background:${v?'var(--card2)':'var(--card3)'};border:2px solid ${v?'var(--dim)':'var(--border)'};border-radius:var(--r2);font-size:clamp(28px,7vw,40px);cursor:${v||!tttOn?'default':'pointer'};color:${v==='X'?'var(--accent)':'var(--accent4)'};transition:all .15s;touch-action:manipulation;font-weight:700" ${!v&&tttOn?`onmouseover="if(!this.textContent)this.style.opacity='.6'" onmouseout="this.style.opacity='1'"`:''}>
    ${v}
  </button>`).join('');
}
function tttMove(i){
  if(!tttOn||board[i])return;
  board[i]=tttTurn;renderBoard();
  const w=checkWin();
  if(w){endGame(w);return;}
  tttTurn=tttTurn==='X'?'O':'X';
  const s=document.getElementById('ttt-status');
  if(tttAI&&tttTurn==='O'&&tttOn){s.textContent='AI THINKING...';s.style.color='var(--accent2)';setTimeout(aiMove,400);}
  else{s.textContent=tttTurn+"'S TURN";s.style.color=tttTurn==='X'?'var(--accent)':'var(--accent4)';}
}
function aiMove(){const idx=getBestMove();tttMove(idx);}
function getBestMove(){
  let best=-Infinity,idx=0;
  board.forEach((_,i)=>{if(!board[i]){board[i]='O';const s=minimax(board,'X',0);board[i]='';if(s>best){best=s;idx=i;}}});
  return idx;
}
function minimax(b,t,depth){
  const w=checkWin(b);
  if(w==='O')return 10-depth;if(w==='X')return depth-10;if(b.every(v=>v))return 0;
  const scores=b.map((v,i)=>{if(v)return null;b[i]=t;const s=minimax(b,t==='X'?'O':'X',depth+1);b[i]='';return s;}).filter(v=>v!==null);
  return t==='O'?Math.max(...scores):Math.min(...scores);
}
function checkWin(b=board){for(const[a,c,e]of wins)if(b[a]&&b[a]===b[c]&&b[a]===b[e])return b[a];if(b.every(v=>v))return 'D';return null;}
function endGame(w){
  tttOn=false;const s=document.getElementById('ttt-status');
  if(w==='D'){s.textContent='🤝 DRAW!';s.style.color='var(--muted)';scores.d++;}
  else if(w==='X'){s.textContent='🎉 YOU WIN!';s.style.color='var(--accent3)';scores.w++;}
  else{s.textContent='🤖 AI WINS!';s.style.color='var(--accent4)';scores.l++;}
  document.getElementById('ttt-sw').textContent=scores.w;document.getElementById('ttt-sd').textContent=scores.d;document.getElementById('ttt-sl').textContent=scores.l;
  tttHist.unshift({result:w,board:[...board],time:new Date().toLocaleTimeString()});tttHist=tttHist.slice(0,10);
  save('ttt-scores',scores);save('ttt-history',tttHist);renderTTTHistory();
  // Highlight winning cells
  wins.forEach(([a,c,e])=>{if(board[a]&&board[a]===board[c]&&board[a]===board[e]){[a,c,e].forEach(idx=>{const btns=document.getElementById('ttt-board').children;if(btns[idx])btns[idx].style.background=w==='X'?'rgba(0,255,179,.15)':'rgba(255,77,141,.15)';});}}); 
}
function resetTTT(){board=Array(9).fill('');tttTurn='X';tttOn=true;const s=document.getElementById('ttt-status');s.textContent='YOUR TURN (X)';s.style.color='var(--accent)';renderBoard();}
function toggleTTTMode(){tttAI=!tttAI;document.getElementById('ttt-mode-btn').textContent='AI: '+(tttAI?'ON':'OFF');document.getElementById('ttt-mode-badge').textContent=tttAI?'vs AI':'2 Player';resetTTT();}
function resetTTTScores(){scores={w:0,d:0,l:0};save('ttt-scores',scores);document.getElementById('ttt-sw').textContent=0;document.getElementById('ttt-sd').textContent=0;document.getElementById('ttt-sl').textContent=0;toast('Scores reset');}
function renderTTTHistory(){const el=document.getElementById('ttt-history');if(!tttHist.length){el.innerHTML='<div class="empty"><p>No games yet</p></div>';return;}el.innerHTML=tttHist.map(h=>`<div class="card2" style="margin-bottom:6px;display:flex;align-items:center;justify-content:space-between"><span style="font-size:13px">${h.result==='D'?'🤝 Draw':h.result==='X'?'🎉 Your win':'🤖 AI won'}</span><span style="font-size:10px;color:var(--dim);font-family:'JetBrains Mono',monospace">${h.time}</span></div>`).join('');}
document.getElementById('ttt-sw').textContent=scores.w;document.getElementById('ttt-sd').textContent=scores.d;document.getElementById('ttt-sl').textContent=scores.l;
renderBoard();renderTTTHistory();
