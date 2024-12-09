/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        dark: '#121826',
        darkAlt: '#212936',
        darkAlt2: '#394150',
        white: '#E4E4E7',
        gray: '#6C727F',
        blue: '#4E80EE',
        green: '#5EC269',
        purple: '#7C71FF',
        purpleAlt: '#9D59EF',
        red: '#DD524C',
        orange: '#E87B35'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // default font
      },
      fontSize: {
        heading: '1.25rem', // 20px
        label: '0.875rem', // 14px
        small: '0.75rem', // 12px
      },
    },
  },
  plugins: [],
}
