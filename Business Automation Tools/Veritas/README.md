# Veritas — Content Quality Analyzer

A polished, single-page editorial quality dashboard built with **pure HTML, CSS, and Vanilla JavaScript** — no API, no server, no dependencies.

## 🔍 What it does

Paste any text content and Veritas scores it across four quality dimensions using a local analysis engine:

| Dimension | What it measures |
|---|---|
| **Clarity** | Average sentence length and structural simplicity |
| **Credibility** | Detection of absolute/hype language (always, guaranteed, revolutionary) |
| **Tone** | Professional register and avoidance of aggressive casing |
| **Actionability** | Presence of active verbs and clear next steps |

It then generates:
- **An overall score** — displayed as an animated ring chart (0–100)
- **Key findings** — specific editorial observations and recommendations
- **A rewrite** — a cleaned-up version of your content with a suggested closing line
- **A brief** — a concise strategic summary of the content's strengths and gaps
- **An exportable report** — download a `.txt` file of the full analysis

## 🚀 How to run

No installation needed. Just open the file in any modern browser:

```
Double-click index.html
```

Then paste your content or click **"Load sample"** to try the built-in demo text.

## 🛠️ Built with

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantic layout |
| CSS3 | Dark theme, conic gradient ring chart, tab system, animations |
| Vanilla JavaScript | Regex-based text scoring, tab switching, Blob export |

> All analysis is performed **entirely locally in your browser**. No text is sent to any server or external service.

## 📄 License

MIT License — see root [LICENSE](../LICENSE) for details.
