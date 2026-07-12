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

let tasks=load('tasks')||[
  {id:1,text:'Review portfolio design',pri:'high',cat:'work',done:false,due:'',created:Date.now()-86400000},
  {id:2,text:'Learn TypeScript generics',pri:'med',cat:'learn',done:false,due:'',created:Date.now()-3600000},
  {id:3,text:'Morning workout',pri:'low',cat:'health',done:true,due:'',created:Date.now()-7200000}
];
let nid=tasks.length+1,filt='all';
const priColor={high:'var(--accent4)',med:'var(--accent5)',low:'var(--accent3)'};
const catIcon={work:'💼',personal:'🏠',health:'💪',learn:'📚'};
function addTask(){
  const v=document.getElementById('t-in').value.trim();if(!v){toast('⚠ Enter a task first');return;}
  tasks.unshift({id:nid++,text:v,pri:document.getElementById('t-pri').value,cat:document.getElementById('t-cat').value,done:false,due:document.getElementById('t-due').value,created:Date.now()});
  document.getElementById('t-in').value='';
  save('tasks',tasks);render();toast('✅ Task added!');
}
function toggle(id){const t=tasks.find(x=>x.id===id);if(t){t.done=!t.done;save('tasks',tasks);render();}}
function del(id){tasks=tasks.filter(x=>x.id!==id);save('tasks',tasks);render();}
function clearDone(){tasks=tasks.filter(x=>!x.done);save('tasks',tasks);render();toast('🗑 Done tasks cleared');}
function setFilter(f,btn){filt=f;document.querySelectorAll('.chip').forEach(b=>b.classList.remove('active'));btn.classList.add('active');render();}
function sortTasks(by){if(by==='pri'){const o={high:0,med:1,low:2};tasks.sort((a,b)=>o[a.pri]-o[b.pri]);save('tasks',tasks);render();toast('Sorted by priority');}}
function isOverdue(t){return t.due&&!t.done&&new Date(t.due)<new Date();}
function render(){
  const vis=tasks.filter(t=>filt==='all'||(filt==='done'?t.done:!t.done));
  const total=tasks.length,done=tasks.filter(x=>x.done).length,overdue=tasks.filter(isOverdue).length;
  document.getElementById('s-total').textContent=total;
  document.getElementById('s-active').textContent=total-done;
  document.getElementById('s-done').textContent=done;
  document.getElementById('s-overdue').textContent=overdue;
  document.getElementById('task-badge').textContent=total+' tasks';
  const el=document.getElementById('task-list');
  if(!vis.length){el.innerHTML='<div class="empty"><div class="empty-icon">✨</div><p>No tasks here!</p></div>';return;}
  el.innerHTML=vis.map(t=>`
  <div class="card" style="margin-bottom:8px;border-left:3px solid ${priColor[t.pri]};padding:14px 14px 14px 16px;transition:opacity .2s;${t.done?'opacity:.6':''}">
    <div class="row align between">
      <div class="row align" style="gap:10px;flex:1">
        <input type="checkbox" ${t.done?'checked':''} onchange="toggle(${t.id})" style="width:18px;height:18px;accent-color:var(--accent);cursor:pointer;flex-shrink:0">
        <div style="flex:1">
          <div style="font-size:14px;font-weight:600;${t.done?'text-decoration:line-through;color:var(--muted)':''}">${t.text}</div>
          <div class="row" style="gap:6px;margin-top:4px">
            <span class="badge">${catIcon[t.cat]} ${t.cat}</span>
            <span class="badge" style="border-color:${priColor[t.pri]}44;color:${priColor[t.pri]}">${t.pri}</span>
            ${t.due?`<span class="badge ${isOverdue(t)?'badge-danger':''}">${isOverdue(t)?'⚠ ':'📅 '}${t.due}</span>`:''}
          </div>
        </div>
      </div>
      <button onclick="del(${t.id})" class="btn btn-icon btn-ghost" style="color:var(--muted);font-size:16px;flex-shrink:0">✕</button>
    </div>
  </div>`).join('');
  animateIn('.card');
}
render();
document.addEventListener("keydown",e=>{if(e.key==="Escape"){const ed=document.getElementById("task-edit-panel");if(ed)ed.style.display="none";}});
