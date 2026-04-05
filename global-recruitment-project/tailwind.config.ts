import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Web3 深色背景系统
        dark: {
          DEFAULT: '#0a0a0f',
          50: '#1a1a24',
          100: '#15151c',
          200: '#12121a',
          300: '#0f0f14',
          400: '#0c0c11',
          500: '#0a0a0f',
          600: '#08080c',
          700: '#060609',
          800: '#040405',
          900: '#020203',
        },
        // 霓虹强调色系统
        neon: {
          cyan: '#00d4ff',
          purple: '#a855f7',
          pink: '#ec4899',
          blue: '#3b82f6',
          green: '#10b981',
          yellow: '#f59e0b',
          orange: '#f97316',
        },
        // 玻璃拟态边框色
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          hover: 'rgba(255, 255, 255, 0.2)',
          active: 'rgba(255, 255, 255, 0.3)',
        },
        // 保留原系统作为兼容
        primary: {
          DEFAULT: '#a855f7',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        accent: {
          DEFAULT: '#00d4ff',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#00d4ff',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Fira Code', 'monospace'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        // 渐变预设
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-neon': 'linear-gradient(90deg, #00d4ff, #a855f7, #ec4899)',
        'gradient-cyan-purple': 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
        'gradient-purple-pink': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)',
      },
      boxShadow: {
        // 霓虹发光效果
        'neon-cyan': '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)',
        'neon-pink': '0 0 20px rgba(236, 72, 153, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)',
        'neon-blue': '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)',
        // 玻璃阴影
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        // 卡片悬浮
        'card-hover': '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(168, 85, 247, 0.2)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        // 悬浮动画
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.6), 0 0 60px rgba(168, 85, 247, 0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
