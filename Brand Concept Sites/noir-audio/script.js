/* ============================================
   NOIR — Premium Audio Instruments
   script.js
   ============================================ */

'use strict';

/* FOUC guard — add preload immediately, remove after first render */
document.documentElement.classList.add('preload');

const { useState, useEffect, useRef, useCallback, useMemo, createElement: h, Fragment } = React;

/* ───────────────────────────────────────────────────────
   UNIQUE ID GENERATOR  (prevents SVG filter/gradient conflicts)
   ─────────────────────────────────────────────────────── */
let _id = 0;
const uid = () => `n${++_id % 9999999}`;

/* ───────────────────────────────────────────────────────
   DATA
   ─────────────────────────────────────────────────────── */
const PRODUCTS = [
  { id:1, name:'NOIR APEX',    sub:'Over-Ear Reference Monitor',  price:2400, tag:'FLAGSHIP',  ac:'#C8A96E',
    img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&h=520&q=85&auto=format&fit=crop',
    specs:[['Drivers','40mm Beryllium-Coated Titanium'],['THD','< 0.001 % @ 1 kHz'],['Response','5 Hz – 50 kHz'],['Impedance','32 Ω'],['Weight','298 g'],['Cable','2.5 m OFC Detachable']],
    desc:'Five years of acoustic research. 40 mm beryllium-coated titanium diaphragms deliver perfect pistonic motion across the full audible spectrum—simultaneously clinical in accuracy and emotionally rewarding in musicality.' },
  { id:2, name:'NOIR ZERO',    sub:'In-Ear Reference Monitor',    price:1800, tag:'IEM',        ac:'#7A9AB8',
    img:'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&h=520&q=85&auto=format&fit=crop',
    specs:[['Drivers','6 mm Planar Magnetic Array'],['Noise Floor','−110 dB'],['Connector','Custom Recessed MMCX'],['Shell','CNC Titanium'],['Weight','8 g each'],['Tips','3 sizes silicone + foam']],
    desc:'Six planar magnetic elements per ear in a CNC titanium shell machined to 0.005 mm tolerance. Images with the precision of a full-size studio monitor at just 8 g per side.' },
  { id:3, name:'NOIR DAC·X',   sub:'Desktop DAC / Amplifier',     price:3200, tag:'SOURCE',     ac:'#6EA882',
    img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=520&q=85&auto=format&fit=crop',
    specs:[['DAC Chip','ESS Sabre ES9038Pro'],['Output Power','4 W @ 32 Ω balanced'],['SNR','132 dB'],['Inputs','USB-C · Optical · Coax'],['Outputs','4.4 mm · XLR · RCA'],['PCM','Up to 768 kHz / 32-bit']],
    desc:'Flagship ES9038Pro with a fully discrete Class-A output stage and balanced XLR outputs. Zero measurable noise-floor artifacts. The source component every NOIR transducer was designed around.' },
  { id:4, name:'NOIR CABLE·S', sub:'Silver Litz Reference Cable', price:620,  tag:'ACCESSORY',  ac:'#B8B0A0',
    img:'https://images.unsplash.com/photo-1608534009826-c0b3e44be960?w=700&h=520&q=85&auto=format&fit=crop',
    imgFallback:'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=700&h=520&q=85&auto=format&fit=crop',
    specs:[['Conductor','6N OCC Silver Litz'],['Length','1.2 m'],['Termination','4.4 mm Pentaconn'],['Braid','8-strand hand-braided'],['Connector','Rhodium-plated MMCX'],['Geometry','Multi-strand twisted']],
    desc:'Six-nines OCC silver in a Litz geometry to minimise skin effect and strand interaction. Hand-braided over 14 days and burned in for 72 hours before leaving our atelier.' },
];

const FEATURES = [
  { tag:'TRANSDUCERS', title:'Beryllium-Coated\nTitanium Architecture',
    body:'40 mm beryllium-coated titanium diaphragms are 40× stiffer than conventional mylar, enabling perfect pistonic motion across the full audible spectrum without resonance breakup at any frequency.' },
  { tag:'ACOUSTICS',   title:'Asymmetric\nChamber Design',
    body:'Rear-chamber geometry tuned across 2,400 acoustic simulations eliminates resonance peaks while preserving the natural decay characteristics of live instruments.' },
  { tag:'MATERIALS',   title:'Forged Magnesium\nAlloy Housing',
    body:'Machined from aerospace-grade magnesium alloy. The housing weighs just 298 g with a rigidity-to-mass ratio that eliminates micro-vibrations during even the longest listening sessions.' },
  { tag:'TECHNOLOGY',  title:'Adaptive Spatial\nAudio Engine',
    body:'HRTF-personalised spatial processing on a dedicated DSP chip delivers head-tracked binaural rendering with under 2 ms latency on all supported devices.' },
];

const NAV_ITEMS  = [['PRODUCTS','collection'],['TECHNOLOGY','engineering'],['STUDIO','studio'],['ABOUT','about']];
const FOOT_COLS  = [
  ['PRODUCTS', [['APEX Headphones','collection'],['ZERO IEM','collection'],['DAC·X Source','collection'],['CABLE·S','collection']]],
  ['COMPANY',  [['Atelier','studio'],['Technology','engineering'],['Journal','about'],['Contact','about']]],
  ['SUPPORT',  [['Warranty','about'],['Repairs','about'],['Register','about'],['FAQ','about']]],
];

/* ───────────────────────────────────────────────────────
   SVG ILLUSTRATIONS  (unique IDs per instance)
   ─────────────────────────────────────────────────────── */
function Headphones({ ac, sz = 300, dk = true }) {
  const id = useRef(uid()).current;
  const band  = dk ? ['#3c3c3c','#090909'] : ['#d0cdc8','#a8a5a0'];
  const cupHi = dk ? '#424242' : '#d8d5d0';
  const cupLo = dk ? '#101010' : '#b0aca8';
  const inner = dk ? '#181818' : '#c8c5c0';
  const deep  = dk ? '#0c0c0c' : '#b8b5b0';
  const cab   = dk ? '#242424' : '#c0bcb8';
  return h('svg',{ width:sz, height:sz, viewBox:'0 0 300 300', fill:'none', style:{overflow:'visible',flexShrink:0} },
    h('defs',null,
      h('radialGradient',{id:`hbd${id}`,cx:'50%',cy:'40%',r:'60%'},h('stop',{offset:'0%',stopColor:band[0]}),h('stop',{offset:'100%',stopColor:band[1]})),
      h('radialGradient',{id:`hcp${id}`,cx:'30%',cy:'30%',r:'70%'},h('stop',{offset:'0%',stopColor:cupHi}),h('stop',{offset:'100%',stopColor:cupLo})),
      h('filter',{id:`hgw${id}`,x:'-40%',y:'-40%',width:'180%',height:'180%'},
        h('feDropShadow',{dx:'0',dy:'12',stdDeviation:'18',floodColor:ac,floodOpacity:'.38'}))
    ),
    /* band */
    h('path',{d:'M76 155 Q150 52 224 155',stroke:`url(#hbd${id})`,strokeWidth:'14',fill:'none',strokeLinecap:'round',filter:`url(#hgw${id})`}),
    h('path',{d:'M76 155 Q150 54 224 155',stroke:ac,strokeWidth:'0.9',fill:'none',strokeLinecap:'round',opacity:'.52'}),
    /* left cup */
    h('ellipse',{cx:'70',cy:'162',rx:'30',ry:'38',fill:`url(#hcp${id})`,filter:`url(#hgw${id})`}),
    h('ellipse',{cx:'70',cy:'162',rx:'21',ry:'27',fill:inner}),
    h('ellipse',{cx:'70',cy:'162',rx:'13',ry:'17',fill:deep}),
    h('ellipse',{cx:'70',cy:'162',rx:'7', ry:'9.5',fill:ac,opacity:'.50'}),
    h('circle', {cx:'70',cy:'162',r:'3',  fill:ac}),
    h('path',   {d:'M57 148 Q65 141 77 144',stroke:'rgba(255,255,255,.06)',strokeWidth:'1.5',fill:'none'}),
    /* right cup */
    h('ellipse',{cx:'230',cy:'162',rx:'30',ry:'38',fill:`url(#hcp${id})`,filter:`url(#hgw${id})`}),
    h('ellipse',{cx:'230',cy:'162',rx:'21',ry:'27',fill:inner}),
    h('ellipse',{cx:'230',cy:'162',rx:'13',ry:'17',fill:deep}),
    h('ellipse',{cx:'230',cy:'162',rx:'7', ry:'9.5',fill:ac,opacity:'.50'}),
    h('circle', {cx:'230',cy:'162',r:'3',  fill:ac}),
    /* cable */
    h('path',{d:'M93 194 Q150 228 207 194',stroke:cab,strokeWidth:'2.5',fill:'none',strokeLinecap:'round'}),
    h('path',{d:'M150 228 L150 246',stroke:cab,strokeWidth:'2.5',strokeLinecap:'round'}),
    h('circle',{cx:'150',cy:'250',r:'5',fill:cab}),
    /* shine */
    h('path',{d:'M108 82 Q150 62 192 82',stroke:'rgba(255,255,255,.04)',strokeWidth:'3',fill:'none',strokeLinecap:'round'})
  );
}

