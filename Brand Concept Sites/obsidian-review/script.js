function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState,
  useEffect,
  useRef,
  useCallback
} = React;

/* ─────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────── */
function useMedia(q) {
  const [m, setM] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    setM(mq.matches);
    const h = e => setM(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, [q]);
  return m;
}
function useInView(threshold = 0.10) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVis(true);
        obs.disconnect();
      }
    }, {
      threshold
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}
function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(window.scrollY / h, 1) : 0);
    };
    window.addEventListener("scroll", fn, {
      passive: true
    });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return p;
}

/* ─────────────────────────────────────────────────
   THEME
───────────────────────────────────────────────── */
const TH = {
  dark: {
    id: "dark",
    bg: "#050505",
    bgAlt: "#07070d",
    surface: "rgba(255,255,255,0.034)",
    surfaceHov: "rgba(255,255,255,0.060)",
    border: "rgba(255,255,255,0.08)",
    text: "#FAFAFA",
    muted: "rgba(255,255,255,0.48)",
    faint: "rgba(255,255,255,0.26)",
    eyebrow: "#39FF14",
    accent: "#39FF14",
    accentB: "#00D4FF",
    grid: "rgba(255,255,255,0.02)",
    headGrad: "linear-gradient(135deg,#e8e8e8 0%,#fff 45%,#b0b0b0 70%,#eee 100%)",
    scoreGrad: "linear-gradient(135deg,#39FF14,#00D4FF)",
    btnBg: "linear-gradient(135deg,#39FF14,#00C472)",
    btnText: "#000",
    btnSecBg: "rgba(255,255,255,0.06)",
    btnSecBorder: "rgba(255,255,255,0.16)",
    btnSecText: "#fff",
    navBg: "rgba(5,5,5,0.92)",
    navBorder: "rgba(255,255,255,0.07)",
    cardShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
    cardShadowHov: "0 20px 60px rgba(0,0,0,0.5)",
    glowA: "rgba(124,58,237,0.38)",
    glowB: "rgba(0,212,255,0.20)",
    glowC: "rgba(57,255,20,0.12)",
    verdictBg: "linear-gradient(160deg,#050505 0%,#0e0520 35%,#130930 65%,#050505 100%)",
    divider: "rgba(255,255,255,0.08)",
    footBg: "#030304"
  }
};

/* ─────────────────────────────────────────────────
   FADE-IN WRAPPER
───────────────────────────────────────────────── */
function FadeIn({
  children,
  delay = 0,
  y = 28,
  sx = {}
}) {
  const [ref, vis] = useInView(0.08);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : `translateY(${y}px)`,
      transition: `opacity 0.72s ease ${delay}s,transform 0.72s ease ${delay}s`,
      ...sx
    }
  }, children);
}

/* ─────────────────────────────────────────────────
   COUNT-UP
───────────────────────────────────────────────── */
function CountUp({
  raw,
  inView
}) {
  const [disp, setDisp] = useState(raw);
  useEffect(() => {
    if (!inView) return;
    const m = raw.match(/^([0-9]+\.?[0-9]*)(.*)$/);
    if (!m) return;
    const target = parseFloat(m[1]),
      suf = m[2] || "",
      dec = m[1].includes(".");
    const dur = 950,
      t0 = performance.now();
    const tick = now => {
      const pr = Math.min((now - t0) / dur, 1),
        ease = 1 - Math.pow(1 - pr, 3);
      setDisp((dec ? (target * ease).toFixed(1) : Math.round(target * ease)) + suf);
      if (pr < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView]);
  return disp;
}

/* ─────────────────────────────────────────────────
   PHONE SVG
───────────────────────────────────────────────── */
function PhoneSVG({
  scale = 1
}) {
  const W = Math.round(260 * scale),
    H = Math.round(390 * scale);
  return /*#__PURE__*/React.createElement("svg", {
    width: W,
    height: H,
    viewBox: "0 0 260 390",
    fill: "none"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "qpb",
    x1: "0",
    y1: "0",
    x2: "260",
    y2: "390",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#1e1e21"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: "#0f0f11"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#06060a"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "qpe",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0",
    gradientUnits: "objectBoundingBox"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "rgba(255,255,255,0.36)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "rgba(255,255,255,0.04)"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "qpc",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "rgba(215,215,215,0.44)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: "rgba(255,255,255,0.16)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "rgba(175,175,175,0.22)"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: "qps",
    cx: "50%",
    cy: "38%",
    r: "55%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#14083c"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#02020a"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: "qpl",
    cx: "36%",
    cy: "30%",
    r: "64%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#26184a"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "55%",
    stopColor: "#080418"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#010104"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: "qpg",
    cx: "26%",
    cy: "16%",
    r: "60%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "rgba(255,255,255,0.12)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "rgba(255,255,255,0)"
  })), /*#__PURE__*/React.createElement("filter", {
    id: "qgf"
  }, /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: "2.8",
    result: "b"
  }), /*#__PURE__*/React.createElement("feMerge", null, /*#__PURE__*/React.createElement("feMergeNode", {
    in: "b"
  }), /*#__PURE__*/React.createElement("feMergeNode", {
    in: "SourceGraphic"
  }))), /*#__PURE__*/React.createElement("filter", {
    id: "qlf"
  }, /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: "0.6"
  })), /*#__PURE__*/React.createElement("clipPath", {
    id: "qpsc"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "14",
    width: "232",
    height: "362",
    rx: "32"
  }))), /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "6",
    width: "248",
    height: "378",
    rx: "40",
    fill: "url(#qpb)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "6",
    width: "248",
    height: "378",
    rx: "40",
    stroke: "rgba(255,255,255,0.06)",
    strokeWidth: "0.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "6",
    width: "4",
    height: "378",
    rx: "2",
    fill: "url(#qpe)",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "250",
    y: "6",
    width: "4",
    height: "378",
    rx: "2",
    fill: "url(#qpe)",
    opacity: "0.18"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "6",
    width: "248",
    height: "3",
    rx: "1.5",
    fill: "rgba(255,255,255,0.26)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "381",
    width: "248",
    height: "3",
    rx: "1.5",
    fill: "rgba(255,255,255,0.04)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "14",
    width: "232",
    height: "362",
    rx: "32",
    fill: "url(#qps)"
  }), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#qpsc)"
  }, /*#__PURE__*/React.createElement("text", {
    x: "22",
    y: "36",
    fill: "rgba(255,255,255,0.60)",
    fontSize: "7",
    fontFamily: "monospace",
    fontWeight: "600"
  }, "9:41"), /*#__PURE__*/React.createElement("rect", {
    x: "218",
    y: "28",
    width: "18",
    height: "8",
    rx: "2",
    fill: "none",
    stroke: "rgba(255,255,255,0.30)",
    strokeWidth: "0.7"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "219.5",
    y: "29.5",
    width: "13",
    height: "5",
    rx: "1.2",
    fill: "rgba(57,255,20,0.72)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "22",
    y: "50",
    width: "216",
    height: "172",
    rx: "24",
    fill: "rgba(0,0,0,0.55)",
    stroke: "rgba(255,255,255,0.05)",
    strokeWidth: "0.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "106",
    cy: "136",
    r: "58",
    fill: "rgba(0,0,0,0.92)",
    stroke: "url(#qpc)",
    strokeWidth: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "106",
    cy: "136",
    r: "50",
    fill: "#04020c",
    stroke: "rgba(124,58,237,0.30)",
    strokeWidth: "0.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "106",
    cy: "136",
    r: "38",
    fill: "url(#qpl)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "106",
    cy: "136",
    r: "25",
    fill: "#020108",
    stroke: "rgba(0,212,255,0.18)",
    strokeWidth: "0.4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "106",
    cy: "136",
    r: "12",
    fill: "#000307"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "95",
    cy: "124",
    rx: "6.5",
    ry: "3.8",
    fill: "rgba(255,255,255,0.07)",
    transform: "rotate(-30 95 124)",
    filter: "url(#qlf)"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "99",
    cy: "120",
    rx: "2.5",
    ry: "1.4",
    fill: "rgba(255,255,255,0.14)",
    transform: "rotate(-30 99 120)"
  }), [0, 60, 120, 180, 240, 300].map(a => /*#__PURE__*/React.createElement("line", {
    key: a,
    x1: 106 + Math.cos(a * Math.PI / 180) * 18,
    y1: 136 + Math.sin(a * Math.PI / 180) * 18,
    x2: 106 + Math.cos(a * Math.PI / 180) * 26,
    y2: 136 + Math.sin(a * Math.PI / 180) * 26,
    stroke: "rgba(255,255,255,0.07)",
    strokeWidth: "1",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "106",
    cy: "136",
    r: "59",
    fill: "none",
    stroke: "rgba(57,255,20,0.14)",
    strokeWidth: "1.2",
    filter: "url(#qgf)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "186",
    cy: "92",
    r: "28",
    fill: "rgba(0,0,0,0.88)",
    stroke: "rgba(255,255,255,0.09)",
    strokeWidth: "0.7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "186",
    cy: "92",
    r: "21",
    fill: "#030210",
    stroke: "rgba(0,212,255,0.16)",
    strokeWidth: "0.4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "186",
    cy: "92",
    r: "13",
    fill: "url(#qpl)",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "186",
    cy: "92",
    r: "6",
    fill: "#010108"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "179",
    cy: "85",
    rx: "3.8",
    ry: "2.2",
    fill: "rgba(255,255,255,0.07)",
    transform: "rotate(-25 179 85)",
    filter: "url(#qlf)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "186",
    cy: "175",
    r: "23",
    fill: "rgba(0,0,0,0.88)",
    stroke: "rgba(57,255,20,0.13)",
    strokeWidth: "0.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "186",
    cy: "175",
    r: "17",
    fill: "#030210"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "186",
    cy: "175",
    r: "10",
    fill: "url(#qpl)",
    opacity: "0.85"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "186",
    cy: "175",
    r: "4.5",
    fill: "#010108"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "42",
    cy: "92",
    r: "10",
    fill: "rgba(0,0,0,0.72)",
    stroke: "rgba(255,140,0,0.28)",
    strokeWidth: "0.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "42",
    cy: "92",
    r: "5.5",
    fill: "#080504"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "42",
    cy: "92",
    r: "2.2",
    fill: "rgba(255,110,0,0.20)"
  }), /*#__PURE__*/React.createElement("text", {
    x: "35",
    y: "108",
    fill: "rgba(255,140,0,0.32)",
    fontSize: "4",
    fontFamily: "monospace",
    letterSpacing: "0.5"
  }, "LiDAR"), /*#__PURE__*/React.createElement("text", {
    x: "48",
    y: "215",
    fill: "rgba(255,255,255,0.13)",
    fontSize: "5",
    fontFamily: "monospace",
    letterSpacing: "3.5"
  }, "OBSIDIAN"), /*#__PURE__*/React.createElement("text", {
    x: "106",
    y: "223",
    textAnchor: "middle",
    fill: "rgba(255,255,255,0.08)",
    fontSize: "4",
    fontFamily: "monospace",
    letterSpacing: "2.5"
  }, "X PRO \xB7 f/1.2 \xB7 120MP"), /*#__PURE__*/React.createElement("rect", {
    x: "22",
    y: "242",
    width: "216",
    height: "104",
    rx: "12",
    fill: "rgba(255,255,255,0.018)",
    stroke: "rgba(255,255,255,0.04)",
    strokeWidth: "0.5"
  }), /*#__PURE__*/React.createElement("text", {
    x: "30",
    y: "254",
    fill: "rgba(255,255,255,0.22)",
    fontSize: "4.5",
    fontFamily: "monospace",
    letterSpacing: "1"
  }, "HISTOGRAM"), [7, 13, 20, 29, 37, 44, 35, 27, 17, 9, 5].map((h, i) => /*#__PURE__*/React.createElement("rect", {
    key: i,
    x: 30 + i * 13,
    y: 332 - h,
    width: "9",
    height: h,
    rx: "2",
    fill: `rgba(57,255,20,${0.12 + h / 52})`
  })), /*#__PURE__*/React.createElement("text", {
    x: "30",
    y: "276",
    fill: "rgba(0,212,255,0.68)",
    fontSize: "6",
    fontFamily: "monospace"
  }, "ISO 64"), /*#__PURE__*/React.createElement("text", {
    x: "72",
    y: "276",
    fill: "rgba(255,255,255,0.26)",
    fontSize: "6",
    fontFamily: "monospace"
  }, "1/4000s"), /*#__PURE__*/React.createElement("text", {
    x: "136",
    y: "276",
    fill: "rgba(255,255,255,0.26)",
    fontSize: "6",
    fontFamily: "monospace"
  }, "f/1.2"), /*#__PURE__*/React.createElement("text", {
    x: "186",
    y: "276",
    fill: "rgba(255,140,0,0.52)",
    fontSize: "6",
    fontFamily: "monospace"
  }, "RAW"), /*#__PURE__*/React.createElement("rect", {
    x: "96",
    y: "364",
    width: "68",
    height: "4",
    rx: "2",
    fill: "rgba(255,255,255,0.18)"
  })), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "14",
    width: "232",
    height: "362",
    rx: "32",
    fill: "url(#qpg)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "92",
    y: "22",
    width: "76",
    height: "22",
    rx: "11",
    fill: "#000"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "148",
    cy: "33",
    r: "4.5",
    fill: "#0a0a0a"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "148",
    cy: "33",
    r: "2.5",
    fill: "#060606"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "256",
    y: "108",
    width: "5",
    height: "44",
    rx: "2.5",
    fill: "url(#qpc)",
    opacity: "0.82"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "256",
    y: "162",
    width: "5",
    height: "24",
    rx: "2.5",
    fill: "url(#qpc)",
    opacity: "0.50"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "-1",
    y: "122",
    width: "5",
    height: "24",
    rx: "2.5",
    fill: "url(#qpc)",
    opacity: "0.68"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "-1",
    y: "154",
    width: "5",
    height: "56",
    rx: "2.5",
    fill: "url(#qpc)",
    opacity: "0.54"
  }));
}

