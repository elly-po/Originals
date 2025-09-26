/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif-display': ['Playfair Display', 'serif'],
        'serif-classic': ['Crimson Text', 'serif'],
        'sans-clean': ['Inter', 'sans-serif'],
      },
      colors: {
        oatmeal: {
          50: '#fefdfb',
          100: '#fcf9f4',
          200: '#f9f2e7',
          300: '#f5ebd6',
          400: '#efe0c1',
          500: '#e8d4a8',
          600: '#d9c088',
          700: '#c6a56b',
          800: '#b08c52',
          900: '#8f6f3e',
        },
        charcoal: {
          400: '#6b7280',
          500: '#4b5563',
          600: '#374151',
          700: '#1f2937',
          800: '#111827',
          900: '#0f172a',
        }
      },
      boxShadow: {
        'textural': '2px 4px 12px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.05)',
        'oatmeal': '0 4px 6px -1px rgba(232, 212, 168, 0.3), 0 2px 4px -1px rgba(232, 212, 168, 0.2)',
        'charcoal': '0 8px 25px -5px rgba(31, 41, 55, 0.25), 0 4px 10px -3px rgba(31, 41, 55, 0.15)',
      },
      backgroundImage: {
        'paper-texture': `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
        'fabric-texture': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f5f5f4' fill-opacity='0.06'%3E%3Cpath d='M30 30c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12zm12 0c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'gentle-bounce': 'gentle-bounce 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'stagger-fade': 'stagger-fade 0.8s ease-out forwards',
      },
      keyframes: {
        'gentle-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'stagger-fade': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

