const PJ=[
{id:1,file:"projects/01-calculator/index.html",title:"Calculator Pro",icon:"🧮",cat:"tools",cat2:"UTILITY TOOL",desc:"Full-featured glassmorphism calculator with keyboard support, history log, percentage and scientific mode.",tg:["tb","tp"],tn:["HTML","CSS","JS"],feats:["History log","Keyboard input","Scientific mode","Copy result","Glassmorphism UI"]},
{id:2,file:"projects/02-tasks/index.html",title:"Task Manager",icon:"✅",cat:"apps",cat2:"PRODUCTIVITY APP",desc:"Advanced to-do with drag-and-drop, priority levels (High/Med/Low), categories and localStorage persistence.",tg:["tb","tg"],tn:["HTML","JS","LocalStorage"],feats:["Drag & drop","Priority levels","Category filter","Dark mode","Auto-save"]},
{id:3,file:"projects/03-stopwatch/index.html",title:"Stopwatch Pro",icon:"⏱",cat:"tools",cat2:"UTILITY TOOL",desc:"Neon cyan stopwatch with animated SVG ring, lap recording, fastest/slowest lap detection and countdown mode.",tg:["tb","tp"],tn:["HTML","CSS","JS"],feats:["SVG progress ring","Lap recording","Fastest / slowest","Countdown mode","Neon theme"]},
{id:4,file:"projects/04-weather/index.html",title:"Weather App",icon:"🌦",cat:"apps",cat2:"API APP",desc:"Glassmorphism weather card with 5 demo cities, 5-day forecast, wind speed, humidity and condition icons.",tg:["tb","tg"],tn:["JS","REST API","CSS"],feats:["5-day forecast","City search","Wind & humidity","Condition icons","°C display"]},
{id:5,file:"projects/05-rps/index.html",title:"Rock Paper Scissors",icon:"✊",cat:"games",cat2:"BROWSER GAME",desc:"Retro neon arcade RPS with Press Start 2P font, AI opponent, live scoreboard and round history.",tg:["tp","tk"],tn:["HTML","CSS","JS"],feats:["Retro arcade UI","AI opponent","Live scoreboard","Round history","Neon glow effects"]},
{id:6,file:"projects/06-qr/index.html",title:"QR Code Generator",icon:"⬛",cat:"tools",cat2:"UTILITY TOOL",desc:"Minimal white card QR generator. Supports URL, text, WiFi credentials and email links. Instant PNG download.",tg:["tb","tg"],tn:["JS","QR API","CSS"],feats:["URL / Text / WiFi","Email QR","Custom alias","Download PNG","One-click copy"]},
{id:7,file:"projects/07-ecommerce/index.html",title:"E-commerce Store",icon:"🛒",cat:"ui",cat2:"UI / CLONE",desc:"LuxeStore boutique — warm earthy tones, product grid with category filters and sliding cart drawer.",tg:["tb","tp","tk"],tn:["HTML","CSS","JS"],feats:["Cart drawer","Category filter","Product grid","Quantity control","Checkout total"]},
{id:8,file:"projects/08-landing/index.html",title:"SaaS Landing Page",icon:"🌐",cat:"ui",cat2:"UI DESIGN",desc:"NexaFlow — full SaaS startup page with hero, feature grid, trust logos, 3-tier pricing table and sticky navbar.",tg:["tb","tg"],tn:["HTML","CSS","JS"],feats:["Sticky navbar","Feature grid","Pricing table","Trust logos","CTA section"]},
{id:9,file:"projects/09-password/index.html",title:"Password Generator",icon:"🔐",cat:"tools",cat2:"UTILITY TOOL",desc:"Matrix green terminal-style password generator with strength meter, character type toggles and history list.",tg:["tb","tp"],tn:["HTML","CSS","JS"],feats:["Strength meter","Type toggles","Bulk generate","Copy clipboard","Recent history"]},
{id:10,file:"projects/10-tictactoe/index.html",title:"Tic Tac Toe",icon:"⭕",cat:"games",cat2:"BROWSER GAME",desc:"Colorful gradient game with minimax AI, 2-player mode, 3 difficulty levels, win animations and score board.",tg:["tp","tg"],tn:["HTML","CSS","JS"],feats:["Minimax AI","3 difficulties","Win animation","Score board","2-player mode"]},
{id:11,file:"projects/11-linkshortener/index.html",title:"Link Shortener",icon:"🔗",cat:"tools",cat2:"UTILITY TOOL",desc:"LinkSnap — deep purple gradient UI with custom aliases, copy-to-clipboard and click count tracking.",tg:["tb","tg"],tn:["HTML","JS","CSS"],feats:["Custom alias","Click tracking","Copy clipboard","Link history","Stats panel"]},
{id:12,file:"projects/12-portfolio/index.html",title:"Portfolio Website",icon:"💼",cat:"ui",cat2:"UI DESIGN",desc:"Dark editorial portfolio with Bebas Neue typography, parallax hero, project hover-reveal grid and timeline.",tg:["tb","tp","tk"],tn:["HTML","CSS","JS"],feats:["Bebas Neue font","Hover reveal grid","Experience timeline","Gold accents","Contact CTA"]},
{id:13,file:"projects/13-drawing/index.html",title:"Drawing App",icon:"🎨",cat:"apps",cat2:"CREATIVE APP",desc:"Draw Studio — macOS dark canvas with pen, shapes, eraser, color picker, undo stack and PNG export.",tg:["tk","tp"],tn:["Canvas","JS","CSS"],feats:["Color picker","Shape tools","Brush sizes","Undo / redo","Save PNG"]},
{id:14,file:"projects/14-food/index.html",title:"Food Order App",icon:"🍔",cat:"apps",cat2:"UI DESIGN",desc:"FoodRush — orange-accented food delivery UI with category tabs, animated cards, cart bar and order total.",tg:["to","tg"],tn:["HTML","CSS","JS"],feats:["Category tabs","Cart bar","Order total","Menu search","Quantity control"]},
{id:15,file:"projects/15-meme/index.html",title:"Meme Generator",icon:"😂",cat:"apps",cat2:"FUN APP",desc:"MemeForge — dark canvas meme creator with 6 templates, text overlay, font size slider and PNG download.",tg:["tk","tp"],tn:["Canvas","JS","CSS"],feats:["6 templates","Text overlay","Font size slider","Color picker","Download PNG"]},
{id:16,file:"projects/16-movie/index.html",title:"Movie Search App",icon:"🎬",cat:"apps",cat2:"API APP",desc:"CineSearch — Netflix-dark browser with 10 films, genre filter, rating display, search and detail modal.",tg:["tb","tp"],tn:["JS","API","CSS"],feats:["Genre filter","Detail modal","Rating display","Search by title","Poster cards"]},
{id:17,file:"projects/17-chat/index.html",title:"Chat App UI",icon:"💬",cat:"ui",cat2:"UI / CLONE",desc:"ChatSpace — full messaging UI with contacts sidebar, message bubbles, typing indicator and auto-reply.",tg:["tg","tb"],tn:["HTML","CSS","JS"],feats:["Contacts sidebar","Typing indicator","Emoji picker","Auto reply","Read receipts"]},
{id:18,file:"projects/18-twitter/index.html",title:"Twitter / X Clone",icon:"🐦",cat:"ui",cat2:"UI / CLONE",desc:"Full X.com clone — dark feed, post composer with character counter, like/RT animations and trending panel.",tg:["tb","tp"],tn:["HTML","CSS","JS"],feats:["Post composer","Like / RT anim","Trending panel","Char counter","Profile bar"]},
{id:19,file:"projects/19-survey/index.html",title:"Survey App",icon:"📊",cat:"apps",cat2:"FORM APP",desc:"SurveyPulse — gradient purple multi-step form with progress bar, star rating, choice selection and results.",tg:["tb","tg"],tn:["HTML","JS","CSS"],feats:["Multi-step form","Progress bar","Star rating","Results chart","Retake option"]},
{id:20,file:"projects/20-ebook/index.html",title:"E-Book Reader",icon:"📚",cat:"apps",cat2:"READER APP",desc:"ReadSpace — warm parchment e-book with sidebar chapters, night mode, font size control and reading time.",tg:["ta","tp"],tn:["HTML","CSS","JS"],feats:["Chapter sidebar","Night mode","Font size control","Reading time","Progress bar"]},
{id:21,file:"projects/21-instagram/index.html",title:"Instagram Clone",icon:"📸",cat:"ui",cat2:"UI / CLONE",desc:"Full Instagram feed — stories row, post cards, double-tap like animation, explore sidebar and comments.",tg:["tk","tp"],tn:["HTML","CSS","JS"],feats:["Stories row","Like animation","Save post","Explore sidebar","Comment input"]},
{id:22,file:"projects/22-whatsapp/index.html",title:"WhatsApp Clone",icon:"💚",cat:"ui",cat2:"UI / CLONE",desc:"Pixel-perfect WhatsApp UI — contact list, message bubbles with ticks, read receipts and emoji insert.",tg:["tg","tb"],tn:["HTML","CSS","JS"],feats:["Contact sidebar","Read receipts ✓✓","Emoji insert","Auto reply","Media preview"]},
{id:23,file:"projects/23-netflix/index.html",title:"Netflix Clone",icon:"🎥",cat:"ui",cat2:"UI / CLONE",desc:"Netflix-style UI — fixed navbar, hero banner with play buttons, horizontal scroll rows and hover overlays.",tg:["tr","tp"],tn:["HTML","CSS","JS"],feats:["Hero banner","Scroll rows","Hover overlay","Genre rows","Fixed navbar"]},
{id:24,file:"projects/24-fileshare/index.html",title:"File Sharing UI",icon:"📂",cat:"apps",cat2:"UTILITY APP",desc:"DropVault — blue-gradient file upload with drag-and-drop, animated progress bars and file type icons.",tg:["tb","tg"],tn:["HTML","CSS","JS"],feats:["Drag & drop","Progress bars","File type icons","Delete files","Size stats"]},
{id:25,file:"projects/25-parallax/index.html",title:"Parallax Website",icon:"🌄",cat:"ui",cat2:"UI DESIGN",desc:"4-section parallax site — night sky, forest, fire stats and ocean CTA with animated counters and dot nav.",tg:["tb","tp"],tn:["HTML","CSS","JS"],feats:["4 parallax sections","Animated counters","Dot navigation","CTA section","Responsive"]},
{id:26,file:"projects/26-dashboard/index.html",title:"Admin Dashboard",icon:"📊",cat:"dashboard",cat2:"DASHBOARD",desc:"AdminOS — dark sidebar panel with KPI cards, 12-month bar chart, product table and transaction list.",tg:["tb","tp","tg"],tn:["HTML","CSS","JS"],feats:["4 KPI cards","Bar chart","Data tables","Sidebar nav","Transaction list"]},
{id:27,file:"projects/27-notes/index.html",title:"Notes App",icon:"📝",cat:"apps",cat2:"PRODUCTIVITY APP",desc:"NoteFlow — macOS dark notes with color labels, markdown-style editor, word count and auto-save.",tg:["ta","tg"],tn:["HTML","JS","LocalStorage"],feats:["Color labels","Word count","Bold / Italic","Pin notes","Auto-save"]},
{id:28,file:"projects/28-calendar/index.html",title:"Calendar App",icon:"📅",cat:"apps",cat2:"PRODUCTIVITY APP",desc:"CalPro — white weekly calendar with mini-cal sidebar, event modal, color coding and upcoming events.",tg:["tb","tk"],tn:["HTML","CSS","JS"],feats:["Mini calendar","Event modal","Color coding","Upcoming events","Sticky headers"]},
{id:29,file:"projects/29-music/index.html",title:"Music Player",icon:"🎧",cat:"apps",cat2:"MEDIA APP",desc:"WavePlayer — deep purple Spotify-style with visualizer bars, 6-track playlist, seek bar and shuffle.",tg:["tp","tk"],tn:["JS","Web Audio","CSS"],feats:["Visualizer bars","6-track playlist","Seek bar","Shuffle / repeat","Like tracks"]},
{id:30,file:"projects/30-blog/index.html",title:"Blog Website",icon:"📰",cat:"ui",cat2:"UI DESIGN",desc:"DevBlog — editorial serif blog with featured post hero, category sidebar, read time and newsletter.",tg:["tb","tg"],tn:["HTML","CSS","JS"],feats:["Featured hero","Category sidebar","Read time","Popular posts","Newsletter form"]},
{id:31,file:"projects/31-aichat/index.html",title:"AI Chat UI",icon:"🤖",cat:"futuristic",cat2:"FUTURISTIC",desc:"NexaAI — GitHub-dark ChatGPT-style interface with typing animation, code block rendering and quick prompts.",tg:["tb","tp"],tn:["HTML","CSS","JS"],feats:["Typing animation","Code rendering","Chat history","Quick prompts","Copy responses"]},
{id:32,file:"projects/32-crypto/index.html",title:"Crypto Dashboard",icon:"💰",cat:"dashboard",cat2:"DASHBOARD",desc:"CryptoVault — dark trading terminal with 6 coin cards, sparkline charts, portfolio value and market table.",tg:["tg","tb","tp"],tn:["JS","Charts","CSS"],feats:["6 coin cards","Sparkline charts","Portfolio value","Market table","Live price flicker"]},
{id:33,file:"projects/33-jobfinder/index.html",title:"Job Finder",icon:"💼",cat:"apps",cat2:"WEB APP",desc:"JobBoard Pro — purple-accented job listing with filter sidebar, salary range slider and featured badges.",tg:["tb","tg"],tn:["HTML","CSS","JS"],feats:["Filter sidebar","Salary range","Featured jobs","Save jobs","Apply modal"]},
{id:34,file:"projects/34-realestate/index.html",title:"Real Estate UI",icon:"🏠",cat:"ui",cat2:"UI DESIGN",desc:"EstateVault — luxury gold-and-black property listing with hero search bar, filter sidebar and 6 property cards.",tg:["tb","ta"],tn:["HTML","CSS","JS"],feats:["Hero search","Filter sidebar","Property cards","Save to wishlist","Agent contact"]},
{id:35,file:"projects/35-travel/index.html",title:"Travel Website",icon:"✈️",cat:"ui",cat2:"UI DESIGN",desc:"WanderMap — full-screen hero with parallax background, destination grid, package cards and scroll-aware navbar.",tg:["tt","tb"],tn:["HTML","CSS","JS"],feats:["Full-screen hero","Destination grid","Package cards","Scroll navbar","Search bar"]},
{id:36,file:"projects/36-saas/index.html",title:"SaaS Platform UI",icon:"💻",cat:"ui",cat2:"UI DESIGN",desc:"StreamLine — clean white SaaS landing with dashboard preview mockup, feature grid and social proof badge.",tg:["tb","tp","tg"],tn:["HTML","CSS","JS"],feats:["Dashboard preview","Feature grid","Social proof","Animated badge","CTA section"]},
{id:37,file:"projects/37-analytics/index.html",title:"Analytics Dashboard",icon:"📈",cat:"dashboard",cat2:"DASHBOARD",desc:"Dark blue analytics panel — 4 KPI cards, 12-month bar chart, traffic sources and top pages table.",tg:["tb","tp"],tn:["JS","Charts","CSS"],feats:["4 KPI cards","Bar chart","Traffic sources","Top pages table","Trend indicators"]},
{id:38,file:"projects/38-banking/index.html",title:"Banking App UI",icon:"💳",cat:"dashboard",cat2:"DASHBOARD",desc:"NeoBank — emerald green banking interface with 3 account cards, quick actions and transaction history.",tg:["tg","tb"],tn:["HTML","CSS","JS"],feats:["3 account cards","Quick actions","Transaction history","Portfolio value","Transfer UI"]},
{id:39,file:"projects/39-lms/index.html",title:"Learning Platform",icon:"🎓",cat:"apps",cat2:"WEB APP",desc:"LearnHub — yellow-accented LMS with progress bars, 6 course cards, category pills, ratings and enrollment.",tg:["tp","tg"],tn:["HTML","CSS","JS"],feats:["Progress bars","6 course cards","Category filter","Star ratings","Enroll button"]},
{id:40,file:"projects/40-portfolio2/index.html",title:"Advanced Portfolio",icon:"🔥",cat:"ui",cat2:"UI DESIGN",desc:"Dark dramatic portfolio with huge Bebas Neue type, project hover-reveal grid, timeline and gold accents.",tg:["tb","tp","tk"],tn:["HTML","CSS","JS"],feats:["Huge typography","Hover reveal grid","Timeline","Gold accents","Contact CTA"]},
{id:41,file:"projects/41-mindreader/index.html",title:"AI Mind Reader",icon:"🧠",cat:"futuristic",cat2:"FUTURISTIC",desc:"Purple neural interface with pulsing orbit rings, animated data stream bars and live system monitor stats.",tg:["tp","tb"],tn:["HTML","CSS","JS"],feats:["Pulse rings","Data stream","Live stats","Activate sequence","Orbitron font"]},
{id:42,file:"projects/42-space/index.html",title:"Space Explorer",icon:"🌌",cat:"futuristic",cat2:"FUTURISTIC",desc:"Cyan deep-space interface with orbit animations, floating icon, data stream bars and live timestamp display.",tg:["tb","tp"],tn:["Canvas","CSS 3D","JS"],feats:["Orbit animations","Floating icon","Data stream","Live clock","System stats"]},
{id:43,file:"projects/43-voiceai/index.html",title:"AI Voice Assistant",icon:"🎙",cat:"futuristic",cat2:"FUTURISTIC",desc:"Cyan voice UI with animated pulse rings around microphone, waveform data bars and command interface.",tg:["tb","tg"],tn:["Web Speech","JS","CSS"],feats:["Pulse rings","Wave visualizer","Command UI","Live timestamp","Activate button"]},
{id:44,file:"projects/44-dna/index.html",title:"DNA Visualizer",icon:"🧬",cat:"futuristic",cat2:"FUTURISTIC",desc:"Biotech green interface with DNA floating icon, animated data streams, system accuracy stats and sequence.",tg:["tg","tp"],tn:["Canvas","CSS","JS"],feats:["DNA animation","Data stream","Accuracy stats","Orbitron font","Green biotech UI"]},
{id:45,file:"projects/45-cyberpunk/index.html",title:"Cyberpunk Dashboard",icon:"🕶",cat:"futuristic",cat2:"FUTURISTIC",desc:"Cyan-on-black cyberpunk panel with grid background, scan pulse rings, data streams and terminal stats.",tg:["tk","tb"],tn:["HTML","CSS","JS"],feats:["Glowing grid","Scan pulses","Data stream","Terminal stats","Neon cyan theme"]},
{id:46,file:"projects/46-brainwave/index.html",title:"Brainwave Simulator",icon:"⚡",cat:"futuristic",cat2:"FUTURISTIC",desc:"Deep purple EEG interface visualizing neural activity with animated data bars, pulse rings and stats.",tg:["tg","tp"],tn:["Canvas","Web Audio","JS"],feats:["Pulse rings","Animated data bars","Frequency stats","Purple neural theme","Live clock"]},
{id:47,file:"projects/47-satellite/index.html",title:"Satellite Tracker UI",icon:"🛰",cat:"futuristic",cat2:"FUTURISTIC",desc:"Deep navy satellite panel with orbit animations, satellite pulse rings, telemetry stats and signal readout.",tg:["tb","tg"],tn:["Canvas","JS","CSS"],feats:["Orbit animation","Telemetry stats","Signal strength","Live timestamp","Pulse rings"]},
{id:48,file:"projects/48-neural/index.html",title:"Neural Network Viz",icon:"🧩",cat:"futuristic",cat2:"FUTURISTIC",desc:"Indigo neural interface with purple/blue accents, node pulse animations and forward propagation stats.",tg:["tp","tb"],tn:["Canvas","JS","CSS"],feats:["Node animations","Layer stats","Propagation UI","Indigo theme","Orbitron font"]},
{id:49,file:"projects/49-hologram/index.html",title:"Hologram Profile",icon:"🌐",cat:"futuristic",cat2:"FUTURISTIC",desc:"Electric-blue hologram card with 3D tilt effect, shimmer animation, scan line pulse and floating badges.",tg:["tb","tk"],tn:["CSS 3D","JS","Canvas"],feats:["3D tilt","Shimmer effect","Scan line","Floating badges","Blue hologram theme"]},
{id:50,file:"projects/50-futureos/index.html",title:"Future OS UI",icon:"🚀",cat:"futuristic",cat2:"FUTURISTIC",desc:"Orange-accent futuristic OS panel with dock, live clock, app grid, notification panel and data streams.",tg:["tb","tp","tg"],tn:["HTML","CSS","JS"],feats:["Live clock","App grid","Data stream","Notification UI","Orange accent theme"]},
];




