/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        'sidebar-bg': '#0F172A',
        'sidebar-hover': 'rgba(99, 102, 241, 0.1)',
        'text-primary': '#1E293B',
        'text-secondary': '#64748B',
        'bg-color': '#F8FAFC',
        'border-color': '#E2E8F0',
      },
      width: {
        'sidebar': '320px',
      },
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
        '5xl': '2600px',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        '10xl': '104rem',
        '260': '260rem',
      }
    },
  },
  plugins: [],
}