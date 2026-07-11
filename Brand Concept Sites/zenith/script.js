function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState,
  useRef,
  useEffect,
  useCallback
} = React;

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const DARK = {
  bg: "#030303",
  fg: "#FFFFFF",
  fg2: "#A1A1AA",
  fg3: "#52525A",
  gold: "#C9A84C",
  goldL: "#E8C96A",
  goldAlpha: "rgba(201,168,76,0.09)",
  glass: "rgba(255,255,255,0.03)",
  glassBorder: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.07)",
  borderSub: "rgba(255,255,255,0.04)",
  navBg: "rgba(3,3,3,0.92)",
  scrollTrack: "#030303",
  inputBg: "rgba(255,255,255,0.04)",
  gridLine: "rgba(255,255,255,0.013)",
  cardShadow: "rgba(0,0,0,0.5)",
  isDark: true,
  watchFilter: "drop-shadow(0 40px 80px rgba(0,0,0,0.96)) drop-shadow(0 0 40px rgba(201,168,76,0.12))"
};
const LIGHT = {
  bg: "#F4F1EB",
  fg: "#0A0908",
  fg2: "#5C5955",
  fg3: "#9A9691",
  gold: "#8B6318",
  goldL: "#6A4B10",
  goldAlpha: "rgba(139,99,24,0.09)",
  glass: "rgba(255,255,255,0.68)",
  glassBorder: "rgba(0,0,0,0.09)",
  border: "rgba(0,0,0,0.09)",
  borderSub: "rgba(0,0,0,0.05)",
  navBg: "rgba(244,241,235,0.94)",
  scrollTrack: "#F4F1EB",
  inputBg: "rgba(255,255,255,0.7)",
  gridLine: "rgba(0,0,0,0.04)",
  cardShadow: "rgba(0,0,0,0.1)",
  isDark: false,
  watchFilter: "drop-shadow(0 24px 60px rgba(0,0,0,0.22)) drop-shadow(0 0 24px rgba(139,99,24,0.09))"
};

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const CSS = `
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* Custom cursor only for real pointer devices */
  @media (pointer: fine)  { * { cursor: none !important; } }
  @media (pointer: coarse){ .z-cursor-dot, .z-cursor-ring { display: none !important; } }

  .z-fade { transition: opacity 0.26s ease; }

  /* Cursors */
  .z-cursor-dot  { position:fixed; width:7px; height:7px; border-radius:50%; pointer-events:none; z-index:99999; transform:translate(-50%,-50%); mix-blend-mode:difference; }
  .z-cursor-ring { position:fixed; width:34px; height:34px; border-radius:50%; pointer-events:none; z-index:99998; transform:translate(-50%,-50%); border:1px solid transparent; transition:transform .18s cubic-bezier(.16,1,.3,1),width .28s,height .28s; }

  /* Keyframes */
  @keyframes zLetterIn   { from{opacity:0;transform:translateY(60px) rotateX(-45deg);filter:blur(12px)} to{opacity:1;transform:none;filter:none} }
  @keyframes zBlurReveal { from{opacity:0;filter:blur(28px);transform:scale(.93) translateY(20px)}     to{opacity:1;filter:none;transform:none} }
  @keyframes zFadeUp     { from{opacity:0;transform:translateY(24px)}  to{opacity:1;transform:none} }
  @keyframes zPulse {
    0%,100%{box-shadow:0 0 0 0 var(--pc1),0 0 24px var(--pc2),inset 0 0 14px var(--pc3)}
    50%    {box-shadow:0 0 0 10px transparent,0 0 56px var(--pc4),inset 0 0 24px var(--pc3)}
  }
  @keyframes zMenuSlide  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }

  .ltr          { display:inline-block; opacity:0; perspective:600px; }
  .ltr.go       { animation:zLetterIn .85s cubic-bezier(.16,1,.3,1) forwards; }
  .blur-in      { animation:zBlurReveal 1.6s cubic-bezier(.16,1,.3,1) .2s both; }
  .fade-up      { animation:zFadeUp .8s cubic-bezier(.16,1,.3,1) both; }
  .pulse-btn    { animation:zPulse 2.6s ease-in-out infinite; }
  .z-menu-anim  { animation:zMenuSlide .28s cubic-bezier(.16,1,.3,1) both; }

  /* Rolling text nav */
  .roll        { display:inline-block; overflow:hidden; position:relative; height:1.22em; vertical-align:bottom; }
  .roll .t1,
  .roll .t2    { display:block; transition:transform .5s cubic-bezier(.76,0,.24,1); }
  .roll .t2    { position:absolute; top:100%; left:0; white-space:nowrap; font-weight:600; }
  .roll:hover .t1,
  .roll:hover .t2 { transform:translateY(-100%); }

  /* 3-D card */
  .persp   { perspective:1000px; }
  .c3d     { transform-style:preserve-3d; }
  /* c-ovl: desktop clip-path reveal — z-index:10 sits above content (z-index:1) */
  .c-ovl   { clip-path:circle(0% at 50% 50%); transition:clip-path .55s cubic-bezier(.76,0,.24,1); z-index:10; }
  .c3d:hover .c-ovl { clip-path:circle(120% at 50% 50%); }

  /* Theme toggle */
  .tog-track { width:50px; height:26px; border-radius:100px; position:relative; transition:background .45s,border-color .45s; border:1px solid; flex-shrink:0; }
  .tog-thumb { position:absolute; top:2px; width:20px; height:20px; border-radius:50%; transition:left .45s cubic-bezier(.34,1.56,.64,1),background .45s; display:flex; align-items:center; justify-content:center; font-size:11px; }

  /* ── Watch startup animation ── */
  @keyframes zRipple {
    0%   { transform:scale(1);  opacity:.85; }
    100% { transform:scale(12); opacity:0;   }
  }
  @keyframes zCrownWind {
    0%,100% { opacity:.55; filter:brightness(1);   }
    50%     { opacity:1;   filter:brightness(2.2) drop-shadow(0 0 5px rgba(201,168,76,.9)); }
  }
  @keyframes zDialGlow {
    0%   { opacity:0; }
    30%  { opacity:1; }
    100% { opacity:0; }
  }
  /* Marquee mask */
  .mq-mask { -webkit-mask:linear-gradient(to right,transparent,black 8%,black 92%,transparent); mask:linear-gradient(to right,transparent,black 8%,black 92%,transparent); }

  /* ── Auto-scroll loop (mobile cards) ── */
  @keyframes zLoopScroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  /* Pause on hover/touch-hold */
  .loop-inner:hover,
  .loop-inner:active { animation-play-state: paused; }

  /* Edge fade mask */
  .loop-wrap {
    -webkit-mask: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
    mask: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
  }

  /* Hover helpers */
  .press-item   { transition:opacity .28s ease; }
  .press-item:hover { opacity:.85 !important; }
  .footer-link  { transition:color .25s ease; }
  .footer-link:hover { opacity:.75; }

  /* Focus ring (accessibility) */
  button:focus-visible, a:focus-visible { outline:2px solid rgba(201,168,76,.6); outline-offset:3px; border-radius:4px; }

  input:focus   { outline:none; }
  input::placeholder { opacity:.4; }
`;

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