/* ─────────────────────────────────────────────────
   DEEP DIVE VISUALS
───────────────────────────────────────────────── */
function SensorViz({
  c
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: "164",
    height: "164",
    viewBox: "0 0 164 164",
    fill: "none"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("radialGradient", {
    id: "qsv"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: c,
    stopOpacity: "0.18"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: c,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "82",
    cy: "82",
    r: "76",
    fill: "url(#qsv)"
  }), Array.from({
    length: 9
  }, (_, r) => Array.from({
    length: 9
  }, (_, col) => /*#__PURE__*/React.createElement("rect", {
    key: `${r}-${col}`,
    x: 14 + col * 16,
    y: 14 + r * 16,
    width: "12",
    height: "12",
    rx: "1.5",
    fill: c,
    opacity: Math.abs(r - 4) + Math.abs(col - 4) < 5 ? 0.18 : 0.05
  }))), Array.from({
    length: 5
  }, (_, r) => Array.from({
    length: 5
  }, (_, col) => /*#__PURE__*/React.createElement("rect", {
    key: `h${r}-${col}`,
    x: 30 + col * 16,
    y: 30 + r * 16,
    width: "12",
    height: "12",
    rx: "1.5",
    fill: c,
    opacity: 0.42
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "82",
    cy: "82",
    r: "70",
    fill: "none",
    stroke: c,
    strokeWidth: "0.6",
    opacity: "0.28"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "82",
    cy: "82",
    r: "54",
    fill: "none",
    stroke: c,
    strokeWidth: "0.4",
    opacity: "0.14"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "10",
    y1: "82",
    x2: "154",
    y2: "82",
    stroke: c,
    strokeWidth: "0.5",
    strokeDasharray: "3 3",
    opacity: "0.22"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "10",
    y1: "78",
    x2: "10",
    y2: "86",
    stroke: c,
    strokeWidth: "1",
    opacity: "0.44"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "154",
    y1: "78",
    x2: "154",
    y2: "86",
    stroke: c,
    strokeWidth: "1",
    opacity: "0.44"
  }), /*#__PURE__*/React.createElement("text", {
    x: "82",
    y: "157",
    textAnchor: "middle",
    fill: c,
    fontSize: "7.5",
    fontFamily: "monospace",
    opacity: "0.52"
  }, "1.2 INCH SENSOR"));
}
function ComputeViz({
  c
}) {
  const nodes = [[82, 82], [50, 50], [114, 50], [50, 114], [114, 114], [26, 82], [138, 82], [82, 26], [82, 138]];
  return /*#__PURE__*/React.createElement("svg", {
    width: "164",
    height: "164",
    viewBox: "0 0 164 164",
    fill: "none"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("radialGradient", {
    id: "qcv"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: c,
    stopOpacity: "0.16"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: c,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("rect", {
    x: "8",
    y: "8",
    width: "148",
    height: "148",
    rx: "6",
    fill: "url(#qcv)"
  }), [26, 56, 82, 108, 138].map(v => /*#__PURE__*/React.createElement("g", {
    key: v
  }, /*#__PURE__*/React.createElement("line", {
    x1: v,
    y1: "8",
    x2: v,
    y2: "156",
    stroke: c,
    strokeWidth: "0.3",
    opacity: "0.09"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: v,
    x2: "156",
    y2: v,
    stroke: c,
    strokeWidth: "0.3",
    opacity: "0.09"
  }))), nodes.slice(1).map((n, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: nodes[0][0],
    y1: nodes[0][1],
    x2: n[0],
    y2: n[1],
    stroke: c,
    strokeWidth: "0.7",
    opacity: "0.26"
  })), [[1, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 6], [5, 7], [6, 8]].map(([a, b], i) => /*#__PURE__*/React.createElement("line", {
    key: `e${i}`,
    x1: nodes[a][0],
    y1: nodes[a][1],
    x2: nodes[b][0],
    y2: nodes[b][1],
    stroke: c,
    strokeWidth: "0.5",
    opacity: "0.17"
  })), nodes.map((n, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: n[0],
    cy: n[1],
    r: i === 0 ? 9 : 5,
    fill: c,
    opacity: i === 0 ? 0.90 : 0.54
  })), /*#__PURE__*/React.createElement("rect", {
    x: "73",
    y: "73",
    width: "18",
    height: "18",
    rx: "3",
    fill: c,
    opacity: "0.17",
    stroke: c,
    strokeWidth: "0.8",
    strokeOpacity: "0.55"
  }), /*#__PURE__*/React.createElement("text", {
    x: "82",
    y: "157",
    textAnchor: "middle",
    fill: c,
    fontSize: "7.5",
    fontFamily: "monospace",
    opacity: "0.52"
  }, "30T OPS NEURAL"));
}
function OpticsViz({
  c
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: "164",
    height: "164",
    viewBox: "0 0 164 164",
    fill: "none"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("radialGradient", {
    id: "qov"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: c,
    stopOpacity: "0.14"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: c,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "82",
    cy: "82",
    r: "76",
    fill: "url(#qov)"
  }), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
    const x = 12 + i * 15,
      cv = [12, 8, 10, 12, 6, 6, 10, 8, 10, 6][i];
    return /*#__PURE__*/React.createElement("path", {
      key: i,
      d: `M${x},${82 - cv} Q${x + 7},82 ${x},${82 + cv}`,
      stroke: c,
      strokeWidth: "1.4",
      fill: "none",
      opacity: i === 4 || i === 5 ? 0.80 : 0.30,
      strokeLinecap: "round"
    });
  }), [-26, -13, 0, 13, 26].map((off, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: "8",
    y1: 82 + off,
    x2: "82",
    y2: 82 + off * 0.08,
    stroke: c,
    strokeWidth: "0.5",
    opacity: "0.18",
    strokeDasharray: "4 3"
  })), [-12, -6, 0, 6, 12].map((off, i) => /*#__PURE__*/React.createElement("line", {
    key: `r${i}`,
    x1: "82",
    y1: 82 + off * 0.08,
    x2: "156",
    y2: 82 + off * 2.2,
    stroke: c,
    strokeWidth: "0.5",
    opacity: "0.18",
    strokeDasharray: "4 3"
  })), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "82",
    x2: "156",
    y2: "82",
    stroke: c,
    strokeWidth: "0.8",
    opacity: "0.35",
    strokeDasharray: "6 4"
  }), [0, 60, 120, 180, 240, 300].map(a => /*#__PURE__*/React.createElement("line", {
    key: a,
    x1: 82 + Math.cos(a * Math.PI / 180) * 19,
    y1: 82 + Math.sin(a * Math.PI / 180) * 19,
    x2: 82 + Math.cos(a * Math.PI / 180) * 28,
    y2: 82 + Math.sin(a * Math.PI / 180) * 28,
    stroke: c,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    opacity: "0.50"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "82",
    cy: "82",
    r: "17",
    fill: "none",
    stroke: c,
    strokeWidth: "0.6",
    opacity: "0.28"
  }), /*#__PURE__*/React.createElement("text", {
    x: "82",
    y: "157",
    textAnchor: "middle",
    fill: c,
    fontSize: "7.5",
    fontFamily: "monospace",
    opacity: "0.52"
  }, "f/1.2 LIQUID OPTICS"));
}

