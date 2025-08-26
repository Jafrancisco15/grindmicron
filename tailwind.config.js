/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#F4D03F",
          gray: "#111214",
          accent: "#FFD54D"
        }
      }
    },
  },
  plugins: [],
};