const THEME_STORAGE_KEY = "theme";
const GA_MEASUREMENT_ID = "G-HHE09EM7PN";

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
  const cards = document.querySelectorAll(".pub-collapsible");
  const syncAbstractHeight = (card) => {
    const abstract = card.querySelector(".pub-abstract");
    if (!abstract) return;

    const expanded = card.getAttribute("data-expanded") === "true";
    if (!expanded) {
      abstract.style.maxHeight = "0px";
      return;
    }

    requestAnimationFrame(() => {
      abstract.style.maxHeight = `${abstract.scrollHeight}px`;
    });
  };

  for (const button of toggles) {
    const card = button.closest(".pub-collapsible");
    if (!card) continue;

    syncAbstractHeight(card);

    button.addEventListener("click", () => {
      const expanded = card.getAttribute("data-expanded") === "true";
      const next = !expanded;
      card.setAttribute("data-expanded", String(next));
      button.setAttribute("aria-expanded", String(next));
      syncAbstractHeight(card);
    });
  }

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => {
      for (const card of cards) {
        syncAbstractHeight(card);
      }
    });

    for (const card of cards) {
      const abstract = card.querySelector(".pub-abstract");
      if (abstract) observer.observe(abstract);
    }
  }

  window.addEventListener("resize", () => {
    for (const card of cards) {
      syncAbstractHeight(card);
    }
  });
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

function initAnalytics() {
  const id = GA_MEASUREMENT_ID.trim();
  if (!/^G-[A-Z0-9]+$/.test(id)) return;
  if (window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
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
  const backdrop = mount.querySelector(".nav-backdrop");
  if (toggle && links && backdrop) {
    const setNavOpen = (isOpen) => {
      links.classList.toggle("open", isOpen);
      backdrop.classList.toggle("open", isOpen);
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
      document.body.classList.toggle("nav-open", isOpen);
    };

    toggle.addEventListener("click", () => {
      setNavOpen(!links.classList.contains("open"));
    });

    backdrop.addEventListener("click", () => {
      setNavOpen(false);
    });

    const navAnchors = Array.from(links.querySelectorAll("a"));
    for (const anchor of navAnchors) {
      anchor.addEventListener("click", () => {
        setNavOpen(false);
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setNavOpen(false);
      }
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
  initAnalytics();
  injectNav();
  initPublicationCards();
  initLastUpdated();
});
