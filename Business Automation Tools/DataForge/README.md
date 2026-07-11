# DataForge — Data Profiling Dashboard

A polished, single-page data profiling and cleanup dashboard built with **pure HTML, CSS, and Vanilla JavaScript** — no frameworks, no dependencies, no server required.

## 🔍 What it does

Upload a CSV, TSV, or JSON file and DataForge instantly:

- **Profiles every column** — detects data types (numeric, date, text), fill rate, and unique value count
- **Scores data quality** — visual completeness bars per column and an overall quality score
- **Generates an analyst summary** — practical insight on the loaded dataset (demo mode)
- **Previews the data table** — filterable live preview of up to 80 rows
- **Exports a clean CSV** — download the processed table directly from the browser

## 🚀 How to run

No installation needed. Just open the file in any modern browser:

```
Double-click index.html
```

Or click **"Load demo dataset"** to explore without uploading a file.

## 🛠️ Built with

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and layout |
| CSS3 | Styling, grid, animations, dark theme |
| Vanilla JavaScript | FileReader API, CSV/TSV/JSON parsing, DOM rendering |

## 📁 Supported file types

- `.csv` — Comma-separated values
- `.tsv` — Tab-separated values
- `.json` — JSON array of objects

> All processing is done **locally in your browser**. No data is sent to any server.

## 📄 License

MIT License — see root [LICENSE](../LICENSE) for details.
