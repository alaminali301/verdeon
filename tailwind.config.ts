import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          950: '#071a10',
          900: '#0e3320',
          800: '#1a5c38',
          700: '#237848',
          600: '#2d9459',
          500: '#3aad6b',
          400: '#5ec48a',
          300: '#8fd9a8',
          200: '#bfedcf',
          100: '#e4f8eb',
          50: '#f2fdf5',
        },
        sand: {
          300: '#d4c7b0',
          200: '#e8dfce',
          100: '#f5f0e8',
        },
        charcoal: '#1c1c1e',
        muted: '#6b7a72',
      },
      fontFamily: {
        display: ['var(--font-playfair)'],
        body: ['var(--font-instrument)'],
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '24px',
        xl: '40px',
      },
      boxShadow: {
        card: '0 2px 20px rgba(14,51,32,.08), 0 1px 4px rgba(14,51,32,.05)',
        lift: '0 8px 40px rgba(14,51,32,.14), 0 2px 8px rgba(14,51,32,.07)',
        glow: '0 8px 30px rgba(58,173,107,.35)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulse_dot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.5', transform: 'scale(.85)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        pulse_dot: 'pulse_dot 2s infinite',
      },
    },
  },
  plugins: [],
}

export default config
