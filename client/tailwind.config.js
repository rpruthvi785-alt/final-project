/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-ocean': '#0077b6',
        'primary-sky': '#48cae4',
        'accent-sunset': '#fb8500',
        'accent-forest': '#2d6a4f',
        'dark-slate': '#023047',
        'bg-sand': '#fefae0',
        'bg-beige': '#faedcd',
      },
      fontFamily: {
        sans: ['Urbanist', 'Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3.5rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