/* ── isMob must be defined before desktop guard ── */
function isMob(){return window.matchMedia('(max-width:768px)').matches;}

/* ── SHARED functions (used by both desktop and mobile) ── */
function ic(cat){return{tools:'ib',apps:'ig',ui:'ip',games:'ik',futuristic:'it',dashboard:'ia'}[cat]||'ib';}
function render(f='all'){const g=document.getElementById('pgrid');if(!g)return;g.innerHTML='';const list=f==='all'?PJ:PJ.filter(p=>p.cat===f);list.forEach(p=>{const d=document.createElement('div');d.className='card';d.innerHTML=`<div class="ct"><div class="ci ${ic(p.cat)}">${p.icon}</div><div class="cn">#${String(p.id).padStart(2,'0')}</div></div><div class="ctitle">${p.title}</div><div class="cdesc">${p.desc.substring(0,90)}…</div><div class="ctags">${p.tn.map((t,i)=>`<span class="tag ${p.tg[i]||'tb'}">${t}</span>`).join('')}</div><div class="cf"><span class="ccat">${p.cat2}</span><span class="clink">VIEW →</span></div>`;d.addEventListener('click',()=>openModal(p));g.appendChild(d);});}
function filt(f,btn){document.querySelectorAll('.fb').forEach(b=>b.classList.remove('act'));btn.classList.add('act');render(f);}
function openModal(p){
  document.getElementById('m-icon').textContent=p.icon;
  document.getElementById('m-cat').textContent='/ '+p.cat2;
  document.getElementById('m-title').textContent=p.title;
  document.getElementById('m-desc').textContent=p.desc;
  document.getElementById('m-feats').innerHTML=p.feats.map(f=>`<span class="feat-pill">${f}</span>`).join('');
  document.getElementById('m-tags').innerHTML=p.tn.map((t,i)=>`<span class="tag ${p.tg[i]||'tb'}">${t}</span>`).join('');
  const link=document.getElementById('m-link');
  link.href=p.file;
  link.onclick=function(){closeModal();return true;};
  document.getElementById('modal-backdrop').classList.add('open');
}
function closeModal(){document.getElementById('modal-backdrop').classList.remove('open');}
function handleBD(e){if(e.target===document.getElementById('modal-backdrop'))closeModal();}
function cnt(id,n,d=1300){let v=0,s=n/(d/16);const t=setInterval(()=>{v=Math.min(v+s,n);document.getElementById(id).textContent=Math.floor(v);if(v>=n)clearInterval(t);},16);}