function IEM({ ac, sz = 160, dk = true }) {
  const id = useRef(uid()).current;
  const s0 = dk ? '#363840' : '#d0cece', s1 = dk ? '#0c0d11' : '#bfbcba';
  const in2 = dk ? '#191a21' : '#b8b5b2', cab = dk ? '#18181f' : '#c0bebb', noz = dk ? '#23242e' : '#b0aeb0';
  return h('svg',{ width:sz, height:sz, viewBox:'0 0 170 170', fill:'none', style:{flexShrink:0} },
    h('defs',null,
      h('radialGradient',{id:`ieg${id}`,cx:'35%',cy:'30%',r:'70%'},h('stop',{offset:'0%',stopColor:s0}),h('stop',{offset:'100%',stopColor:s1})),
      h('filter',{id:`ief${id}`,x:'-40%',y:'-40%',width:'180%',height:'180%'},h('feDropShadow',{dx:'0',dy:'10',stdDeviation:'13',floodColor:ac,floodOpacity:'.28'}))
    ),
    h('path',{d:'M55 82 Q47 62 62 47 Q81 40 98 52 Q104 62 101 82 Q96 97 81 104 Q63 107 55 92Z',fill:`url(#ieg${id})`,filter:`url(#ief${id})`}),
    h('path',{d:'M55 82 Q47 62 62 47 Q81 40 98 52 Q104 62 101 82 Q96 97 81 104 Q63 107 55 92Z',stroke:ac,strokeWidth:'.7',fill:'none',opacity:'.4'}),
    h('ellipse',{cx:'78',cy:'73',rx:'12',ry:'15',fill:in2,opacity:'.9'}),
    h('circle', {cx:'78',cy:'73',r:'5.5',fill:ac,opacity:'.42'}),
    h('circle', {cx:'78',cy:'73',r:'2.8',fill:ac}),
    h('rect',   {x:'42',y:'88',width:'14',height:'8',rx:'4',fill:noz,transform:'rotate(-30 49 92)'}),
    h('path',   {d:'M68 102 Q85 120 103 102',stroke:cab,strokeWidth:'2.5',fill:'none',strokeLinecap:'round'}),
    h('path',   {d:'M85 120 L85 135',stroke:cab,strokeWidth:'2.5',strokeLinecap:'round'}),
    h('path',   {d:'M58 55 Q72 48 86 51',stroke:'rgba(255,255,255,.07)',strokeWidth:'1.5',fill:'none',strokeLinecap:'round'})
  );
}

function DAC({ ac, sz = 160, dk = true }) {
  const id = useRef(uid()).current;
  const b0 = dk?'#222':'#d8d5d0', b1 = dk?'#0c0c0c':'#c4c1bc', dp = dk?'#070707':'#e8e5e0';
  const kn  = dk?'#121212':'#c8c5c0', kn2 = dk?'#0a0a0a':'#b8b5b0', pt = dk?'#111':'#ccc';
  const bd1 = dk?'rgba(255,255,255,.06)':'rgba(0,0,0,.08)';
  const bd2 = dk?'rgba(255,255,255,.04)':'rgba(0,0,0,.06)';
  const bd3 = dk?'rgba(255,255,255,.05)':'rgba(0,0,0,.08)';
  const bd4 = dk?'rgba(255,255,255,.07)':'rgba(0,0,0,.10)';
  const tx1 = dk?'rgba(255,255,255,.38)':'rgba(0,0,0,.38)';
  const tx2 = dk?'rgba(255,255,255,.18)':'rgba(0,0,0,.22)';
  const sh  = dk?'rgba(255,255,255,.07)':'rgba(255,255,255,.5)';
  return h('svg',{ width:sz, height:sz, viewBox:'0 0 170 170', fill:'none', style:{flexShrink:0} },
    h('defs',null,
      h('linearGradient',{id:`dag${id}`,x1:'0%',y1:'0%',x2:'0%',y2:'100%'},h('stop',{offset:'0%',stopColor:b0}),h('stop',{offset:'100%',stopColor:b1})),
      h('filter',{id:`daf${id}`,x:'-40%',y:'-40%',width:'180%',height:'180%'},h('feDropShadow',{dx:'0',dy:'12',stdDeviation:'16',floodColor:ac,floodOpacity:'.22'}))
    ),
    h('rect',{x:'18',y:'48',width:'134',height:'74',rx:'5',fill:`url(#dag${id})`,filter:`url(#daf${id})`}),
    h('rect',{x:'18',y:'48',width:'134',height:'74',rx:'5',stroke:bd1,strokeWidth:'.8',fill:'none'}),
    h('rect',{x:'19',y:'49',width:'132',height:'1',fill:sh}),
    h('rect',{x:'31',y:'61',width:'80',height:'33',rx:'3',fill:dp,stroke:bd2,strokeWidth:'.8'}),
    h('text',{x:'37',y:'73',fill:ac,fontSize:'5',fontFamily:'monospace',opacity:'.95'},'PCM 32BIT / 768kHz'),
    h('text',{x:'37',y:'82',fill:tx1,fontSize:'4',fontFamily:'monospace'},'INPUT: USB-C'),
    ...[0,1,2,3,4,5].map(i => h('rect',{key:i,x:String(37+i*7),y:'86',width:'5',height:'3',rx:'.8',fill:i<4?ac:dk?'#1a1a1a':'#d0ccc8',opacity:String(.30+i*.13)})),
    h('circle',{cx:'138',cy:'85',r:'15',fill:kn,stroke:bd3,strokeWidth:'.8'}),
    h('circle',{cx:'138',cy:'85',r:'10',fill:kn2}),
    h('circle',{cx:'138',cy:'75',r:'2.2',fill:ac,opacity:'.95'}),
    ...[27,39,53].map(x => h('rect',{key:x,x:String(x),y:'110',width:'8',height:'6',rx:'3',fill:pt,stroke:bd4,strokeWidth:'.5'})),
    h('text',{x:'23',y:'124',fill:tx2,fontSize:'3.5',fontFamily:'monospace'},'XLR·L   XLR·R   USB-C')
  );
}

function Cable({ ac, sz = 160, dk = true }) {
  const id = useRef(uid()).current;
  const c0 = dk?'#B8B8C0':'#808088', c1 = dk?'#E0E0E4':'#A0A0A8', c2 = dk?'#949498':'#606068';
  const pl = dk?'#181818':'#c0bcb8', pb = dk?'#222':'#b8b4b0';
  return h('svg',{ width:sz, height:sz, viewBox:'0 0 170 170', fill:'none', style:{flexShrink:0} },
    h('defs',null,
      h('linearGradient',{id:`cag${id}`,x1:'0%',y1:'0%',x2:'100%',y2:'100%'},
        h('stop',{offset:'0%',stopColor:c0}),h('stop',{offset:'50%',stopColor:c1}),h('stop',{offset:'100%',stopColor:c2})),
      h('filter',{id:`caf${id}`,x:'-40%',y:'-40%',width:'180%',height:'180%'},h('feDropShadow',{dx:'0',dy:'8',stdDeviation:'10',floodColor:ac,floodOpacity:'.32'}))
    ),
    h('rect',{x:'73',y:'24',width:'22',height:'30',rx:'11',fill:pl,filter:`url(#caf${id})`}),
    ...[28,34,40].map(y => h('rect',{key:y,x:'76',y:String(y),width:'16',height:'2.5',rx:'1.2',fill:ac,opacity:String(y===28?.95:y===34?.55:.26)})),
    h('path',{d:'M84 54 C64 76 44 86 49 116 C53 136 73 144 85 138',stroke:`url(#cag${id})`,strokeWidth:'5',fill:'none',strokeLinecap:'round',filter:`url(#caf${id})`}),
    h('path',{d:'M84 54 C64 76 44 86 49 116 C53 136 73 144 85 138',stroke:'rgba(255,255,255,.10)',strokeWidth:'1',fill:'none',strokeLinecap:'round'}),
    h('path',{d:'M84 54 C104 74 118 88 113 111 C109 126 95 134 85 138',stroke:`url(#cag${id})`,strokeWidth:'3.5',fill:'none',strokeLinecap:'round',opacity:'.50'}),
    h('rect',{x:'78',y:'136',width:'14',height:'20',rx:'7',fill:pb,filter:`url(#caf${id})`})
  );
}

function ProductSVG({ p, sz, dk = true }) {
  if (p.id === 1) return h(Headphones, { ac: p.ac, sz, dk });
  if (p.id === 2) return h(IEM,        { ac: p.ac, sz, dk });
  if (p.id === 3) return h(DAC,        { ac: p.ac, sz, dk });
  return               h(Cable,       { ac: p.ac, sz, dk });
}

/* ───────────────────────────────────────────────────────
   SHARED UI HELPERS
   ─────────────────────────────────────────────────────── */