/* ─────────────────────────────────────────────
   WATCH SVG  — Startup mainspring animation
   Phase 1 "idle"   : hands at 12 o'clock (0°)
   Phase 2 "winding": hands spin N full turns
                      then decelerate to real time
   Phase 3 "running": hands tick every second

   Uses CSS transforms (not SVG transform attr)
   so CSS transition:transform works on <g>.
   rotate around dial centre  → translate(140,180)
                                 rotate(deg)
                                 translate(-140,-180)
───────────────────────────────────────────── */
function WatchSVG({
  theme
}) {
  const [angles, setAngles] = useState({
    h: 0,
    m: 0,
    s: 0
  });
  const [phase, setPhase] = useState("idle"); // idle | winding | settling | running
  const ids = useRef([]);
  useEffect(() => {
    const add = (fn, ms) => {
      const id = setTimeout(fn, ms);
      ids.current.push(id);
    };
    const snap = () => {
      const n = new Date();
      return {
        h: n.getHours() % 12 * 30 + n.getMinutes() * .5,
        m: n.getMinutes() * 6 + n.getSeconds() * .1,
        s: n.getSeconds() * 6
      };
    };

    /* — Step 1: after first paint, trigger the wind-up — */
    add(() => {
      const cur = snap();
      setPhase("winding");
      setAngles({
        h: 2 * 360 + cur.h,
        /* 2 full spins  → current hour   (heaviest) */
        m: 5 * 360 + cur.m,
        /* 5 full spins  → current minute            */
        s: 8 * 360 + cur.s /* 8 full spins  → current second (lightest) */
      });

      /*
       * Step 2 — "settling":
       *   Snap hands to real normalised angles with transition:NONE.
       *   Without this, switching from 1025° → 305° with an ease-out
       *   transition causes a fast BACKWARD spin (the stuck-animate bug).
       */
      add(() => {
        const c = snap();
        setPhase("settling"); // transition:none → zero-duration snap
        setAngles(c);

        /*
         * Step 3 — "running":
         *   Wait two paint frames (60 ms) so the browser commits the
         *   transition:none render before we re-enable tick transitions.
         */
        add(() => {
          setPhase("running");
          const tickId = setInterval(() => setAngles(snap()), 1000);
          ids.current.push(tickId);
        }, 60);
      }, 3400);
    }, 80);
    return () => ids.current.forEach(id => {
      clearTimeout(id);
      clearInterval(id);
    });
  }, []);
  const winding = phase === "winding";
  const running = phase === "running";

  /*
   * CSS transform equivalent of SVG rotate(deg, cx, cy)
   * Transition durations stagger: second settles first,
   * minute next, hour last — like gears of different mass.
   */
  const rot = deg => `translate(140px,180px) rotate(${deg}deg) translate(-140px,-180px)`;
  const rotS = deg => `translate(140px,210px) rotate(${deg}deg) translate(-140px,-210px)`;
  const trH = winding ? "transform 3.2s cubic-bezier(.08,.82,.14,1.0)" : running ? "transform .06s ease-out" : "none";
  const trM = winding ? "transform 2.7s cubic-bezier(.08,.82,.14,1.0)" : running ? "transform .06s ease-out" : "none";
  const trS = winding ? "transform 2.2s cubic-bezier(.08,.82,.14,1.0)" : running ? "transform .06s ease-out" : "none";
  const markers = Array.from({
    length: 12
  }, (_, i) => {
    const a = (i * 30 - 90) * Math.PI / 180,
      r = 62,
      l = i % 3 === 0 ? 10 : 5;
    return {
      x1: 140 + r * Math.cos(a),
      y1: 175 + r * Math.sin(a),
      x2: 140 + (r - l) * Math.cos(a),
      y2: 175 + (r - l) * Math.sin(a),
      main: i % 3 === 0
    };
  });
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 280 400",
    style: {
      filter: theme.watchFilter,
      width: "100%",
      height: "auto",
      willChange: "transform"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "wg1",
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#5e5e68"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "45%",
    stopColor: "#2e2e38"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#191920"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "wg2",
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#1e1e28"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#0c0c12"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: "wg3",
    cx: "35%",
    cy: "28%",
    r: "75%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#14141e"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#05050a"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "wg4",
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "0%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#b8942a"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: "#e8c96a"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#b8942a"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "wg5",
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "rgba(255,255,255,.42)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "30%",
    stopColor: "rgba(255,255,255,.05)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "70%",
    stopColor: "rgba(255,255,255,.02)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "rgba(255,255,255,.28)"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: "wg6",
    cx: "25%",
    cy: "22%",
    r: "60%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "rgba(255,255,255,.17)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "rgba(255,255,255,0)"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "wg7",
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "0%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#404050"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: "#a0a0b2"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#383848"
  })), /*#__PURE__*/React.createElement("filter", {
    id: "wgf"
  }, /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: "2.5",
    result: "b"
  }), /*#__PURE__*/React.createElement("feComposite", {
    in: "SourceGraphic",
    in2: "b",
    operator: "over"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: "wgDialGlow",
    cx: "50%",
    cy: "50%",
    r: "50%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: theme.gold,
    stopOpacity: ".18"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: theme.gold,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: "M106 2Q106 0 118 0L162 0Q174 0 174 2L174 79Q174 81 140 81Q106 81 106 79Z",
    fill: "#161618"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M113 4Q113 2 120 2L160 2Q167 2 167 4L167 77Q167 79 140 79Q113 79 113 77Z",
    fill: "#111113"
  }), [16, 31, 46, 61].map(y => /*#__PURE__*/React.createElement("ellipse", {
    key: y,
    cx: "140",
    cy: y,
    rx: "4",
    ry: "2.5",
    fill: "#0a0a0a",
    stroke: "#1e1e1e",
    strokeWidth: ".5"
  })), /*#__PURE__*/React.createElement("rect", {
    x: "58",
    y: "77",
    width: "164",
    height: "206",
    rx: "32",
    fill: "url(#wg1)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M92 79Q140 73 188 79",
    stroke: "rgba(255,255,255,.23)",
    strokeWidth: "1.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "63",
    y: "82",
    width: "154",
    height: "196",
    rx: "28",
    fill: "url(#wg2)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "219",
    y: "148",
    width: "18",
    height: "32",
    rx: "6",
    fill: "url(#wg7)",
    style: winding ? {
      animation: "zCrownWind .38s ease-in-out 5 alternate"
    } : undefined
  }), [154, 162, 170, 178].map(y => /*#__PURE__*/React.createElement("line", {
    key: y,
    x1: "219",
    y1: y,
    x2: "237",
    y2: y,
    stroke: "rgba(255,255,255,.14)",
    strokeWidth: ".8"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "140",
    cy: "180",
    r: "68",
    fill: "#050508"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "140",
    cy: "180",
    r: "66",
    fill: "url(#wg3)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "140",
    cy: "180",
    r: "64",
    fill: "none",
    stroke: "rgba(255,255,255,.04)",
    strokeWidth: ".5"
  }), winding && /*#__PURE__*/React.createElement("circle", {
    cx: "140",
    cy: "180",
    r: "64",
    fill: "url(#wgDialGlow)",
    style: {
      animation: "zDialGlow 2.8s ease-in-out forwards"
    }
  }), Array.from({
    length: 60
  }, (_, i) => {
    if (i % 5 === 0) return null;
    const a = (i * 6 - 90) * Math.PI / 180;
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: 140 + 62 * Math.cos(a),
      y1: 180 + 62 * Math.sin(a),
      x2: 140 + 59 * Math.cos(a),
      y2: 180 + 59 * Math.sin(a),
      stroke: "rgba(255,255,255,.12)",
      strokeWidth: ".5"
    });
  }), markers.map((m, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: m.x1,
    y1: m.y1 + 5,
    x2: m.x2,
    y2: m.y2 + 5,
    stroke: m.main ? theme.gold : "rgba(255,255,255,.3)",
    strokeWidth: m.main ? 2.5 : 1,
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("text", {
    x: "140",
    y: "152",
    textAnchor: "middle",
    fill: theme.gold,
    style: {
      fontFamily: "Cormorant Garamond,serif",
      fontSize: 9,
      letterSpacing: 4,
      fontWeight: 300
    }
  }, "ZENITH"), /*#__PURE__*/React.createElement("text", {
    x: "140",
    y: "163",
    textAnchor: "middle",
    fill: "rgba(255,255,255,.28)",
    style: {
      fontFamily: "JetBrains Mono,monospace",
      fontSize: 4,
      letterSpacing: 3
    }
  }, "V-1 \xB7 TITANIUM"), /*#__PURE__*/React.createElement("circle", {
    cx: "140",
    cy: "210",
    r: "14",
    fill: "#030305",
    stroke: "rgba(255,255,255,.08)",
    strokeWidth: ".5"
  }), [0, 90, 180, 270].map(d => {
    const a = (d - 90) * Math.PI / 180;
    return /*#__PURE__*/React.createElement("line", {
      key: d,
      x1: 140 + 11 * Math.cos(a),
      y1: 210 + 11 * Math.sin(a),
      x2: 140 + 13 * Math.cos(a),
      y2: 210 + 13 * Math.sin(a),
      stroke: "#444",
      strokeWidth: ".7"
    });
  }), /*#__PURE__*/React.createElement("g", {
    style: {
      transform: rotS(angles.s),
      transition: trS
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: "140",
    y1: "200",
    x2: "140",
    y2: "218",
    stroke: theme.gold,
    strokeWidth: ".9",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("g", {
    style: {
      transform: rot(angles.h),
      transition: trH
    }
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "137.5,137 142.5,137 144,183 136,183",
    fill: "url(#wg4)",
    opacity: ".95"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "139,139 141,139 141.5,181 138.5,181",
    fill: "rgba(255,255,255,.13)"
  })), /*#__PURE__*/React.createElement("g", {
    style: {
      transform: rot(angles.m),
      transition: trM
    }
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "138.5,118 141.5,118 143,183 137,183",
    fill: "url(#wg4)",
    opacity: ".88"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "139.5,120 140.5,120 141,181 139,181",
    fill: "rgba(255,255,255,.1)"
  })), winding && [0, 0.4, 0.8].map((delay, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: "140",
    cy: "180",
    r: "7",
    fill: "none",
    stroke: theme.gold,
    strokeWidth: .7 - i * .15,
    style: {
      transformOrigin: "140px 180px",
      animation: `zRipple 1.1s ease-out ${delay}s forwards`,
      opacity: 0
    }
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "140",
    cy: "180",
    r: "6.5",
    fill: theme.gold,
    filter: "url(#wgf)",
    style: winding ? {
      filter: `url(#wgf) drop-shadow(0 0 6px ${theme.gold})`
    } : undefined
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "140",
    cy: "180",
    r: "4",
    fill: "#111"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "140",
    cy: "180",
    r: "1.5",
    fill: theme.gold
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "112",
    cy: "150",
    rx: "30",
    ry: "16",
    fill: "url(#wg6)",
    transform: "rotate(-22,112,150)",
    style: {
      mixBlendMode: "screen"
    }
  }), /*#__PURE__*/React.createElement("rect", {
    x: "60",
    y: "79",
    width: "160",
    height: "202",
    rx: "30",
    fill: "none",
    stroke: "url(#wg5)",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M106 281Q106 279 140 279Q174 279 174 281L174 386Q174 389 162 389L118 389Q106 389 106 386Z",
    fill: "#161618"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M113 283Q113 281 140 281Q167 281 167 283L167 384Q167 386 160 386L120 386Q113 386 113 384Z",
    fill: "#111113"
  }), [298, 315, 332, 349].map(y => /*#__PURE__*/React.createElement("ellipse", {
    key: y,
    cx: "140",
    cy: y,
    rx: "4",
    ry: "2.5",
    fill: "#0a0a0a",
    stroke: "#1e1e1e",
    strokeWidth: ".5"
  })), /*#__PURE__*/React.createElement("rect", {
    x: "119",
    y: "371",
    width: "42",
    height: "18",
    rx: "5",
    fill: "#2a2a2a",
    stroke: "#333",
    strokeWidth: ".5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "123",
    y: "375",
    width: "34",
    height: "10",
    rx: "3",
    fill: "#1a1a1a"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "140",
    y1: "371",
    x2: "140",
    y2: "389",
    stroke: "#404040",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "140",
    cy: "375",
    r: "2.2",
    fill: theme.gold
  }));
}

/* ─────────────────────────────────────────────
   AUTO-SCROLL LOOP ROW  (mobile cards)
   Duplicates items [A,B,C] → [A,B,C,A,B,C].
   paddingRight = gap so each slot = cardW+gap.
   -50% = exactly one full cycle → seamless loop.
───────────────────────────────────────────── */
function AutoScrollRow({
  items,
  renderItem,
  cardW,
  gap = 16,
  duration = 22
}) {
  const doubled = [...items, ...items];
  return /*#__PURE__*/React.createElement("div", {
    className: "loop-wrap",
    style: {
      overflow: "hidden",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "loop-inner",
    style: {
      display: "inline-flex",
      animation: `zLoopScroll ${duration}s linear infinite`,
      willChange: "transform"
    }
  }, doubled.map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flexShrink: 0,
      paddingRight: `${gap}px`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${cardW}px`
    }
  }, renderItem(item, i % items.length))))));
}

/* Mini stat card for mobile loop */
function MiniStatCard({
  label,
  num,
  sub,
  accent = false,
  theme,
  dark
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "148px",
      background: accent ? dark ? "linear-gradient(135deg,rgba(201,168,76,.13),rgba(201,168,76,.04))" : "linear-gradient(135deg,rgba(139,99,24,.11),rgba(139,99,24,.03))" : theme.glass,
      backdropFilter: "blur(40px)",
      WebkitBackdropFilter: "blur(40px)",
      border: `1px solid ${accent ? theme.gold : theme.glassBorder}`,
      borderRadius: 16,
      padding: "22px 20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: `0 4px 24px ${theme.cardShadow}`,
      position: "relative",
      overflow: "hidden"
    }
  }, accent && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(circle at 30% 50%,${theme.goldAlpha},transparent 70%)`,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "3px",
      color: theme.gold,
      textTransform: "uppercase",
      position: "relative",
      zIndex: 1
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: "44px",
      fontWeight: accent ? 600 : 300,
      color: theme.fg,
      lineHeight: 1
    }
  }, num, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "18px",
      fontWeight: 300,
      color: theme.fg2
    }
  }, sub)), accent && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "10px",
      height: 2,
      background: dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)",
      borderRadius: 1,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: "100%",
      background: `linear-gradient(to right,${theme.gold},${theme.goldL})`,
      borderRadius: 1
    }
  }))));
}