if(!isMob()){
  const pages=Array.from(document.querySelectorAll('#wrap .pg'));
  let cur=0,busy=false;const DUR=720;
  function go(idx){if(busy||idx===cur||idx<0||idx>=pages.length)return;busy=true;const from=pages[cur],to=pages[idx];const dn=idx>cur;from.classList.remove('on');from.classList.add(dn?'out-up':'out-dn');to.style.opacity='0';to.style.transform=dn?'translateY(80px)':'translateY(-80px)';to.style.transition='none';to.classList.add('on');requestAnimationFrame(()=>requestAnimationFrame(()=>{to.style.transition=`opacity ${DUR}ms cubic-bezier(.23,1,.32,1),transform ${DUR}ms cubic-bezier(.23,1,.32,1)`;to.style.opacity='1';to.style.transform='translateY(0)';}));setTimeout(()=>{from.classList.remove('out-up','out-dn');from.style.opacity=from.style.transform=from.style.transition='';to.style.transition=to.style.opacity=to.style.transform='';cur=idx;busy=false;syncUI();},DUR+50);}
  function syncUI(){document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('on',i===cur));document.querySelectorAll('.n-links a').forEach(a=>a.classList.toggle('act',+a.dataset.s===cur));}
  let wcd=false;
  window.addEventListener('wheel',e=>{if(busy||wcd)return;const pg=pages[cur];if(pg.id==='pg-proj'){if(e.deltaY>0&&pg.scrollHeight-pg.scrollTop-pg.clientHeight>5)return;if(e.deltaY<0&&pg.scrollTop>0)return;}wcd=true;setTimeout(()=>wcd=false,DUR+80);if(e.deltaY>0&&cur<pages.length-1)go(cur+1);else if(e.deltaY<0&&cur>0)go(cur-1);},{passive:true});
  window.addEventListener('keydown',e=>{if(busy)return;if(e.key==='ArrowDown'||e.key==='PageDown'){e.preventDefault();if(cur<pages.length-1)go(cur+1);}if(e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();if(cur>0)go(cur-1);}if(e.key==='Escape')closeModal();});
  const CR=document.getElementById('cur'),RR=document.getElementById('cur-r');
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;CR.style.left=mx+'px';CR.style.top=my+'px';});
  setInterval(()=>{rx+=(mx-rx)*.15;ry+=(my-ry)*.15;RR.style.left=rx+'px';RR.style.top=ry+'px';},16);
  document.addEventListener('mouseover',e=>{const t=e.target.closest('button,a,.card,.fb,.dot,.modal-view-btn,.modal-x');if(t){CR.style.width='20px';CR.style.height='20px';RR.style.width='52px';RR.style.height='52px';RR.style.borderColor='rgba(244,114,182,.6)';}else{CR.style.width='12px';CR.style.height='12px';RR.style.width='36px';RR.style.height='36px';RR.style.borderColor='rgba(56,189,248,.5)';}});
  setTimeout(()=>{cnt('c1',50);cnt('c2',6);cnt('c3',12);},300);
