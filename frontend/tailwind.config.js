/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        chalk: {
          DEFAULT: 'rgb(var(--color-chalk) / <alpha-value>)',
          light: 'rgb(var(--color-chalk-light) / <alpha-value>)',
          dark: 'rgb(var(--color-chalk-dark) / <alpha-value>)',
        },
        highlight: 'rgb(var(--color-highlight) / <alpha-value>)',
        stamp: 'rgb(var(--color-stamp) / <alpha-value>)',
        rule: 'rgb(var(--color-rule) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'ruled-paper':
          'repeating-linear-gradient(to bottom, transparent, transparent 27px, rgb(var(--color-rule)) 28px)',
      },
    },
  },
  plugins: [],
};
