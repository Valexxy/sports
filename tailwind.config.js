/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Shared Tokens
        void: '#05070B',
        panel: '#0E131F',
        stadiumGreen: '#00FF87',
        cyberPurple: '#8B5CF6',
        gold: '#FFD700',
        crimson: '#FF2E55',
        
        // User Theme Tokens
        neonGreen: '#00E676',
        neonPurple: '#A855F7',
        neonCyan: '#00F0FF',
        surfaceUser: '#07080B',
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        
        // Admin Theme Tokens (High Density & PAM)
        surfaceAdmin: '#08090C',
        adminPanel: '#0F1117',
        adminBorder: 'rgba(255, 255, 255, 0.12)',
        destructive: '#FF3366',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