render();syncUI();
}/* end desktop only */



/* ── Mobile counter ── */
function mobCnt(id,n,d=1200){
  const el=document.getElementById(id);if(!el)return;
  let v=0,s=n/(d/16);
  const t=setInterval(()=>{v=Math.min(v+s,n);el.textContent=Math.floor(v);if(v>=n)clearInterval(t);},16);
}

/* ════════════════════════════════════════════
   MOBILE PAGE ENGINE — fully self-contained
   Does NOT rely on .on / .out-up / .out-dn
   Uses direct style manipulation only
   ════════════════════════════════════════════ */
const MOB_IDS=['pg-home','pg-proj','pg-about'];
let mobCur=0,mobBusy=false;
const MOB_DUR=600;

/* Hard-reset all pages to hidden */
function mobPageStyle(id, visible){
  const el=document.getElementById(id);
  if(!el)return;
  const isHome = id==='pg-home';
  const overflow = isHome ? 'hidden' : 'auto';
  if(visible){
    el.style.cssText=`position:absolute;inset:0;display:flex;flex-direction:column;opacity:1;visibility:visible;pointer-events:auto;transform:none;transition:none;overflow:${overflow};`;
  } else {
    el.style.cssText='position:absolute;inset:0;display:flex;flex-direction:column;opacity:0;visibility:hidden;pointer-events:none;transform:none;transition:none;overflow:hidden;';
  }
}

