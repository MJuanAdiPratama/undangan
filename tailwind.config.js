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
        earth: {
          beige: '#FDFBF7',
          'beige-soft': '#F7F3EB',
          'beige-dark': '#EBE3DA',
          sage: '#8A9A86',
          'sage-dark': '#5D6E59',
          'sage-light': '#DCE3DA',
          charcoal: '#2C3E35',
          'charcoal-deep': '#1D2A24',
          gold: '#D4AF37',
          'gold-light': '#F3E5AB',
          'gold-dark': '#B58D23',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Playfair Display', 'serif'],
        sans: ['var(--font-jakarta)', 'sans-serif'],
        script: ['var(--font-alex)', 'cursive'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(44, 62, 53, 0.06)',
        'card': '0 10px 40px -10px rgba(44, 62, 53, 0.08)',
        'elevated': '0 20px 50px -12px rgba(44, 62, 53, 0.14)',
      },
    },
  },
  plugins: [],
};
