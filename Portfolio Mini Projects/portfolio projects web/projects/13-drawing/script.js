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

const canvas=document.getElementById('dr-canvas');const ctx=canvas.getContext('2d');
const palette=['#00e5ff','#7c6fff','#00ffb3','#ff4d8d','#ffb800','#ffffff','#000000'];
document.getElementById('dr-palette').innerHTML=palette.map(c=>`<button onclick="document.getElementById('dr-col').value='${c}'" style="width:18px;height:18px;border-radius:4px;background:${c};border:1px solid rgba(255,255,255,.15);cursor:pointer;-webkit-tap-highlight-color:transparent"></button>`).join('');
function addColor(c){document.getElementById('dr-col').value=c;}
function resize(){const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=Math.min(window.innerHeight*0.55,480)*devicePixelRatio;canvas.style.height=(canvas.height/devicePixelRatio)+'px';ctx.scale(devicePixelRatio,devicePixelRatio);}
resize();window.addEventListener('resize',()=>{const data=canvas.toDataURL();resize();const img=new Image();img.onload=()=>ctx.drawImage(img,0,0,canvas.width/devicePixelRatio,canvas.height/devicePixelRatio);img.src=data;});
let drawing=false,tool='pen',history=[],future=[];
function getPos(e){const r=canvas.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return{x:(t.clientX-r.left),y:(t.clientY-r.top)};}
function setTool(t,btn){tool=t;document.querySelectorAll('[id^="tool-"]').forEach(b=>{b.style.borderColor='var(--border)';b.style.color='var(--muted)'});btn.style.borderColor='var(--accent)';btn.style.color='var(--accent)';}
document.getElementById('dr-sz').addEventListener('input',function(){document.getElementById('dr-sz-val').textContent=this.value;});
canvas.addEventListener('pointerdown',e=>{
  const p=getPos(e);
  if(tool==='fill'){floodFill(Math.round(p.x),Math.round(p.y),document.getElementById('dr-col').value);return;}
  history.push(canvas.toDataURL());if(history.length>30)history.shift();future=[];
  drawing=true;ctx.beginPath();ctx.moveTo(p.x,p.y);
  ctx.strokeStyle=tool==='eraser'?'#1a2436':document.getElementById('dr-col').value;
  ctx.lineWidth=parseInt(document.getElementById('dr-sz').value)*(tool==='brush'?2.5:1);
  ctx.lineCap='round';ctx.lineJoin='round';
  ctx.globalAlpha=tool==='brush'?0.7:1;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove',e=>{if(!drawing)return;const p=getPos(e);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.beginPath();ctx.moveTo(p.x,p.y);});
canvas.addEventListener('pointerup',()=>{drawing=false;ctx.globalAlpha=1;ctx.beginPath();});
function undo(){if(!history.length)return;future.push(canvas.toDataURL());const img=new Image();img.onload=()=>{ctx.clearRect(0,0,canvas.width/devicePixelRatio,canvas.height/devicePixelRatio);ctx.drawImage(img,0,0,canvas.width/devicePixelRatio,canvas.height/devicePixelRatio);};img.src=history.pop();}
function redo(){if(!future.length)return;history.push(canvas.toDataURL());const img=new Image();img.onload=()=>{ctx.clearRect(0,0,canvas.width/devicePixelRatio,canvas.height/devicePixelRatio);ctx.drawImage(img,0,0,canvas.width/devicePixelRatio,canvas.height/devicePixelRatio);};img.src=future.pop();}
function clearCanvas(){history.push(canvas.toDataURL());ctx.clearRect(0,0,canvas.width/devicePixelRatio,canvas.height/devicePixelRatio);}
function saveCanvas(){const a=document.createElement('a');a.download='devos-drawing.png';a.href=canvas.toDataURL('image/png');a.click();toast('💾 Saved!');}
function floodFill(x,y,fillColor){toast('Fill mode: click to fill area');/* simplified */}
