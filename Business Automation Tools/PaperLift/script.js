/* ============================================
   PaperLift — script.js
   PDF table extraction logic — no external deps
   ============================================ */

/* ── State ── */
var tables = [], active = 0;

/* ── Demo Data ── */
var demoTables = [
  {
    name: 'Revenue by Region',
    confidence: 97,
    headers: ['Region', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'],
    rows: [
      ['North America', '$1.8M', '$2.1M', '$2.4M', '$2.8M', '$9.1M'],
      ['Europe',        '$1.1M', '$1.3M', '$1.5M', '$1.7M', '$5.6M'],
      ['Middle East',   '$620K', '$760K', '$840K', '$930K', '$3.15M'],
      ['Asia Pacific',  '$980K', '$1.2M', '$1.4M', '$1.6M', '$5.18M']
    ]
  },
  {
    name: 'Operating Metrics',
    confidence: 94,
    headers: ['Metric', 'Current', 'Previous', 'Change', 'Status'],
    rows: [
      ['Net retention', '118%',    '111%',    '+7 pts',  'Strong'],
      ['Gross margin',  '72%',     '68%',     '+4 pts',  'Improving'],
      ['CAC payback',   '10.4 mo', '12.8 mo', '-2.4 mo', 'Improving'],
      ['NPS',           '54',      '48',      '+6',      'Strong']
    ]
  },
  {
    name: 'Customer Segments',
    confidence: 91,
    headers: ['Segment', 'Accounts', 'ARR', 'Growth'],
    rows: [
      ['Enterprise', '86',  '$9.8M', '31%'],
      ['Mid-market', '214', '$6.4M', '24%'],
      ['SMB',        '820', '$3.1M', '12%']
    ]
  }
];

/* ── DOM References ── */
var drop  = document.getElementById('drop');
var input = document.getElementById('fileInput');

/* ── Drag & Drop ── */
drop.addEventListener('dragover', function(e) { e.preventDefault(); drop.classList.add('over'); });
drop.addEventListener('dragleave', function()  { drop.classList.remove('over'); });
drop.addEventListener('drop', function(e) {
  e.preventDefault();
  drop.classList.remove('over');
  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});

/* ── File Input ── */
input.addEventListener('change', function() {
  if (input.files[0]) handleFile(input.files[0]);
});

/* ── App Controls ── */
function resetApp() {
  document.getElementById('hero').style.display = 'grid';
  document.getElementById('workspace').classList.remove('active');
  document.getElementById('progress').classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleFile(file) {
  if (!/\.pdf$/i.test(file.name)) { toast('Please choose a PDF file'); return; }
  runDemo(file.name);
}

/* ── Demo Extraction with Animated Steps ── */
function runDemo(name) {
  document.getElementById('hero').style.display = 'none';
  document.getElementById('workspace').classList.remove('active');
  document.getElementById('progress').classList.add('active');
  document.getElementById('fileName').textContent = name || 'Annual_Report_2026.pdf';

  var labels = ['Reading PDF', 'Finding table grids', 'Normalizing cells', 'Preparing exports'];
  var idx = 0;
  renderSteps(labels, idx);

  var timer = setInterval(function() {
    idx++;
    renderSteps(labels, idx);
    if (idx >= labels.length) {
      clearInterval(timer);
      tables = JSON.parse(JSON.stringify(demoTables));
      active = 0;
      document.getElementById('progress').classList.remove('active');
      document.getElementById('workspace').classList.add('active');
      renderAll();
      toast('Demo extraction complete');
    }
  }, 360);
}

/* ── Render Step Progress ── */
function renderSteps(labels, idx) {
  document.getElementById('steps').innerHTML = labels.map(function(l, i) {
    return '<div class="step ' + (i < idx ? 'done' : '') + '">' + (i + 1) + '. ' + l + '</div>';
  }).join('');
}

/* ── Render All Panels ── */
function renderAll() {
  document.getElementById('fileMeta').textContent = tables.length + ' tables extracted · demo mode';

  document.getElementById('summary').innerHTML = [
    ['Tables',          tables.length],
    ['Avg confidence',  Math.round(tables.reduce(function(a, t) { return a + t.confidence; }, 0) / tables.length) + '%'],
    ['Rows',            tables.reduce(function(a, t) { return a + t.rows.length; }, 0)],
    ['Export formats',  'CSV / JSON']
  ].map(function(m) {
    return '<div class="sum"><span>' + m[0] + '</span><strong>' + m[1] + '</strong></div>';
  }).join('');

  document.getElementById('tableList').innerHTML = tables.map(function(t, i) {
    return '<button class="tablebtn ' + (i === active ? 'active' : '') + '" onclick="selectTable(' + i + ')">'
      + '<b>' + esc(t.name) + '</b>'
      + '<span>' + t.rows.length + ' rows · ' + t.headers.length + ' columns · ' + t.confidence + '% confidence</span>'
      + '</button>';
  }).join('');

  renderTable();
}

/* ── Select Table ── */
function selectTable(i) {
  active = i;
  renderAll();
}

/* ── Render Table Preview ── */
function renderTable() {
  var t = tables[active];
  if (!t) return;
  document.getElementById('tableTitle').textContent = t.name;
  document.getElementById('tableSub').textContent   = t.rows.length + ' rows · ' + t.headers.length + ' columns · ' + t.confidence + '% extraction confidence';
  document.getElementById('thead').innerHTML = '<tr>' + t.headers.map(function(h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr>';
  document.getElementById('tbody').innerHTML = t.rows.map(function(r) {
    return '<tr>' + r.map(function(c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>';
  }).join('');
  document.getElementById('raw').textContent = 'Demo mode: structured extraction returned ' + tables.length + ' tables with review-ready confidence scores.';
}

/* ── Export ── */
function exportCurrent() {
  var t = tables[active];
  if (!t) return toast('Run the demo first');
  download(toCSV(t), safe(t.name) + '.csv', 'text/csv');
}

function exportAll() {
  if (!tables.length) return toast('Run the demo first');
  var payload = {
    source: document.getElementById('fileName').textContent,
    tables: tables
  };
  download(JSON.stringify(payload, null, 2), 'paperlift_tables.json', 'application/json');
}

function toCSV(t) {
  return [t.headers].concat(t.rows).map(function(r) {
    return r.map(function(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(',');
  }).join('\n');
}

/* ── Utilities ── */
function download(text, name, type) {
  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: type }));
  a.download = name;
  a.click();
  setTimeout(function() { URL.revokeObjectURL(a.href); }, 500);
}

function safe(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
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
