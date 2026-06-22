/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050b18',
          900: '#0a1530',
          800: '#0f1f44',
          700: '#162a5c',
          600: '#1f3a78',
          500: '#2c4f9e',
        },
        gold: {
          50: '#fdf8ec',
          100: '#faecc4',
          300: '#e9c873',
          400: '#d9ad4a',
          500: '#c4943a',
          600: '#a3792c',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
