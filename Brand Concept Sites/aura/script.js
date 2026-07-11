(function(){
'use strict';

/* ── PRELOADER ── */
const pre=document.getElementById('pre'),prog=document.getElementById('pprog');
let pct=0;
const piv=setInterval(()=>{
  pct+=Math.random()*10+2;
  if(pct>=100){
    pct=100;clearInterval(piv);
    setTimeout(()=>{pre.classList.add('out');},200);
  }
  prog.style.width=Math.min(pct,100)+'%';
},100);

/* ── CURSOR ── */
const cdot=document.getElementById('cdot');
const cring=document.getElementById('cring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
document.addEventListener('mousedown',()=>document.body.classList.add('h-clk'));
document.addEventListener('mouseup',()=>document.body.classList.remove('h-clk'));
document.querySelectorAll('a,button').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('h-hov'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('h-hov'));
});
(function animCur(){
  rx+=(mx-rx)*.13;ry+=(my-ry)*.13;
  if(cdot){cdot.style.left=mx+'px';cdot.style.top=my+'px';}
  if(cring){cring.style.left=rx+'px';cring.style.top=ry+'px';}
  requestAnimationFrame(animCur);
})();

/* ── SMOOTH SCROLL ── */
window.smoothTo=function(id){
  const el=document.getElementById(id);
  if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
};

/* ── MOBILE MENU ── */
window.toggleMenu=function(){document.body.classList.toggle('menu-open');};
window.closeMenu=function(){document.body.classList.remove('menu-open');};
window.mobGo=function(id){closeMenu();setTimeout(()=>smoothTo(id),400);};

/* ── NAV SCROLL ── */
const nav=document.getElementById('nav');
function onScroll(){
  nav.classList.toggle('sc',window.scrollY>60);
  /* Parallax story image */
  const pax=document.getElementById('pax');
  if(pax){
    const rect=pax.closest('section').getBoundingClientRect();
    const p=1-(rect.top/window.innerHeight);
    if(p>-.6&&p<1.6)pax.style.transform='translateY('+(p-.5)*86+'px)';
  }
  /* Scroll reveal */
  document.querySelectorAll('.r:not(.on)').forEach(el=>{
    if(el.getBoundingClientRect().top<window.innerHeight*.91)el.classList.add('on');
  });
}
window.addEventListener('scroll',onScroll,{passive:true});
setTimeout(onScroll,180);

/* ── TICKER ── */
const tw=['Est. 2019','Single Origin','Ethiopia Yirgacheffe','Cold Brew · 18 Hours','Copenhagen Studio','Carbon Neutral Shipping','Ethically Sourced','Small-Batch Roasted','Third Wave Coffee','Obsessive Precision','12 Origin Farms','SCA Score 87+'];
const tw2=document.getElementById('ticker-wrap');
[...tw,...tw,...tw].forEach(w=>{
  const s=document.createElement('span');s.className='tick-item';
  s.innerHTML='<span class="tick-sep"></span>'+w;
  tw2.appendChild(s);
});

/* ── SPLIT CHAR hero ── */
function splitChars(el,delay){
  const txt=el.textContent;el.innerHTML='';el.style.display='inline';
  [...txt].forEach((c,i)=>{
    if(c===' '){el.appendChild(document.createTextNode('\u00A0'));return;}
    const s=document.createElement('span');s.className='char';s.textContent=c;
    s.style.setProperty('--tx',((Math.random()-.5)*48)+'px');
    s.style.setProperty('--ty',(Math.random()*44+12)+'px');
    s.style.setProperty('--rot',((Math.random()-.5)*14)+'deg');
    s.style.animationDelay=(delay+i*.052)+'s';
    el.appendChild(s);
  });
}
const hw=document.getElementById('hw');
if(hw)splitChars(hw,.5);

/* ── PROCESS DRAG (mouse + touch) ── */
const pt=document.getElementById('proc-track');
let dragging=false,startX=0,scrollStart=0;
pt.addEventListener('mousedown',e=>{dragging=true;startX=e.pageX-pt.offsetLeft;scrollStart=pt.scrollLeft;pt.style.cursor='grabbing';});
document.addEventListener('mouseup',()=>{dragging=false;if(pt)pt.style.cursor='grab';});
document.addEventListener('mousemove',e=>{if(!dragging)return;e.preventDefault();pt.scrollLeft=scrollStart-(e.pageX-pt.offsetLeft-startX)*1.2;});
/* Touch */
let tStartX=0,tScrollStart=0;
pt.addEventListener('touchstart',e=>{tStartX=e.touches[0].pageX;tScrollStart=pt.scrollLeft;},{passive:true});
pt.addEventListener('touchmove',e=>{pt.scrollLeft=tScrollStart-(e.touches[0].pageX-tStartX);},{passive:true});

/* ── TOAST ── */
window.toast=function(msg,type){
  const tc=document.getElementById('toasts');
  const t=document.createElement('div');t.className='toast';
  const colors={success:'#1C6B32',cart:'#C49A56',info:'#4A6A9A','':'#5C574F'};
  t.style.borderLeftColor=colors[type]||colors[''];
  const dot=document.createElement('span');
  dot.style.cssText='width:5px;height:5px;border-radius:50%;flex-shrink:0;background:'+(colors[type]||colors['']);
  t.appendChild(dot);t.appendChild(document.createTextNode(msg));
  tc.appendChild(t);
  requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add('in')));
  setTimeout(()=>{t.classList.remove('in');setTimeout(()=>t.remove(),440);},3500);
};

