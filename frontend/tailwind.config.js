import flowbitePlugin from "flowbite/plugin";
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: {} },
    extend: {
      screen: {
        'xs': '480px',
      },
    },
  plugins: [flowbitePlugin],
};