function mobHideAll(){
  MOB_IDS.forEach(id=>mobPageStyle(id,false));
}

/* Show one page instantly (no animation) */
function mobShowOnly(idx){
  mobHideAll();
  mobPageStyle(MOB_IDS[idx],true);
  mobCur=idx;
  syncIconNav();
}

function mobGo(idx){
  if(!isMob())return;
  idx=Math.max(0,Math.min(idx,MOB_IDS.length-1));
  if(mobBusy||idx===mobCur)return;
  mobBusy=true;

  const fromId=MOB_IDS[mobCur];
  const toId=MOB_IDS[idx];
  const fromEl=document.getElementById(fromId);
  const toEl=document.getElementById(toId);
  const goDown=idx>mobCur;
  const isToHome=toId==='pg-home';

  /* update index & nav immediately */
  mobCur=idx;
  syncIconNav();

  /* hide from-page instantly */
  mobPageStyle(fromId,false);

  /* position to-page off screen */
  toEl.style.cssText=`position:absolute;inset:0;display:flex;flex-direction:column;opacity:0;visibility:visible;pointer-events:none;overflow:${isToHome?'hidden':'auto'};transform:translateY(${goDown?'60px':'-60px'});transition:none;`;

  /* animate in */
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      toEl.style.transition=`opacity ${MOB_DUR}ms cubic-bezier(.25,1,.35,1),transform ${MOB_DUR}ms cubic-bezier(.25,1,.35,1)`;
      toEl.style.opacity='1';
      toEl.style.transform='translateY(0)';
    });
  });

  setTimeout(()=>{
    mobPageStyle(toId,true);
    if(toEl.scrollTop)toEl.scrollTop=0;
    mobBusy=false;
  },MOB_DUR+40);

  if(idx===0)setTimeout(()=>{mobCnt('mc1',50);mobCnt('mc2',6);mobCnt('mc3',12);},200);
}

