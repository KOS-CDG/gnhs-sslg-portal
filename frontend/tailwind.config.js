/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E91E8C',
          50:  '#fce4f3',
          100: '#f9b8e1',
          200: '#f587cc',
          300: '#f155b8',
          400: '#ee2ca5',
          500: '#E91E8C',
          600: '#c7177a',
          700: '#a41065',
          800: '#820a50',
          900: '#60053c',
        },
        secondary: {
          DEFAULT: '#C0392B',
          50:  '#fbeaea',
          100: '#f5c5c2',
          200: '#ee9f9a',
          300: '#e87a72',
          400: '#e1544a',
          500: '#C0392B',
          600: '#a33024',
          700: '#87271e',
          800: '#6a1e17',
          900: '#4e1511',
        },
        accent: '#FFFFFF',
      },
      fontFamily: {
        heading: ['"Times New Roman"', 'Georgia', 'serif'],
        body: ['Inter', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
}
