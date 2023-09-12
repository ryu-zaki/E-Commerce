/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./build/*.html"],
  theme: {

    screens: {

      'xsm': '520px',

      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },

    colors: {
      'red': '#FF5E54',
      'green': '#29CA3E',
      'yellow': '#FEBD2F',
      'white': '#fff',
      'gray': '#eee',
      'blue': '#0000FF',
      'lightDark': '#222',
      'orange': '#FF7D1A',
      'lightGray': '#aaa',
      'transparent': 'rgba(0,0,0,0.0)'
    },
    extend: {},
  },
  plugins: [],
}

