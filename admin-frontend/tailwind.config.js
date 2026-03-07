/***************************************************
 * Tailwind configuration for JALSANKALP Admin UI
 ***************************************************/
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#1e3a8a',
        secondary: '#0f766e',
        accent: '#38bdf8',
        surface: '#ffffff',
        muted: '#e5e7eb',
        ink: '#1f2937',
      },
      boxShadow: {
        card: '0 8px 30px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
