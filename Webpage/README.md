# ajaykrishnan-es.github.io

Personal academic website for Ajaykrishnan E S, PhD student in Computer Science at UC Santa Barbara.

## Pages

- `index.html` — home: bio, research interests, and profile links (arXiv, Google Scholar, ORCID, DBLP, email)
- `publications/` — list of papers with expandable abstracts, venue, and links to paper/slides
- `service-and-recognition/` — academic service and awards
- `cv/` — link to CV PDF
- `contact/` — contact information
- `about-this-website/` — note on how the site was built

## Structure

```
css/
  tokens.css       — design tokens (colors, font, theme variables)
  base.css         — global element styles
  nav.css          — navigation bar
  publications.css — publication list and abstract toggle
  mobile.css       — responsive overrides
  main.css         — page-level layout
  style.css        — entry point that imports all of the above
js/
  main.js          — nav injection, theme toggle, publication card toggle
partials/
  nav.html         — shared navbar, fetched and injected at runtime
fonts/             — self-hosted Crimson Pro (used) and EB Garamond (unused)
academicons/       — icon font for academic profile links
slides/            — talk slides (PDF)
cv/                — CV PDF goes here
sitemap.xml        — for Google Search Console
robots.txt         — points crawlers to sitemap
```

## Local preview

```bash
python3 -m http.server 8000
```

Open http://localhost:8000

## Deployment

Hosted on GitHub Pages at https://ajaykrishnan-es.github.io.  
Settings → Pages → Deploy from branch → `main`, `/ (root)`.
