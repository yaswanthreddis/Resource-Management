/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      colors: {
        primary : '#4169e1',
        secondary: '#eee',
      },

      width : {
        97  : '30rem',
        100 : '35rem',
        110 : '40rem',
      },

      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

