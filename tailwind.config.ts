import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        journal: {
          ink: "hsl(var(--journal-ink))",
          paper: "hsl(var(--journal-paper))",
          line: "hsl(var(--journal-line))",
          red: "hsl(var(--journal-red))",
          gold: "hsl(var(--journal-gold))",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-source-serif)", "ui-serif", "Georgia", "serif"],
        display: ["var(--font-playfair)", "ui-serif", "Georgia", "serif"],
      },
      backgroundImage: {
        "journal-glow":
          "radial-gradient(circle at top left, rgba(120, 26, 38, 0.16), transparent 34%), radial-gradient(circle at bottom right, rgba(141, 106, 45, 0.12), transparent 28%)",
        "journal-grid":
          "linear-gradient(to right, rgba(38, 30, 29, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(38, 30, 29, 0.08) 1px, transparent 1px)",
      },
      boxShadow: {
        editorial: "0 20px 60px rgba(24, 20, 19, 0.08)",
      },
      maxWidth: {
        prose: "72ch",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "line-grow": {
          "0%": { transform: "scaleX(0)", transformOrigin: "left" },
          "100%": { transform: "scaleX(1)", transformOrigin: "left" },
        },
      },
      animation: {
        "fade-up": "fade-up 700ms ease-out both",
        "line-grow": "line-grow 900ms ease-out both",
      },
    },
  },
  plugins: [typography, animate],
};
export default config;
