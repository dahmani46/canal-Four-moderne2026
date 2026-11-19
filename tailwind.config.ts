import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bordeaux: {
          DEFAULT: "#5C1A26",
          dark: "#3E0F18",
          light: "#7A2636",
        },
        cream: {
          DEFAULT: "#FBF4E9",
          dark: "#F3E6D3",
        },
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E2C784",
          dark: "#A9833A",
        },
        ink: "#2A1A14",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(60, 20, 20, 0.25)",
        page: "0 20px 60px -15px rgba(40, 10, 15, 0.45)",
      },
      perspective: {
        book: "2400px",
      },
    },
  },
  plugins: [],
};

export default config;
