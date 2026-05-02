import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        university: {
          navy: "#0f204b",
          maroon: "#800000",
          gold: "#d4af37",
          gray: "#f3f4f6",
        }
      },
    },
  },
  plugins: [],
};
export default config;
