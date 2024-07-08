/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { transform: "translateX(200%)" },
          "100%": { transform: "translateX(0)" },
        },
        hideIn: {
          "0%": { opacity: 0 },
          "100%": { transform: 1 },
        },
      },
      animation: {
        "fade-in": "fadeIn 2s ease-in-out",
        "hide-in": "hideIn 2.5s ease-in",
      },
    },
  },
  plugins: [],
}
