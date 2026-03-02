const THEME_STORAGE_KEY = "theme";

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch (_) {}
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  if (theme !== "light" && theme !== "dark") return;
  document.documentElement.setAttribute("data-theme", theme);
}

function updateThemeButton(button, theme) {
  if (!button) return;
  button.setAttribute("data-theme", theme);
  button.setAttribute("aria-pressed", String(theme === "dark"));
  const nextTheme = theme === "dark" ? "light" : "dark";
  button.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
  button.setAttribute("title", `Switch to ${nextTheme} mode`);
}

function initThemeToggle(mount) {
  const button = mount.querySelector("#theme-toggle");
  if (!button) return;

  let theme = getInitialTheme();
  applyTheme(theme);
  updateThemeButton(button, theme);

  button.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    updateThemeButton(button, theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (_) {}
  });
}

applyTheme(getInitialTheme());

function initPublicationCards() {
  const toggles = document.querySelectorAll(".pub-abstract-toggle");
  for (const button of toggles) {
    const card = button.closest(".pub-collapsible");
    if (!card) continue;

    button.addEventListener("click", () => {
      const expanded = card.getAttribute("data-expanded") === "true";
      const next = !expanded;
      card.setAttribute("data-expanded", String(next));
      button.setAttribute("aria-expanded", String(next));
    });
  }
}

function initLastUpdated() {
  const nodes = document.querySelectorAll(".last-updated");
  if (!nodes.length) return;

  const parsed = new Date(document.lastModified);
  if (Number.isNaN(parsed.getTime())) return;

  const formatted = parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  for (const node of nodes) {
    node.textContent = formatted;
  }
}

async function injectNav() {
  const mount = document.getElementById("nav-mount");
  if (!mount) return;

  // Use absolute path so it works from subfolders on GitHub Pages.
  const resp = await fetch("/partials/nav.html?v=" + Date.now(), { cache: "no-store" });;
  if (!resp.ok) {
    mount.innerHTML = "<div class='container small'>Nav failed to load.</div>";
    return;
  }
  mount.innerHTML = await resp.text();
  initThemeToggle(mount);

  // Mobile toggle
  const toggle = mount.querySelector(".nav-toggle");
  const links = mount.querySelector("#nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Mark active link
  const path = window.location.pathname.replace(/index\.html$/, "");
  const anchors = Array.from(mount.querySelectorAll(".nav-links a"));
  for (const a of anchors) {
    const href = a.getAttribute("href");
    if (!href) continue;
    // Treat "/" specially
    const normalizedHref = href.endsWith("/") ? href : href + "/";
    const normalizedPath = path.endsWith("/") ? path : path + "/";
    if (normalizedHref === "/" && normalizedPath === "/") {
      a.setAttribute("aria-current", "page");
    } else if (normalizedHref !== "/" && normalizedPath.startsWith(normalizedHref)) {
      a.setAttribute("aria-current", "page");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  injectNav();
  initPublicationCards();
  initLastUpdated();
});
