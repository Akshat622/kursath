/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0a2540',
          navy: '#0b3b60',
          gold: '#d4af37',
          yellow: '#f39c12',
          light: '#f8fafc'
        }
      }
    },
  },
  plugins: [],
}
