import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Design tokens lifted from the vanilla project (index.html CSS variables).
      colors: {
        brand: {
          rose: {
            50:  '#FFFBFB',
            100: '#FEF5F5',
            300: '#F8C3CD',
            500: '#4A0612',
            700: '#770523',
          },
        },
        surface: {
          bg:     '#FFFBFB',
          bubble: 'rgba(49, 0, 13, 0.04)', // user bubble
          card:   '#FFFFFF',
        },
        text: {
          1: '#240F1B',              // Text & Icon / text-1
          2: 'rgba(36, 15, 27, 0.44)', // Text & Icon / text-2 (reference footer)
          muted: '#9B8488',
        },
      },
      fontFamily: {
        // Fallbacks match what the vanilla project uses.
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', 'system-ui', 'sans-serif'],
        aeonik: ['"Aeonik Soft Pro"', '-apple-system', 'system-ui', 'sans-serif'],
        denton: ['Denton', 'serif'],
      },
      fontSize: {
        // Aliases matching design tokens
        body18: ['18px', { lineHeight: '140%', fontWeight: '400' }],
        greet28: ['28px', { lineHeight: '140%', fontWeight: '400' }],
      },
      borderRadius: {
        pill: '296px',
      },
      keyframes: {
        cozySpin: { to: { transform: 'rotate(360deg)' } },
        cozyLightboxFade: { from: { opacity: '0' }, to: { opacity: '1' } },
        cozyDot: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'cozy-spin': 'cozySpin 0.9s linear infinite',
        'lightbox-in': 'cozyLightboxFade 200ms ease',
      },
    },
  },
  plugins: [],
};

export default config;