/* ─────────────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────────────── */
function MagBtn({
  children,
  primary,
  t,
  isMobile,
  onClick
}) {
  const ref = useRef(null);
  const [pos, setPos] = useState({
    x: 0,
    y: 0
  });
  const [dn, setDn] = useState(false);
  const mv = e => {
    if (isMobile || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - r.left - r.width / 2) * 0.24,
      y: (e.clientY - r.top - r.height / 2) * 0.24
    });
  };
  return /*#__PURE__*/React.createElement("button", {
    ref: ref,
    onMouseMove: mv,
    onMouseLeave: () => {
      setPos({
        x: 0,
        y: 0
      });
      setDn(false);
    },
    onMouseDown: () => setDn(true),
    onMouseUp: () => setDn(false),
    onClick: onClick,
    style: {
      transform: `translate(${pos.x}px,${pos.y}px) scale(${dn ? 0.96 : 1})`,
      transition: dn ? "transform 0.08s ease" : "transform 0.30s cubic-bezier(0.23,1,0.32,1)",
      padding: isMobile ? "13px 0" : "13px 30px",
      flex: isMobile ? "1" : "none",
      borderRadius: "100px",
      border: primary ? "none" : `1px solid ${t.btnSecBorder}`,
      background: primary ? t.btnBg : t.btnSecBg,
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      color: primary ? t.btnText : t.btnSecText,
      fontFamily: "'Syne',sans-serif",
      fontWeight: 700,
      fontSize: isMobile ? "0.88rem" : "0.86rem",
      letterSpacing: "0.04em",
      cursor: "pointer",
      userSelect: "none",
      outline: "none",
      whiteSpace: "nowrap",
      boxShadow: primary ? `0 0 28px ${t.accent}24` : "none",
      textAlign: "center"
    }
  }, children);
}

