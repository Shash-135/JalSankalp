/***************************************************
 * Tailwind configuration for JANSANKALP Villager UI
 ***************************************************/
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#2563eb',
        secondary: '#0f766e',
        surface: '#ffffff',
        bg: '#f3f4f6',
        ink: '#111827',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
