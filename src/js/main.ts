import "../css/main.css";

/* ============================================================
   Theme toggle (light / dark / auto)
   ============================================================ */

type Scheme = "light" | "dark" | "auto";

const STORAGE_KEY = "yema-theme";

function getSavedScheme(): Scheme {
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === "light" || v === "dark" || v === "auto") return v;
  const def = document.documentElement.dataset.defaultScheme;
  return def === "light" || def === "dark" || def === "auto" ? def : "auto";
}

function prefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyScheme(scheme: Scheme) {
  const dark = scheme === "dark" || (scheme === "auto" && prefersDark());
  document.documentElement.classList.toggle("dark", dark);
  updateToggleIcon(dark);
}

function updateToggleIcon(dark: boolean) {
  const light = document.querySelector<HTMLElement>(".theme-icon-light");
  const night = document.querySelector<HTMLElement>(".theme-icon-dark");
  if (!light || !night) return;
  light.classList.toggle("hidden", !dark);
  night.classList.toggle("hidden", dark);
}

function initThemeToggle() {
  applyScheme(getSavedScheme());

  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const currentDark = document.documentElement.classList.contains("dark");
    const next: Scheme = currentDark ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyScheme(next);
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (getSavedScheme() === "auto") applyScheme("auto");
    });
}

function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
}

function initScrollReveal() {
  const items = document.querySelectorAll<HTMLElement>(".reveal");
  if (items.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const delay = parseInt(el.dataset.revealDelay ?? "0", 10);
          setTimeout(() => el.classList.add("is-visible"), delay);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initMobileMenu();
  initScrollReveal();
});
