/** @type {import('tailwindcss').Config} */
import { heroui } from "@heroui/react";
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(drawer|modal).js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