/* ─────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────── */
function NavBar({
  t,
  scrollY,
  isMobile
}) {
  const progress = useScrollProgress();
  const up = scrollY > 50;
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: up ? t.navBg : "transparent",
      backdropFilter: up ? "blur(24px)" : "none",
      WebkitBackdropFilter: up ? "blur(24px)" : "none",
      borderBottom: up ? `1px solid ${t.navBorder}` : "none",
      transition: "all 0.36s ease",
      padding: isMobile ? "0 5vw" : "0 6vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: isMobile ? "56px" : "60px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Syne',sans-serif",
      fontWeight: 800,
      fontSize: isMobile ? "0.88rem" : "0.92rem",
      letterSpacing: "0.06em",
      color: t.text
    }
  }, "AXIOM", /*#__PURE__*/React.createElement("span", {
    style: {
      color: t.accent
    }
  }, "."), "LABS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "0.55rem" : "0.60rem",
      letterSpacing: isMobile ? "0.18em" : "0.26em",
      color: t.muted,
      textTransform: "uppercase",
      opacity: up ? 1 : 0,
      transition: "opacity 0.3s ease"
    }
  }, "OBSIDIAN X PRO"), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "2px",
      background: t.divider,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${progress * 100}%`,
      background: `linear-gradient(90deg,${t.accent},${t.accentB})`,
      transition: "width 0.1s linear",
      boxShadow: `0 0 6px ${t.accent}80`
    }
  })));
}

/* ─────────────────────────────────────────────────
   SPEC ICON
───────────────────────────────────────────────── */
function Icon({
  type,
  color: c
}) {
  const s = {
    stroke: c,
    strokeWidth: "1.4",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  const map = {
    cpu: /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "none"
    }, /*#__PURE__*/React.createElement("rect", _extends({
      x: "5",
      y: "5",
      width: "14",
      height: "14",
      rx: "2"
    }, s)), /*#__PURE__*/React.createElement("rect", {
      x: "8.5",
      y: "8.5",
      width: "7",
      height: "7",
      rx: "1",
      fill: c,
      opacity: "0.20",
      stroke: "none"
    }), [8, 12, 16].map(x => [/*#__PURE__*/React.createElement("line", _extends({
      key: x + "t",
      x1: x,
      y1: "2",
      x2: x,
      y2: "5"
    }, s)), /*#__PURE__*/React.createElement("line", _extends({
      key: x + "b",
      x1: x,
      y1: "19",
      x2: x,
      y2: "22"
    }, s))]), [8, 12, 16].map(y => [/*#__PURE__*/React.createElement("line", _extends({
      key: y + "l",
      x1: "2",
      y1: y,
      x2: "5",
      y2: y
    }, s)), /*#__PURE__*/React.createElement("line", _extends({
      key: y + "r",
      x1: "19",
      y1: y,
      x2: "22",
      y2: y
    }, s))])),
    camera: /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", _extends({
      d: "M2 8h3l2-2.5h10L19 8h3a1 1 0 011 1v10a1 1 0 01-1 1H2a1 1 0 01-1-1V9a1 1 0 011-1z"
    }, s)), /*#__PURE__*/React.createElement("circle", _extends({
      cx: "12",
      cy: "13.5",
      r: "3.5"
    }, s)), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "13.5",
      r: "1.5",
      fill: c,
      opacity: "0.26",
      stroke: "none"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "18.5",
      cy: "10.5",
      r: "0.8",
      fill: c,
      stroke: "none"
    })),
    battery: /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "none"
    }, /*#__PURE__*/React.createElement("rect", _extends({
      x: "1",
      y: "7",
      width: "20",
      height: "10",
      rx: "2.5"
    }, s)), /*#__PURE__*/React.createElement("rect", {
      x: "21",
      y: "10",
      width: "3",
      height: "4",
      rx: "1",
      fill: c,
      opacity: "0.5",
      stroke: "none"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "9",
      width: "15",
      height: "6",
      rx: "1.5",
      fill: c,
      opacity: "0.55",
      stroke: "none"
    })),
    display: /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "none"
    }, /*#__PURE__*/React.createElement("rect", _extends({
      x: "1",
      y: "3",
      width: "22",
      height: "15",
      rx: "2.5"
    }, s)), /*#__PURE__*/React.createElement("line", _extends({
      x1: "8",
      y1: "18",
      x2: "16",
      y2: "18"
    }, s)), /*#__PURE__*/React.createElement("line", _extends({
      x1: "12",
      y1: "18",
      x2: "12",
      y2: "21"
    }, s)), /*#__PURE__*/React.createElement("rect", {
      x: "3.5",
      y: "5.5",
      width: "17",
      height: "10",
      rx: "1",
      fill: c,
      opacity: "0.10",
      stroke: "none"
    })),
    storage: /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "none"
    }, /*#__PURE__*/React.createElement("ellipse", _extends({
      cx: "12",
      cy: "6.5",
      rx: "9.5",
      ry: "3.5"
    }, s)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M2.5 6.5v11c0 1.9 4.3 3.5 9.5 3.5s9.5-1.6 9.5-3.5v-11"
    }, s)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M2.5 12c0 1.9 4.3 3.5 9.5 3.5s9.5-1.6 9.5-3.5"
    }, s, {
      opacity: "0.44"
    }))),
    video: /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "none"
    }, /*#__PURE__*/React.createElement("rect", _extends({
      x: "1",
      y: "5.5",
      width: "16",
      height: "13",
      rx: "2.5"
    }, s)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M17 9.5l6-3v11l-6-3v-5z"
    }, s))),
    aperture: /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "none"
    }, /*#__PURE__*/React.createElement("circle", _extends({
      cx: "12",
      cy: "12",
      r: "9.5"
    }, s)), /*#__PURE__*/React.createElement("circle", _extends({
      cx: "12",
      cy: "12",
      r: "3.5"
    }, s)), [0, 60, 120, 180, 240, 300].map(a => /*#__PURE__*/React.createElement("line", {
      key: a,
      x1: 12 + Math.cos(a * Math.PI / 180) * 4,
      y1: 12 + Math.sin(a * Math.PI / 180) * 4,
      x2: 12 + Math.cos(a * Math.PI / 180) * 8.5,
      y2: 12 + Math.sin(a * Math.PI / 180) * 8.5,
      stroke: c,
      strokeWidth: "0.9",
      opacity: "0.44"
    }))),
    weight: /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", _extends({
      d: "M4.5 21l2-12h11l2 12h-15z"
    }, s)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M9 9a3 3 0 116 0"
    }, s)), /*#__PURE__*/React.createElement("line", _extends({
      x1: "12",
      y1: "6",
      x2: "12",
      y2: "4"
    }, s))),
    signal: /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", _extends({
      d: "M2.5 17.5a13.5 13.5 0 0119 0"
    }, s)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M6.5 13.5a8.5 8.5 0 0111 0"
    }, s)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M10.5 9.5a4 4 0 013 0"
    }, s)), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "20",
      r: "1.5",
      fill: c,
      stroke: "none"
    }))
  };
  return map[type] || null;
}

/* ─────────────────────────────────────────────────
   BENTO CARD
───────────────────────────────────────────────── */
function BCard({
  t,
  icon,
  label,
  value,
  sub,
  cs = 1,
  accent,
  isMobile,
  inView
}) {
  const [hov, setHov] = useState(false);
  const ac = accent || t.accent;
  const eCs = isMobile ? cs >= 2 ? 2 : 1 : cs;
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      gridColumn: `span ${eCs}`,
      background: hov ? t.surfaceHov : t.surface,
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      border: `1px solid ${hov ? ac + "44" : t.border}`,
      borderRadius: isMobile ? "16px" : "18px",
      padding: isMobile ? eCs > 1 ? "20px 22px" : "18px" : cs > 1 ? "26px 30px" : "24px",
      position: "relative",
      overflow: "hidden",
      boxShadow: hov ? `${t.cardShadowHov},0 0 0 1px ${ac}20 inset,inset 0 1px 0 ${t.id === "dark" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.92)"}` : `${t.cardShadow},inset 0 1px 0 ${t.id === "dark" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.75)"}`,
      transform: hov ? "translateY(-4px) scale(1.006)" : "none",
      transition: "all 0.32s cubic-bezier(0.23,1,0.32,1)",
      cursor: "default",
      minHeight: isMobile ? "118px" : "136px",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      right: 0,
      width: isMobile ? "56px" : "68px",
      height: isMobile ? "56px" : "68px",
      background: hov ? `radial-gradient(circle at top right,${ac}1e,transparent 70%)` : "none",
      borderRadius: `0 ${isMobile ? 16 : 18}px 0 0`,
      transition: "background 0.32s ease",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      gap: "6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transition: "transform 0.28s ease",
      transform: hov ? "scale(1.08)" : "none",
      transformOrigin: "left top"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    type: icon,
    color: hov ? ac : ac + "88"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "0.50rem" : "0.54rem",
      letterSpacing: "0.26em",
      color: t.faint,
      textTransform: "uppercase"
    }
  }, label)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: isMobile ? eCs > 1 ? "1.9rem" : "1.55rem" : cs > 1 ? "2.2rem" : "1.7rem",
      fontWeight: 800,
      lineHeight: 1,
      color: t.text,
      letterSpacing: "-0.03em",
      fontFamily: "'Syne',sans-serif"
    }
  }, inView ? /*#__PURE__*/React.createElement(CountUp, {
    raw: value,
    inView: inView
  }) : value), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "0.58rem" : "0.62rem",
      color: t.faint,
      marginTop: "6px",
      lineHeight: 1.5
    }
  }, sub))));
}

/* ─────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────── */
function Hero({
  t,
  isDark,
  scrollY,
  isMobile
}) {
  const hg = {
    background: t.headGrad,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  };
  return /*#__PURE__*/React.createElement("section", {
    style: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
      padding: isMobile ? "0 5vw" : "0 6vw"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(ellipse 70% 70% at ${isMobile ? "50% 25%" : "66% 46%"},${t.glowA} 0%,transparent 60%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(ellipse 50% 50% at ${isMobile ? "80% 75%" : "22% 68%"},${t.glowB} 0%,transparent 56%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: `linear-gradient(${t.grid} 1px,transparent 1px),linear-gradient(90deg,${t.grid} 1px,transparent 1px)`,
      backgroundSize: "60px 60px"
    }
  }), isMobile ? /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      paddingTop: "70px",
      paddingBottom: "48px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "qf1",
    style: {
      position: "relative",
      marginBottom: "2rem"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      width: "270px",
      height: "270px",
      borderRadius: "50%",
      background: `radial-gradient(circle,${t.glowA} 0%,transparent 65%)`,
      filter: "blur(40px)",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      width: "180px",
      height: "180px",
      borderRadius: "50%",
      background: `radial-gradient(circle,${t.glowB} 0%,transparent 65%)`,
      filter: "blur(28px)",
      top: "40%",
      left: "60%",
      transform: "translate(-50%,-50%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "qfa",
    style: {
      position: "relative",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(PhoneSVG, {
    scale: 0.72
  }))), /*#__PURE__*/React.createElement("div", {
    className: "qf2",
    style: {
      marginBottom: "1rem"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "0.62rem",
      letterSpacing: "0.34em",
      color: t.eyebrow,
      textTransform: "uppercase"
    }
  }, "\u25C9 Exclusive Review \u2014 2026")), /*#__PURE__*/React.createElement("div", {
    className: "qr1",
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Syne',sans-serif",
      fontSize: "clamp(2.2rem,11.5vw,5.8rem)",
      fontWeight: 800,
      letterSpacing: "-0.048em",
      lineHeight: 0.90,
      ...hg
    }
  }, "OBSIDIAN")), /*#__PURE__*/React.createElement("div", {
    className: "qr2",
    style: {
      textAlign: "center",
      marginBottom: "12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Syne',sans-serif",
      fontSize: "clamp(2.2rem,11.5vw,5.8rem)",
      fontWeight: 800,
      letterSpacing: "-0.048em",
      lineHeight: 0.90,
      color: t.text
    }
  }, "X PRO")), /*#__PURE__*/React.createElement("div", {
    className: "qr3",
    style: {
      textAlign: "center",
      marginBottom: "2rem"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "0.84rem",
      color: t.muted,
      lineHeight: 1.72
    }
  }, "The camera that sees beyond", /*#__PURE__*/React.createElement("br", null), "the limits of human perception.")), /*#__PURE__*/React.createElement("div", {
    className: "qf3",
    style: {
      display: "flex",
      gap: "10px",
      width: "100%",
      marginBottom: "2rem"
    }
  }, /*#__PURE__*/React.createElement(MagBtn, {
    primary: true,
    t: t,
    isMobile: true
  }, "Full Review"), /*#__PURE__*/React.createElement(MagBtn, {
    t: t,
    isMobile: true
  }, "Watch Film")), /*#__PURE__*/React.createElement("div", {
    className: "qf3",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "10px",
      width: "100%",
      paddingTop: "1.4rem",
      borderTop: `1px solid ${t.divider}`
    }
  }, [["9.8", "Overall Score"], ["4K120", "Max Video"], ["1.2\"", "Sensor Size"], ["f/1.2", "Aperture"]].map(([v, l]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      background: t.surface,
      borderRadius: "14px",
      padding: "14px 16px",
      border: `1px solid ${t.border}`,
      boxShadow: t.cardShadow,
      backdropFilter: "blur(12px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "1.65rem",
      fontWeight: 800,
      color: t.accent,
      lineHeight: 1,
      fontFamily: "'Syne',sans-serif"
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "0.55rem",
      color: t.faint,
      letterSpacing: "0.20em",
      textTransform: "uppercase",
      marginTop: "5px"
    }
  }, l))))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "2rem",
      alignItems: "center",
      width: "100%",
      maxWidth: "1240px",
      margin: "0 auto",
      paddingTop: "5rem"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "qf1",
    style: {
      marginBottom: "1.3rem"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "0.65rem",
      letterSpacing: "0.36em",
      color: t.eyebrow,
      textTransform: "uppercase"
    }
  }, "\u25C9 Exclusive Review \u2014 2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "qr1",
    style: {
      fontFamily: "'Syne',sans-serif",
      fontSize: "clamp(3rem,7vw,7.2rem)",
      fontWeight: 800,
      letterSpacing: "-0.048em",
      lineHeight: 0.90,
      ...hg
    }
  }, "OBSIDIAN")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "hidden",
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "qr2",
    style: {
      fontFamily: "'Syne',sans-serif",
      fontSize: "clamp(3rem,7vw,7.2rem)",
      fontWeight: 800,
      letterSpacing: "-0.048em",
      lineHeight: 0.90,
      color: t.text
    }
  }, "X PRO")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "hidden",
      marginBottom: "2.2rem"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "qr3",
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "clamp(0.82rem,1.2vw,0.96rem)",
      color: t.muted,
      lineHeight: 1.78,
      maxWidth: "340px",
      display: "block"
    }
  }, "The camera that sees beyond", /*#__PURE__*/React.createElement("br", null), "the limits of human perception.")), /*#__PURE__*/React.createElement("div", {
    className: "qf2",
    style: {
      display: "flex",
      gap: "12px"
    }
  }, /*#__PURE__*/React.createElement(MagBtn, {
    primary: true,
    t: t,
    isMobile: false
  }, "Full Review"), /*#__PURE__*/React.createElement(MagBtn, {
    t: t,
    isMobile: false
  }, "Watch Film")), /*#__PURE__*/React.createElement("div", {
    className: "qf3",
    style: {
      display: "flex",
      gap: "2.5rem",
      marginTop: "3rem",
      paddingTop: "1.6rem",
      borderTop: `1px solid ${t.divider}`
    }
  }, [["9.8", "Score"], ["4K120", "Video"], ["1.2\"", "Sensor"], ["f/1.2", "Aperture"]].map(([v, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "1.65rem",
      fontWeight: 800,
      color: t.accent,
      lineHeight: 1,
      fontFamily: "'Syne',sans-serif"
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "0.54rem",
      color: t.faint,
      letterSpacing: "0.24em",
      textTransform: "uppercase",
      marginTop: "4px"
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "450px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      width: "400px",
      height: "400px",
      borderRadius: "50%",
      background: `radial-gradient(circle,${t.glowA} 0%,transparent 65%)`,
      filter: "blur(48px)",
      transform: `translateY(${scrollY * 0.04}px)`,
      transition: "transform 0.05s linear"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      width: "270px",
      height: "270px",
      borderRadius: "50%",
      background: `radial-gradient(circle,${t.glowB} 0%,transparent 65%)`,
      filter: "blur(34px)",
      transform: `translateY(${-scrollY * 0.025}px) translateX(55px)`,
      transition: "transform 0.05s linear"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      width: "160px",
      height: "160px",
      borderRadius: "50%",
      background: `radial-gradient(circle,${t.glowC} 0%,transparent 65%)`,
      filter: "blur(24px)",
      transform: `translateY(${scrollY * 0.02}px) translateX(-55px)`,
      transition: "transform 0.05s linear"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `translateY(${-scrollY * 0.08}px)`,
      transition: "transform 0.05s linear"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "qfa"
  }, /*#__PURE__*/React.createElement(PhoneSVG, {
    scale: 1
  }))), isDark && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "10%",
      right: "4%",
      width: "80px",
      height: "1.5px",
      background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.38),transparent)",
      transform: "rotate(-22deg)",
      filter: "blur(0.8px)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "9%",
      right: "7%",
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      background: "radial-gradient(circle,rgba(255,255,255,0.05) 0%,transparent 70%)",
      pointerEvents: "none"
    }
  })))), !isMobile && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: "1.8rem",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "7px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "0.52rem",
      letterSpacing: "0.36em",
      color: t.faint,
      textTransform: "uppercase"
    }
  }, "Scroll"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "1px",
      height: "44px",
      background: `linear-gradient(to bottom,${t.accent}60,transparent)`
    }
  })));
}

/* ─────────────────────────────────────────────────
   DEEP DIVE
───────────────────────────────────────────────── */
function DeepDive({
  t,
  isMobile
}) {
  const [idx, setIdx] = useState(0);
  const [prog, setProg] = useState(0);
  const tmr = useRef(null);
  const TICK = 50,
    DUR = 5000;
  const [secRef, secVis] = useInView(0.06);
  const panels = [{
    tag: "01",
    title: "Sensor\nArchitecture",
    desc: "The Obsidian X Pro houses a 1.2-inch stacked CMOS sensor — the largest ever fitted to a mobile form factor. Every photon, shadow, and highlight resolved with surgical precision at 120 megapixels.",
    specs: [["Sensor Size", "1.2 Inches"], ["Resolution", "120 Megapixels"], ["Architecture", "Stacked CMOS"]],
    color: t.accentB,
    viz: "sensor"
  }, {
    tag: "02",
    title: "Computational\nVision",
    desc: "The OmegaX 9 Pro chip dedicates 30 trillion operations per second to computational photography. Real-time ProRes RAW at 4K 120fps — previously impossible outside cinema cameras.",
    specs: [["Neural OPS", "30T / sec"], ["Capture Mode", "4K ProRes RAW"], ["Color Depth", "10-bit HDR+"]],
    color: t.accent,
    viz: "compute"
  }, {
    tag: "03",
    title: "Liquid\nOptics",
    desc: "Variable f/1.2–f/11 aperture iris, physically actuated by micro-motors. A 10-element Obsidian-coated lens eliminates 99.7% of chromatic aberration and virtually all lens flare.",
    specs: [["Aperture", "f/1.2 Variable"], ["Lens Elements", "10-element Coated"], ["Optical Zoom", "10× Periscope"]],
    color: t.id === "dark" ? "#FF6B6B" : "#DC2626",
    viz: "optics"
  }];
  const restart = useCallback(() => {
    clearInterval(tmr.current);
    let e = 0;
    tmr.current = setInterval(() => {
      e += TICK;
      setProg(e / DUR);
      if (e >= DUR) {
        e = 0;
        setIdx(i => (i + 1) % 3);
        setProg(0);
      }
    }, TICK);
  }, []);
  useEffect(() => {
    restart();
    return () => clearInterval(tmr.current);
  }, [restart]);
  const go = i => {
    setIdx(i);
    restart();
  };
  const p = panels[idx];
  const vizMap = {
    sensor: /*#__PURE__*/React.createElement(SensorViz, {
      c: p.color
    }),
    compute: /*#__PURE__*/React.createElement(ComputeViz, {
      c: p.color
    }),
    optics: /*#__PURE__*/React.createElement(OpticsViz, {
      c: p.color
    })
  };
  return /*#__PURE__*/React.createElement("section", {
    ref: secRef,
    "aria-label": "Product features deep dive",
    style: {
      padding: isMobile ? "5rem 5vw" : "6rem 6vw",
      background: t.bgAlt,
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(ellipse 75% 50% at 50% 50%,${t.glowA} 0%,transparent 70%)`,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "1100px",
      margin: "0 auto",
      position: "relative",
      opacity: secVis ? 1 : 0,
      transform: secVis ? "none" : "translateY(32px)",
      transition: "opacity 0.72s ease,transform 0.72s ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: isMobile ? "2rem" : "3rem"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "0.60rem" : "0.64rem",
      letterSpacing: "0.34em",
      color: t.eyebrow,
      textTransform: "uppercase",
      display: "block",
      marginBottom: "0.9rem"
    }
  }, "\u25C9 The Deep Dive"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Syne',sans-serif",
      fontSize: isMobile ? "clamp(1.9rem,8vw,3.2rem)" : "clamp(2.2rem,4.5vw,5rem)",
      fontWeight: 800,
      letterSpacing: "-0.04em",
      lineHeight: 1.05,
      color: t.text
    }
  }, "What Makes It", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      background: t.scoreGrad,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text"
    }
  }, "Extraordinary."))), /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    "aria-label": "Select feature to explore",
    style: {
      display: "flex",
      justifyContent: "center",
      gap: "8px",
      marginBottom: isMobile ? "1.8rem" : "2.5rem",
      flexWrap: "wrap"
    }
  }, panels.map((pl, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => go(i),
    role: "tab",
    "aria-selected": i === idx,
    "aria-controls": `deepdive-panel-${i}`,
    id: `deepdive-tab-${i}`,
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "0.60rem" : "0.64rem",
      letterSpacing: "0.10em",
      padding: isMobile ? "8px 14px" : "9px 20px",
      borderRadius: "100px",
      cursor: "pointer",
      border: `1px solid ${i === idx ? pl.color + "55" : t.border}`,
      background: i === idx ? `${pl.color}10` : t.surface,
      color: i === idx ? pl.color : t.muted,
      outline: "none",
      transition: "all 0.3s ease",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      boxShadow: i === idx ? `0 0 12px ${pl.color}16` : "none"
    }
  }, pl.tag, " \xB7 ", isMobile ? i === 0 ? "Sensor" : i === 1 ? "Vision" : "Optics" : pl.title.replace("\n", " ")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: "14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "tabpanel",
    id: `deepdive-panel-${idx}`,
    "aria-labelledby": `deepdive-tab-${idx}`,
    "aria-live": "polite",
    "aria-atomic": "true",
    style: {
      background: t.surface,
      backdropFilter: "blur(32px)",
      WebkitBackdropFilter: "blur(32px)",
      border: `1px solid ${t.border}`,
      borderRadius: isMobile ? "20px" : "22px",
      padding: isMobile ? "28px 24px" : "36px",
      position: "relative",
      overflow: "hidden",
      boxShadow: `${t.cardShadow},inset 0 1px 0 ${p.color}20`,
      transition: "box-shadow 0.6s ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "0.56rem" : "0.58rem",
      letterSpacing: "0.26em",
      color: p.color,
      textTransform: "uppercase",
      marginBottom: "0.8rem"
    }
  }, p.tag, " / 03"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "'Syne',sans-serif",
      fontSize: isMobile ? "clamp(1.6rem,6vw,2.2rem)" : "clamp(1.6rem,2.8vw,2.6rem)",
      fontWeight: 800,
      lineHeight: 1.05,
      letterSpacing: "-0.03em",
      marginBottom: "1.1rem",
      whiteSpace: "pre-line",
      color: t.text,
      transition: "all 0.5s ease"
    }
  }, p.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "0.80rem" : "0.84rem",
      color: t.muted,
      lineHeight: 1.80,
      marginBottom: "1.8rem"
    }
  }, p.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "7px"
    }
  }, p.specs.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 14px",
      background: `${p.color}08`,
      border: `1px solid ${p.color}1e`,
      borderRadius: "10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "0.56rem" : "0.60rem",
      color: t.faint,
      textTransform: "uppercase",
      letterSpacing: "0.14em"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "0.74rem" : "0.78rem",
      color: p.color,
      fontWeight: 700
    }
  }, v))))), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      background: t.surface,
      backdropFilter: "blur(32px)",
      WebkitBackdropFilter: "blur(32px)",
      border: `1px solid ${t.border}`,
      borderRadius: isMobile ? "20px" : "22px",
      position: "relative",
      overflow: "hidden",
      boxShadow: t.cardShadow,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: isMobile ? "32px 24px 36px" : "36px",
      minHeight: isMobile ? "300px" : "360px",
      transition: "all 0.5s ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      width: "220px",
      height: "220px",
      borderRadius: "50%",
      background: `radial-gradient(circle,${p.color}12 0%,transparent 70%)`,
      transition: "background 0.8s ease",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1
    }
  }, vizMap[p.viz]), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "3px",
      background: t.divider
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${prog * 100}%`,
      background: p.color,
      transition: "width 0.05s linear",
      boxShadow: `0 0 6px ${p.color}80`
    }
  })))), /*#__PURE__*/React.createElement("div", {
    role: "group",
    "aria-label": "Slide navigation",
    style: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      marginTop: "1.6rem"
    }
  }, panels.map((pl, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => go(i),
    "aria-label": `Go to ${pl.title.replace("\n", " ")}, slide ${i + 1} of ${panels.length}`,
    "aria-current": i === idx ? "true" : undefined,
    style: {
      width: i === idx ? "32px" : "9px",
      height: "9px",
      borderRadius: "5px",
      background: i === idx ? p.color : t.border,
      border: "none",
      cursor: "pointer",
      transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
      boxShadow: i === idx ? `0 0 7px ${p.color}80` : "none"
    }
  })))));
}

/* ─────────────────────────────────────────────────
   SPECS
───────────────────────────────────────────────── */
function Specs({
  t,
  isMobile
}) {
  const [secRef, secVis] = useInView(0.05);
  const cards = [{
    icon: "cpu",
    label: "Processor",
    value: "OmegaX 9",
    sub: "3nm · 12-core · 30T OPS",
    cs: 2,
    ac: t.accent
  }, {
    icon: "camera",
    label: "Main Sensor",
    value: "1.2\"",
    sub: "120MP Stacked CMOS · Dual PD",
    ac: t.accentB
  }, {
    icon: "battery",
    label: "Battery",
    value: "7200",
    sub: "mAh · 120W Hyper · 50W Wireless",
    ac: "#F59E0B"
  }, {
    icon: "display",
    label: "Display",
    value: "6.9\"",
    sub: "LTPO OLED · 2K · 1–120Hz adaptive",
    ac: "#EF4444"
  }, {
    icon: "storage",
    label: "Storage",
    value: "1 TB",
    sub: "UFS 4.0 · 12GB LPDDR5X",
    ac: "#A78BFA"
  }, {
    icon: "video",
    label: "Video",
    value: "4K120",
    sub: "ProRes RAW · 10-bit · Dolby Vision",
    cs: 2,
    ac: "#FB923C"
  }, {
    icon: "aperture",
    label: "Aperture",
    value: "f/1.2",
    sub: "Variable iris · 10-element Obsidian",
    ac: "#38BDF8"
  }, {
    icon: "weight",
    label: "Weight",
    value: "182g",
    sub: "Titanium · Ceramic · Obsidian glass",
    ac: "#34D399"
  }, {
    icon: "signal",
    label: "Wireless",
    value: "Wi-Fi 7",
    sub: "BT 5.4 · UWB · NFC · 5G SA",
    cs: 2,
    ac: "#F472B6"
  }];
  return /*#__PURE__*/React.createElement("section", {
    ref: secRef,
    style: {
      padding: isMobile ? "5rem 5vw" : "6rem 6vw",
      background: t.bg,
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(ellipse 80% 55% at 50% 50%,${t.glowA} 0%,transparent 70%)`,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement(FadeIn, {
    sx: {
      textAlign: "center",
      marginBottom: isMobile ? "2.5rem" : "4rem",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "0.60rem" : "0.64rem",
      letterSpacing: "0.34em",
      color: t.eyebrow,
      textTransform: "uppercase",
      display: "block",
      marginBottom: "0.9rem"
    }
  }, "\u25C9 Technical Specifications"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Syne',sans-serif",
      fontSize: isMobile ? "clamp(2rem,9vw,3.6rem)" : "clamp(2.5rem,5.5vw,5.8rem)",
      fontWeight: 800,
      letterSpacing: "-0.048em",
      lineHeight: 1,
      color: t.text
    }
  }, "Built Different."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "0.74rem" : "0.80rem",
      color: t.muted,
      marginTop: "0.9rem",
      letterSpacing: "0.04em"
    }
  }, "Every number a record. Every spec, a statement.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: isMobile ? "repeat(2,minmax(0,1fr))" : "repeat(3,minmax(0,1fr))",
      gap: isMobile ? "9px" : "11px",
      maxWidth: isMobile ? "100%" : "1040px",
      margin: "0 auto"
    }
  }, cards.map((c, i) => /*#__PURE__*/React.createElement(FadeIn, {
    key: i,
    delay: Math.min(i * 0.055, 0.33),
    sx: {
      gridColumn: `span ${isMobile ? (c.cs >= 2 ? 2 : 1) : c.cs || 1}`
    }
  }, /*#__PURE__*/React.createElement(BCard, {
    t: t,
    icon: c.icon,
    label: c.label,
    value: c.value,
    sub: c.sub,
    cs: c.cs || 1,
    accent: c.ac,
    isMobile: isMobile,
    inView: secVis
  })))));
}

