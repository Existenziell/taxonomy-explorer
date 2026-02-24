import type { Config } from 'tailwindcss'

export default {
  mode: 'jit',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Gotu', 'Arial', 'sans-serif'],
      },
      colors: {
        accent: 'var(--color-accent)',
        'accent-dark': 'var(--color-accent-dark)',
        cta: 'var(--color-cta)',
        grey: 'var(--color-grey)',
        'grey-dark': 'var(--color-grey-dark)',
        level: {
          1: 'var(--color-level-1)',
          2: 'var(--color-level-2)',
          3: 'var(--color-level-3)',
          4: 'var(--color-level-4)',
          5: 'var(--color-level-5)',
          6: 'var(--color-level-6)',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
} satisfies Config
