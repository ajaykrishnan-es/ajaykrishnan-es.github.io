# Ajay site scaffold (original)

This is a minimal multi-page academic website scaffold designed for GitHub Pages.

## Structure
- `index.html` — home
- `research/`, `publications/`, `teaching/`, `cv/`, `contact/` — section pages
- `partials/nav.html` — shared navbar injected via `js/main.js`
- `css/style.css` — site styles

## Local preview
From the repo root:
```bash
python3 -m http.server 8000
```
Open http://localhost:8000

## GitHub Pages
- If repo is `<username>.github.io`, it will deploy from root automatically.
- Otherwise: Settings → Pages → Deploy from branch → select `main` and `/ (root)`.
