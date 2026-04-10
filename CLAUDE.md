# Instructions for AI Assistants

## Sitemap — update on every session that modifies content

`sitemap.xml` must be kept in sync with the site. **Whenever you modify any HTML page in this project, update `sitemap.xml` before finishing** — no need to ask, just do it.

Rules:
- Set `<lastmod>` to today's date (ISO 8601: `YYYY-MM-DD`) for every page you touched.
- If a new top-level page is added (new folder with an `index.html`), add a `<url>` block for it.
- If a page is removed, delete its `<url>` block.
- Do not add entries for `404.html`, `about-this-website/`, or any non-content pages.
- Keep `priority` consistent with existing entries (homepage = 1.0, publications = 0.9, cv = 0.7, misc = 0.6, contact = 0.5).
