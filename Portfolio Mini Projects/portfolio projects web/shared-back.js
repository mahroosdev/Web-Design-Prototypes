(function(){
  const PORTFOLIO = 'index.html';

  function goBack(){
    try{ window.location.href = PORTFOLIO; }catch(e){ history.back(); }
  }

  // expose globally for inline onclick attributes
  window.goBack = goBack;

  function ensureTopbar(){
    // If topbar already exists attach handler
    if(document.getElementById('devos-topbar')){
      const btn = document.querySelector('#devos-topbar .devos-back');
      if(btn){ btn.removeEventListener('click', goBack); btn.addEventListener('click', goBack); }
    } else {
      const top = document.createElement('div');
      top.id = 'devos-topbar';
      top.innerHTML = '<div class="devos-logo">DEVOS</div><button class="devos-back">← Back</button>';
      document.body.insertBefore(top, document.body.firstChild);
      top.querySelector('.devos-back').addEventListener('click', goBack);
    }

    // Attach to any existing back-btn elements as well
    document.querySelectorAll('.back-btn').forEach(b=>{ b.removeEventListener('click', goBack); b.addEventListener('click', goBack); });

    // Hide existing page headers/navs to enforce consistent topbar
    document.querySelectorAll('nav, .nav, header, .top').forEach(el => { if(el.id !== 'devos-topbar') el.style.display = 'none'; });

    // Add shared styles (once)
    if(!document.getElementById('shared-back-style')){
      const style = document.createElement('style');
      style.id = 'shared-back-style';
      style.innerHTML = `
#devos-topbar{position:fixed;top:12px;left:12px;right:12px;display:flex;justify-content:space-between;align-items:center;padding:10px 18px;background:rgba(5,8,12,0.6);backdrop-filter:blur(8px);border-radius:10px;z-index:99999}
#devos-topbar .devos-logo{font-weight:700;color:#fff;font-family:Syne,system-ui}
#devos-topbar .devos-back{border:1px solid #00e0ff;background:transparent;color:#00e0ff;padding:6px 12px;border-radius:8px;cursor:pointer}
.devos-nav-placeholder{height:52px}
`;
      document.head.appendChild(style);

      // Insert a small spacer so the topbar doesn't overlap page content
      const spacer = document.createElement('div');
      spacer.className = 'devos-nav-placeholder';
      if(document.body.firstChild) document.body.insertBefore(spacer, document.body.firstChild.nextSibling);
      else document.body.appendChild(spacer);
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', ensureTopbar);
  else ensureTopbar();
  // --- structure injection: hero, features, tech (only if missing) ---
  function ensureStructure(){
    // helper: get short title from document.title
    function shortTitle(){
      const t = (document.title||'').split('|')[0].split('-')[0].trim();
      return t || 'Project';
    }

    function getDescription(){
      const md = document.querySelector('meta[name="description"]');
      if(md && md.content) return md.content;
      // try to find a first paragraph with some text
      const p = document.querySelector('body p');
      if(p && p.innerText.trim().length>20) return p.innerText.trim();
      return '';
    }

    // Add minimal styles for hero/features/tech if not present
    if(!document.getElementById('shared-structure-style')){
      const s = document.createElement('style');
      s.id = 'shared-structure-style';
      s.innerHTML = `
      .hero{padding:40px 28px}
      .hero h1{font-size:32px;margin-bottom:6px}
      .hero p{color:rgba(234,242,255,.7)}
      .demo{display:flex;justify-content:center;padding:36px}
      .features,.tech{padding:32px}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
      .card{background:rgba(18,24,33,.9);padding:12px;border-radius:10px}
      .tag{border:1px solid rgba(0,224,255,.2);padding:6px 10px;border-radius:20px;margin-right:8px;display:inline-block}
      `;
      document.head.appendChild(s);
    }

    if(!document.querySelector('.hero')){
      const h = document.createElement('section');
      h.className = 'hero';
      h.innerHTML = `<h1>${shortTitle()}</h1><p>${getDescription()}</p>`;
      // insert after topbar spacer if present
      const spacer = document.querySelector('.devos-nav-placeholder');
      if(spacer && spacer.nextSibling) spacer.parentNode.insertBefore(h, spacer.nextSibling);
      else document.body.insertBefore(h, document.body.firstChild ? document.body.firstChild.nextSibling : null);
    }

    if(!document.querySelector('.features')){
      const f = document.createElement('section');
      f.className = 'features';
      f.innerHTML = `<h2>Features</h2><div class="grid"><div class="card">Feature 1</div><div class="card">Feature 2</div><div class="card">Feature 3</div></div>`;
      document.body.appendChild(f);
    }

    if(!document.querySelector('.tech')){
      const t = document.createElement('section');
      t.className = 'tech';
      t.innerHTML = `<h2>Tech</h2><div><span class="tag">HTML</span><span class="tag">CSS</span><span class="tag">JavaScript</span></div>`;
      document.body.appendChild(t);
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', ensureStructure);
  else ensureStructure();

  // --- normalize layout: move main preview into centered preview area and organize sections ---
  function normalizeLayout(){
    if(document.getElementById('project-main-wrap')) return;

    // Create main wrap
    const main = document.createElement('main');
    main.id = 'project-main-wrap';
    main.className = 'project-wrap';

    // create preview section
    const previewSection = document.createElement('section');
    previewSection.className = 'demo';
    const previewWrapper = document.createElement('div');
    previewWrapper.className = 'preview-wrapper';
    previewSection.appendChild(previewWrapper);

    // find insertion point (after hero if exists)
    const hero = document.querySelector('.hero');
    const spacer = document.querySelector('.devos-nav-placeholder');
    if(hero){
      // insert main after hero
      if(hero.nextSibling) hero.parentNode.insertBefore(main, hero.nextSibling);
      else hero.parentNode.appendChild(main);
    } else if(spacer){
      if(spacer.nextSibling) spacer.parentNode.insertBefore(main, spacer.nextSibling);
      else spacer.parentNode.appendChild(main);
    } else {
      document.body.appendChild(main);
    }

    // append preview into main
    main.appendChild(previewSection);

    // add layout styles
    if(!document.getElementById('shared-layout-style')){
      const ls = document.createElement('style');
      ls.id = 'shared-layout-style';
      ls.innerHTML = `
      #project-main-wrap{max-width:1100px;margin:28px auto;padding:18px}
      .project-wrap .demo{display:flex;justify-content:center;padding:36px}
      .preview-wrapper{max-width:540px;width:100%;display:flex;justify-content:center;align-items:center;min-height:320px}
      .features .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
      @media(max-width:768px){#project-main-wrap{padding:12px}.preview-wrapper{min-height:220px}}
      `;
      document.head.appendChild(ls);
    }

    // find a preview candidate: largest visible element not in hero/features/tech/topbar/modal
    try{
      const all = Array.from(document.querySelectorAll('body *'));
      const candidates = all.filter(el=>{
        if(!el.offsetParent) return false; // not visible
        if(el.id==='devos-topbar' || el.classList.contains('devos-nav-placeholder')) return false;
        if(el.closest('.hero') || el.closest('.features') || el.closest('.tech') || el.closest('#modal-backdrop')) return false;
        const t = el.tagName.toLowerCase();
        if(['script','style','link','meta','head','title','svg','canvas'].includes(t)) return false;
        // skip very small elements
        const r = el.getBoundingClientRect();
        if(r.width < 80 || r.height < 40) return false;
        return true;
      });

      let best = null; let bestArea = 0;
      candidates.forEach(el=>{
        const r = el.getBoundingClientRect();
        const area = r.width * r.height;
        if(area > bestArea){ bestArea = area; best = el; }
      });

      // only move if best is meaningful
      if(best && bestArea > 3000){
        // avoid moving the hero or our preview wrapper itself
        if(!best.classList.contains('preview-wrapper') && !best.classList.contains('demo')){
          // move the element into previewWrapper
          previewWrapper.appendChild(best);
        }
      } else {
        // no good candidate — create placeholder box
        const ph = document.createElement('div');
        ph.style.width = '100%';
        ph.style.minHeight = '280px';
        ph.style.background = 'linear-gradient(90deg, rgba(255,255,255,.02), rgba(255,255,255,.01))';
        ph.style.borderRadius = '12px';
        ph.style.display = 'flex';
        ph.style.alignItems = 'center';
        ph.style.justifyContent = 'center';
        ph.innerText = 'Preview area';
        previewWrapper.appendChild(ph);
      }
    }catch(e){
      console.warn('normalizeLayout error',e);
    }

    // move existing features and tech sections into main (if present)
    const features = document.querySelector('.features');
    if(features) main.appendChild(features);
    const tech = document.querySelector('.tech');
    if(tech) main.appendChild(tech);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ ensureStructure(); normalizeLayout(); });
  else { ensureStructure(); normalizeLayout(); }

  // --- populate hero/features/tech from PJ metadata in index.html when available ---
  function populateFromPJ(){
    try{
      const href = location.href || '';
      const file = href.split('/').pop().split('?')[0].split('#')[0];
      if(!file) return;

      fetch('index.html').then(r=>r.text()).then(txt=>{
        const m = txt.match(/const\s+PJ\s*=\s*(\[[\s\S]*?\]);/);
        if(!m) return;
        let arr;
        try{ arr = eval('(' + m[1] + ')'); }catch(e){ console.warn('PJ eval failed',e); return; }
        if(!Array.isArray(arr)) return;
        const p = arr.find(x=> (x.file||'').split('/').pop()===file || (x.file||'')===file );
        if(!p) return;

        // set hero
        const hero = document.querySelector('.hero');
        if(hero){
          const h = hero.querySelector('h1'); if(h) h.textContent = (p.icon? (p.icon+' '):'') + p.title;
          const pd = hero.querySelector('p'); if(pd) pd.textContent = p.desc || '';
        }

        // set features
        const features = document.querySelector('.features');
        if(features){
          const grid = features.querySelector('.grid') || (function(){ const g=document.createElement('div'); g.className='grid'; features.appendChild(g); return g; })();
          grid.innerHTML = '';
          (p.feats||[]).forEach(f => { const c=document.createElement('div'); c.className='card'; c.textContent = f; grid.appendChild(c); });
        }

        // set tech
        const tech = document.querySelector('.tech');
        if(tech){
          const container = tech.querySelector('div') || (function(){ const d=document.createElement('div'); tech.appendChild(d); return d; })();
          container.innerHTML = '';
          (p.tn||[]).forEach((t,i)=>{ const s=document.createElement('span'); s.className = 'tag ' + ((p.tg&&p.tg[i])||'tb'); s.textContent = t; container.appendChild(s); });
        }
      }).catch(e=>{ /* ignore fetch errors */ });
    }catch(e){ console.warn('populateFromPJ error',e); }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', populateFromPJ);
  else populateFromPJ();

})();
