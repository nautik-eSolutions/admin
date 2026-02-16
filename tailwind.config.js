/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // <--- ¡Esta línea es la más importante!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
