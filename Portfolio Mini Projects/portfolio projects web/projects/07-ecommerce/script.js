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

const products=[
  {id:1,name:'Wireless Headphones',cat:'Electronics',price:59.99,icon:'🎧',rating:4.5,reviews:128,badge:'Best Seller',desc:'Premium noise-cancelling sound'},
  {id:2,name:'Smart Watch Pro',cat:'Electronics',price:129.99,icon:'⌚',rating:4.8,reviews:89,badge:'New',desc:'Health tracking & notifications'},
  {id:3,name:'Laptop Stand',cat:'Electronics',price:39.99,icon:'💻',rating:4.3,reviews:56,badge:'',desc:'Ergonomic aluminum design'},
  {id:4,name:'Mechanical Keyboard',cat:'Electronics',price:89.99,icon:'⌨',rating:4.7,reviews:203,badge:'Top Rated',desc:'RGB backlit, tactile switches'},
  {id:5,name:'Minimalist Tee',cat:'Clothing',price:24.99,icon:'👕',rating:4.2,reviews:44,badge:'',desc:'100% organic cotton'},
  {id:6,name:'Running Shoes',cat:'Clothing',price:89.99,icon:'👟',rating:4.6,reviews:167,badge:'Popular',desc:'Lightweight & breathable'},
  {id:7,name:'Clean Code Book',cat:'Books',price:34.99,icon:'📘',rating:4.9,reviews:512,badge:'Classic',desc:'Robert C. Martin'},
  {id:8,name:'Design Patterns',cat:'Books',price:29.99,icon:'📗',rating:4.7,reviews:289,badge:'',desc:'Gang of Four'},
  {id:9,name:'Desk Organizer',cat:'Home',price:22.99,icon:'🗂',rating:4.1,reviews:67,badge:'',desc:'Bamboo & steel design'},
  {id:10,name:'LED Desk Lamp',cat:'Home',price:44.99,icon:'💡',rating:4.4,reviews:134,badge:'Sale',desc:'Eye-care smart lighting'},
];
let cart={},shopCat='';
function setShopCat(c,btn){shopCat=c;document.querySelectorAll('#cat-filters .chip').forEach(b=>b.classList.remove('active'));btn.classList.add('active');filterProducts();}
function filterProducts(){
  const q=document.getElementById('shop-search').value.toLowerCase();
  const sort=document.getElementById('shop-sort').value;
  let list=products.filter(p=>(!shopCat||p.cat===shopCat)&&(p.name+p.desc+p.cat).toLowerCase().includes(q));
  if(sort==='price-asc')list.sort((a,b)=>a.price-b.price);
  else if(sort==='price-desc')list.sort((a,b)=>b.price-a.price);
  else if(sort==='rating')list.sort((a,b)=>b.rating-a.rating);
  const g=document.getElementById('shop-grid');
  if(!list.length){g.innerHTML='<div class="empty" style="grid-column:1/-1"><div class="empty-icon">🔍</div><p>No products found</p></div>';return;}
  g.innerHTML=list.map(p=>`
  <div class="card card-hover" style="cursor:pointer;position:relative" onclick="addToCart(${p.id})">
    ${p.badge?`<span style="position:absolute;top:10px;right:10px;background:var(--accent4);color:#000;font-size:9px;font-weight:700;padding:2px 7px;border-radius:20px;letter-spacing:.05em">${p.badge}</span>`:''}
    <div style="font-size:52px;text-align:center;padding:16px 0;margin-bottom:8px">${p.icon}</div>
    <div style="font-size:13px;font-weight:700;margin-bottom:3px">${p.name}</div>
    <div style="font-size:11px;color:var(--muted);margin-bottom:6px">${p.desc}</div>
    <div class="row" style="gap:4px;margin-bottom:10px;font-size:11px;color:var(--accent5)">
      ${'⭐'.repeat(Math.round(p.rating))} <span style="color:var(--muted)">(${p.reviews})</span>
    </div>
    <div class="row between align">
      <span style="font-family:'JetBrains Mono',monospace;font-size:16px;color:var(--accent);font-weight:700">$${p.price}</span>
      <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();addToCart(${p.id})">+ Add</button>
    </div>
    ${cart[p.id]?`<div style="margin-top:8px;text-align:center;font-size:11px;color:var(--accent3)">✓ ${cart[p.id]} in cart</div>`:''}
  </div>`).join('');
}
function addToCart(id){cart[id]=(cart[id]||0)+1;updateCart();filterProducts();const p=products.find(x=>x.id===id);toast(`🛒 Added ${p.name}`);}
function removeFromCart(id){if(cart[id]>1)cart[id]--;else delete cart[id];updateCart();renderCartItems();}
function updateCart(){const total=Object.entries(cart).reduce((s,[id,q])=>s+(products.find(x=>x.id==id)?.price||0)*q,0);const count=Object.values(cart).reduce((s,v)=>s+v,0);document.getElementById('cart-badge').textContent=count;document.getElementById('cart-total').textContent=total.toFixed(2);save('shop-cart',cart);}
function renderCartItems(){const items=Object.entries(cart).filter(([,q])=>q>0);document.getElementById('cart-empty').style.display=items.length?'none':'block';document.getElementById('cart-footer').style.display=items.length?'block':'none';document.getElementById('cart-items').innerHTML=items.map(([id,q])=>{const p=products.find(x=>x.id==id);return`<div class="row align between" style="padding:8px 0;border-bottom:1px solid var(--border)"><span style="font-size:22px">${p.icon}</span><span style="flex:1;font-size:13px;margin:0 10px">${p.name}</span><div class="row align" style="gap:8px"><button onclick="removeFromCart(${id})" class="btn btn-xs btn-ghost">-</button><span style="font-family:'JetBrains Mono',monospace;font-size:13px">${q}</span><button onclick="cart[${id}]=${q}+1;updateCart();renderCartItems()" class="btn btn-xs btn-ghost">+</button><span style="font-family:'JetBrains Mono',monospace;color:var(--accent);font-size:13px">$${(p.price*q).toFixed(2)}</span><button onclick="delete cart[${id}];updateCart();renderCartItems()" class="btn btn-xs btn-danger">✕</button></div></div>`;}).join('');}
function toggleCart(){const p=document.getElementById('cart-panel');p.style.display=p.style.display==='none'?'block':'none';if(p.style.display!=='none')renderCartItems();}
function checkout(){if(!Object.keys(cart).length){toast('Cart is empty!');return;}cart={};updateCart();document.getElementById('cart-panel').style.display='none';toast('🎉 Order placed! Thank you for shopping with ShopOS!');}
cart=load('shop-cart')||{};updateCart();filterProducts();
