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
        beige: {
          100: '#F5F5DC', // Light beige
          200: '#E8E8D0', // Darker beige
        },
        roseGold: {
          400: '#D4AF37', // Slightly goldish for variety
          500: '#B76E79', // Base Rose Gold
          600: '#A05C66', // Darker Rose Gold
        }
      },
    },
  },
  plugins: [],
};
export default config;
