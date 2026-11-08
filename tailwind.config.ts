import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#151513",
        card: "#24241F",
        accent: {
          DEFAULT: "#D6A86C",
          hover: "#E4C294",
          dark: "#B3884D",
          dim: "rgba(214, 168, 108, 0.15)",
        },
        primaryText: "#F5F0E8",
        secondaryText: "#A9A49A",
        surface: {
          subtle: "#1C1C18",
          DEFAULT: "#24241F",
          elevated: "#2D2D26",
          border: "rgba(214, 168, 108, 0.2)",
          borderHover: "rgba(214, 168, 108, 0.45)",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Playfair Display", "Didot", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        gold: "0 0 25px -5px rgba(214, 168, 108, 0.25)",
        goldGlow: "0 0 35px -5px rgba(214, 168, 108, 0.35)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;

