/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F9F5F0',
          primary: '#E8622A',
          secondary: '#2D6A4F',
          accent: '#F4A261',
          text: '#1A1A1A',
          muted: '#6B6B6B',
          card: '#FFFFFF',
          border: '#E5DDD4',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
