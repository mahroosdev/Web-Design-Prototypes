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

let qtype='url',qrHistory=load('qr-history')||[];
const fields={
  url:`<div class="form-group"><label>URL</label><input id="qf1" value="https://example.com" placeholder="https://..."></div>`,
  text:`<div class="form-group"><label>Text</label><textarea id="qf1" rows="3" placeholder="Enter any text..."></textarea></div>`,
  wifi:`<div class="form-group"><label>Network Name (SSID)</label><input id="qf1" placeholder="My WiFi"></div><div class="form-group"><label>Password</label><input id="qf2" type="password" placeholder="Password"></div><div class="form-group"><label>Security</label><select id="qf3"><option>WPA</option><option>WEP</option><option>None</option></select></div>`,
  email:`<div class="form-group"><label>Email</label><input id="qf1" placeholder="user@example.com"></div><div class="form-group"><label>Subject</label><input id="qf2" placeholder="Hello!"></div><div class="form-group"><label>Body</label><textarea id="qf3" rows="2" placeholder="Message..."></textarea></div>`,
  tel:`<div class="form-group"><label>Phone Number</label><input id="qf1" placeholder="+1 555 000 0000" type="tel"></div>`,
  vcard:`<div class="row" style="gap:8px"><div class="form-group col"><label>First Name</label><input id="qf1" placeholder="John"></div><div class="form-group col"><label>Last Name</label><input id="qf2" placeholder="Doe"></div></div><div class="form-group"><label>Phone</label><input id="qf3" placeholder="+1 555 000 0000"></div><div class="form-group"><label>Email</label><input id="qf4" placeholder="john@example.com"></div><div class="form-group"><label>Company</label><input id="qf5" placeholder="DevOS Corp"></div>`
};
function setQType(t,btn){qtype=t;document.getElementById('qr-fields').innerHTML=fields[t];document.querySelectorAll('[id^="qtype-"]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');}
setQType('url',document.getElementById('qtype-url'));
function getData(){
  const v=i=>document.getElementById('qf'+i)?.value||'';
  if(qtype==='url')return v(1);
  if(qtype==='text')return v(1);
  if(qtype==='wifi')return `WIFI:T:${v(3)||'WPA'};S:${v(1)};P:${v(2)};;`;
  if(qtype==='email')return `mailto:${v(1)}?subject=${encodeURIComponent(v(2))}&body=${encodeURIComponent(v(3))}`;
  if(qtype==='tel')return `tel:${v(1)}`;
  if(qtype==='vcard')return `BEGIN:VCARD
VERSION:3.0
N:${v(2)};${v(1)}
FN:${v(1)} ${v(2)}
TEL:${v(3)}
EMAIL:${v(4)}
ORG:${v(5)}
END:VCARD`;
  return v(1);
}
function generateQR(){
  const data=getData();if(!data.trim()){toast('⚠ Fill in the required fields');return;}
  const size=parseInt(document.getElementById('qr-size').value);
  const fg=document.getElementById('qr-fg').value;
  const bg=document.getElementById('qr-bg').value;
  const box=document.getElementById('qr-box');
  box.innerHTML='<div id="qr-inner"></div>';
  document.getElementById('qr-empty').style.display='none';
  try{
    new QRCode(document.getElementById('qr-inner'),{text:data,width:size,height:size,colorDark:fg,colorLight:bg,correctLevel:QRCode.CorrectLevel.H});
    document.getElementById('qr-dl').disabled=false;document.getElementById('qr-cp').disabled=false;
    qrHistory.unshift({type:qtype,data:data.slice(0,40),time:new Date().toLocaleTimeString()});
    qrHistory=qrHistory.slice(0,5);save('qr-history',qrHistory);renderHistory();
    toast('✅ QR Code generated!');
  }catch(e){toast('⚠ Generation failed: '+e.message);}
}
function downloadQR(){const img=document.querySelector('#qr-inner img');if(!img)return;const a=document.createElement('a');a.href=img.src;a.download='qrcode-'+qtype+'.png';a.click();toast('⬇ Downloaded!');}
function copyQR(){const img=document.querySelector('#qr-inner img');if(!img)return;fetch(img.src).then(r=>r.blob()).then(b=>{try{navigator.clipboard.write([new ClipboardItem({'image/png':b})]).then(()=>toast('📋 Image copied!'));}catch{toast('⚠ Copy not supported in this browser');}});}
function shareQR(){const data=getData();if(navigator.share)navigator.share({title:'QR Code',text:data}).catch(()=>{});else{copyText(data,'URL copied!');}}
function renderHistory(){document.getElementById('qr-history').innerHTML=qrHistory.length?qrHistory.map(h=>`<div class="card2" style="margin-bottom:6px;display:flex;justify-content:space-between;align-items:center"><span class="badge">${h.type}</span><span style="font-size:12px;color:var(--muted);flex:1;margin:0 10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${h.data}</span><span style="font-size:10px;color:var(--dim);font-family:'JetBrains Mono',monospace">${h.time}</span></div>`).join(''):'<div class="empty"><p>No QR codes generated yet</p></div>';}
renderHistory();
