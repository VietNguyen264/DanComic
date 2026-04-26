import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#dc2626', // Red-600
        'dark-bg': '#111827', // Gray-900
        'dark-card': '#1f2937', // Gray-800
        'light-bg': '#ffffff',
        'light-card': '#f3f4f6', // Gray-100
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      boxShadow: {
        'hover': '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
