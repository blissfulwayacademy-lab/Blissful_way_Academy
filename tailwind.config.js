/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      /**
       * Semantic colours. Components name the role, not the swatch, so the
       * dark/light split below is a property of this file rather than of
       * ninety scattered `amber-400`s.
       *
       * The one rule that matters: `gold` is for DARK grounds and `gold-deep`
       * is for LIGHT ones. They are not interchangeable — `gold` on `cream`
       * measures 2.24:1, which is unreadable.
       */
      colors: {
        ink: {
          DEFAULT: '#0B0B0C', // dark section ground (hero, footer, header)
          raised: '#141416', // raised surfaces on dark
          text: '#1C1B19', // body text on cream — 15.97:1
          muted: '#5A5751', // secondary text on cream — 6.68:1
        },
        cream: {
          DEFAULT: '#FAF6EE', // light section ground — warm, not clinical white
          alt: '#F3EDE1', // subtle alternate light surface / raised cards
        },
        /**
         * Spec called for #8A6D1F. Measured, that lands at 4.20:1 on `cream-alt`
         * (below the 4.5:1 floor) and 4.54:1 on `cream` — passing by 0.04, too
         * thin to survive any later surface tweak. Darkened 10% at identical
         * hue: now 4.97:1 on `cream-alt` and 5.38:1 on `cream`.
         */
        gold: {
          DEFAULT: '#C9A227', // accents on DARK grounds — 8.13:1 on ink
          deep: '#7C621C', // accents on LIGHT grounds
        },
        bone: {
          DEFAULT: '#F5F2EA', // body text on dark — 17.59:1 on ink
          muted: '#A8A29A', // secondary text on dark — 7.78:1 on ink
        },
        moss: '#2F4F3A', // deep green secondary — carries bone at 8.16:1

        /**
         * Both of the following are DARK-GROUND ONLY — they exist for the
         * booking modal and the classroom panel, which stay dark. Neither has a
         * light-ground counterpart yet, so do not use them on cream.
         */
        danger: {
          DEFAULT: '#F0A99C', // alert body text — 9.51:1 on ink-raised
          strong: '#FBDDD6', // alert heading — 12.04:1 on the alert's own tint
        },
        /**
         * The light counterpart of `moss`: hue 141.3 against moss's 140.6, so
         * the "live" dot and the tutor tiles read as one green rather than two.
         * Replaces emerald-300/400, which was a cyan-leaning green at odds with
         * everything else on the page.
         */
        live: '#9CC9AC',
      },
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
