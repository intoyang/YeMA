/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{html,ts,js}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        surface2: "var(--surface2)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        border: "var(--border)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        tertiary: "var(--tertiary)",
        neutral: "var(--neutral)",
        // footer 深色永远
        "footer-bg": "var(--footer-bg)",
        "footer-text": "var(--footer-text)",
        "footer-text-muted": "var(--footer-text-muted)",
        "footer-border": "var(--footer-border)",
      },
      fontFamily: {
        serif: ["Newsreader", "LXGW WenKai", "Georgia", "serif"],
        sans: ["Inter", "LXGW WenKai", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["64px", { lineHeight: "1.10", fontWeight: "500" }],
        section: ["52px", { lineHeight: "1.20", fontWeight: "500" }],
        "h-lg": ["36px", { lineHeight: "1.30", fontWeight: "500" }],
        "h-md": ["32px", { lineHeight: "1.10", fontWeight: "500" }],
        "body-e": ["17px", { lineHeight: "1.60", fontWeight: "400" }],
        "body-lg": ["20px", { lineHeight: "1.60", fontWeight: "400" }],
        body: ["16px", { lineHeight: "1.50", fontWeight: "400" }],
        label: [
          "12px",
          { lineHeight: "1.30", letterSpacing: "0.12px", fontWeight: "500" },
        ],
        overline: [
          "10px",
          { lineHeight: "1.60", letterSpacing: "0.5px", fontWeight: "400" },
        ],
      },
      spacing: {
        "section-v": "100px",
        "card-p": "24px",
      },
      maxWidth: {
        "layout": "1200px",
        "reading": "720px",
      },
      boxShadow: {
        ring: "rgba(0,0,0,0.05) 0px 4px 24px",
        "ring-warm": "0 0 0 1px var(--border)",
      },
    },
  },
  plugins: [],
};
