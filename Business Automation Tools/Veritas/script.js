/* ============================================
   Veritas — script.js
   Editorial quality scoring logic — offline
   ============================================ */

/* ── App State ── */
var report = null;
var currentTab = 'findings';

var sample = 'Our AI platform helps teams transform scattered operational data into reliable daily decisions. It connects messy CSV exports, customer records, and performance reports, then highlights quality gaps, revenue risks, and next best actions. Teams can move faster because managers no longer need to rebuild the same spreadsheet analysis every week.';

/* ── DOM References & Events ── */
var content = document.getElementById('content');
if (content) {
  content.addEventListener('input', function() {
    document.getElementById('count').textContent = words(content.value) + ' words';
  });
}

/* ── App Controls ── */
function resetApp() {
  document.getElementById('hero').style.display = 'grid';
  document.getElementById('results').classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadSample() {
  content.value = sample;
  content.dispatchEvent(new Event('input'));
  toast('Sample content loaded');
}

/* ── Local Analysis Engine ── */
function analyze() {
  var text = content.value.trim();
  var wc = words(text);
  if (wc < 10) {
    toast('Add at least 10 words');
    return;
  }

  var clarity = scoreClarity(text);
  var cred    = scoreCredibility(text);
  var tone    = scoreTone(text);
  var action  = scoreAction(text);
  var score   = Math.round((clarity + cred + tone + action) / 4);

  report = {
    text:          text,
    words:         wc,
    score:         score,
    clarity:       clarity,
    credibility:   cred,
    tone:          tone,
    actionability: action,
    findings:      findings(text, wc, clarity, cred, tone, action),
    rewrite:       rewrite(text),
    brief:         brief(text, wc, score)
  };

  document.getElementById('hero').style.display = 'none';
  document.getElementById('results').classList.add('active');
  renderReport();
  toast('Demo analysis complete');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Word & Score Metrics ── */
function words(t) {
  return (t.trim().match(/\S+/g) || []).length;
}

function sentences(t) {
  return Math.max((t.match(/[.!?]/g) || []).length, 1);
}

function scoreClarity(t) {
  var avg = words(t) / sentences(t);
  return clamp(Math.round(96 - Math.max(avg - 18, 0) * 3), 62, 96);
}

function scoreCredibility(t) {
  var flags = (t.match(/\b(always|never|guaranteed|revolutionary|best|everyone)\b/gi) || []).length;
  return clamp(90 - flags * 7, 58, 94);
}

function scoreTone(t) {
  var caps = (t.match(/[A-Z]{5,}/g) || []).length;
  return clamp(92 - caps * 8, 60, 95);
}

function scoreAction(t) {
  var verbs = (t.match(/\b(start|build|create|connect|reduce|improve|move|highlight|deliver|review)\b/gi) || []).length;
  return clamp(70 + verbs * 4, 62, 96);
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

/* ── Feedback Generator ── */
function findings(t, wc, c, cr, to, a) {
  var out = [];
  out.push({
    title: 'Strong product framing',
    body: 'The copy explains the operational value and gives the reader a clear reason to care.'
  });

  if (c < 82) {
    out.push({
      title: 'Improve sentence length',
      body: 'Break long sentences into shorter claims so the value proposition is faster to scan.'
    });
  } else {
    out.push({
      title: 'Good clarity',
      body: 'Sentence length and structure are suitable for a professional product page.'
    });
  }

  if (cr < 82) {
    out.push({
      title: 'Add proof',
      body: 'Reduce broad claims or support them with metrics, customer examples, or process detail.'
    });
  } else {
    out.push({
      title: 'Credible tone',
      body: 'The language avoids excessive hype and reads as believable.'
    });
  }

  if (a < 82) {
    out.push({
      title: 'Make next action sharper',
      body: 'Add a concrete call to action or implementation outcome at the end.'
    });
  }

  out.push({
    title: 'Length check',
    body: wc + ' words is suitable for a compact portfolio or landing-page section.'
  });

  return out;
}

function rewrite(t) {
  var trimmed = t.replace(/\s+/g, ' ').trim();
  return 'Improved version:\n\n' + trimmed + '\n\nSuggested closing line: Review the dashboard, identify the highest-risk gaps, and export a clean report for the next operating meeting.';
}

function brief(t, wc, score) {
  return [
    'Content quality score: ' + score + '/100',
    'Word count: ' + wc,
    'Best use: portfolio case study, SaaS landing section, or product demo description',
    'Primary improvement: add one measurable proof point and one direct next step.'
  ];
}

/* ── Render Report ── */
function renderReport() {
  document.getElementById('score').textContent = report.score;
  document.getElementById('ring').style.setProperty('--score', report.score);
  document.getElementById('verdict').textContent = report.score >= 86 ? 'Ready with minor polish'
                                                 : report.score >= 74 ? 'Good draft, needs tightening'
                                                 : 'Needs revision before publishing';

  document.getElementById('summary').textContent = report.words + ' words · ' + report.score + '/100 score · demo mode';

  document.getElementById('metrics').innerHTML = [
    ['Clarity',       report.clarity],
    ['Credibility',   report.credibility],
    ['Tone',          report.tone],
    ['Actionability', report.actionability]
  ].map(function(m) {
    return '<div class="metric">'
      + '<div class="metric-top"><span>' + m[0] + '</span><b>' + m[1] + '%</b></div>'
      + '<div class="bar"><i style="width:' + m[1] + '%"></i></div>'
      + '</div>';
  }).join('');

  showTab(currentTab, document.querySelector('.tab.active'));
}

/* ── Tab Controls ── */
function showTab(tab, btn) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');

  var p = document.getElementById('panel');
  if (!report) { p.innerHTML = ''; return; }

  if (tab === 'findings') {
    p.innerHTML = '<div class="list">' + report.findings.map(function(f) {
      return '<div class="item"><b>' + esc(f.title) + '</b><span>' + esc(f.body) + '</span></div>';
    }).join('') + '</div>';
  } else if (tab === 'rewrite') {
    p.innerHTML = '<div class="rewrite">' + esc(report.rewrite) + '</div>';
  } else {
    p.innerHTML = '<div class="list">' + report.brief.map(function(x) {
      return '<div class="item"><span>' + esc(x) + '</span></div>';
    }).join('') + '</div>';
  }
}

/* ── Export report ── */
function exportReport() {
  if (!report) return toast('Analyze content first');
  var lines = ['VERITAS CONTENT QUALITY REPORT', 'Score: ' + report.score + '/100', 'Words: ' + report.words, '', 'Findings:']
    .concat(report.findings.map(function(f) { return '- ' + f.title + ': ' + f.body; }), ['', report.rewrite, '', 'Brief:'])
    .concat(report.brief.map(function(b) { return '- ' + b; }));

  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' }));
  a.download = 'veritas_report.txt';
  a.click();
  setTimeout(function() { URL.revokeObjectURL(a.href); }, 500);
}

/* ── Toast Utilities ── */
function toast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(window._toast);
  window._toast = setTimeout(function() { t.classList.remove('on'); }, 2200);
}

function esc(v) {
  return String(v).replace(/[&<>"']/g, function(c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
