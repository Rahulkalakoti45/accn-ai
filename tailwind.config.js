/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgSpace: '#0A0F1E',
        bgMidnight: '#0D1426',
        cardSurface: '#111827',
        cardBorder: '#1E2D45',
        accentGreen: '#00FF88',
        accentCyan: '#00D4FF',
        accentPurple: '#7C3AED',
        accentGold: '#F59E0B',
        textPrimary: '#F1F5F9',
        textSecondary: '#94A3B8',
        textMuted: '#475569',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'neon-green': '0 0 15px rgba(0, 255, 136, 0.3)',
        'neon-cyan': '0 0 15px rgba(0, 212, 255, 0.3)',
        'neon-purple': '0 0 15px rgba(124, 58, 237, 0.3)',
        'neon-gold': '0 0 15px rgba(245, 158, 11, 0.3)',
      }
    },
  },
  plugins: [],
}
