import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brown_bg: "#f6eee4", // 전체 배경
        brown_card: "#f0e0d3", // 카드
        brown_text: "#5e4633", // 기본 텍스트
        brown_accent: "#cd9e6d", // 버튼/강조
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      "dark",
      {
        sweethome: {
          primary: "#cd9e6d",
          secondary: "#f0e0d3",
          accent: "#dfb693",
          neutral: "#5e4633",
          "base-100": "#f6eee4",
          info: "#f5e6d3",
          success: "#b7c37f",
          warning: "#8d6b47ff",
          error: "#d0614b",
        },
      },
    ],
  },
};
