/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'violet': '#6E3CA3',
      'red': '#A82828',
      'blanc': '#ffffffff',
      'jsp': '#282828',
    }
  },
  plugins: [],
};