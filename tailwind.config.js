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
        // iOS-Native Dark Mode System Colors
        void: '#000000',
        panel: '#1C1C1E',
        surface: '#2C2C2E',
        elevated: '#3A3A3C',
        
        // Brand Accent Colors
        stadiumGreen: '#30D158',  // iOS system green
        cyberPurple: '#BF5AF2',  // iOS system purple
        gold: '#FFD60A',         // iOS system yellow
        crimson: '#FF375F',      // iOS system red/pink
        
        // Extended iOS Palette
        neonGreen: '#30D158',
        neonPurple: '#BF5AF2',
        neonCyan: '#64D2FF',     // iOS system cyan
        iosBlue: '#0A84FF',      // iOS system blue
        iosOrange: '#FF9F0A',    // iOS system orange
        iosTeal: '#40C8E0',      // iOS system teal
        iosIndigo: '#5E5CE6',    // iOS system indigo
        
        // Surface tokens
        surfaceUser: '#000000',
        glassBorder: 'rgba(255, 255, 255, 0.06)',
        
        // Admin Theme Tokens
        surfaceAdmin: '#000000',
        adminPanel: '#1C1C1E',
        adminBorder: 'rgba(255, 255, 255, 0.08)',
        destructive: '#FF375F',
        warning: '#FF9F0A',

        // iOS Grouped Background
        iosGroupedBg: '#1C1C1E',
        iosGroupedBgElevated: '#2C2C2E',
        iosLabel: 'rgba(235, 235, 245, 1)',
        iosSecondaryLabel: 'rgba(235, 235, 245, 0.6)',
        iosTertiaryLabel: 'rgba(235, 235, 245, 0.3)',
        iosSeparator: 'rgba(84, 84, 88, 0.65)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'ios': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
        'ios-2xl': '24px',
        'ios-card': '13px',
      },
      boxShadow: {
        'ios': '0 1px 3px rgba(0, 0, 0, 0.3), inset 0 0.5px 0 rgba(255, 255, 255, 0.04)',
        'ios-elevated': '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 0.5px rgba(255, 255, 255, 0.05)',
        'ios-float': '0 16px 48px rgba(0, 0, 0, 0.6)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
    },
  },
  plugins: [],
}