/* ─────────────────────────────────────────────────
   VERDICT
───────────────────────────────────────────────── */
function Verdict({
  t,
  isDark,
  isMobile
}) {
  const cr = useRef(null);
  const [tilt, setTilt] = useState({
    x: 0,
    y: 0
  });
  const [glint, setGlint] = useState({
    x: 50,
    y: 50
  });
  const [secRef, secVis] = useInView(0.06);
  const mv = e => {
    if (isMobile || !cr.current) return;
    const r = cr.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width,
      ny = (e.clientY - r.top) / r.height;
    setTilt({
      x: (ny - 0.5) * 18,
      y: -(nx - 0.5) * 18
    });
    setGlint({
      x: nx * 100,
      y: ny * 100
    });
  };
  const ml = () => {
    setTilt({
      x: 0,
      y: 0
    });
    setGlint({
      x: 50,
      y: 50
    });
  };
  const subs = [{
    l: "Camera",
    s: 10.0,
    c: t.accent
  }, {
    l: "Performance",
    s: 9.8,
    c: t.accentB
  }, {
    l: "Design",
    s: 9.5,
    c: "#A78BFA"
  }, {
    l: "Battery",
    s: 9.6,
    c: "#F59E0B"
  }, {
    l: "Display",
    s: 9.8,
    c: "#EF4444"
  }, {
    l: "Value",
    s: 9.0,
    c: "#34D399"
  }];
  return /*#__PURE__*/React.createElement("section", {
    ref: secRef,
    style: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: isMobile ? "5rem 5vw" : "6rem 6vw",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: t.verdictBg
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(ellipse 75% 65% at 50% 50%,${t.glowA} 0%,transparent 68%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "-12%",
      left: "-6%",
      width: "420px",
      height: "420px",
      borderRadius: "50%",
      background: `radial-gradient(circle,${t.glowC} 0%,transparent 70%)`,
      filter: "blur(55px)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: "-16%",
      right: "-6%",
      width: "400px",
      height: "400px",
      borderRadius: "50%",
      background: `radial-gradient(circle,${t.glowA} 0%,transparent 70%)`,
      filter: "blur(55px)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      maxWidth: isMobile ? "100%" : "560px",
      opacity: secVis ? 1 : 0,
      transform: secVis ? "none" : "translateY(36px)",
      transition: "opacity 0.8s ease,transform 0.8s ease",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "1.4rem",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      background: t.id === "dark" ? "rgba(57,255,20,0.08)" : "rgba(4,120,87,0.08)",
      border: `1px solid ${t.accent}28`,
      borderRadius: "100px",
      padding: "7px 16px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.88rem"
    }
  }, "\uD83C\uDFC6"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "0.60rem",
      letterSpacing: "0.22em",
      color: t.eyebrow,
      textTransform: "uppercase"
    }
  }, "Best Camera Phone 2026")), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Syne',sans-serif",
      fontSize: isMobile ? "clamp(2.8rem,12vw,5rem)" : "clamp(3rem,6.5vw,7.5rem)",
      fontWeight: 800,
      letterSpacing: "-0.048em",
      textAlign: "center",
      marginBottom: isMobile ? "2rem" : "2.8rem",
      lineHeight: 0.92,
      color: t.text
    }
  }, "Near.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      background: t.scoreGrad,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text"
    }
  }, "Perfect.")), /*#__PURE__*/React.createElement("div", {
    ref: cr,
    onMouseMove: mv,
    onMouseLeave: ml,
    style: {
      position: "relative",
      width: "100%",
      background: t.surface,
      backdropFilter: "blur(60px)",
      WebkitBackdropFilter: "blur(60px)",
      border: `1px solid ${t.border}`,
      borderRadius: isMobile ? "22px" : "26px",
      padding: isMobile ? "28px 22px" : "40px",
      transform: isMobile ? "none" : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      transition: "transform 0.08s ease",
      transformStyle: "preserve-3d",
      boxShadow: `${t.cardShadow},0 60px 160px ${isDark ? "rgba(0,0,0,0.80)" : "rgba(0,0,0,0.14)"},inset 0 1px 0 ${isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.92)"}`,
      cursor: "default"
    }
  }, !isMobile && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "26px",
      pointerEvents: "none",
      background: `radial-gradient(circle at ${glint.x}% ${glint.y}%,${isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.60)"} 0%,transparent 52%)`,
      transition: "background 0.04s linear"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: isMobile ? "1.4rem" : "1.8rem"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Syne',sans-serif",
      fontSize: isMobile ? "clamp(4rem,18vw,6rem)" : "clamp(4rem,9vw,6.5rem)",
      fontWeight: 800,
      lineHeight: 1,
      letterSpacing: "-0.06em",
      background: t.scoreGrad,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      filter: `drop-shadow(0 0 28px ${t.accent}44)`
    }
  }, "9.8"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "0.64rem" : "0.68rem",
      color: t.faint,
      letterSpacing: "0.38em",
      textTransform: "uppercase",
      marginTop: "-4px"
    }
  }, "out of 10")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: isMobile ? "13px 16px" : "15px 22px",
      paddingTop: isMobile ? "1.4rem" : "1.6rem",
      borderTop: `1px solid ${t.divider}`,
      marginBottom: isMobile ? "1.4rem" : "1.8rem"
    }
  }, subs.map(({
    l,
    s,
    c
  }, i) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "5px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "0.56rem" : "0.58rem",
      color: t.faint,
      textTransform: "uppercase",
      letterSpacing: "0.14em"
    }
  }, l), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "0.66rem" : "0.70rem",
      color: c,
      fontWeight: 700
    }
  }, s.toFixed(1))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "2px",
      background: t.divider,
      borderRadius: "2px",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      borderRadius: "2px",
      width: secVis ? `${s * 10}%` : "0%",
      background: c,
      boxShadow: `0 0 5px ${c}90`,
      transition: `width 1.0s cubic-bezier(0.34,1.56,0.64,1) ${0.2 + i * 0.08}s`
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: isMobile ? "1.4rem" : "1.6rem",
      borderTop: `1px solid ${t.divider}`,
      flexWrap: "wrap",
      gap: "12px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "0.54rem" : "0.56rem",
      color: t.faint,
      textTransform: "uppercase",
      letterSpacing: "0.2em"
    }
  }, "Starting from"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Syne',sans-serif",
      fontSize: isMobile ? "1.6rem" : "1.8rem",
      fontWeight: 800,
      color: t.text,
      marginTop: "2px"
    }
  }, "$1,499")), /*#__PURE__*/React.createElement(MagBtn, {
    primary: true,
    t: t,
    isMobile: isMobile
  }, "Buy Now"))), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: isMobile ? "2rem" : "2.5rem",
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: isMobile ? "0.70rem" : "0.72rem",
      color: t.faint,
      textAlign: "center",
      maxWidth: "320px",
      lineHeight: 1.90,
      fontStyle: "italic"
    }
  }, "\"The Obsidian X Pro isn't just a camera phone.", /*#__PURE__*/React.createElement("br", null), "It's a statement about what's possible.\"")));
}

