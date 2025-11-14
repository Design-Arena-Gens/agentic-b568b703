import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#f1f6ff",
          100: "#e0ecff",
          200: "#bed7ff",
          300: "#94baff",
          400: "#6691ff",
          500: "#4167ff",
          600: "#2341ff",
          700: "#1b33d6",
          800: "#1629a8",
          900: "#152788"
        }
      }
    }
  },
  plugins: []
};

export default config;
