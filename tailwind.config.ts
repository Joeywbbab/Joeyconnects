import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Zinestyle 颜色系统
        paper: {
          DEFAULT: '#f4f1ea',
          light: '#faf9f6',
          dark: '#e9e4d9',
        },
        ink: {
          DEFAULT: '#1a1a1a',
          light: '#333333',
        },
        // 强调色
        accent: {
          red: '#dc2626',
          blue: '#3b82f6',
          orange: '#f97316',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        typewriter: ['Courier Prime', 'Courier', 'monospace'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'vintage': '15px 15px 0px rgba(0,0,0,0.05)',
        'heavy': '40px 40px 0px rgba(239,68,68,0.05)',
        'soft': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
        'slower': '700ms',
        'slowest': '1000ms',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