/* ─────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────── */
function Footer({
  t,
  isMobile
}) {
  const cols = [{
    title: "Product",
    links: ["Overview", "Specs", "Camera", "Performance", "Compare"]
  }, {
    title: "Review",
    links: ["Full Review", "Deep Dive", "Video Test", "Verdict", "Awards"]
  }, {
    title: "Company",
    links: ["AXIOM Labs", "About Us", "Contact", "Press Kit", "Newsletter"]
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: t.footBg,
      borderTop: `1px solid ${t.divider}`,
      padding: isMobile ? "3rem 5vw" : "5rem 6vw"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "1100px",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr",
      gap: isMobile ? "2.5rem" : "3rem",
      marginBottom: isMobile ? "2.5rem" : "4rem"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Syne',sans-serif",
      fontWeight: 800,
      fontSize: "1.1rem",
      letterSpacing: "0.06em",
      color: t.text,
      marginBottom: "1rem"
    }
  }, "AXIOM", /*#__PURE__*/React.createElement("span", {
    style: {
      color: t.accent
    }
  }, "."), "LABS"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "0.75rem",
      color: t.muted,
      lineHeight: 1.75,
      maxWidth: "260px"
    }
  }, "Independent reviews for devices that shape how we see the world. No ads. No bias. Just truth."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      marginTop: "1.4rem",
      flexWrap: "wrap"
    }
  }, ["Twitter", "YouTube", "Instagram"].map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    role: "link",
    tabIndex: 0,
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "0.58rem",
      letterSpacing: "0.12em",
      padding: "6px 12px",
      borderRadius: "100px",
      border: `1px solid ${t.border}`,
      background: t.surface,
      color: t.muted,
      cursor: "pointer",
      userSelect: "none",
      transition: "all 0.25s ease"
    },
    onMouseEnter: e => {
      e.currentTarget.style.color = t.accent;
      e.currentTarget.style.borderColor = t.accent + "44";
    },
    onMouseLeave: e => {
      e.currentTarget.style.color = t.muted;
      e.currentTarget.style.borderColor = t.border;
    },
    onFocus: e => {
      e.currentTarget.style.color = t.accent;
      e.currentTarget.style.borderColor = t.accent + "44";
    },
    onBlur: e => {
      e.currentTarget.style.color = t.muted;
      e.currentTarget.style.borderColor = t.border;
    },
    onKeyDown: e => e.key === "Enter" && e.currentTarget.click()
  }, s)))), !isMobile && cols.map(col => /*#__PURE__*/React.createElement("div", {
    key: col.title
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Syne',sans-serif",
      fontWeight: 700,
      fontSize: "0.78rem",
      letterSpacing: "0.08em",
      color: t.text,
      marginBottom: "1.2rem",
      textTransform: "uppercase"
    }
  }, col.title), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      display: "flex",
      flexDirection: "column",
      gap: "0.7rem"
    }
  }, col.links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l,
    role: "link",
    tabIndex: 0,
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "0.72rem",
      color: t.muted,
      cursor: "pointer",
      transition: "color 0.2s ease"
    },
    onMouseEnter: e => e.currentTarget.style.color = t.accent,
    onMouseLeave: e => e.currentTarget.style.color = t.muted,
    onKeyDown: e => e.key === "Enter" && e.currentTarget.click(),
    onFocus: e => e.currentTarget.style.color = t.accent,
    onBlur: e => e.currentTarget.style.color = t.muted
  }, l)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: "1.6rem",
      borderTop: `1px solid ${t.divider}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: isMobile ? "column" : "row",
      gap: "0.6rem",
      textAlign: isMobile ? "center" : "left"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "0.60rem",
      color: t.faint,
      letterSpacing: "0.14em"
    }
  }, "\xA9 2026 AXIOM LABS \xB7 OBSIDIAN X PRO REVIEW"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "1.5rem"
    }
  }, ["Privacy", "Terms", "Cookies"].map(l => /*#__PURE__*/React.createElement("span", {
    key: l,
    role: "link",
    tabIndex: 0,
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "0.60rem",
      color: t.faint,
      cursor: "pointer",
      letterSpacing: "0.10em",
      transition: "color 0.2s ease"
    },
    onMouseEnter: e => e.currentTarget.style.color = t.text,
    onMouseLeave: e => e.currentTarget.style.color = t.faint,
    onFocus: e => e.currentTarget.style.color = t.text,
    onBlur: e => e.currentTarget.style.color = t.faint,
    onKeyDown: e => e.key === "Enter" && e.currentTarget.click()
  }, l))))));
}

/* ─────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────── */
function App() {
  const isDark = true;
  const [scrollY, setScrollY] = useState(0);
  const isMobile = useMedia("(max-width: 768px)");
  const t = TH.dark;
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, {
      passive: true
    });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, `
        @keyframes qfloat { 0%,100% { transform: translateY(0px) rotate(-0.6deg); } 50% { transform: translateY(-17px) rotate(0.6deg); } }
        @keyframes qrc    { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes qfu    { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }

        .qfa { animation: qfloat 7.5s ease-in-out infinite; }
        .qr1 { animation: qrc 0.72s ease 0.10s both; }
        .qr2 { animation: qrc 0.72s ease 0.28s both; }
        .qr3 { animation: qrc 0.72s ease 0.46s both; }
        .qf1 { animation: qfu 0.80s ease 0.18s both; }
        .qf2 { animation: qfu 0.80s ease 0.42s both; }
        .qf3 { animation: qfu 0.80s ease 0.82s both; }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${t.bg}; }
        ::-webkit-scrollbar-thumb { background: ${t.accent}48; border-radius: 2px; }
        * { -webkit-tap-highlight-color: transparent; }
        button { outline: none; }
        img, svg { display: block; }

        .qgrain {
          position: fixed; inset: 0; pointer-events: none; z-index: 9990;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.86' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 150px; mix-blend-mode: overlay;
          opacity: ${isDark ? 0.024 : 0.015};
        }

        button:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px ${t.bg}, 0 0 0 4px ${t.accent} !important;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
          .qfa { animation: none !important; transform: none !important; }
        }
      `), /*#__PURE__*/React.createElement("div", {
    className: "qgrain"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.bg,
      color: t.text,
      fontFamily: "'Syne',sans-serif",
      overflowX: "hidden",
      minHeight: "100vh",
      transition: "background 0.5s ease,color 0.5s ease"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    t: t,
    scrollY: scrollY,
    isMobile: isMobile
  }), /*#__PURE__*/React.createElement(Hero, {
    t: t,
    isDark: isDark,
    scrollY: scrollY,
    isMobile: isMobile
  }), /*#__PURE__*/React.createElement(DeepDive, {
    t: t,
    isMobile: isMobile
  }), /*#__PURE__*/React.createElement(Specs, {
    t: t,
    isMobile: isMobile
  }), /*#__PURE__*/React.createElement(Verdict, {
    t: t,
    isDark: isDark,
    isMobile: isMobile
  }), /*#__PURE__*/React.createElement(Footer, {
    t: t,
    isMobile: isMobile
  })));
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(App, null));
