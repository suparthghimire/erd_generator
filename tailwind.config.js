/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'translateX(-3px);' },
          '50%': { transform: 'translateX(3px)' },
        }
      }
    },
    
  },
  
  plugins: [ 
  ],
  darkMode:"class"
}