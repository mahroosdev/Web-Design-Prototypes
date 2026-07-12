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

const wicons={0:'☀️',1:'🌤',2:'⛅',3:'☁️',45:'🌫',48:'🌫',51:'🌦',61:'🌧',71:'🌨',80:'🌦',95:'⛈',99:'⛈'};
const wdesc={0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Foggy',48:'Icy fog',51:'Light drizzle',61:'Rain',71:'Snow',80:'Rain showers',95:'Thunderstorm',99:'Heavy thunderstorm'};
const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function getWIcon(c){return wicons[Object.keys(wicons).map(Number).filter(x=>c>=x).pop()||0]||'🌡';}
function getWDesc(c){return wdesc[Object.keys(wdesc).map(Number).filter(x=>c>=x).pop()||0]||'Unknown';}
let recentCities=load('wx-recent')||['Kuwait City','Dubai','London'];
function renderRecent(){document.getElementById('wx-recent').innerHTML=recentCities.slice(0,5).map(c=>`<button class="chip" onclick="document.getElementById('wx-city').value='${c}';searchCity()">${c}</button>`).join('');}
async function searchCity(){
  const city=document.getElementById('wx-city').value.trim();if(!city)return;
  document.getElementById('wx-loading').style.display='block';document.getElementById('wx-main').style.display='none';document.getElementById('wx-err').style.display='none';
  try{
    const geo=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`).then(r=>r.json());
    if(!geo.results?.length)throw new Error('City not found. Try another name.');
    const {latitude:lat,longitude:lon,name,country,timezone}=geo.results[0];
    const wx=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,windspeed_10m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,windspeed_10m_max&temperature_unit=celsius&windspeed_unit=kmh&timezone=${encodeURIComponent(timezone||'auto')}`).then(r=>r.json());
    const cw=wx.current_weather;
    const hi=wx.daily.temperature_2m_max[0];const lo=wx.daily.temperature_2m_min[0];
    document.getElementById('wx-city-name').textContent=`📍 ${name}, ${country}`;
    document.getElementById('wx-icon').textContent=getWIcon(cw.weathercode);
    document.getElementById('wx-temp').textContent=Math.round(cw.temperature)+'°';
    document.getElementById('wx-desc').textContent=getWDesc(cw.weathercode);
    document.getElementById('wx-feels').textContent=`High ${Math.round(hi)}° · Low ${Math.round(lo)}°`;
    const curH=new Date().getHours();const hi2=wx.hourly.relativehumidity_2m?.[curH]??'--';
    document.getElementById('wx-details').innerHTML=[
      {l:'💨 Wind',v:cw.windspeed+' km/h'},{l:'💧 Humidity',v:hi2+'%'},{l:'🌅 Sunrise',v:wx.daily.sunrise[0]?.slice(11)||'--'},{l:'🌇 Sunset',v:wx.daily.sunset[0]?.slice(11)||'--'},{l:'🌧 Rain',v:(wx.daily.precipitation_sum[0]||0)+'mm'},{l:'💨 Max Wind',v:wx.daily.windspeed_10m_max[0]+' km/h'}
    ].map(({l,v})=>`<div class="stat-card"><div style="font-size:12px;font-weight:600;margin-bottom:4px">${l}</div><div style="font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--accent)">${v}</div></div>`).join('');
    document.getElementById('wx-forecast').innerHTML=wx.daily.time.slice(0,7).map((d,i)=>`<div class="card2" style="flex-shrink:0;min-width:80px;text-align:center"><div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--muted)">${i===0?'Today':days[new Date(d).getDay()]}</div><div style="font-size:32px;margin:6px 0">${getWIcon(wx.daily.weathercode[i])}</div><div style="font-size:13px;font-weight:700;color:var(--accent)">${Math.round(wx.daily.temperature_2m_max[i])}°</div><div style="font-size:11px;color:var(--muted)">${Math.round(wx.daily.temperature_2m_min[i])}°</div></div>`).join('');
    document.getElementById('wx-hourly').innerHTML=wx.hourly.time.slice(curH,curH+12).map((t,i)=>`<div class="card2" style="flex-shrink:0;min-width:60px;text-align:center"><div style="font-size:10px;font-family:'JetBrains Mono',monospace;color:var(--muted)">${t.slice(11)}</div><div style="font-size:22px;margin:4px 0">${getWIcon(wx.hourly.weathercode[curH+i])}</div><div style="font-size:13px;color:var(--accent)">${Math.round(wx.hourly.temperature_2m[curH+i])}°</div></div>`).join('');
    if(!recentCities.includes(name)){recentCities.unshift(name);recentCities=recentCities.slice(0,5);save('wx-recent',recentCities);renderRecent();}
    document.getElementById('wx-main').style.display='block';
  }catch(e){document.getElementById('wx-err').style.display='block';document.getElementById('wx-err').textContent='⚠ '+e.message;}
  document.getElementById('wx-loading').style.display='none';
}
function getLocation(){if(!navigator.geolocation)return toast('Geolocation not supported');navigator.geolocation.getCurrentPosition(async pos=>{const r=await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}`).catch(()=>null);document.getElementById('wx-city').value='My Location';searchCity();},()=>toast('⚠ Location access denied'));}
renderRecent();searchCity();
