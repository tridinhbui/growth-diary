/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'growth-green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'magic': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'glow': {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        aurora: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        dream: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-magic': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-aurora': 'linear-gradient(45deg, #fa709a 0%, #fee140 100%)',
        'gradient-dream': 'linear-gradient(120deg, #a8edea 0%, #fed6e3 100%)',
        'gradient-cosmic': 'linear-gradient(225deg, #FF3CAC 0%, #784BA0 50%, #2B86AB 100%)',
        'gradient-flow': 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
        'mesh-purple': 'radial-gradient(at 40% 20%, hsla(263,98%,70%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(235,98%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(196,98%,70%,1) 0px, transparent 50%)',
        'mesh-pink': 'radial-gradient(at 40% 20%, hsla(300,98%,70%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(265,98%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(196,98%,70%,1) 0px, transparent 50%)',
        'particles': 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'spin-slower': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'pulse-fast': 'pulse 0.8s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'glimmer': 'glimmer 2.5s ease-in-out infinite',
        'morph': 'morph 4s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out infinite',
        'tada': 'tada 1s ease-in-out',
        'jello': 'jello 1s ease-in-out',
        'rubber': 'rubber 1s ease-in-out',
        'gradient-flow': 'gradient-flow 15s ease infinite',
        'aurora': 'aurora 8s ease-in-out infinite',
        'wave': 'wave 2.5s ease-in-out infinite',
        'ripple': 'ripple 0.6s linear',
        'blob': 'blob 7s infinite',
        'float-orb': 'float-orb 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-out': 'fadeOut 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'zoom-in': 'zoomIn 0.5s ease-out',
        'zoom-out': 'zoomOut 0.5s ease-in',
        'scale-up': 'scaleUp 0.3s ease-out',
        'scale-down': 'scaleDown 0.3s ease-in',
        'progress': 'progress 2s ease-in-out',
        'loading-pulse': 'loading-pulse 2s ease-in-out infinite',
        'shrink': 'shrink linear forwards',
        'expand': 'expand 0.3s ease-out',
        'magic-glow': 'magic-glow 3s ease-in-out infinite',
        'cosmic-dance': 'cosmic-dance 20s linear infinite',
        'dream-float': 'dream-float 8s ease-in-out infinite',
        'stardust': 'stardust 4s ease-in-out infinite',
        'moonbeam': 'moonbeam 5s ease-in-out infinite',
        'firefly': 'firefly 6s ease-in-out infinite',
        'hover-lift': 'hover-lift 0.3s ease-out',
        'click-bounce': 'click-bounce 0.2s ease-out',
        'focus-glow': 'focus-glow 0.3s ease-out',
        'success-burst': 'success-burst 0.6s ease-out',
        'error-shake': 'error-shake 0.5s ease-in-out',
        'warning-pulse': 'warning-pulse 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.4)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 0, transform: 'scale(0)' },
          '50%': { opacity: 1, transform: 'scale(1)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
        glimmer: {
          '0%, 100%': { opacity: 0.7 },
          '50%': { opacity: 1 },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.1)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1)' },
        },
        tada: {
          '0%': { transform: 'scale3d(1, 1, 1)' },
          '10%, 20%': { transform: 'scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg)' },
          '30%, 50%, 70%, 90%': { transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)' },
          '40%, 60%, 80%': { transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)' },
          '100%': { transform: 'scale3d(1, 1, 1)' },
        },
        jello: {
          '11.1%': { transform: 'skewX(-12.5deg) skewY(-12.5deg)' },
          '22.2%': { transform: 'skewX(6.25deg) skewY(6.25deg)' },
          '33.3%': { transform: 'skewX(-3.125deg) skewY(-3.125deg)' },
          '44.4%': { transform: 'skewX(1.5625deg) skewY(1.5625deg)' },
          '55.5%': { transform: 'skewX(-0.78125deg) skewY(-0.78125deg)' },
          '66.6%': { transform: 'skewX(0.390625deg) skewY(0.390625deg)' },
          '77.7%': { transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)' },
          '88.8%': { transform: 'skewX(0.09765625deg) skewY(0.09765625deg)' },
          '100%': { transform: 'skewX(0deg) skewY(0deg)' },
        },
        rubber: {
          '0%': { transform: 'scale3d(1, 1, 1)' },
          '30%': { transform: 'scale3d(1.25, 0.75, 1)' },
          '40%': { transform: 'scale3d(0.75, 1.25, 1)' },
          '50%': { transform: 'scale3d(1.15, 0.85, 1)' },
          '65%': { transform: 'scale3d(.95, 1.05, 1)' },
          '75%': { transform: 'scale3d(1.05, .95, 1)' },
          '100%': { transform: 'scale3d(1, 1, 1)' },
        },
        'gradient-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        aurora: {
          '0%, 100%': { 
            transform: 'rotate(0deg) scale(1)',
            opacity: 0.5,
          },
          '33%': { 
            transform: 'rotate(120deg) scale(1.1)',
            opacity: 0.8,
          },
          '66%': { 
            transform: 'rotate(240deg) scale(0.9)',
            opacity: 0.6,
          },
        },
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: 1 },
          '100%': { transform: 'scale(4)', opacity: 0 },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'float-orb': {
          '0%, 100%': { 
            transform: 'translateY(0px) translateX(0px)',
            opacity: 0.7,
          },
          '25%': { 
            transform: 'translateY(-20px) translateX(10px)',
            opacity: 1,
          },
          '50%': { 
            transform: 'translateY(-40px) translateX(-5px)',
            opacity: 0.8,
          },
          '75%': { 
            transform: 'translateY(-20px) translateX(-10px)',
            opacity: 0.9,
          },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        zoomIn: {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        zoomOut: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(0)', opacity: 0 },
        },
        scaleUp: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
        scaleDown: {
          '0%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        'loading-pulse': {
          '0%, 100%': { opacity: 0.7, transform: 'scaleX(1)' },
          '50%': { opacity: 1, transform: 'scaleX(1.02)' },
        },
        shrink: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
        expand: {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        'magic-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(168, 85, 247, 0.4), 0 0 10px rgba(168, 85, 247, 0.3), 0 0 15px rgba(168, 85, 247, 0.2)',
            transform: 'scale(1)',
          },
          '50%': { 
            boxShadow: '0 0 10px rgba(168, 85, 247, 0.6), 0 0 20px rgba(168, 85, 247, 0.5), 0 0 30px rgba(168, 85, 247, 0.4)',
            transform: 'scale(1.02)',
          },
        },
        'cosmic-dance': {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
        'dream-float': {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
            opacity: 0.6,
          },
          '25%': { 
            transform: 'translateY(-30px) rotate(90deg)',
            opacity: 1,
          },
          '50%': { 
            transform: 'translateY(-60px) rotate(180deg)',
            opacity: 0.8,
          },
          '75%': { 
            transform: 'translateY(-30px) rotate(270deg)',
            opacity: 0.9,
          },
        },
        stardust: {
          '0%, 100%': { 
            transform: 'scale(0) rotate(0deg)',
            opacity: 0,
          },
          '50%': { 
            transform: 'scale(1) rotate(180deg)',
            opacity: 1,
          },
        },
        moonbeam: {
          '0%': { 
            transform: 'translateY(-100px) scaleY(0)',
            opacity: 0,
          },
          '50%': { 
            transform: 'translateY(-50px) scaleY(1)',
            opacity: 0.8,
          },
          '100%': { 
            transform: 'translateY(0px) scaleY(0.5)',
            opacity: 0.4,
          },
        },
        firefly: {
          '0%, 100%': { 
            transform: 'translate(0px, 0px) scale(0.8)',
            opacity: 0.3,
          },
          '25%': { 
            transform: 'translate(50px, -30px) scale(1.2)',
            opacity: 1,
          },
          '50%': { 
            transform: 'translate(-30px, -60px) scale(1)',
            opacity: 0.7,
          },
          '75%': { 
            transform: 'translate(-40px, -20px) scale(1.1)',
            opacity: 0.9,
          },
        },
        'hover-lift': {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-4px)' },
        },
        'click-bounce': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'focus-glow': {
          '0%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2)' },
        },
        'success-burst': {
          '0%': { 
            transform: 'scale(0) rotate(0deg)',
            opacity: 0,
          },
          '50%': { 
            transform: 'scale(1.2) rotate(180deg)',
            opacity: 1,
          },
          '100%': { 
            transform: 'scale(1) rotate(360deg)',
            opacity: 1,
          },
        },
        'error-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-8px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(8px)' },
        },
        'warning-pulse': {
          '0%, 100%': { 
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            transform: 'scale(1)',
          },
          '50%': { 
            backgroundColor: 'rgba(251, 191, 36, 0.3)',
            transform: 'scale(1.02)',
          },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 5px rgba(59, 130, 246, 0.5)',
        'glow': '0 0 10px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-xl': '0 0 25px rgba(59, 130, 246, 0.5)',
        'glow-2xl': '0 0 50px rgba(59, 130, 246, 0.5)',
        'magic': '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)',
        'aurora': '0 0 30px rgba(236, 72, 153, 0.3), 0 0 60px rgba(59, 130, 246, 0.2)',
        'dream': '0 0 15px rgba(139, 92, 246, 0.3), 0 0 30px rgba(139, 92, 246, 0.1)',
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      scale: {
        '102': '1.02',
        '105': '1.05',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      backdropBlur: {
        '4xl': '72px',
      },
    },
  },
  plugins: [
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-card': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
        },
        '.border-magic': {
          border: '1px solid transparent',
          backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(45deg, #667eea, #764ba2)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'content-box, border-box',
        },
        '.border-aurora': {
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(45deg, #fa709a, #fee140)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'content-box, border-box',
        },
        '.text-gradient': {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-aurora': {
          background: 'linear-gradient(45deg, #fa709a 0%, #fee140 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-cosmic': {
          background: 'linear-gradient(225deg, #FF3CAC 0%, #784BA0 50%, #2B86AB 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.hover-glow': {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
          },
        },
        '.click-effect': {
          transition: 'all 0.1s ease',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        '.scrollbar-thin': {
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '3px',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
        '.scrollbar-none': {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      };
      
      addUtilities(newUtilities);
    },
  ],
} 