/* ─────────────────────────────────────────────
   SHARED UI ATOMS
───────────────────────────────────────────── */

/* Glass panel */
function Glass({
  children,
  style = {},
  theme
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: theme.glass,
      backdropFilter: "blur(40px)",
      WebkitBackdropFilter: "blur(40px)",
      border: `1px solid ${theme.glassBorder}`,
      borderRadius: 20,
      boxShadow: `0 8px 40px ${theme.cardShadow}, inset 0 1px 0 rgba(255,255,255,${theme.isDark ? 0.05 : 0.7})`,
      ...style
    }
  }, children);
}

/* Section label */
function SLabel({
  children,
  theme,
  center = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "9px",
      letterSpacing: "3px",
      color: theme.gold,
      textTransform: "uppercase",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      justifyContent: center ? "center" : "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 1,
      background: theme.gold,
      display: "inline-block"
    }
  }), children, center && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 1,
      background: theme.gold,
      display: "inline-block"
    }
  }));
}

/* Spec row */
function SpecRow({
  label,
  value,
  theme
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "13px 0",
      borderBottom: `1px solid ${theme.borderSub}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: "12px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "9px",
      letterSpacing: "1.5px",
      color: theme.fg2,
      textTransform: "uppercase",
      flexShrink: 0
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "10px",
      color: theme.fg,
      textAlign: "right"
    }
  }, value));
}

/* Theme toggle */
function ThemeToggle({
  dark,
  onToggle,
  theme
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onToggle,
    "aria-label": "Toggle theme",
    style: {
      background: "none",
      border: "none",
      padding: 0,
      display: "flex",
      alignItems: "center",
      gap: "8px",
      minHeight: "44px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "9px",
      letterSpacing: "2px",
      color: theme.fg3,
      textTransform: "uppercase"
    }
  }, dark ? "Dark" : "Light"), /*#__PURE__*/React.createElement("div", {
    className: "tog-track",
    style: {
      background: dark ? "rgba(201,168,76,.12)" : "rgba(139,99,24,.12)",
      borderColor: dark ? "rgba(201,168,76,.3)" : "rgba(139,99,24,.3)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tog-thumb",
    style: {
      left: dark ? "2px" : "calc(100% - 22px)",
      background: theme.gold
    }
  }, dark ? "☾" : "☀")));
}

/* ─────────────────────────────────────────────
   MAGNETIC CTA BUTTON
───────────────────────────────────────────── */
function MagBtn({
  onClick,
  added,
  theme,
  fullWidth = false,
  isMobile = false
}) {
  const wrapRef = useRef(null);
  const [off, setOff] = useState({
    x: 0,
    y: 0
  });
  const onMove = useCallback(e => {
    if (isMobile) return;
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2),
      dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist < 95) setOff({
      x: dx * (1 - dist / 95) * .55,
      y: dy * (1 - dist / 95) * .55
    });else setOff({
      x: 0,
      y: 0
    });
  }, [isMobile]);
  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [onMove]);
  const rgb = theme.isDark ? "201,168,76" : "139,99,24";
  return /*#__PURE__*/React.createElement("div", {
    ref: wrapRef,
    style: {
      display: "inline-block",
      width: fullWidth ? "100%" : undefined
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    "aria-label": added ? "Remove from cart" : "Add to cart",
    className: "pulse-btn",
    style: {
      "--pc1": added ? "transparent" : `rgba(${rgb},.5)`,
      "--pc2": added ? "transparent" : `rgba(${rgb},.16)`,
      "--pc3": added ? "transparent" : `rgba(${rgb},.07)`,
      "--pc4": added ? "transparent" : `rgba(${rgb},.3)`,
      transform: `translate(${off.x}px,${off.y}px)`,
      transition: "transform .45s cubic-bezier(.16,1,.3,1)",
      background: added ? theme.isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.05)" : theme.gold,
      border: `1px solid ${theme.gold}`,
      color: added ? theme.gold : theme.isDark ? "#030303" : "#fff",
      padding: "16px 40px",
      fontSize: "10px",
      letterSpacing: "3px",
      textTransform: "uppercase",
      fontFamily: "'JetBrains Mono',monospace",
      borderRadius: "100px",
      fontWeight: 500,
      minHeight: "50px",
      width: fullWidth ? "100%" : undefined,
      willChange: "transform"
    }
  }, added ? "— IN YOUR COLLECTION —" : "ADD TO COLLECTION"));
}

/* ─────────────────────────────────────────────
   3-D TILT CARD
   Desktop : CSS clip-path circle expand on hover
             z-index:10 on overlay (above content)
   Mobile  : tap to reveal / tap overlay to close
             opacity transition — no clip-path issues
───────────────────────────────────────────── */
function TiltCard({
  product,
  theme,
  isMobile = false
}) {
  const ref = useRef(null);
  const [T, setT] = useState({
    rx: 0,
    ry: 0,
    gx: 50,
    gy: 50,
    on: false
  });
  const [show, setShow] = useState(false); // mobile overlay toggle

  function onMove(e) {
    if (isMobile) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width,
      y = (e.clientY - r.top) / r.height;
    setT({
      rx: (y - .5) * 18,
      ry: (x - .5) * -18,
      gx: x * 100,
      gy: y * 100,
      on: true
    });
  }
  function onLeave() {
    setT({
      rx: 0,
      ry: 0,
      gx: 50,
      gy: 50,
      on: false
    });
  }

  /* ── gradient shared by both modes ── */
  const overlayBg = theme.isDark ? "linear-gradient(135deg,#C9A84C,#9a7530)" : "linear-gradient(135deg,#8B6318,#5a3f0c)";
  return /*#__PURE__*/React.createElement("div", {
    className: "persp",
    style: {
      height: "390px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "c3d",
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    style: {
      height: "100%",
      position: "relative",
      overflow: "hidden",
      borderRadius: 20,
      background: theme.glass,
      backdropFilter: "blur(40px)",
      WebkitBackdropFilter: "blur(40px)",
      border: `1px solid ${theme.glassBorder}`,
      boxShadow: `0 8px 40px ${theme.cardShadow},inset 0 1px 0 rgba(255,255,255,${theme.isDark ? 0.05 : 0.7})`,
      transform: `rotateX(${T.rx}deg) rotateY(${T.ry}deg)`,
      transition: T.on ? "transform .08s linear" : "transform .7s cubic-bezier(.16,1,.3,1)",
      willChange: "transform"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: 20,
      pointerEvents: "none",
      background: `radial-gradient(circle at ${T.gx}% ${T.gy}%,${theme.goldAlpha} 0%,transparent 55%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "32px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "relative",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "9px",
      letterSpacing: "3px",
      color: theme.gold,
      textTransform: "uppercase",
      marginBottom: "14px"
    }
  }, product.tag), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: "26px",
      fontWeight: 300,
      lineHeight: 1.2,
      marginBottom: "12px",
      whiteSpace: "pre-line",
      color: theme.fg
    }
  }, product.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "11px",
      color: theme.fg2,
      lineHeight: 1.8
    }
  }, product.desc)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: "36px",
      fontWeight: 600,
      color: theme.fg
    }
  }, product.price), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "9px",
      letterSpacing: "2px",
      color: theme.fg3
    }
  }, product.ref)), isMobile && /*#__PURE__*/React.createElement("button", {
    onClick: () => setShow(true),
    style: {
      position: "absolute",
      bottom: 28,
      right: 28,
      background: "none",
      border: `1px solid ${theme.glassBorder}`,
      color: theme.fg3,
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "2px",
      textTransform: "uppercase",
      padding: "7px 14px",
      borderRadius: "100px"
    }
  }, "Quick View")), !isMobile && /*#__PURE__*/React.createElement("div", {
    className: "c-ovl",
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: 20,
      background: overlayBg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "12px"
      /* z-index set in CSS (.c-ovl { z-index:10 }) */
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: "28px",
      fontWeight: 600,
      color: "#fff"
    }
  }, "QUICK VIEW"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "9px",
      letterSpacing: "3px",
      color: "rgba(255,255,255,.6)"
    }
  }, product.ref), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "4px",
      border: "1px solid rgba(255,255,255,.35)",
      padding: "8px 24px",
      fontSize: "9px",
      letterSpacing: "2px",
      fontFamily: "'JetBrains Mono',monospace",
      color: "#fff"
    }
  }, "EXPLORE MODEL")), isMobile && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: 20,
      background: overlayBg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "14px",
      zIndex: 20,
      opacity: show ? 1 : 0,
      pointerEvents: show ? "all" : "none",
      transition: "opacity .35s ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: "28px",
      fontWeight: 600,
      color: "#fff",
      letterSpacing: "1px"
    }
  }, "QUICK VIEW"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "9px",
      letterSpacing: "3px",
      color: "rgba(255,255,255,.65)"
    }
  }, product.ref), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: "20px",
      fontWeight: 300,
      color: "#fff",
      marginTop: "4px",
      letterSpacing: "-.3px",
      whiteSpace: "pre-line",
      textAlign: "center"
    }
  }, product.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "10px",
      fontWeight: 600,
      color: "#fff",
      letterSpacing: "1px"
    }
  }, product.price), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "8px",
      border: "1px solid rgba(255,255,255,.4)",
      padding: "10px 28px",
      fontSize: "9px",
      letterSpacing: "2px",
      fontFamily: "'JetBrains Mono',monospace",
      color: "#fff",
      borderRadius: "100px"
    }
  }, "EXPLORE MODEL"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShow(false),
    style: {
      position: "absolute",
      top: 16,
      right: 16,
      background: "rgba(0,0,0,.2)",
      border: "1px solid rgba(255,255,255,.3)",
      color: "#fff",
      width: 32,
      height: 32,
      borderRadius: "50%",
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "13px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "\u2715"))));
}

