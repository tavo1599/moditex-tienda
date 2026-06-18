/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Tipografía fina para el look premium minimalista
        sans: ['Jost', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Wordmark elegante de la marca (Essential West)
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        // Paleta neutra y sobria (no tradicional, elegante)
        ink: '#111111',
        bone: '#F7F5F2',
        sand: '#EDE9E3',
        clay: '#9A8F82',
      },
      letterSpacing: {
        widest2: '0.25em',
      },
    },
  },
  plugins: [],
}
