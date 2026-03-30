/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tomato: {
          50: "#F7F1EF",
          100: "#F0E3DE",
          300: "#D2B3A8",
          500: "#B78275",
          600: "#9E6B60"
        },
        leaf: {
          300: "#C8D4C8",
          500: "#829884",
          600: "#5F7363"
        },
        warm: {
          bg: "#F6F3EC",
          card: "#FBF9F4",
          text: "#3E3934",
          border: "#DAD3C8"
        }
      },
      boxShadow: {
        soft: "0 8px 26px rgba(62, 57, 52, 0.07)"
      }
    }
  },
  plugins: [],
};
