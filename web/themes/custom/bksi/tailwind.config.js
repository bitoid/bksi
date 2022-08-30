/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./js/**/*.js",
    "./**/*.twig",
    "../../../modules/custom/**/*.twig",
  ],
  theme: {
    screens: {
      'md': '890px',
      'lg': '1100px',
      'xl': '1366px',
    },
    extend: {
      colors: {
        'mainBlack': '#191428',
        'mainRed': '#E63229',
        'lightGray': '#F3F3F4',
        'midGray': '#E2E2E2',
        'darkGrey': '#E4E4E4',
        'darkRed': '#E43229',
        'mainOrange': '#ED4900',
        'darkBlue': '#191428',
      },
      keyframes: {
        displayTransition: {
          '0%': { opacity: '0', display: 'none' },
          '1%': { opacity: '0', display: 'flex' },
          '100%': { opacity: '1', display: 'flex' },
        },
      },
      animation: {
        'navDropown': 'displayTransition .3s ease-out',
      },
    },
    variants:{
      extend: {
        animation: ['group-hover'],
      },
    },
    plugins: [
      require("tailwindcss-hyphens")
    ],
  }
}
