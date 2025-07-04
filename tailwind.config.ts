import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      colors: {
        primary: '#4f46e5',
        background: '#f9fafb',
        surface: '#ffffff',
      },
      animation: {
        fade: 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: []
}

export default config
