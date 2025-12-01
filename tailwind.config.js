import daisyui from "daisyui";
import themes from "daisyui/src/colors/themes.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...themes["[data-theme=light]"],
          "input-bg": "transparent",  // 기본 배경 제거
          "input-text": "#000000",    // 글자색은 검정
        },
      },
    ],
  },
}