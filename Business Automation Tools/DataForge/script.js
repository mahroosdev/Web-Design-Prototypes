/* ============================================
   DataForge — script.js
   Data profiling logic — no external deps
   ============================================ */

/* ── App State ── */
var state = { name: '', headers: [], rows: [], profile: [] };

/* ── Demo Dataset ── */
var demoRows = [
  ['Customer',      'Region',         'Plan',       'MRR',   'Health', 'Last Login'],
  ['Nova Labs',     'North America',  'Enterprise', '12400', '94',     '2026-06-02'],
  ['Atlas Studio',  'Europe',         'Team',       '4200',  '88',     '2026-06-08'],
  ['Blue Finch',    'Middle East',    'Business',   '7800',  '76',     '2026-05-28'],
  ['Orbit Retail',  'Asia Pacific',   'Enterprise', '15600', '91',     '2026-06-10'],
  ['Mercury Ops',   'Europe',         'Starter',    '900',   '64',     '2026-04-21'],
  ['Summit Works',  'North America',  'Business',   '6400',  '82',     '2026-06-01'],
  ['Cedar Health',  'Middle East',    'Team',       '3600',  '79',     '2026-05-30'],
  ['Pulse Grid',    'Asia Pacific',   'Enterprise', '18100', '96',     '2026-06-11']
];

/* ── DOM References ── */
var drop  = document.getElementById('drop');
var input = document.getElementById('fileInput');

/* ── Drag & Drop ── */
drop.addEventListener('dragover',  function(e) { e.preventDefault(); drop.classList.add('over'); });
drop.addEventListener('dragleave', function()  { drop.classList.remove('over'); });
drop.addEventListener('drop', function(e) {
  e.preventDefault();
  drop.classList.remove('over');
  if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
});

/* ── File Input ── */
input.addEventListener('change', function() {
  if (input.files[0]) loadFile(input.files[0]);
});

