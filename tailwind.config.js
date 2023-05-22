/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        chat: 'url("/src/assets/images/chat-bg.png")',
        arrow: 'url("/src/assets/images/background-blue.jpg")',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
