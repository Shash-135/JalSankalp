/***************************************************
 * Tailwind configuration for JALSANKALP Villager UI
 ***************************************************/
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary:   '#1a3a8f',
        secondary: '#ea580c',
        success:   '#059669',
        warning:   '#d97706',
        surface:   '#ffffff',
        bg:        '#eef2ff',
        ink:       '#0f172a',
        muted:     '#64748b',
      },
      boxShadow: {
        card:  '0 2px 12px rgba(26,58,143,0.08)',
        lift:  '0 8px 24px rgba(26,58,143,0.14)',
        inner: 'inset 0 2px 6px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease both',
        'slide-up':   'slideUp 0.35s cubic-bezier(.16,1,.3,1) both',
        'pulse-ring':  'pulseRing 2s ease-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 },              to: { opacity: 1 } },
        slideUp:   { from: { transform: 'translateY(16px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        pulseRing: { '0%': { transform: 'scale(1)', opacity: 0.7 }, '100%': { transform: 'scale(1.5)', opacity: 0 } },
      },
    },
  },
  plugins: [],
};
