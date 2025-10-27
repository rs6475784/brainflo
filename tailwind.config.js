/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pure black and white only
        'bg-primary': '#f5f5f5',
        'bg-card': '#ffffff',
        'bg-input': '#fafafa',
        'bg-hover': '#f0f0f0',
        'text-primary': '#000000',
        'text-secondary': '#6b6b6b',
        'text-muted': '#737373',
        'border-primary': '#e5e5e5',
        'border-hover': '#d4d4d4',
        'btn-primary-bg': '#000000',
        'btn-primary-text': '#ffffff',
        'btn-secondary-bg': '#ffffff',
        'btn-secondary-border': '#d4d4d4',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'xs': '11px',
        'sm': '13px',
        'base': '14px',
        'lg': '16px',
        'xl': '18px',
        '2xl': '24px',
        '3xl': '28px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '30px',
        '2xl': '40px',
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.04)',
        'md': '0 2px 8px rgba(0,0,0,0.04)',
        'lg': '0 4px 12px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}
