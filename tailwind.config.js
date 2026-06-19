/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        dtube: {
          bg: '#0f0f23',
          card: '#1a1a2e',
          accent: '#e94560',
          text: '#eaeaea',
          muted: '#aaa',
        },
      },
    },
  },
  plugins: [],
}
