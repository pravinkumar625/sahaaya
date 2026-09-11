/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          teal: '#00F5D4',
          violet: '#7C3AED',
          glow: 'rgba(0,245,212,0.15)',
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.04)',
          border: 'rgba(0,245,212,0.12)',
          hover: 'rgba(255,255,255,0.07)',
        },
        severity: {
          critical: '#FF4D6D',
          high: '#FF9F1C',
          medium: '#00F5D4',
          low: '#7C3AED',
        },
        dark: {
          900: '#050812',
          800: '#080F1E',
          700: '#0D1628',
          600: '#131F35',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #00F5D4, #7C3AED)',
        'accent-gradient-r': 'linear-gradient(135deg, #7C3AED, #00F5D4)',
        'glow-teal': 'radial-gradient(circle, rgba(0,245,212,0.15) 0%, transparent 70%)',
        'glow-violet': 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-teal': '0 0 30px rgba(0,245,212,0.3)',
        'glow-violet': '0 0 30px rgba(124,58,237,0.3)',
        'glow-sm': '0 0 15px rgba(0,245,212,0.2)',
        glass: '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'glitch': 'glitch 0.4s ease-in-out infinite',
        'glitch-2': 'glitch2 0.35s ease-in-out infinite',
        'ripple': 'ripple 2.5s linear infinite',
        'ripple-2': 'ripple 2.5s linear infinite 0.8s',
        'ripple-3': 'ripple 2.5s linear infinite 1.6s',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'pulse-border': 'pulseBorder 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'slide-in': 'slideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0, 0) skew(0deg)', filter: 'hue-rotate(0deg)' },
          '20%': { transform: 'translate(-3px, 1px) skew(0.5deg)', filter: 'hue-rotate(90deg)' },
          '40%': { transform: 'translate(3px, -2px) skew(-0.5deg)', filter: 'hue-rotate(180deg)' },
          '60%': { transform: 'translate(-1px, 3px) skew(0.3deg)', filter: 'hue-rotate(270deg)' },
          '80%': { transform: 'translate(2px, -1px) skew(-0.3deg)', filter: 'hue-rotate(45deg)' },
        },
        glitch2: {
          '0%, 100%': { clipPath: 'inset(0 0 0 0)', transform: 'translate(0)' },
          '25%': { clipPath: 'inset(30% 0 40% 0)', transform: 'translate(-4px, 0)' },
          '50%': { clipPath: 'inset(60% 0 10% 0)', transform: 'translate(4px, 0)' },
          '75%': { clipPath: 'inset(10% 0 70% 0)', transform: 'translate(-2px, 0)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseBorder: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255,77,109,0.4), inset 0 0 15px rgba(255,77,109,0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(255,77,109,0.7), inset 0 0 30px rgba(255,77,109,0.2)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(30px)' },
          '60%': { transform: 'scale(1.02) translateY(-4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