function syncIconNav(){
  document.querySelectorAll('.mob-icon-btn').forEach((b,i)=>b.classList.toggle('mob-act',i===mobCur));
}

/* ── Swipe navigation ── */
let mst=0,msx=0,mSwipeLocked=false;
window.addEventListener('touchstart',e=>{
  mst=e.touches[0].clientY;
  msx=e.touches[0].clientX;
  mSwipeLocked=false;
},{passive:true});

window.addEventListener('touchend',e=>{
  if(!isMob()||mobBusy||mSwipeLocked)return;
  const dy=mst-e.changedTouches[0].clientY;
  const dx=msx-e.changedTouches[0].clientX;
  if(Math.abs(dy)<55||Math.abs(dy)<Math.abs(dx)*1.4)return;
  if(e.target.closest('.mob-filters'))return;
  /* on scrollable pages respect scroll boundary */
  const pg=document.getElementById(MOB_IDS[mobCur]);
  if(pg&&mobCur>0){
    if(dy>0&&pg.scrollHeight-pg.scrollTop-pg.clientHeight>8)return;
    if(dy<0&&pg.scrollTop>0)return;
  }
  mSwipeLocked=true;
  if(dy>0&&mobCur<MOB_IDS.length-1)mobGo(mobCur+1);
  else if(dy<0&&mobCur>0)mobGo(mobCur-1);
},{passive:true});

