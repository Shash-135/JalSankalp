/***************************************************
 * Tailwind configuration for JALSANKALP Villager UI
 ***************************************************/
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Roboto"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#1e3a8a',    // Government Navy Blue
        secondary: '#ea580c',  // Saffron/Orange Accent
        surface: '#ffffff',
        bg: '#f8fafc',         // Crisp off-white/gray
        ink: '#0f172a',        // Deep Slate text
      },
      boxShadow: {
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Sharper, standard structural shadow
      },
    },
  },
  plugins: [],
};
