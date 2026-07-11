# PaperLift — PDF Table Extraction Interface

A focused, single-page PDF table extraction workspace built with **pure HTML, CSS, and Vanilla JavaScript** — no server, no dependencies, no API keys required.

## 🔍 What it does

Upload a PDF (or run the built-in demo) and PaperLift:

- **Simulates extraction steps** — animated progress pipeline showing Reading → Finding table grids → Normalizing cells → Preparing exports
- **Detects multiple tables** — renders a selectable list of extracted tables with confidence scores
- **Previews each table** — full row/column preview with extraction confidence percentage
- **Exports clean data** — download any individual table as CSV or all tables as a combined JSON file

## 🚀 How to run

No installation needed. Just open the file in any modern browser:

```
Double-click index.html
```

Then click **"Run demo document"** to see a fully simulated extraction from an annual report.

## 🛠️ Built with

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantic layout |
| CSS3 | Styling, dark theme, grid, step animations |
| Vanilla JavaScript | DOM rendering, CSV/JSON export, Blob API |

## 📁 Demo data

The demo simulates extraction from `Annual_Report_2026.pdf` and returns 3 structured tables:

| Table | Rows | Confidence |
|---|---|---|
| Revenue by Region | 4 rows | 97% |
| Operating Metrics | 4 rows | 94% |
| Customer Segments | 3 rows | 91% |

> All processing is done **locally in your browser**. No data is sent to any server.

## 📄 License

MIT License — see root [LICENSE](../LICENSE) for details.
