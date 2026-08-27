/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        flag: {
          green: {
            light: '#2ECC71',
            DEFAULT: '#007A33', // Official-like Forest Green
            dark: '#005E28',
          },
          yellow: {
            light: '#FEE180',
            DEFAULT: '#FCD116', // Golden Yellow
            dark: '#C8A200',
          },
          red: {
            light: '#E74C3C',
            DEFAULT: '#CE1126', // Deep Crimson Red
            dark: '#9E0B1A',
          },
        },
        brand: {
          primary: '#007A33',
          secondary: '#FCD116',
          accent: '#CE1126',
          dark: '#121824',
          light: '#F8F9FA',
          slate: '#4A5568',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}