/* ── CART ── */
let cart=[];
function renderCart(){
  const ci=document.getElementById('cart-items');
  const ct=document.getElementById('cart-total');
  const cb=document.getElementById('bag-count');
  const cf=document.getElementById('cart-foot');
  ci.innerHTML='';
  let sum=0,cnt=0;
  if(!cart.length){
    ci.innerHTML='<div class="cart-empty-state"><div class="cart-empty-icon">◌</div><div class="cart-empty-lbl">Your bag is empty</div></div>';
    cf.style.display='none';
  } else {
    cf.style.display='block';
    cart.forEach((item,i)=>{
      sum+=item.price*item.qty;cnt+=item.qty;
      const row=document.createElement('div');row.className='cart-row';
      row.innerHTML=
        '<div>'+
          '<div class="cr-name">'+item.name+'</div>'+
          '<div class="cr-price">$'+item.price+' per bag</div>'+
        '</div>'+
        '<div style="display:flex;align-items:center;gap:7px">'+
          '<div class="cr-ctrl">'+
            '<button class="cr-btn" onclick="cq('+i+',-1)">−</button>'+
            '<div class="cr-qty">'+item.qty+'</div>'+
            '<button class="cr-btn" onclick="cq('+i+',1)">+</button>'+
          '</div>'+
          '<button class="cr-del" onclick="cr('+i+')">✕</button>'+
        '</div>';
      ci.appendChild(row);
    });
  }
  ct.textContent='$'+sum;
  cb.textContent=cnt;
  cb.style.display=cnt>0?'flex':'none';
}
window.addToCart=function(name,price,btnId){
  const ex=cart.find(c=>c.name===name);
  if(ex)ex.qty++;else cart.push({name,price,qty:1});
  renderCart();
  const btn=document.getElementById(btnId);
  if(btn){
    const orig=btn.textContent;
    btn.textContent='Added ✓';btn.classList.add('added');
    setTimeout(()=>{btn.textContent=orig;btn.classList.remove('added');},1800);
  }
  toast(name+' added to your bag','cart');
};
window.cq=function(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);renderCart();};
window.cr=function(i){cart.splice(i,1);renderCart();toast('Item removed from bag','');};
window.openCart=function(){
  renderCart();
  document.getElementById('cart-veil').style.opacity='1';
  document.getElementById('cart-veil').style.pointerEvents='all';
  document.getElementById('cart').style.transform='translateX(0)';
};
window.closeCart=function(){
  document.getElementById('cart-veil').style.opacity='0';
  document.getElementById('cart-veil').style.pointerEvents='none';
  document.getElementById('cart').style.transform='translateX(100%)';
};
window.checkout=function(){
  if(!cart.length){toast('Your bag is empty','');return;}
  toast('Redirecting to secure checkout…','success');
  setTimeout(closeCart,900);
};
renderCart();

/* ── MODAL ── */
window.modal=function(title,body){
  document.getElementById('m-title').textContent=title;
  document.getElementById('m-body').textContent=body;
  document.getElementById('modal-bg').classList.add('open');
};
window.closeModal=function(){document.getElementById('modal-bg').classList.remove('open');};

/* ── NEWSLETTER ── */
window.subscribeNL=function(){
  const em=document.getElementById('nl-email').value.trim();
  if(!em||!em.includes('@')||!em.includes('.')){toast('Please enter a valid email address','');return;}
  document.getElementById('nl-email').value='';
  toast('You\'re subscribed to the Harvest Bulletin.','success');
};

})();
