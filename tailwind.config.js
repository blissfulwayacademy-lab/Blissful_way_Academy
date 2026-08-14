/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Georgia removed: zero coverage of Igbo dotted vowels, so it could only
        // ever delay resolution. Constantia and Palatino stay out for the same
        // reason in reverse — they cover ị ọ ụ but not Ṅ, which would split a
        // single word across three faces.
        serif: ['"Gentium Book Plus"', 'ui-serif', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