function Corners({ color = 'var(--ac)', size = 14, pad = 10 }) {
  const mk = (v, h2) => ({
    position:'absolute', [v]:pad, [h2]:pad, width:size, height:size,
    borderTop:    v==='top'    ? `1px solid ${color}55` : 'none',
    borderBottom: v==='bottom' ? `1px solid ${color}55` : 'none',
    borderLeft:   h2==='left'  ? `1px solid ${color}55` : 'none',
    borderRight:  h2==='right' ? `1px solid ${color}55` : 'none',
  });
  return h(Fragment, null,
    h('div',{style:mk('top','left')}), h('div',{style:mk('top','right')}),
    h('div',{style:mk('bottom','left')}), h('div',{style:mk('bottom','right')})
  );
}

function Waveform({ color = 'var(--ac)' }) {
  return h('div',{ style:{display:'flex',alignItems:'center',gap:3,height:32} },
    Array.from({length:24},(_,i) =>
      h('div',{key:i,style:{width:2,borderRadius:2,background:color,
        animation:`wave ${.50+Math.sin(i)*.45}s ease-in-out ${i*.045}s infinite alternate`,
        height:`${22+Math.sin(i*.85)*12}%`,opacity:.65+Math.abs(Math.sin(i))*.35}})
    )
  );
}

function ThemeToggle({ dark, onToggle }) {
  return h('button',{
    onClick:onToggle,
    className:'toggle-wrap',
    'aria-label': dark ? 'Switch to light mode' : 'Switch to dark mode',
  },
    h('span',{style:{position:'absolute',left:7,top:'50%',transform:'translateY(-50%)',fontSize:10,opacity:dark?.20:0,transition:'opacity .30s',pointerEvents:'none'}}, '☀'),
    h('span',{style:{position:'absolute',right:7,top:'50%',transform:'translateY(-50%)',fontSize:9, opacity:dark?0:.20,transition:'opacity .30s',pointerEvents:'none'}}, '☾'),
    h('div',{className:'toggle-thumb',style:{[dark?'left':'right']:3}}, dark?'☾':'☀')
  );
}

function SectionLabel({ text }) {
  return h('div',{className:'section-hd'},
    h('div',{className:'divider-line'}),
    h('span',{className:'lbl'}, text)
  );
}

/* ───────────────────────────────────────────────────────
   PRODUCT CARD
   ─────────────────────────────────────────────────────── */
function ProductCard({ p, idx, mob, tab, dk, hovered, onHover, onLeave, onDetail, onAddCart }) {
  const [imgFailed, setImgFailed] = React.useState(false);

  return h('div', {
    className: 'p-card',
    style: {
      boxShadow: hovered
        ? `0 24px 60px var(--shadow), 0 0 0 1px ${p.ac}22`
        : '0 4px 20px var(--shadow-sm)',
    },
    onMouseEnter: onHover,
    onMouseLeave: onLeave,
  },
    /* ── PHOTO / SVG AREA ──────────────────────────────── */
    h('div', {
      className: 'card-photo-wrap',
      onClick: onDetail,
      role: 'button', tabIndex: 0,
      onKeyDown: ev => ev.key === 'Enter' && onDetail(),
      'aria-label': `View ${p.name}`,
    },
      /* Real photograph — hidden once imgFailed=true */
      !imgFailed && h('img', {
        className: 'card-photo',
        src: p.img,
        alt: p.name,
        loading: 'lazy',
        decoding: 'async',
        onLoad:  ev => ev.target.classList.add('img-ready'),
        onError: () => {
          if (p.imgFallback) {
            /* try secondary URL first */
            const img = document.createElement('img');
            img.className = 'card-photo img-ready';
            img.src = p.imgFallback;
            img.alt = p.name;
            img.style.cssText = 'width:100%;height:100%;object-fit:cover;object-position:center;filter:brightness(.70) contrast(1.12) saturate(.80)';
            img.onerror = () => setImgFailed(true);
            const wrap = document.querySelector(`[data-pid="${p.id}"]`);
            if (wrap) {
              const oldImg = wrap.querySelector('img');
              if (oldImg) wrap.replaceChild(img, oldImg);
            } else {
              setImgFailed(true);
            }
          } else {
            setImgFailed(true);
          }
        },
      }),

      /* SVG fallback — luxurious, shown when all images fail */
      imgFailed && h('div', {
        style: {
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `radial-gradient(ellipse 72% 72% at 50% 50%, ${p.ac}14, transparent)`,
          transition: 'background .4s',
        },
      },
        h(ProductSVG, { p, sz: mob ? 140 : 170, dk })
      ),

      h('div', { className: 'card-photo-overlay' }),

      /* tag */
      h('div', {
        style: { position:'absolute', top:12, left:12, zIndex:2,
                 background:'rgba(0,0,0,.74)', backdropFilter:'blur(8px)',
                 WebkitBackdropFilter:'blur(8px)',
                 border:`1px solid ${p.ac}42`, padding:'4px 10px', borderRadius:2 },
      },
        h('span', { style:{ fontSize:8, letterSpacing:'.28em', color:p.ac, fontWeight:700 } }, p.tag)
      ),

      /* price */
      h('div', {
        style: { position:'absolute', bottom:10, right:12, zIndex:2,
                 fontFamily:"'Cormorant Garamond',serif",
                 fontSize: mob ? 14 : 17, color:'#fff',
                 opacity: .92, textShadow:'0 2px 10px rgba(0,0,0,.7)' },
      },
        `$${p.price.toLocaleString()}`
      )
    ),

    /* ── INFO ───────────────────────────────────────────── */
    h('div', {
      className: 'card-info',
      style: { padding: mob ? '12px 14px 0' : '16px 18px 0',
               borderTop:`1px solid ${p.ac}18`,
               flex:1, display:'flex', flexDirection:'column' },
    },
      h('div', { className:'serif',
                 style:{ fontSize: mob?15:17, fontWeight:400, color:'var(--text)',
                         letterSpacing:'.04em', lineHeight:1.2, marginBottom:3,
                         transition:'color .4s' } },
        p.name
      ),
      h('div', { style:{ fontSize:9, color:'var(--muted)', letterSpacing:'.12em',
                         lineHeight:1.3, transition:'color .4s' } },
        p.sub
      )
    ),

    /* ── CTA ─────────────────────────────────────────────── */
    mob
      ? h('button', {
          className: 'card-cta',
          onClick: onAddCart,
          'aria-label': `Add ${p.name} to cart`,
          style: { margin:'10px 14px 14px', padding:'10px 0', width:'calc(100% - 28px)',
                   fontSize:9, letterSpacing:'.22em', fontWeight:700, textAlign:'center',
                   border:`1px solid ${p.ac}45`, color:p.ac, background:`${p.ac}12`,
                   borderRadius:2, cursor:'pointer', fontFamily:"'Space Mono',monospace",
                   transition:'all .2s' },
        }, 'ADD TO CART')
      : h('div', {
          className: 'qb-bar',
          onClick: onAddCart,
          role: 'button', tabIndex: 0,
          onKeyDown: ev => ev.key === 'Enter' && onAddCart(),
          'aria-label': `Add ${p.name} to cart`,
          style: { position:'absolute', bottom:0, left:0, right:0,
                   background:'var(--card-qb)',
                   padding:'16px 18px', display:'flex',
                   justifyContent:'space-between', alignItems:'center',
                   borderTop:`1px solid ${p.ac}2A`, cursor:'pointer' },
        },
          h('span', { style:{ fontSize:9, letterSpacing:'.26em', color:p.ac, fontWeight:700 } }, 'ADD TO CART'),
          h('span', { style:{ fontSize:20, color:p.ac, lineHeight:1 } }, '+')
        )
  );
}

function FooterAccordion({ scrollTo }) {
  const [open, setOpen] = useState({});
  const toggle = k => setOpen(p => ({ ...p, [k]: !p[k] }));
  return h('div',{ style:{marginBottom:28} },
    FOOT_COLS.map(([cat, links]) =>
      h('div',{ key:cat },
        h('button',{
          className:'accord-hd',
          onClick:()=>toggle(cat),
          'aria-expanded': !!open[cat],
        },
          h('span',{className:'lbl',style:{fontSize:8,letterSpacing:'.28em',color:'var(--label)',fontWeight:700}}, cat),
          h('span',{style:{fontSize:18,color:'var(--muted)',transition:'transform .30s',
            transform:open[cat]?'rotate(45deg)':'rotate(0deg)',lineHeight:1}}, '+')
        ),
        open[cat] && h('div',{className:'accord-body'},
          links.map(([l,tg]) =>
            h('button',{key:l, onClick:()=>scrollTo(tg), className:'foot-lnk'}, l)
          )
        )
      )
    )
  );
}

/* ───────────────────────────────────────────────────────
   MAIN APP
   ─────────────────────────────────────────────────────── */