/* ── App Controls ── */
function resetApp() {
  document.getElementById('hero').style.display = 'grid';
  document.getElementById('dashboard').classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadDemo() {
  setData('portfolio_customer_health.csv', demoRows.slice(1), demoRows[0]);
  toast('Demo dataset loaded');
}

function loadFile(file) {
  var reader = new FileReader();
  reader.onload = function() {
    try {
      var parsed = parseText(reader.result, file.name);
      setData(file.name, parsed.rows, parsed.headers);
    } catch (e) {
      toast(e.message);
    }
  };
  reader.readAsText(file);
}

/* ── Parsing ── */
function parseText(text, name) {
  var isJson = /\.json$/i.test(name);
  if (isJson) {
    var data = JSON.parse(text);
    if (!Array.isArray(data) || !data.length) throw Error('JSON must be a non-empty array');
    var headers = Object.keys(data[0]);
    return { headers: headers, rows: data.map(function(o) { return headers.map(function(h) { return o[h] ?? ''; }); }) };
  }
  var delim = /\.tsv$/i.test(name) ? '\t' : ',';
  var lines = text.trim().split(/\r?\n/).filter(Boolean).map(function(line) { return splitLine(line, delim); });
  if (lines.length < 2) throw Error('File needs headers and at least one row');
  return { headers: lines[0], rows: lines.slice(1) };
}

function splitLine(line, delim) {
  var out = [], cur = '', q = false;
  for (var i = 0; i < line.length; i++) {
    var c = line[i];
    if (c === '"')           { q = !q; continue; }
    if (c === delim && !q)   { out.push(cur.trim()); cur = ''; }
    else                     { cur += c; }
  }
  out.push(cur.trim());
  return out;
}

/* ── Set Data & Render ── */
function setData(name, rows, headers) {
  state = { name: name, headers: headers, rows: rows, profile: profile(headers, rows) };
  document.getElementById('hero').style.display      = 'none';
  document.getElementById('dashboard').classList.add('active');
  document.getElementById('fileName').textContent    = name;
  document.getElementById('fileMeta').textContent    = rows.length + ' rows · ' + headers.length + ' columns · local demo ready';
  renderMetrics();
  renderColumns();
  renderTable();
  runInsights(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Profile ── */
function profile(headers, rows) {
  return headers.map(function(h, i) {
    var vals   = rows.map(function(r) { return r[i] || ''; });
    var filled = vals.filter(Boolean);
    var nums   = filled.filter(function(v) { return !isNaN(parseFloat(v)) && isFinite(v); });
    var type   = nums.length / Math.max(filled.length, 1) > .7 ? 'numeric'
               : (/date|login|created|time/i.test(h) ? 'date' : 'text');
    return {
      name:    h,
      type:    type,
      filled:  filled.length,
      unique:  new Set(filled).size,
      quality: Math.round((filled.length / Math.max(rows.length, 1)) * 100)
    };
  });
}

/* ── Render Metrics ── */
function renderMetrics() {
  var numeric = state.profile.filter(function(p) { return p.type === 'numeric'; }).length;
  var avg     = Math.round(state.profile.reduce(function(a, p) { return a + p.quality; }, 0) / Math.max(state.profile.length, 1));
  document.getElementById('metrics').innerHTML = [
    ['Rows',          state.rows.length],
    ['Columns',       state.headers.length],
    ['Numeric fields',numeric],
    ['Quality score', avg + '%']
  ].map(function(m) {
    return '<div class="metric"><span>' + m[0] + '</span><strong>' + m[1] + '</strong></div>';
  }).join('');
}

/* ── Render Columns ── */
function renderColumns() {
  document.getElementById('columns').innerHTML = state.profile.map(function(p) {
    return '<div class="col">'
      + '<div class="col-top"><b title="' + esc(p.name) + '">' + esc(p.name) + '</b><span class="pill">' + p.type + '</span></div>'
      + '<div class="bar"><i style="width:' + p.quality + '%"></i></div>'
      + '<small>' + p.filled + ' filled · ' + p.unique + ' unique values</small>'
      + '</div>';
  }).join('');
}

/* ── Render Table ── */
function renderTable() {
  var q    = document.getElementById('search').value.toLowerCase();
  var rows = state.rows.filter(function(r) { return !q || r.join(' ').toLowerCase().includes(q); }).slice(0, 80);
  document.getElementById('thead').innerHTML = '<tr>' + state.headers.map(function(h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr>';
  document.getElementById('tbody').innerHTML = rows.map(function(r) {
    return '<tr>' + state.headers.map(function(_, i) { return '<td>' + esc(r[i] || '') + '</td>'; }).join('') + '</tr>';
  }).join('');
  document.getElementById('tableInfo').textContent = rows.length + ' visible rows from ' + state.rows.length;
}

/* ── Insights ── */
function runInsights(silent) {
  if (!state.rows.length) return toast('Load data first');
  document.getElementById('aiStatus').textContent = 'Demo mode';
  var score = Math.round(state.profile.reduce(function(a, p) { return a + p.quality; }, 0) / state.profile.length);
  document.getElementById('aiOut').innerHTML =
    '<p><b>Portfolio demo insight:</b> this dataset is ' + score + '% complete and ready for segmentation.</p>'
    + '<ul>'
    + '<li>Prioritize low-health accounts for customer success outreach.</li>'
    + '<li>Enterprise plans show the strongest recurring revenue concentration.</li>'
    + '<li>Region and plan fields are clean enough for immediate dashboarding.</li>'
    + '</ul>';
  if (!silent) toast('Demo insight generated');
}

/* ── Export ── */
function exportCSV() {
  if (!state.rows.length) return toast('No data to export');
  var csv = [state.headers].concat(state.rows).map(function(r) {
    return r.map(function(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(',');
  }).join('\n');
  download(csv, state.name.replace(/\.[^.]+$/, '') + '_clean.csv', 'text/csv');
}

/* ── Utilities ── */
function download(text, name, type) {
  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: type }));
  a.download = name;
  a.click();
  setTimeout(function() { URL.revokeObjectURL(a.href); }, 500);
}

function toast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(window._toast);
  window._toast = setTimeout(function() { t.classList.remove('on'); }, 2400);
}

function esc(v) {
  return String(v).replace(/[&<>"']/g, function(c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