/* ── Mobile render ── */
function mobRender(f='all'){
  const g=document.getElementById('mob-pgrid');if(!g)return;
  g.innerHTML='';
  const list=f==='all'?PJ:PJ.filter(p=>p.cat===f);
  list.forEach(p=>{
    const cc={tools:'ib',apps:'ig',ui:'ip',games:'ik',futuristic:'it',dashboard:'ia'}[p.cat]||'ib';
    const d=document.createElement('div');
    d.className='mob-card';
    d.innerHTML=`<div class="mob-card-top"><div class="mob-card-icon ${cc}">${p.icon}</div><div class="mob-card-num">#${String(p.id).padStart(2,'0')}</div></div><div class="mob-card-title">${p.title}</div><div class="mob-card-cat"><span>${p.cat2}</span><span style="color:var(--accent);font-size:10px;">→</span></div>`;
    d.addEventListener('click',()=>openModal(p));
    g.appendChild(d);
  });
}
function mobFilt(f,btn){
  document.querySelectorAll('.mob-fb').forEach(b=>b.classList.remove('act'));
  btn.classList.add('act');mobRender(f);
}

/* ── Init ── */
(function initMobile(){
  if(!isMob())return;
  mobRender();
  mobShowOnly(0);
  setTimeout(()=>{mobCnt('mc1',50);mobCnt('mc2',6);mobCnt('mc3',12);},400);
})();

/* ── Re-init on resize ── */
let _lastMob=isMob();
window.addEventListener('resize',()=>{
  const m=isMob();
  if(m===_lastMob)return;
  _lastMob=m;
  if(m){mobRender();mobShowOnly(0);}
});
