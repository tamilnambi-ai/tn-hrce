import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#FDF0F0',
          100: '#FAD5D5',
          500: '#8B1A1A',
          600: '#6E1414',
          700: '#521010',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'hero-search': '0 2px 8px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.12)',
        'dropdown':    '0 4px 6px -1px rgba(0,0,0,0.06), 0 10px 30px rgba(0,0,0,0.10)',
        'pill-hover':  '0 2px 4px rgba(0,0,0,0.18)',
      },
      keyframes: {
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      animation: {
        slideDown: 'slideDown 0.18s ease-out',
        fadeIn:    'fadeIn 0.25s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