function App() {
  /* ── state ── */
  const [dk,       setDk]       = useState(true);
  const [ready,    setReady]    = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart,     setCart]     = useState([]);
  const [ordered,  setOrdered]  = useState(false);
  const [feat,     setFeat]     = useState(0);
  const [hovered,  setHovered]  = useState(null);
  const [mnav,     setMnav]     = useState(false);
  const [film,     setFilm]     = useState(false);
  const [prodM,    setProdM]    = useState(null);
  const [W,        setW]        = useState(window.innerWidth);

  const mob = W < 768, tab = W >= 768 && W < 1024;
  const magRef  = useRef(null);
  const featRefs = useRef([]);

  /* ── effects ── */
  useEffect(() => {
    document.documentElement.classList.toggle('light', !dk);
  }, [dk]);

  useEffect(() => {
    let raf;
    const onScroll = () => {
      raf && cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 20));
    };
    const onResize = () => setW(window.innerWidth);
    setTimeout(() => {
      setReady(true);
      const root = document.documentElement;
      root.classList.remove('preload');
      // Double rAF ensures first paint is done before enabling transitions
      requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('ready')));
    }, 80);
    window.addEventListener('scroll',  onScroll, { passive: true });
    window.addEventListener('resize',  onResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  /* magnetic button */
  const onMouseMove = useCallback(e => {
    const b = magRef.current;
    if (!b || mob) return;
    const r  = b.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width  / 2);
    const dy = e.clientY - (r.top  + r.height / 2);
    const d  = Math.sqrt(dx*dx + dy*dy);
    b.style.transform = d < 90
      ? `translate(${dx/d*(1-d/90)*14}px,${dy/d*(1-d/90)*14}px)`
      : 'translate(0,0)';
  }, [mob]);
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  /* sticky feature observer */
  useEffect(() => {
    if (mob) return;
    const refs = featRefs.current.filter(Boolean);
    const obs  = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const i = featRefs.current.indexOf(e.target);
          if (i >= 0) setFeat(i);
        }
      });
    }, { threshold: .55, rootMargin: '-18% 0px -18% 0px' });
    refs.forEach(r => obs.observe(r));
    return () => obs.disconnect();
  }, [mob]);

  /* ── helpers ── */
  const scrollTo = useCallback(id => {
    const el = document.getElementById(id);
    if (el) { setMnav(false); setTimeout(() => el.scrollIntoView({ behavior:'smooth', block:'start' }), 40); }
  }, []);

  const addToCart = useCallback(p => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      return ex ? prev.map(i => i.id===p.id ? {...i,qty:i.qty+1} : i) : [...prev,{...p,qty:1}];
    });
    setProdM(null);
    setCartOpen(true);
  }, []);

  const adjustQty = useCallback((id, d) => {
    setCart(prev => prev.map(i => i.id===id ? {...i,qty:i.qty+d} : i).filter(i => i.qty>0));
  }, []);

  const checkout = useCallback(() => {
    setOrdered(true);
    setTimeout(() => { setCart([]); setOrdered(false); setCartOpen(false); }, 3600);
  }, []);

  const cartCount = useMemo(() => cart.reduce((a,i) => a+i.qty, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((a,i) => a+i.price*i.qty, 0), [cart]);

  /* ── animation helper ── */
  const an = (name, dur='1s', delay='0s') =>
    ready ? { animation:`${name} ${dur} cubic-bezier(.23,1,.32,1) ${delay} both` } : { opacity:0 };

  /* ── shared style builders ── */
  const glassStyle = { background:'var(--glass)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', border:'1px solid var(--border)', transition:'var(--transition)' };
  const secPad     = mob ? '72px 20px' : tab ? '96px 6%' : '120px 8%';

  /* ════════════════════════════════════════
     RENDER
     ════════════════════════════════════════ */
  return h('div', { style:{ minHeight:'100vh' } },

    /* ── grain overlay (dark only) ── */
    dk && h('div', { className:'grain-overlay' }),

    /* ════════════════════════════════════════
       NAV
    ════════════════════════════════════════ */
    h('nav', {
      className: `site-nav ${scrolled?'scrolled':''}`,
      style: { padding:`0 ${mob?'16px':'50px'}` },
      role:'navigation', 'aria-label':'Main navigation',
    },
      /* logo */
      h('button', { onClick:()=>scrollTo('hero'), style:{display:'flex',alignItems:'center',gap:10,padding:0,minWidth:0}, 'aria-label':'NOIR Audio home' },
        h('div',{style:{width:7,height:7,borderRadius:'50%',background:'var(--ac)',boxShadow:'0 0 10px var(--ac), 0 0 22px var(--ac)',animation:'pulse 3s ease infinite',flexShrink:0,transition:'background .3s'}}),
        h('span',{className:'serif',style:{fontSize:22,fontWeight:300,letterSpacing:'.32em',color:'var(--text)',transition:'color .4s'}}, 'NOIR'),
        !mob && h('span',{style:{fontSize:9,color:'var(--dim)',letterSpacing:'.18em',marginTop:3,transition:'color .4s'}}, 'AUDIO')
      ),

      /* desktop links */
      !mob && h('div', { role:'menubar', style:{display:'flex',gap:38,alignItems:'center'} },
        NAV_ITEMS.map(([label, target]) =>
          h('button', { key:label, onClick:()=>scrollTo(target), className:'nav-lnk', role:'menuitem' }, label)
        )
      ),

      /* right controls */
      h('div', { style:{display:'flex',gap:9,alignItems:'center'} },
        h(ThemeToggle, { dark:dk, onToggle:()=>setDk(v=>!v) }),

        /* cart button */
        h('button', {
          onClick:()=>setCartOpen(true),
          className:'icon-btn',
          style:{height:38,padding:'0 16px',gap:8,display:'flex',alignItems:'center',fontSize:10,letterSpacing:'.20em',color:'var(--text)',fontFamily:"'Space Mono',monospace"},
          'aria-label':`Cart — ${cartCount} items`,
        },
          !mob && h('span',null,'CART'),
          mob && h('svg',{width:15,height:15,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'1.8'},
            h('path',{d:'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z'}),
            h('line',{x1:'3',y1:'6',x2:'21',y2:'6'}),
            h('path',{d:'M16 10a4 4 0 01-8 0'})
          ),
          cartCount > 0 && h('span', {
            style:{background:'var(--ac)',color:'var(--ac-fg)',borderRadius:'50%',
              width:17,height:17,display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:9,fontWeight:700,flexShrink:0,transition:'background .3s'},
          }, cartCount)
        ),

        /* hamburger (mobile) */
        mob && h('button', {
          onClick: ()=>setMnav(v=>!v),
          className:'icon-btn',
          style:{ width:40, height:40 },
          'aria-label': mnav ? 'Close menu' : 'Open menu',
          'aria-expanded': mnav,
        },
          h('div',{style:{display:'flex',flexDirection:'column',gap:5,alignItems:'center',justifyContent:'center'}},
            [0,1,2].map(i => h('div',{key:i,style:{
              width:18,height:1.5,background:'var(--text)',borderRadius:1,transition:'all .28s',
              transform: mnav ? (i===0?'rotate(45deg) translate(4.5px,4.5px)':i===2?'rotate(-45deg) translate(4.5px,-4.5px)':'scaleX(0)') : 'none',
              opacity: mnav && i===1 ? 0 : 1,
            }}))
          )
        )
      )
    ),

    /* mobile nav menu */
    mob && mnav && h('div', { className:'mnav', role:'menu' },
      NAV_ITEMS.map(([label, target]) =>
        h('button', { key:label, onClick:()=>scrollTo(target), className:'mnav-item', role:'menuitem' },
          h('span', null, label),
          h('span', { style:{fontSize:14,opacity:.35} }, '›')
        )
      )
    ),

    /* ════════════════════════════════════════
       HERO
    ════════════════════════════════════════ */
    h('section', {
      id:'hero',
      className:'hero-section',
      style:{ flexDirection: mob ? 'column' : 'row' },
      'aria-label':'Hero',
    },
      /* background radial glow */
      h('div',{style:{position:'absolute',inset:0,pointerEvents:'none',transition:'background .4s',
        background:`radial-gradient(ellipse 55% 65% at ${mob?'50% 30%':'68% 50%'}, var(--ac-glow) 0%, transparent 70%)`}}),
      /* grid */
      h('div',{ className:'hero-grid' }),

      mob
        /* ── MOBILE HERO ── */
        ? h(Fragment, null,
            h('div',{ style:{width:'100%',padding:'44px 22px 22px',zIndex:2,position:'relative'}, ...an('fadeUp','1s','0s') },
              h(SectionLabel, { text:'FLAGSHIP · 2026' }),
              h('h1',{ className:'serif', style:{fontSize:'clamp(40px,10.5vw,54px)',fontWeight:300,lineHeight:1.04,letterSpacing:'-.02em',marginBottom:18,color:'var(--text)',transition:'color .4s'} },
                'Sound Without',h('br'),h('em',{style:{color:'var(--ac)',fontStyle:'italic',transition:'color .3s'}},'Compromise.')
              ),
              h('p',{style:{fontSize:13,lineHeight:1.82,color:'var(--muted)',marginBottom:26,maxWidth:400,transition:'color .4s'}},
                'Precision-engineered transducers forged from aerospace alloys. Each component exists at the intersection of acoustic physics and obsessive craft.'
              ),
              h('div',{style:{display:'flex',gap:10,flexWrap:'wrap',marginBottom:28}},
                h('button',{ref:magRef,onClick:()=>scrollTo('collection'),className:'btn-primary',style:{flex:'1 1 auto',textAlign:'center'}},'EXPLORE COLLECTION'),
                h('button',{onClick:()=>setFilm(true),className:'btn-ghost',style:{flex:'1 1 auto',textAlign:'center'}},'WATCH FILM ›')
              ),
              h('div',{style:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0 12px',paddingTop:20,borderTop:'1px solid var(--border)',transition:'var(--transition)'}},
                [['5Hz–50kHz','FREQUENCY'],['<0.001%','THD'],['298g','MASS']].map(([v,l]) =>
                  h('div',{key:l},
                    h('div',{className:'serif',style:{fontSize:18,color:'var(--text)',marginBottom:3,transition:'color .4s'}}, v),
                    h('div',{style:{fontSize:7,color:'var(--dim)',letterSpacing:'.18em',lineHeight:1.4,transition:'color .4s'}}, l)
                  )
                )
              )
            ),
            h('div',{style:{width:'100%',display:'flex',justifyContent:'center',padding:'0 30px 52px',zIndex:1,filter:`drop-shadow(0 24px 48px var(--ac-glow))`}, ...an('hscale','1.3s','.2s')},
              h(Headphones,{ac:'var(--ac)',sz:Math.min(W-60,280),dk})
            )
          )

        /* ── DESKTOP HERO ── */
        : h(Fragment, null,
            h('div',{style:{position:'absolute',left:'9%',maxWidth:490,zIndex:2}},
              h('div',{style:{display:'flex',alignItems:'center',gap:14,marginBottom:26}, ...an('sleft','.8s','.18s')},
                h('div',{className:'divider-line'}),
                h('span',{className:'lbl'},'FLAGSHIP COLLECTION 2026')
              ),
              h('h1',{ className:'serif', style:{fontSize:'clamp(54px,5.2vw,80px)',fontWeight:300,lineHeight:1.04,letterSpacing:'-.02em',marginBottom:22,color:'var(--text)',transition:'color .4s'}, ...an('sleft','1.05s','.06s') },
                'Sound Without',h('br'),h('em',{style:{color:'var(--ac)',fontStyle:'italic',transition:'color .3s'}},'Compromise.')
              ),
              h('p',{style:{fontSize:13,lineHeight:1.88,color:'var(--muted)',marginBottom:46,maxWidth:390,transition:'color .4s'}, ...an('fadeUp','.9s','.42s')},
                'Precision-engineered transducers forged from aerospace alloys. Each component exists at the intersection of acoustic physics and obsessive craft.'
              ),
              h('div',{style:{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}, ...an('fadeUp','.9s','.56s')},
                h('button',{ref:magRef,onClick:()=>scrollTo('collection'),className:'btn-primary',style:{transition:'opacity .2s,transform .15s'}},'EXPLORE APEX'),
                h('button',{onClick:()=>setFilm(true),className:'btn-ghost'},'WATCH FILM ›')
              ),
              h('div',{style:{display:'flex',gap:42,marginTop:52,paddingTop:36,borderTop:'1px solid var(--border)',transition:'var(--transition)'}, ...an('fadeUp','.9s','.70s')},
                [['5Hz–50kHz','FREQUENCY'],['<0.001%','THD @ 1kHz'],['298g','MASS']].map(([v,l]) =>
                  h('div',{key:l},
                    h('div',{className:'serif',style:{fontSize:23,color:'var(--text)',marginBottom:4,transition:'color .4s'}}, v),
                    h('div',{style:{fontSize:8,color:'var(--dim)',letterSpacing:'.20em',transition:'color .4s'}}, l)
                  )
                )
              )
            ),
            h('div',{style:{position:'absolute',right:'7%',zIndex:1,filter:`drop-shadow(0 50px 100px var(--ac-glow))`}, ...an('hscale','1.5s','0s')},
              h(Headphones,{ac:'var(--ac)',sz:490,dk})
            ),
            h('div',{style:{position:'absolute',bottom:40,left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:8}, ...an('fadeIn','1s','1.1s')},
              h('span',{style:{fontSize:8,letterSpacing:'.32em',color:'var(--dim)',transition:'color .4s'}},'SCROLL'),
              h('div',{style:{width:1,height:44,background:'linear-gradient(to bottom,var(--muted),transparent)'}})
            )
          )
    ),

    /* ════════════════════════════════════════
       COLLECTION
    ════════════════════════════════════════ */
    h('section', { id:'collection', style:{padding:secPad,scrollMarginTop:64}, 'aria-label':'Products' },
      /* header */
      h('div',{style:{display:'flex',justifyContent:'space-between',alignItems: mob?'flex-start':'flex-end',marginBottom: mob?32:56,flexDirection:mob?'column':'row',gap:mob?14:0}},
        h('div',null,
          h(SectionLabel, { text:'THE COLLECTION' }),
          h('h2',{className:'serif',style:{fontSize:mob?34:48,fontWeight:300,lineHeight:1.1,letterSpacing:'-.01em',color:'var(--text)',transition:'color .4s'}},
            'Precision',h('br'),h('em',{style:{color:'var(--muted)',fontStyle:'italic',fontFamily:"'Cormorant Garamond',serif",transition:'color .4s'}},'Instruments')
          )
        ),
        !mob && h('p',{style:{fontSize:12,color:'var(--muted)',maxWidth:260,lineHeight:1.82,textAlign:'right',transition:'color .4s'}},
          'Handcrafted in limited quantities. Each unit serialized, measured, and certified before leaving the atelier.')
      ),

      /* grid */
      h('div',{
        role:'list',
        className:'card-grid',
        style:{
          display:'grid',
          gap: mob ? 10 : 16,
          alignItems:'start',
        },
      },
        PRODUCTS.map((p, idx) =>
          h(ProductCard, {
            key: p.id, p, idx, mob, tab, dk,
            hovered: hovered === p.id,
            onHover:  ()  => setHovered(p.id),
            onLeave:  ()  => setHovered(null),
            onDetail: ()  => setProdM(p),
            onAddCart:()  => addToCart(p),
          })
        )
      ),

      /* mobile helper text */
      mob && h('p',{style:{fontSize:11,color:'var(--muted)',lineHeight:1.75,marginTop:18,transition:'color .4s'}},
        'Handcrafted in limited quantities. Each unit serialized, measured, and certified.')
    ),

    /* ════════════════════════════════════════
       MARQUEE
    ════════════════════════════════════════ */
    h('div',{
      'aria-hidden':'true',
      style:{overflow:'hidden',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',padding:'16px 0',background: dk?'rgba(255,255,255,.008)':'rgba(0,0,0,.02)',transition:'var(--transition)'},
    },
      h('div',{style:{display:'flex',gap:52,animation:'marquee 24s linear infinite',whiteSpace:'nowrap',width:'max-content'}},
        Array(2).fill(['BERYLLIUM DRIVERS','·','ADAPTIVE SPATIAL AUDIO','·','LITZ SILVER CABLE','·','PRECISION MACHINED','·','SERIALIZED & CERTIFIED','·','ES9038PRO DAC','·']).flat()
          .map((tx,i) => h('span',{key:i,style:{fontSize:9,letterSpacing:'.3em',color:'var(--marquee)',transition:'color .4s'}}, tx))
      )
    ),

    /* ════════════════════════════════════════
       ENGINEERING
    ════════════════════════════════════════ */
    h('section', { id:'engineering', style:{padding:mob?'72px 0 96px':`${tab?96:120}px 0 ${tab?120:150}px`,scrollMarginTop:64} },
      h('div',{style:{padding:mob?'0 20px':'0 8%',marginBottom:mob?32:54}},
        h(SectionLabel, { text:'ENGINEERING' }),
        h('h2',{className:'serif',style:{fontSize:mob?34:48,fontWeight:300,letterSpacing:'-.01em',color:'var(--text)',transition:'color .4s'}}, 'Built Different.')
      ),

      mob
        /* ── MOBILE: pill tabs + content ── */
        ? h('div', null,
            h('div',{style:{padding:'0 20px',marginBottom:0}},
              h('div',{style:{display:'flex',gap:8,overflowX:'auto',paddingBottom:14,scrollbarWidth:'none',WebkitOverflowScrolling:'touch'}},
                FEATURES.map((f,i) =>
                  h('button',{key:i,onClick:()=>setFeat(i),style:{
                    flexShrink:0,padding:'9px 18px',borderRadius:20,minHeight:38,
                    background: feat===i ? 'var(--ac)' : dk?'rgba(255,255,255,.06)':'rgba(0,0,0,.06)',
                    color:       feat===i ? 'var(--ac-fg)' : 'var(--muted)',
                    border:      `1px solid ${feat===i ? 'var(--ac)' : 'var(--border)'}`,
                    fontSize:9,letterSpacing:'.18em',fontFamily:"'Space Mono',monospace",
                    whiteSpace:'nowrap',transition:'all .3s',
                  },'aria-pressed':feat===i}, f.tag)
                )
              )
            ),

            h('div',{ key:feat, style:{margin:'0 16px'} },
              h('div',{ ...glassStyle, style:{...glassStyle.style,borderRadius:6,overflow:'hidden',
                background:`radial-gradient(ellipse 100% 60% at 50% 0%,var(--ac-glow),var(--glass))`,
                animation:'fadeUp .35s ease both',position:'relative'} },
                h('div',{style:{display:'flex',justifyContent:'center',alignItems:'center',padding:'30px 20px 14px',
                  background:`radial-gradient(ellipse 70% 70% at 50% 50%,var(--ac-soft),transparent)`,position:'relative'}},
                  h(Corners,{color:'var(--ac)',size:11,pad:9}),
                  h('div',{style:{animation:'hscale .5s ease both'}}, h(Headphones,{ac:'var(--ac)',sz:Math.min(W-80,220),dk}))
                ),
                h('div',{style:{padding:'0 20px 26px'}},
                  h('div',{style:{paddingTop:16,borderTop:'1px solid var(--border)',transition:'var(--transition)'}},
                    h('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:10}},
                      h('span',{className:'lbl',style:{fontSize:8}}, FEATURES[feat].tag),
                      h('div',{style:{flex:1,height:1,background:'var(--border)'}})
                    ),
                    h('h3',{className:'serif',style:{fontSize:22,fontWeight:300,lineHeight:1.3,marginBottom:12,color:'var(--text)',whiteSpace:'pre-line',transition:'color .4s'}}, FEATURES[feat].title),
                    h('p',{style:{fontSize:12,color:'var(--muted)',lineHeight:1.9,transition:'color .4s'}}, FEATURES[feat].body)
                  )
                ),
                h('div',{style:{padding:'11px 20px',borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',background:dk?'rgba(255,255,255,.02)':'rgba(0,0,0,.02)',transition:'var(--transition)'}},
                  h('span',{style:{fontSize:9,color:'var(--dim)',letterSpacing:'.10em',transition:'color .4s'}},'NOIR APEX · HPA-001'),
                  h('span',{className:'lbl',style:{fontSize:8}}, `${feat+1} / ${FEATURES.length}`)
                )
              )
            )
          )

        /* ── DESKTOP: sticky panel ── */
        : h('div',{style:{display:'flex'}},
            h('div',{style:{flex:1,padding:'0 8%'}},
              FEATURES.map((f,i) =>
                h('div',{key:i,
                  ref: el => featRefs.current[i] = el,
                  onClick:()=>setFeat(i),
                  className:`feat-border${feat===i?' active':''}`,
                  role:'button', tabIndex:0,
                  onKeyDown: e => e.key==='Enter' && setFeat(i),
                  'aria-selected': feat===i,
                },
                  h('span',{style:{fontSize:8,letterSpacing:'.32em',color:feat===i?'var(--ac)':'var(--label)',fontWeight:700,display:'block',marginBottom:12,transition:'color .4s'}}, f.tag),
                  h('h3',{className:'serif',style:{fontSize:27,fontWeight:300,lineHeight:1.32,marginBottom:16,whiteSpace:'pre-line',color:feat===i?'var(--text)':'var(--muted)',transition:'color .45s ease'}}, f.title),
                  h('div',{style:{maxHeight:feat===i?200:0,overflow:'hidden',transition:'max-height .50s cubic-bezier(.23,1,.32,1)'}},
                    h('p',{style:{fontSize:12,color:'var(--muted)',lineHeight:1.92,animation:feat===i?'fadeUp .5s ease both':'none',transition:'color .4s'}}, f.body)
                  )
                )
              )
            ),
            h('div',{style:{width:'44%',position:'sticky',top:'18vh',height:'fit-content',padding:'0 8% 0 0'}},
              h('div',{
                className:'glass sticky-panel',
                style:{borderRadius:6,padding:'52px 42px',display:'flex',flexDirection:'column',alignItems:'center',position:'relative',transition:'var(--transition)'},
              },
                h(Corners,{color:'var(--ac)'}),
                h('div',{key:feat,style:{animation:'hscale .55s cubic-bezier(.23,1,.32,1) both'}},
                  h(Headphones,{ac:'var(--ac)',sz:330,dk})
                ),
                h('div',{style:{marginTop:24,textAlign:'center',paddingTop:18,borderTop:'1px solid var(--border)',width:'100%',transition:'var(--transition)'}},
                  h('div',{className:'lbl',style:{display:'block',marginBottom:7}}, FEATURES[feat].tag),
                  h('div',{style:{fontSize:9,color:'var(--dim)',letterSpacing:'.12em',transition:'color .4s'}},'NOIR APEX · HPA-001')
                )
              )
            )
          )
    ),

    /* ════════════════════════════════════════
       STUDIO
    ════════════════════════════════════════ */
    h('section', { id:'studio', style:{padding:secPad,borderTop:'1px solid var(--border)',scrollMarginTop:64,transition:'var(--transition)'} },
      h('div',{style:{marginBottom:mob?28:44}},
        h(SectionLabel,{text:'THE STUDIO'})
      ),

      /* stat cards */
      h('div',{style:{display:'grid',gridTemplateColumns:mob?'1fr':tab?'1fr 1fr':'1fr 1fr 1fr',gap:mob?10:14,marginBottom:mob?18:24}},
        [['🏛','THE ATELIER','Berlin','Est. 2017'],['✦','UNITS / YEAR','1,200','Hand-finished'],['◈','WARRANTY','Lifetime','No questions asked']].map(([icon,label,val,sub]) =>
          h('div',{key:label,className:'glass',style:{borderRadius:4,padding:mob?'18px 16px':'30px 26px',position:'relative',display:mob?'flex':'block',alignItems:'center',gap:16,transition:'var(--transition)'}},
            !mob && h(Corners,{color:'var(--ac)',size:10,pad:8}),
            h('div',{style:{fontSize:mob?26:20,flexShrink:0,marginBottom:mob?0:12,opacity:.72}}, icon),
            h('div',null,
              h('div',{className:'lbl',style:{display:'block',fontSize:8,marginBottom:mob?4:7}}, label),
              h('div',{className:'serif',style:{fontSize:mob?22:34,fontWeight:300,lineHeight:1,marginBottom:mob?2:5,color:'var(--text)',transition:'color .4s'}}, val),
              h('div',{style:{fontSize:mob?10:10,color:'var(--muted)',letterSpacing:'.08em',transition:'color .4s'}}, sub)
            )
          )
        )
      ),

      /* bespoke CTA */
      h('div',{className:'glass',style:{borderRadius:4,padding:mob?'22px 18px':'40px 46px',
        background:'linear-gradient(135deg,var(--ac-glow),var(--glass))',
        display:'flex',flexDirection:mob?'column':'row',alignItems:mob?'flex-start':'center',
        justifyContent:'space-between',gap:mob?20:0,transition:'var(--transition)'}},
        h('div',null,
          h('div',{className:'lbl',style:{display:'block',marginBottom:10}},'BESPOKE PROGRAM'),
          h('h3',{className:'serif',style:{fontSize:mob?22:32,fontWeight:300,lineHeight:1.22,maxWidth:480,color:'var(--text)',transition:'color .4s'}},
            'Commission a unit built',h('br'),h('em',{style:{color:'var(--ac)',transition:'color .3s'}},'exclusively'),' to your specification.'
          )
        ),
        h('button',{onClick:()=>scrollTo('about'),className:'btn-primary',style:{flexShrink:0,width:mob?'100%':undefined,textAlign:'center',marginTop:mob?4:0}},'ENQUIRE NOW')
      )
    ),

    /* ════════════════════════════════════════
       FOOTER
    ════════════════════════════════════════ */
    h('footer', { id:'about', style:{padding:mob?'52px 20px 40px':`${mob?52:68}px 8% ${mob?40:48}px`,borderTop:'1px solid var(--border)',scrollMarginTop:64,transition:'var(--transition)'} },

      mob
        /* ── MOBILE FOOTER ── */
        ? h(Fragment, null,
            /* brand */
            h('div',{style:{marginBottom:28}},
              h('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:12}},
                h('div',{style:{width:7,height:7,borderRadius:'50%',background:'var(--ac)',transition:'background .3s'}}),
                h('span',{className:'serif',style:{fontSize:20,fontWeight:300,letterSpacing:'.32em',color:'var(--text)',transition:'color .4s'}},'NOIR')
              ),
              h('p',{style:{fontSize:12,color:'var(--muted)',lineHeight:1.76,marginBottom:18,maxWidth:340,transition:'color .4s'}},
                'Precision audio instruments for the discerning ear. Handcrafted in limited quantities since 2017.'),
              h('div',{style:{display:'flex',gap:9}},
                ['IG','X','YT'].map(s =>
                  h('button',{key:s,onClick:()=>scrollTo('about'),className:'icon-btn',style:{width:36,height:36,fontSize:9,letterSpacing:'.10em',color:'var(--muted)',fontFamily:"'Space Mono',monospace"}}, s)
                )
              )
            ),
            /* accordion nav */
            h(FooterAccordion,{scrollTo}),
            /* newsletter */
            h('div',{className:'glass',style:{borderRadius:4,padding:'18px 16px',margin:'22px 0',transition:'var(--transition)'}},
              h('div',{className:'lbl',style:{display:'block',marginBottom:6}},'DISPATCH'),
              h('p',{style:{fontSize:11,color:'var(--muted)',marginBottom:14,lineHeight:1.65,transition:'color .4s'}},'Quarterly notes on acoustic research & new releases.'),
              h('div',{style:{display:'flex',flexDirection:'column',gap:9}},
                h('input',{type:'email',placeholder:'your@email.com','aria-label':'Email address',style:{background:'var(--inp)',border:'1px solid var(--inp-b)',color:'var(--text)',padding:'12px 14px',borderRadius:2,fontSize:12,outline:'none',fontFamily:"'Space Mono',monospace",letterSpacing:'.04em',width:'100%',minHeight:44,transition:'var(--transition)'}}),
                h('button',{className:'btn-primary',style:{padding:'13px',width:'100%',textAlign:'center'}},'SUBSCRIBE')
              )
            ),
            /* copyright */
            h('div',{style:{paddingTop:18,borderTop:'1px solid var(--border)',transition:'var(--transition)'}},
              h('div',{style:{display:'flex',gap:'8px 16px',flexWrap:'wrap',marginBottom:10}},
                ['PRIVACY','TERMS','COOKIES'].map(lb =>
                  h('button',{key:lb,style:{fontSize:9,color:'var(--dim)',letterSpacing:'.12em',background:'none',border:'none',cursor:'pointer',fontFamily:"'Space Mono',monospace",transition:'color .2s'}}, lb)
                )
              ),
              h('p',{style:{fontSize:9,color:'var(--dim)',letterSpacing:'.10em',lineHeight:1.6,transition:'color .4s'}},'© 2026 NOIR AUDIO. ALL RIGHTS RESERVED.')
            )
          )

        /* ── DESKTOP FOOTER ── */
        : h(Fragment, null,
            h('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:52}},
              h('div',{style:{maxWidth:270}},
                h('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:12}},
                  h('div',{style:{width:7,height:7,borderRadius:'50%',background:'var(--ac)',transition:'background .3s'}}),
                  h('span',{className:'serif',style:{fontSize:20,fontWeight:300,letterSpacing:'.32em',color:'var(--text)',transition:'color .4s'}},'NOIR')
                ),
                h('p',{style:{fontSize:11,color:'var(--muted)',lineHeight:1.78,marginBottom:20,transition:'color .4s'}},
                  'Precision audio instruments for the discerning ear. Handcrafted in limited quantities since 2017.'),
                h('div',{style:{display:'flex',gap:9}},
                  ['IG','X','YT'].map(s =>
                    h('button',{key:s,onClick:()=>scrollTo('about'),className:'icon-btn',style:{width:33,height:33,fontSize:9,letterSpacing:'.10em',color:'var(--muted)',fontFamily:"'Space Mono',monospace"}}, s)
                  )
                )
              ),
              h('div',{style:{display:'flex',gap:64}},
                FOOT_COLS.map(([cat,links]) =>
                  h('div',{key:cat},
                    h('div',{className:'lbl',style:{fontSize:8,display:'block',marginBottom:16,letterSpacing:'.28em',color:'var(--label)'}}, cat),
                    links.map(([l,tg]) =>
                      h('button',{key:l,onClick:()=>scrollTo(tg),className:'foot-lnk'}, l)
                    )
                  )
                )
              )
            ),
            /* newsletter */
            h('div',{className:'glass',style:{borderRadius:4,padding:'28px 36px',marginBottom:38,display:'flex',alignItems:'center',gap:22,justifyContent:'space-between',transition:'var(--transition)'}},
              h('div',null,
                h('div',{className:'lbl',style:{display:'block',marginBottom:6}},'DISPATCH'),
                h('p',{style:{fontSize:12,color:'var(--muted)',transition:'color .4s'}},'Quarterly notes on acoustic research & new releases.')
              ),
              h('div',{style:{display:'flex',gap:9}},
                h('input',{type:'email',placeholder:'your@email.com','aria-label':'Email address',style:{background:'var(--inp)',border:'1px solid var(--inp-b)',color:'var(--text)',padding:'10px 13px',borderRadius:2,fontSize:11,outline:'none',fontFamily:"'Space Mono',monospace",width:210,letterSpacing:'.04em',minHeight:42,transition:'var(--transition)'}}),
                h('button',{className:'btn-primary',style:{padding:'10px 22px',whiteSpace:'nowrap'}},'SUBSCRIBE')
              )
            ),
            h('div',{style:{paddingTop:18,borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',transition:'var(--transition)'}},
              h('span',{style:{fontSize:9,color:'var(--dim)',letterSpacing:'.12em',transition:'color .4s'}},'© 2026 NOIR AUDIO. ALL RIGHTS RESERVED.'),
              h('div',{style:{display:'flex',gap:18}},
                ['PRIVACY','TERMS','COOKIES'].map(lb =>
                  h('button',{key:lb,style:{fontSize:9,color:'var(--dim)',letterSpacing:'.12em',background:'none',border:'none',cursor:'pointer',fontFamily:"'Space Mono',monospace",transition:'color .2s'}}, lb)
                )
              )
            )
          )
    ),

    /* ── CART DRAWER ── */
    cartOpen && h(Fragment, null,
      h('div',{onClick:()=>setCartOpen(false),style:{position:'fixed',inset:0,zIndex:200,background:dk?'rgba(0,0,0,.75)':'rgba(0,0,0,.50)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',animation:'bdIn .3s ease both'},'aria-hidden':'true'}),

      h('div',{ className:'cart-drawer', style:{width:mob?'100vw':'min(420px,90vw)'}, role:'dialog', 'aria-label':'Shopping cart', 'aria-modal':'true' },
        /* header */
        h('div',{style:{padding:mob?'18px 16px':'24px 28px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0,background:dk?'rgba(255,255,255,.02)':'rgba(0,0,0,.02)',transition:'var(--transition)'}},
          h('div',null,
            h('div',{className:'lbl',style:{display:'block',marginBottom:5}},'YOUR SELECTION'),
            h('div',{className:'serif',style:{fontSize:22,fontWeight:300,color:'var(--text)',transition:'color .4s'}},'Cart')
          ),
          h('button',{onClick:()=>setCartOpen(false),className:'icon-btn',style:{width:38,height:38,fontSize:18,color:'var(--muted)'},'aria-label':'Close cart'}, '×')
        ),

        ordered
          /* ── order success ── */
          ? h('div',{style:{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justify('center'),padding:'40px 28px',textAlign:'center'}},
              h('div',{style:{width:58,height:58,borderRadius:'50%',border:'2px solid var(--ac)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:24,animation:'checkIn .5s cubic-bezier(.23,1,.32,1) both'}},
                h('span',{style:{color:'var(--ac)',fontSize:22}},'✓')
              ),
              h('div',{className:'lbl',style:{display:'block',marginBottom:12}},'ORDER CONFIRMED'),
              h('h3',{className:'serif',style:{fontSize:25,fontWeight:300,marginBottom:12,color:'var(--text)',transition:'color .4s'}},'Thank you.'),
              h('p',{style:{fontSize:11,color:'var(--muted)',lineHeight:1.82,transition:'color .4s'}},'Your instruments will be hand-finished and shipped within 14 business days.')
            )
          : h(Fragment, null,
              /* items list */
              h('div',{style:{flex:1,overflowY:'auto',padding:mob?'16px':'20px 28px'},role:'list'},
                cart.length === 0
                  ? h('div',{style:{textAlign:'center',padding:'80px 0',color:'var(--dim)',fontSize:11,letterSpacing:'.12em',transition:'color .4s'}},'Your curation is empty')
                  : cart.map((item, i) =>
                      h('div',{key:item.id,role:'listitem',style:{display:'flex',gap:13,alignItems:'center',padding:'16px 0',borderBottom:'1px solid var(--border)',animation:`fadeUp .35s ease ${i*.06}s both`,transition:'var(--transition)'}},
                        h('div',{
                          onClick:()=>{setCartOpen(false);setProdM(item);},
                          role:'button',tabIndex:0,'aria-label':`View ${item.name}`,
                          onKeyDown:e=>e.key==='Enter'&&(setCartOpen(false),setProdM(item)),
                          style:{width:62,height:62,borderRadius:3,flexShrink:0,
                                 border:'1px solid var(--border)',overflow:'hidden',
                                 cursor:'pointer',background:'#0a0a0a'}},
                        h('img',{src:item.img,alt:item.name,decoding:'async',
                                 style:{width:'100%',height:'100%',objectFit:'cover',
                                        filter:'brightness(.70) saturate(.80)',
                                        opacity:0,transition:'opacity .3s ease'},
                                 onLoad: ev=>ev.target.style.opacity=1,
                                 onError:ev=>ev.target.style.display='none'})),
                        h('div',{style:{flex:1,minWidth:0}},
                          h('div',{className:'serif',style:{fontSize:14,marginBottom:2,color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',transition:'color .4s'}}, item.name),
                          h('div',{style:{fontSize:9,color:'var(--muted)',letterSpacing:'.10em',marginBottom:7,transition:'color .4s'}}, item.sub),
                          h('div',{style:{display:'flex',alignItems:'center',gap:9},'aria-label':`Quantity: ${item.qty}`},
                            [-1,null,1].map((d,j) => d === null
                              ? h('span',{key:j,style:{fontSize:13,minWidth:16,textAlign:'center',color:'var(--text)',transition:'color .4s'}}, item.qty)
                              : h('button',{key:j,onClick:()=>adjustQty(item.id,d),'aria-label':d<0?'Decrease quantity':'Increase quantity',style:{background:dk?'rgba(255,255,255,.05)':'rgba(0,0,0,.06)',border:'1px solid var(--border)',color:'var(--text)',width:28,height:28,borderRadius:2,fontSize:15,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all .2s'}}, d<0?'−':'+')
                            )
                          )
                        ),
                        h('div',{className:'serif',style:{fontSize:15,color:item.ac,flexShrink:0}}, `$${(item.price*item.qty).toLocaleString()}`)
                      )
                    )
              ),
              /* checkout footer */
              cart.length > 0 && h('div',{style:{padding:mob?'16px':'22px 28px',borderTop:'1px solid var(--border)',flexShrink:0,transition:'var(--transition)'}},
                h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:16}},
                  h('span',{style:{fontSize:9,letterSpacing:'.24em',color:'var(--muted)',transition:'color .4s'}},'SUBTOTAL'),
                  h('span',{className:'serif',style:{fontSize:26,color:'var(--text)',transition:'color .4s'}}, `$${cartTotal.toLocaleString()}`)
                ),
                h('button',{onClick:checkout,className:'btn-primary',style:{width:'100%',padding:15,textAlign:'center'}},'PROCEED TO CHECKOUT'),
                h('p',{style:{textAlign:'center',marginTop:10,fontSize:9,color:'var(--dim)',letterSpacing:'.10em',transition:'color .4s'}},'Complimentary worldwide shipping')
              )
            )
      )
    ),

    /* ── PRODUCT DETAIL MODAL ── */
    prodM && h('div',{ className:'modal-bd', onClick:()=>setProdM(null), role:'dialog', 'aria-label':`Product details: ${prodM.name}`, 'aria-modal':'true' },
      h('div',{
        onClick: e => e.stopPropagation(),
        className:'glass',
        style:{...glassStyle,background:'var(--bg2)',borderRadius:6,width:mob?'100%':'min(720px,92vw)',maxHeight:mob?'90vh':'88vh',overflowY:'auto',
          boxShadow:`0 0 0 1px ${prodM.ac}22, 0 40px 120px var(--shadow)`,animation:'scaleIn .40s cubic-bezier(.23,1,.32,1) both',position:'relative',transition:'var(--transition)'},
      },
        h(Corners,{color:prodM.ac}),
        h('button',{onClick:()=>setProdM(null),className:'icon-btn',style:{position:'absolute',top:12,right:12,width:36,height:36,zIndex:2,fontSize:16,color:'var(--muted)'},'aria-label':'Close dialog'}, '×'),

        h('div',{style:{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr'}},
          /* image panel */
          h('div',{style:{position:'relative',height:mob?240:360,overflow:'hidden',
            background:'#090909',
            borderRight:mob?'none':'1px solid var(--border)',
            borderBottom:mob?'1px solid var(--border)':'none'}},
            h('img',{src:prodM.img, alt:prodM.name,
              loading:'lazy', decoding:'async',
              style:{width:'100%',height:'100%',objectFit:'cover',
                filter:'brightness(.72) contrast(1.12) saturate(.82)',
                opacity:0, transition:'opacity .35s ease'},
              onLoad:  ev => ev.target.style.opacity = 1,
              onError: ev => { ev.target.style.display='none'; ev.target.parentNode.style.background=`radial-gradient(ellipse 70% 70% at 50% 50%,${prodM.ac}12,#0a0a0a)`; },
            }),
            h('div',{style:{position:'absolute',inset:0,pointerEvents:'none',
              background:'linear-gradient(to bottom,transparent 40%,rgba(0,0,0,.55) 100%)'}}),
            h(Corners,{color:prodM.ac}),
          ),
          /* info panel */
          h('div',{style:{padding:mob?'20px 20px 24px':'36px 30px'}},
            h('div',{className:'lbl',style:{display:'block',marginBottom:8}}, prodM.tag),
            h('h2',{className:'serif',style:{fontSize:mob?24:30,fontWeight:300,letterSpacing:'.02em',marginBottom:5,color:'var(--text)',transition:'color .4s'}}, prodM.name),
            h('div',{style:{fontSize:9,color:'var(--muted)',letterSpacing:'.12em',marginBottom:16,transition:'color .4s'}}, prodM.sub),
            h('p',{style:{fontSize:12,color:'var(--muted)',lineHeight:1.84,marginBottom:18,transition:'color .4s'}}, prodM.desc),
            h('div',{style:{borderTop:'1px solid var(--border)',paddingTop:14,marginBottom:16,transition:'var(--transition)'}},
              prodM.specs.map(([k,v]) =>
                h('div',{key:k,style:{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid var(--border)',gap:12,transition:'var(--transition)'}},
                  h('span',{style:{fontSize:9,color:'var(--muted)',letterSpacing:'.12em',flexShrink:0,transition:'color .4s'}}, k),
                  h('span',{style:{fontSize:10,color:'var(--text)',letterSpacing:'.04em',textAlign:'right',transition:'color .4s'}}, v)
                )
              )
            ),
            h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}},
              h('span',{style:{fontSize:9,color:'var(--muted)',letterSpacing:'.20em',transition:'color .4s'}},'PRICE'),
              h('span',{className:'serif',style:{fontSize:26,color:prodM.ac}}, `$${prodM.price.toLocaleString()}`)
            ),
            h('button',{onClick:()=>addToCart(prodM),className:'btn-primary',style:{width:'100%',padding:14,textAlign:'center',background:prodM.ac,boxShadow:`0 8px 32px ${prodM.ac}30`}},'ADD TO CART'),
            h('button',{onClick:()=>setProdM(null),className:'btn-ghost',style:{width:'100%',marginTop:9,padding:12,textAlign:'center'}},'CONTINUE BROWSING')
          )
        )
      )
    ),

    /* ── FILM MODAL ── */
    film && h('div',{
      style:{position:'fixed',inset:0,zIndex:300,background:dk?'rgba(0,0,0,.96)':'rgba(12,10,8,.97)',backdropFilter:'blur(14px)',WebkitBackdropFilter:'blur(14px)',animation:'bdIn .3s ease both',display:'flex',alignItems:'center',justifyContent:'center',padding:mob?'16px':0},
      role:'dialog','aria-label':'Film: The Art of Listening','aria-modal':'true',
    },
      dk && h('div',{'aria-hidden':'true',style:{position:'absolute',inset:0,backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='.07'/%3E%3C/svg%3E")`,animation:'grain .3s steps(1) infinite',opacity:.8,pointerEvents:'none'}}),
      h('button',{onClick:()=>setFilm(false),className:'icon-btn',style:{position:'absolute',top:18,right:18,width:40,height:40,background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.12)',color:'rgba(255,255,255,.6)',fontSize:17,zIndex:1},'aria-label':'Close film modal'}, '×'),
      h('div',{onClick:e=>e.stopPropagation(),style:{textAlign:'center',padding:mob?'0 20px':0,animation:'fadeUp .70s ease both',position:'relative',zIndex:1,width:'100%',maxWidth:660}},
        h('div',{className:'lbl',style:{display:'block',marginBottom:22,fontSize:8,letterSpacing:'.45em',opacity:.80}},'NOW PLAYING'),
        h('h2',{className:'serif',style:{fontSize:mob?'clamp(36px,9.5vw,50px)':'clamp(50px,5vw,72px)',fontWeight:300,lineHeight:1.02,letterSpacing:'-.02em',marginBottom:12,color:'#E5E5E5'}},
          'The Art of',h('br'),h('em',{style:{color:'var(--ac)'}},'Listening.')
        ),
        h('p',{style:{fontSize:10,color:'rgba(255,255,255,.26)',letterSpacing:'.20em',marginBottom:30}},"NOIR AUDIO · 2026 · 4'32\""),
        h('div',{style:{display:'flex',justifyContent:'center',marginBottom:26}}, h(Waveform,{color:'var(--ac)'})),
        h('div',{style:{width:'100%',height:mob?150:240,border:'1px solid rgba(255,255,255,.08)',borderRadius:4,background:'linear-gradient(135deg,#0d0d0d,#141414)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',margin:'0 auto',marginBottom:26},'aria-hidden':'true'},
          h(Corners,{color:'var(--ac)',size:11,pad:9}),
          h(Headphones,{ac:'var(--ac)',sz:mob?120:185,dk:true}),
          h('div',{style:{position:'absolute',bottom:12,left:12,right:12,height:2,background:'rgba(255,255,255,.07)',borderRadius:2}},
            h('div',{style:{width:'35%',height:'100%',background:'var(--ac)',borderRadius:2,boxShadow:'0 0 8px var(--ac)'}})
          ),
          h('div',{style:{position:'absolute',bottom:18,right:14,fontSize:9,color:'rgba(255,255,255,.35)',letterSpacing:'.1em',fontFamily:'monospace'}},"1:36 / 4:32")
        ),
        h('button',{onClick:()=>setFilm(false),className:'btn-ghost',style:{color:'rgba(255,255,255,.45)',borderColor:'rgba(255,255,255,.12)'}},'CLOSE')
      )
    )
  );
}

/* ────── RENDER ────── */
ReactDOM.createRoot(document.getElementById('root')).render(h(App));
