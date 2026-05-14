import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#1a3c2e",
        leaf: "#4ade80",
        cream: "#fefce8",
        earth: "#92400e"
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"]
      },
      boxShadow: {
        organic: "0 24px 80px rgba(26, 60, 46, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