/* ─────────────────────────────────────────────
   MARQUEE ROW
───────────────────────────────────────────── */
function MarqRow({
  items,
  dir,
  speed,
  sy,
  theme,
  small = false
}) {
  const all = [...items, ...items, ...items, ...items, ...items, ...items];
  const tx = -1100 + sy * speed * dir;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "hidden",
      padding: "4px 0",
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      gap: small ? "28px" : "50px",
      transform: `translateX(${tx}px)`,
      willChange: "transform"
    }
  }, all.map((item, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: i % 2 === 0 ? small ? "34px" : "56px" : small ? "30px" : "52px",
      fontWeight: i % 2 === 0 ? 300 : 400,
      fontStyle: i % 2 === 0 ? "italic" : "normal",
      color: i % 2 === 0 ? `rgba(${theme.isDark ? "255,255,255" : "10,9,8"},.055)` : "transparent",
      WebkitTextStroke: i % 2 !== 0 ? `1px rgba(${theme.isDark ? "255,255,255" : "10,9,8"},.07)` : "none",
      letterSpacing: "-1px",
      lineHeight: 1,
      pointerEvents: "none"
    }
  }, item))));
}

/* ═══════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════ */
function ZenithV1() {
  const [dark, setDark] = useState(true);
  const [fading, setFading] = useState(false);
  const [go, setGo] = useState(false);
  const [sy, setSy] = useState(0);
  const [progress, setProg] = useState(0);
  const [added, setAdded] = useState(false);
  const [cursor, setCursor] = useState({
    x: -200,
    y: -200
  });
  const [ring, setRing] = useState({
    x: -200,
    y: -200
  });
  const [menuOpen, setMenuOpen] = useState(false);

  /* scroll container — fixes artifact iframe scroll */
  const scrollRef = useRef(null);

  /* ── Section refs — IN PAGE ORDER ── */
  const secHero = useRef(null);
  const secMaterials = useRef(null); // 1st content section
  const secCraft = useRef(null); // 2nd  (Craftsmanship)
  const secCollection = useRef(null); // 3rd
  const secContact = useRef(null); // 4th  (footer)

  const winW = useWindowWidth();
  const isMobile = winW < 768;
  const isTablet = winW >= 768 && winW < 1100;
  const theme = dark ? DARK : LIGHT;
  const PAD = isMobile ? "20px" : isTablet ? "40px" : "68px";

  /* ── Nav items in page order ── */
  const NAV = [{
    label: "Materials",
    sref: secMaterials
  }, {
    label: "Craftsmanship",
    sref: secCraft
  }, {
    label: "Collection",
    sref: secCollection
  }, {
    label: "Contact",
    sref: secContact
  }];

  /* scroll helper */
  const scrollTo = useCallback(ref => {
    const container = scrollRef.current;
    const target = ref?.current;
    if (!container || !target) return;
    container.scrollTo({
      top: target.offsetTop - 72,
      behavior: "smooth"
    });
    setMenuOpen(false);
  }, []);

  /* theme toggle */
  const toggleTheme = () => {
    setFading(true);
    setTimeout(() => {
      setDark(d => !d);
      setFading(false);
    }, 260);
  };

  /* setup */
  useEffect(() => {
    const t = setTimeout(() => setGo(true), 200);
    const el = scrollRef.current;
    const onScroll = () => {
      if (!el) return;
      setSy(el.scrollTop);
      const mH = el.scrollHeight - el.clientHeight;
      setProg(mH > 0 ? el.scrollTop / mH * 100 : 0);
    };
    const onMouse = e => {
      setCursor({
        x: e.clientX,
        y: e.clientY
      });
      setTimeout(() => setRing({
        x: e.clientX,
        y: e.clientY
      }), 90);
    };
    el?.addEventListener("scroll", onScroll, {
      passive: true
    });
    window.addEventListener("mousemove", onMouse);
    return () => {
      clearTimeout(t);
      el?.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);
  useEffect(() => {
    if (menuOpen) setMenuOpen(false);
  }, [sy]);
  const heroParallax = isMobile ? 0 : -sy * 0.25;

  /* ── DATA ── */
  const features = [{
    n: "01",
    title: "Grade 5 Titanium",
    desc: "Aerospace-grade Ti-6Al-4V alloy machined from solid billet in our Geneva facility. 40% lighter than steel with ten times the corrosion resistance. Each case undergoes 48 hours of hand-finishing across eight surface treatments — from satin-brushed flanks to mirror-polished bevels."
  }, {
    n: "02",
    title: "In-House Caliber",
    desc: "The manual-wind Cal. V1 houses 316 individual components across 24 jewels. Column-wheel escapement, Glucydur beryllium balance wheel, and a 72-hour power reserve. The movement is visible through a double-domed sapphire exhibition caseback."
  }, {
    n: "03",
    title: "Sapphire Crystal",
    desc: "Double-domed sapphire machined to 1.5mm with seven-layer anti-reflective coating on both surfaces, delivering 99.4% light transmission. Rated 9 on the Mohs hardness scale — the same material used in aircraft cockpit windows."
  }, {
    n: "04",
    title: "200m Water Resistance",
    desc: "Screw-down crown with a custom ceramic triple-gasket system. Every finished watch is pressure-tested to 30 bar in our in-house hyperbaric chamber before leaving Geneva."
  }];
  const specs = [["Case Diameter", "39.0 mm"], ["Case Thickness", "9.8 mm"], ["Case Material", "Grade 5 Titanium (Ti-6Al-4V)"], ["Movement", "Cal. V1 — Manual Wind, In-House"], ["Oscillations", "28,800 vph / 4 Hz"], ["Power Reserve", "72 hours"], ["Jewels", "24"], ["Crystal", "Double-dome Sapphire, 7-layer AR"], ["Water Resistance", "200m / 20 ATM"], ["Strap", "Grained calfskin, titanium deployant"], ["Weight", "68 g"], ["Reference No.", "ZNT-V1-TI-001"]];
  const upsells = [{
    tag: "Companion Piece",
    name: "Zenith S-1\nSteel Edition",
    desc: "Automatic Cal. A1. Brushed and polished 316L steel. Date aperture at 6 o'clock.",
    price: "$4,200",
    ref: "ZNT-S1-ST-001"
  }, {
    tag: "Limited — 99 Pcs",
    name: "Zenith V-1\nObsidian Dial",
    desc: "Meteorite composite dial. Only 99 pieces worldwide, each individually numbered.",
    price: "$9,800",
    ref: "ZNT-V1-TI-099"
  }, {
    tag: "New Arrival",
    name: "Zenith P-1\nPocket Watch",
    desc: "Revival of an 1892 design. Hand-guilloché silver dial, 18k rose gold hunter case.",
    price: "$12,400",
    ref: "ZNT-P1-AG-001"
  }];
  const materials = [{
    code: "Ti",
    name: "Grade 5 Titanium",
    tag: "Aerospace Alloy",
    stat: "Ti-6Al-4V",
    desc: "Ten times the corrosion resistance of standard steel. Used in jet turbines and surgical implants before finding its way to the V-1 case."
  }, {
    code: "Sa",
    name: "Sapphire Crystal",
    tag: "Corundum Al₂O₃",
    stat: "9 Mohs",
    desc: "Identical hardness to natural sapphires. The only mineral that outranks it on the Mohs scale is diamond."
  }, {
    code: "Lth",
    name: "Swiss Calfskin",
    tag: "Glovelier, Jura",
    stat: "4h / Strap",
    desc: "Sourced from a single tannery in Jura. Aged 18 months before cutting. Each strap requires four hours of hand assembly."
  }];
  const press = ["HODINKEE", "REVOLUTION", "WATCHTIME", "FT WEEKEND", "GQ", "ESQUIRE", "MONOCLE"];
  const pStats = [{
    n: "340",
    l: "Finishing steps"
  }, {
    n: "72h",
    l: "Power reserve"
  }, {
    n: "12",
    l: "Weeks to build"
  }, {
    n: "24",
    l: "Movement jewels"
  }, {
    n: "200m",
    l: "Depth rating"
  }, {
    n: "316",
    l: "Components"
  }];

  /* ── HEADING SIZE helpers ── */
  const hXL = isMobile ? "clamp(28px,8vw,40px)" : isTablet ? "clamp(34px,5vw,50px)" : "clamp(38px,5vw,62px)";
  const hL = isMobile ? "clamp(26px,7vw,36px)" : isTablet ? "clamp(30px,4vw,44px)" : "clamp(32px,4vw,52px)";

  /* ════════════════ RENDER ════════════════ */
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("link", {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=JetBrains+Mono:wght@300;400;500&display=swap"
  }), /*#__PURE__*/React.createElement("style", null, CSS), /*#__PURE__*/React.createElement("style", null, `::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:${theme.scrollTrack};}::-webkit-scrollbar-thumb{background:${theme.gold};border-radius:2px;}`), /*#__PURE__*/React.createElement("div", {
    className: "z-cursor-dot",
    style: {
      left: cursor.x,
      top: cursor.y,
      background: theme.gold,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "z-cursor-ring",
    style: {
      left: ring.x,
      top: ring.y,
      borderColor: `rgba(${dark ? "201,168,76" : "139,99,24"},.45)`,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      left: 0,
      top: 0,
      width: "3px",
      height: "100%",
      zIndex: 9990,
      background: dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.07)",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: `${progress}%`,
      background: `linear-gradient(to bottom,${theme.gold},${theme.goldL})`,
      transition: "height .08s linear"
    }
  })), /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Main navigation",
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: `${isMobile ? "14px" : "22px"} ${PAD}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: sy > 40 || menuOpen ? theme.navBg : "transparent",
      backdropFilter: sy > 40 || menuOpen ? "blur(28px)" : "none",
      WebkitBackdropFilter: sy > 40 || menuOpen ? "blur(28px)" : "none",
      borderBottom: sy > 40 && !menuOpen ? `1px solid ${theme.borderSub}` : "none",
      transition: "background .5s,border-color .5s"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => scrollTo(secHero),
    "aria-label": "Back to top",
    style: {
      background: "none",
      border: "none",
      padding: 0,
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: isMobile ? "18px" : "22px",
      fontWeight: 600,
      letterSpacing: "4px",
      color: theme.fg
    }
  }, "Z", /*#__PURE__*/React.createElement("span", {
    style: {
      color: theme.gold
    }
  }, "."), "ENITH"), !isMobile && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "36px",
      alignItems: "center"
    }
  }, NAV.map(({
    label,
    sref
  }) => /*#__PURE__*/React.createElement("button", {
    key: label,
    onClick: () => scrollTo(sref),
    style: {
      background: "none",
      border: "none",
      padding: 0,
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "10px",
      letterSpacing: "2.5px",
      color: theme.fg2,
      textTransform: "uppercase"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "roll"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t1"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "t2",
    style: {
      color: theme.fg
    }
  }, label))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "12px" : "22px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "7px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: isMobile ? 5 : 6,
      height: isMobile ? 5 : 6,
      borderRadius: "50%",
      background: theme.gold,
      boxShadow: `0 0 8px ${theme.gold}`,
      flexShrink: 0
    }
  }), !isMobile && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "9px",
      letterSpacing: "2px",
      color: theme.fg2,
      textTransform: "uppercase"
    }
  }, "In Stock")), /*#__PURE__*/React.createElement(ThemeToggle, {
    dark: dark,
    onToggle: toggleTheme,
    theme: theme
  }), isMobile && /*#__PURE__*/React.createElement("button", {
    onClick: () => setMenuOpen(o => !o),
    "aria-label": menuOpen ? "Close menu" : "Open menu",
    "aria-expanded": menuOpen,
    style: {
      background: "none",
      border: `1px solid ${theme.border}`,
      padding: "7px 11px",
      borderRadius: "8px",
      color: theme.fg2,
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "15px",
      lineHeight: 1,
      minHeight: "40px"
    }
  }, menuOpen ? "✕" : "≡"))), isMobile && menuOpen && /*#__PURE__*/React.createElement("nav", {
    className: "z-menu-anim",
    "aria-label": "Mobile navigation",
    style: {
      position: "fixed",
      top: "54px",
      left: 0,
      right: 0,
      zIndex: 999,
      background: theme.navBg,
      backdropFilter: "blur(32px)",
      WebkitBackdropFilter: "blur(32px)",
      borderBottom: `1px solid ${theme.borderSub}`,
      padding: "8px 20px 20px"
    }
  }, NAV.map(({
    label,
    sref
  }, i) => /*#__PURE__*/React.createElement("button", {
    key: label,
    onClick: () => scrollTo(sref),
    style: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      background: "none",
      border: "none",
      padding: "14px 0",
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "11px",
      letterSpacing: "3px",
      color: theme.fg,
      textTransform: "uppercase",
      borderBottom: i < NAV.length - 1 ? `1px solid ${theme.borderSub}` : "none",
      textAlign: "left",
      minHeight: "48px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 1,
      background: theme.gold,
      display: "inline-block",
      marginRight: "12px",
      flexShrink: 0
    }
  }), label)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      paddingTop: "4px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: theme.gold,
      boxShadow: `0 0 8px ${theme.gold}`,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "9px",
      letterSpacing: "2px",
      color: theme.fg2,
      textTransform: "uppercase"
    }
  }, "In Stock \xB7 Ref. ZNT-V1-TI-001"))), /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    className: "z-fade",
    style: {
      height: "100vh",
      overflowY: "auto",
      overflowX: "hidden",
      background: theme.bg,
      color: theme.fg,
      fontFamily: "'JetBrains Mono',monospace",
      opacity: fading ? 0 : 1,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("section", {
    ref: secHero,
    style: {
      height: "100vh",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: "center",
      justifyContent: "center",
      padding: isMobile ? "120px 20px 56px" : `0 ${PAD}`,
      position: "relative",
      overflow: "hidden",
      gap: isMobile ? "14px" : "0",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: `linear-gradient(${theme.gridLine} 1px,transparent 1px),linear-gradient(90deg,${theme.gridLine} 1px,transparent 1px)`,
      backgroundSize: isMobile ? "50px 50px" : "80px 80px",
      mask: "radial-gradient(ellipse at 55% 45%,black 0%,transparent 70%)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "50%",
      left: isMobile ? "50%" : "62%",
      transform: "translate(-50%,-50%)",
      width: isMobile ? "280px" : "640px",
      height: isMobile ? "280px" : "640px",
      borderRadius: "50%",
      background: `radial-gradient(circle,${theme.goldAlpha} 0%,transparent 70%)`,
      pointerEvents: "none"
    }
  }), isMobile && /*#__PURE__*/React.createElement("div", {
    className: "blur-in",
    style: {
      width: "170px",
      flexShrink: 0,
      zIndex: 1,
      alignSelf: "center"
    }
  }, /*#__PURE__*/React.createElement(WatchSVG, {
    theme: theme
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: isMobile ? "100%" : "600px",
      zIndex: 2,
      textAlign: isMobile ? "center" : "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "fade-up",
    style: {
      animationDelay: ".05s",
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "9px",
      letterSpacing: "3.5px",
      color: theme.gold,
      textTransform: "uppercase",
      marginBottom: "22px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      justifyContent: isMobile ? "center" : "flex-start"
    }
  }, !isMobile && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 1,
      background: theme.gold,
      display: "inline-block"
    }
  }), "Ref. ZNT-V1-TI-001 \xB7 Geneva, CH"), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "visible",
      marginBottom: "2px"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    onMouseEnter: e => {
      e.currentTarget.style.textShadow = "3px 0 rgba(255,0,80,.5),-3px 0 rgba(0,200,255,.5)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.textShadow = "none";
    },
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: isMobile ? "clamp(64px,17vw,90px)" : isTablet ? "clamp(72px,10vw,110px)" : "clamp(80px,11vw,136px)",
      fontWeight: 300,
      lineHeight: .9,
      letterSpacing: "-2px",
      margin: 0,
      perspective: "600px",
      color: theme.fg,
      transition: "text-shadow .22s"
    }
  }, "ZENITH".split("").map((l, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: `ltr ${go ? "go" : ""}`,
    style: {
      animationDelay: `${.18 + i * .06}s`
    }
  }, l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "visible",
      marginBottom: "24px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: isMobile ? "clamp(52px,13vw,72px)" : isTablet ? "clamp(60px,8vw,90px)" : "clamp(62px,9vw,112px)",
      fontWeight: 700,
      lineHeight: .9,
      letterSpacing: "-2px",
      margin: 0,
      color: "transparent",
      WebkitTextStroke: `1px rgba(${dark ? "255,255,255" : "10,9,8"},.18)`,
      perspective: "600px"
    }
  }, "V—1".split("").map((l, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: `ltr ${go ? "go" : ""}`,
    style: {
      animationDelay: `${.52 + i * .09}s`
    }
  }, l)))), /*#__PURE__*/React.createElement("div", {
    className: "fade-up",
    style: {
      animationDelay: "1s",
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "11px" : "11.5px",
      color: theme.fg2,
      lineHeight: 1.88,
      marginBottom: "32px",
      maxWidth: isMobile ? "100%" : "440px",
      letterSpacing: ".3px"
    }
  }, "A manifesto in titanium. Hand-finished across 340 steps in our Geneva atelier. Where aerospace precision meets horological obsession."), /*#__PURE__*/React.createElement("div", {
    className: "fade-up",
    style: {
      animationDelay: "1.15s",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "stretch" : "center",
      gap: isMobile ? "14px" : "36px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: isMobile ? "center" : "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: isMobile ? "48px" : "60px",
      fontWeight: 600,
      lineHeight: 1,
      color: theme.fg
    }
  }, "$6,400"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "1.5px",
      color: theme.fg3,
      marginTop: "4px"
    }
  }, "EXCL. VAT \xB7 FREE WHITE-GLOVE DELIVERY")), /*#__PURE__*/React.createElement(MagBtn, {
    onClick: () => setAdded(!added),
    added: added,
    theme: theme,
    fullWidth: isMobile,
    isMobile: isMobile
  })), isMobile && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: "28px",
      fontWeight: 300,
      color: theme.fg,
      lineHeight: 1
    }
  }, "01"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "2px",
      color: theme.fg3,
      textTransform: "uppercase"
    }
  }, "of 250 \xB7 2024"))), !isMobile && /*#__PURE__*/React.createElement("div", {
    className: "blur-in",
    style: {
      position: "absolute",
      right: isTablet ? "4%" : "7%",
      top: "50%",
      transform: `translateY(calc(-50% + ${heroParallax}px))`,
      width: isTablet ? "270px" : "330px",
      zIndex: 1,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement(WatchSVG, {
    theme: theme
  })), !isMobile && /*#__PURE__*/React.createElement("div", {
    className: "fade-up",
    style: {
      animationDelay: "1.4s",
      position: "absolute",
      bottom: "36px",
      right: PAD,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "4px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: "34px",
      fontWeight: 300,
      color: theme.fg,
      lineHeight: 1
    }
  }, "01"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "2px",
      color: theme.fg3,
      textTransform: "uppercase"
    }
  }, "of 250 \xB7 2024"))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "10px 0",
      borderTop: `1px solid ${theme.borderSub}`,
      borderBottom: `1px solid ${theme.borderSub}`,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mq-mask"
  }, /*#__PURE__*/React.createElement(MarqRow, {
    items: ["Titanium", "Grade 5", "Geneva", "Manual-Wind", "V-1", "Zenith", "Sapphire", "Horlogerie"],
    dir: 1,
    speed: isMobile ? 0.1 : 0.22,
    sy: sy,
    theme: theme,
    small: isMobile
  }), /*#__PURE__*/React.createElement(MarqRow, {
    items: ["ZNT-V1-TI-001", "72h Reserve", "200m Depth", "In-House Cal.", "Hand-Finished", "316 Components"],
    dir: -1,
    speed: isMobile ? 0.08 : 0.16,
    sy: sy,
    theme: theme,
    small: isMobile
  }))), /*#__PURE__*/React.createElement("section", {
    ref: secMaterials,
    style: {
      padding: `${isMobile ? "56px" : "100px"} ${PAD} 0`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "40px",
      textAlign: isMobile ? "center" : "left"
    }
  }, /*#__PURE__*/React.createElement(SLabel, {
    theme: theme,
    center: isMobile
  }, "Materials"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: hXL,
      fontWeight: 300,
      lineHeight: 1.1,
      color: theme.fg,
      margin: 0
    }
  }, "Nothing extraneous.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "Nothing compromised."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3,1fr)",
      gap: "16px"
    }
  }, materials.map((m, i) => /*#__PURE__*/React.createElement(Glass, {
    key: i,
    theme: theme,
    style: {
      padding: isMobile ? "26px" : "40px",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: "68px",
      fontWeight: 700,
      lineHeight: 1,
      color: "transparent",
      WebkitTextStroke: `1px rgba(${dark ? "255,255,255" : "10,9,8"},.07)`,
      position: "absolute",
      top: "-8px",
      right: "18px",
      letterSpacing: "-2px",
      pointerEvents: "none"
    }
  }, m.code), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "3px",
      color: theme.gold,
      textTransform: "uppercase",
      marginBottom: "10px"
    }
  }, m.tag), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: "26px",
      fontWeight: 400,
      color: theme.fg,
      marginBottom: "6px",
      lineHeight: 1.15
    }
  }, m.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "18px",
      fontWeight: 300,
      color: theme.gold,
      marginBottom: "16px"
    }
  }, m.stat), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: `linear-gradient(to right,${theme.gold},transparent)`,
      marginBottom: "14px",
      opacity: .4
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "10.5px",
      color: theme.fg2,
      lineHeight: 1.85
    }
  }, m.desc)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: `${isMobile ? "64px" : "120px"} ${PAD}`,
      textAlign: "center",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
      width: isMobile ? "260px" : "600px",
      height: "280px",
      background: `radial-gradient(ellipse,${theme.goldAlpha} 0%,transparent 70%)`,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: "18px",
      fontStyle: "italic",
      color: theme.fg3,
      marginBottom: "20px"
    }
  }, "\u2014"), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: isMobile ? "clamp(20px,5.5vw,32px)" : isTablet ? "clamp(26px,4vw,44px)" : "clamp(28px,4.5vw,56px)",
      fontWeight: 300,
      fontStyle: "italic",
      color: theme.fg,
      lineHeight: 1.35,
      maxWidth: "880px",
      margin: "0 auto 24px",
      letterSpacing: "-.3px"
    }
  }, "\"The mechanical watch is not merely a timekeeper \u2014 it is a philosophical argument against obsolescence.\""), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "9px",
      letterSpacing: "2.5px",
      color: theme.fg3,
      textTransform: "uppercase"
    }
  }, "Laurent Ferrier \xB7 Independent Watchmaker \xB7 Geneva")), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: `0 ${PAD} ${isMobile ? "56px" : "100px"}`
    }
  }, /*#__PURE__*/React.createElement(Glass, {
    theme: theme,
    style: {
      padding: isMobile ? "24px 16px" : "40px 56px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: isMobile ? "repeat(3,1fr)" : isTablet ? "repeat(3,1fr)" : "repeat(6,1fr)",
      gap: isMobile ? "20px 8px" : "32px",
      alignItems: "center"
    }
  }, pStats.map(({
    n,
    l
  }, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: isMobile ? "30px" : "44px",
      fontWeight: 600,
      color: theme.fg,
      lineHeight: 1
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "7px" : "8.5px",
      letterSpacing: "1px",
      color: theme.fg2,
      marginTop: "4px",
      textTransform: "uppercase"
    }
  }, l)))))), /*#__PURE__*/React.createElement("section", {
    ref: secCraft,
    style: {
      borderTop: `1px solid ${theme.borderSub}`
    }
  }, isMobile ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "44px 20px 60px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "44px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "190px",
      marginBottom: "14px"
    }
  }, /*#__PURE__*/React.createElement(WatchSVG, {
    theme: theme
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "3px",
      color: theme.fg3,
      textTransform: "uppercase"
    }
  }, "ZNT-V1-TI-001 \xB7 Grade 5 Titanium"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "10px",
      marginTop: "12px"
    }
  }, [["TI", true], ["BLK", false], ["GLD", false]].map(([c, sel]) => /*#__PURE__*/React.createElement("div", {
    key: c,
    style: {
      width: 28,
      height: 28,
      borderRadius: "50%",
      border: `1px solid ${sel ? theme.gold : theme.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "7px",
      color: sel ? theme.gold : theme.fg3
    }
  }, c)))), features.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      marginBottom: "44px",
      paddingBottom: "44px",
      borderBottom: i < features.length - 1 ? `1px solid ${theme.borderSub}` : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "9px",
      letterSpacing: "3px",
      color: theme.gold,
      marginBottom: "14px",
      display: "flex",
      alignItems: "center",
      gap: "14px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .35
    }
  }, f.n), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: `linear-gradient(to right,rgba(${dark ? "201,168,76" : "139,99,24"},.3),transparent)`
    }
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: hL,
      fontWeight: 400,
      letterSpacing: "-.3px",
      marginBottom: "12px",
      color: theme.fg,
      lineHeight: 1.1
    }
  }, f.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "11px",
      color: theme.fg2,
      lineHeight: 1.9,
      letterSpacing: ".3px"
    }
  }, f.desc)))) :
  /*#__PURE__*/
  /* Desktop sticky layout */
  React.createElement("div", {
    style: {
      display: "flex",
      padding: `0 ${PAD}`,
      minHeight: "180vh"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: isTablet ? "42%" : "44%",
      paddingTop: "100px",
      position: "sticky",
      top: 0,
      alignSelf: "flex-start",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: isTablet ? "230px" : "268px"
    }
  }, /*#__PURE__*/React.createElement(WatchSVG, {
    theme: theme
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "24px",
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "3px",
      color: theme.fg3,
      textTransform: "uppercase",
      textAlign: "center"
    }
  }, "ZNT-V1-TI-001"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "14px",
      display: "flex",
      gap: "10px"
    }
  }, [["TI", true], ["BLK", false], ["GLD", false]].map(([c, sel]) => /*#__PURE__*/React.createElement("div", {
    key: c,
    style: {
      width: 26,
      height: 26,
      borderRadius: "50%",
      border: `1px solid ${sel ? theme.gold : theme.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "7px",
      color: sel ? theme.gold : theme.fg3
    }
  }, c)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      paddingTop: "100px",
      paddingBottom: "100px",
      paddingLeft: "60px"
    }
  }, features.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      marginBottom: "100px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "9px",
      letterSpacing: "3px",
      color: theme.gold,
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "16px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .35
    }
  }, f.n), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: `linear-gradient(to right,rgba(${dark ? "201,168,76" : "139,99,24"},.3),transparent)`
    }
  })), /*#__PURE__*/React.createElement("h3", {
    onMouseEnter: e => {
      e.currentTarget.style.textShadow = "3px 0 rgba(255,0,80,.5),-3px 0 rgba(0,200,255,.5)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.textShadow = "none";
    },
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: "52px",
      fontWeight: 400,
      letterSpacing: "-.5px",
      marginBottom: "18px",
      color: theme.fg,
      lineHeight: 1.1,
      transition: "text-shadow .2s"
    }
  }, f.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "11.5px",
      color: theme.fg2,
      lineHeight: 1.95,
      maxWidth: "460px",
      letterSpacing: ".3px"
    }
  }, f.desc)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: `${isMobile ? "56px" : "120px"} ${PAD}`,
      borderTop: `1px solid ${theme.borderSub}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "44px",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "flex-end",
      gap: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, {
    theme: theme
  }, "Technical Specifications"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: hXL,
      fontWeight: 300,
      lineHeight: 1.1,
      color: theme.fg,
      margin: 0
    }
  }, "Engineered to", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "Obsession"))), !isMobile && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "9.5px",
      color: theme.fg3,
      letterSpacing: "1px",
      textAlign: "right",
      maxWidth: "180px",
      lineHeight: 1.9
    }
  }, "Every component", /*#__PURE__*/React.createElement("br", null), "sourced and verified", /*#__PURE__*/React.createElement("br", null), "in Geneva.")), /*#__PURE__*/React.createElement(Glass, {
    theme: theme,
    style: {
      padding: isMobile ? "20px 18px" : "44px",
      marginBottom: "18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "3px",
      color: theme.fg3,
      textTransform: "uppercase",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 1,
      background: theme.fg3,
      display: "inline-block"
    }
  }), "Full Specification Sheet"), specs.map(([l, v]) => /*#__PURE__*/React.createElement(SpecRow, {
    key: l,
    label: l,
    value: v,
    theme: theme
  }))), isMobile ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "4px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 20px 14px",
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "3px",
      color: theme.fg3,
      textTransform: "uppercase",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 1,
      background: theme.fg3,
      display: "inline-block"
    }
  }), "Key Figures"), /*#__PURE__*/React.createElement(AutoScrollRow, {
    items: [{
      label: "Movement",
      num: "316",
      sub: "components",
      accent: false
    }, {
      label: "Reserve",
      num: "72",
      sub: "h",
      accent: false
    }, {
      label: "Depth",
      num: "200",
      sub: "m",
      accent: false
    }, {
      label: "Jewels",
      num: "24",
      sub: "",
      accent: false
    }, {
      label: "Weeks",
      num: "12",
      sub: "",
      accent: false
    }, {
      label: "Steps",
      num: "340",
      sub: "",
      accent: false
    }],
    renderItem: item => /*#__PURE__*/React.createElement(MiniStatCard, _extends({}, item, {
      theme: theme,
      dark: dark
    })),
    cardW: Math.round(winW * 0.60),
    gap: 14,
    duration: 18
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: "16px"
    }
  }, [["Movement", "316", "components", false], ["Reserve", "72", "h", false], ["Depth", "200", "m", false]].map(([label, num, sub, accent], i) => /*#__PURE__*/React.createElement(Glass, {
    key: i,
    theme: theme,
    style: {
      padding: "32px",
      background: accent ? dark ? "linear-gradient(135deg,rgba(201,168,76,.09),rgba(201,168,76,.02))" : "linear-gradient(135deg,rgba(139,99,24,.08),rgba(139,99,24,.02))" : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "3px",
      color: theme.gold,
      marginBottom: "10px",
      textTransform: "uppercase"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: "48px",
      fontWeight: accent ? 600 : 300,
      color: theme.fg,
      lineHeight: 1
    }
  }, num, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "18px",
      fontWeight: 300,
      color: theme.fg2
    }
  }, sub)), accent && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "12px",
      height: 3,
      background: dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)",
      borderRadius: 2,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: "100%",
      background: `linear-gradient(to right,${theme.gold},${theme.goldL})`,
      borderRadius: 2
    }
  })))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: `${isMobile ? "48px" : "72px"} ${PAD}`,
      borderTop: `1px solid ${theme.borderSub}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "4px",
      color: theme.fg3,
      textTransform: "uppercase",
      textAlign: "center",
      marginBottom: "32px"
    }
  }, "As featured in"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: isMobile ? "16px 22px" : "48px",
      flexWrap: "wrap"
    }
  }, press.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "press-item",
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: isMobile ? "13px" : "19px",
      fontWeight: 400,
      letterSpacing: "2px",
      color: theme.fg,
      opacity: .22,
      textTransform: "uppercase"
    }
  }, p)))), /*#__PURE__*/React.createElement("section", {
    ref: secCollection,
    style: {
      padding: `${isMobile ? "48px" : "80px"} 0 ${isMobile ? "60px" : "120px"}`,
      borderTop: `1px solid ${theme.borderSub}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `0 ${PAD}`,
      marginBottom: "40px",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "flex-end",
      gap: "14px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, {
    theme: theme
  }, "Complete the Collection"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: hXL,
      fontWeight: 300,
      lineHeight: 1.1,
      color: theme.fg,
      margin: 0
    }
  }, "Further", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "Explorations"))), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "none",
      border: `1px solid ${theme.border}`,
      color: theme.fg2,
      padding: "12px 28px",
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "9px",
      letterSpacing: "2.5px",
      textTransform: "uppercase",
      borderRadius: "100px",
      flexShrink: 0,
      transition: "border-color .25s,color .25s"
    }
  }, "View All Models")), isMobile ? /*#__PURE__*/React.createElement(AutoScrollRow, {
    items: upsells,
    renderItem: product => /*#__PURE__*/React.createElement(TiltCard, {
      product: product,
      theme: theme,
      isMobile: true
    }),
    cardW: Math.round(winW * 0.80),
    gap: 16,
    duration: 24
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `0 ${PAD}`,
      display: "grid",
      gridTemplateColumns: isTablet ? "1fr 1fr" : "repeat(3,1fr)",
      gap: "20px"
    }
  }, upsells.map((p, i) => /*#__PURE__*/React.createElement(TiltCard, {
    key: i,
    product: p,
    theme: theme
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: `${isMobile ? "72px" : "110px"} ${PAD}`,
      textAlign: "center",
      borderTop: `1px solid ${theme.borderSub}`,
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      width: isMobile ? "260px" : "700px",
      height: "380px",
      borderRadius: "50%",
      background: `radial-gradient(circle,${theme.goldAlpha} 0%,transparent 70%)`,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement(SLabel, {
    theme: theme,
    center: true
  }, "Secure Your Piece"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: isMobile ? "clamp(34px,9vw,54px)" : isTablet ? "clamp(44px,7vw,70px)" : "clamp(48px,8vw,90px)",
      fontWeight: 300,
      lineHeight: 1,
      marginBottom: "22px",
      color: theme.fg
    }
  }, "Own a ", /*#__PURE__*/React.createElement("em", null, "Masterpiece")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "10.5px" : "11px",
      color: theme.fg2,
      lineHeight: 1.9,
      maxWidth: "440px",
      margin: "0 auto 40px",
      letterSpacing: ".3px"
    }
  }, "Each V-1 is individually assembled and verified over 12 weeks. Delivered in hand-stitched Saffiano leather with a certificate of authenticity and 5-year movement warranty."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(MagBtn, {
    onClick: () => setAdded(!added),
    added: added,
    theme: theme,
    fullWidth: isMobile,
    isMobile: isMobile
  }))), /*#__PURE__*/React.createElement("footer", {
    ref: secContact,
    style: {
      borderTop: `1px solid ${theme.borderSub}`,
      padding: `${isMobile ? "48px" : "64px"} ${PAD} ${isMobile ? "48px" : "80px"}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "1fr 1fr 1fr" : "1fr 1fr 1fr 1fr",
      gap: isMobile ? "36px 20px" : isTablet ? "32px" : "40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: isMobile ? "span 2" : "span 1"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: "22px",
      fontWeight: 600,
      letterSpacing: "5px",
      color: theme.fg,
      marginBottom: "16px"
    }
  }, "Z", /*#__PURE__*/React.createElement("span", {
    style: {
      color: theme.gold
    }
  }, "."), "ENITH"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "9px",
      letterSpacing: "2px",
      color: theme.fg3,
      textTransform: "uppercase",
      lineHeight: 2.1
    }
  }, "Rue de la Paix 14", /*#__PURE__*/React.createElement("br", null), "1204 Geneva", /*#__PURE__*/React.createElement("br", null), "Switzerland", /*#__PURE__*/React.createElement("br", null), "Est. MCMXLVIII")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "3px",
      color: theme.fg3,
      textTransform: "uppercase",
      marginBottom: "14px"
    }
  }, "Collections"), ["V-1 Titanium", "S-1 Steel", "P-1 Pocket", "Archival"].map(l => /*#__PURE__*/React.createElement("div", {
    key: l,
    className: "footer-link",
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "10px",
      color: theme.fg2,
      padding: "5px 0"
    }
  }, l))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "3px",
      color: theme.fg3,
      textTransform: "uppercase",
      marginBottom: "14px"
    }
  }, "Atelier"), ["Our Story", "Craftsmanship", "Movements", "Partnerships"].map(l => /*#__PURE__*/React.createElement("div", {
    key: l,
    className: "footer-link",
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "10px",
      color: theme.fg2,
      padding: "5px 0"
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: isMobile ? "span 2" : "span 1"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "3px",
      color: theme.fg3,
      textTransform: "uppercase",
      marginBottom: "14px"
    }
  }, "Stay Informed"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "10px",
      color: theme.fg2,
      lineHeight: 1.8,
      marginBottom: "16px"
    }
  }, "New references. Limited editions. Archive releases."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      maxWidth: isMobile ? "100%" : "320px"
    }
  }, /*#__PURE__*/React.createElement("input", {
    "aria-label": "Email address",
    placeholder: "your@email.com",
    style: {
      background: theme.inputBg,
      backdropFilter: "blur(20px)",
      border: `1px solid ${theme.glassBorder}`,
      borderRight: "none",
      color: theme.fg,
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "10px",
      padding: "12px 14px",
      borderRadius: "8px 0 0 8px",
      flex: 1,
      minWidth: 0
    }
  }), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Subscribe",
    style: {
      background: theme.gold,
      border: "none",
      color: dark ? "#030303" : "#fff",
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "9px",
      padding: "12px 18px",
      borderRadius: "0 8px 8px 0",
      flexShrink: 0,
      fontWeight: 500
    }
  }, "\u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "16px",
      fontFamily: "'Cormorant Garamond',serif",
      fontSize: "13px",
      fontStyle: "italic",
      color: theme.fg3
    }
  }, "\"Time is the only true luxury.\"")))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `16px ${PAD}`,
      borderTop: `1px solid ${theme.borderSub}`,
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: isMobile ? "8px" : "0",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "1px",
      color: theme.fg3
    }
  }, "\xA9 2024 Zenith Atelier SA. All rights reserved."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
      justifyContent: "center"
    }
  }, ["Privacy", "Terms", "Warranty", "Contact"].map(l => /*#__PURE__*/React.createElement("span", {
    key: l,
    className: "footer-link",
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "1.5px",
      color: theme.fg3,
      textTransform: "uppercase",
      padding: "4px 0"
    }
  }, l))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "8px",
      letterSpacing: "1px",
      color: theme.fg3
    }
  }, "46.2044\xB0 N, 6.1432\xB0 E"))));
}
    ReactDOM.createRoot(document.getElementById('root')).render(
      React.createElement(ZenithV1, null)
    );
