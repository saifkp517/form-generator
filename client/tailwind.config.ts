import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5C6BC0', // Bold indigo
          hover: '#3949AB',
          light: '#E8EAF6',
          dark: '#303F9F',
        },
        secondary: {
          DEFAULT: '#26A69A', // Teal
          hover: '#00897B',
          light: '#E0F2F1',
        },
        neutral: {
          light: '#F9FAFC',
          DEFAULT: '#F0F2F5',
          dark: '#E3E5E8',
          text: '#2F3542',
          muted: '#6C757D',
        },
        accent: {
          success: '#4CAF50',
          warning: '#FF9800',
          error: '#F44336',
          info: '#2196F3',
          purple: '#9C27B0',
          pink: '#E91E63',
        },
        sidebar: {
          bg: '#2F3542',
          text: '#EEF2F7',
          highlight: '#5C6BC0',
        },
      },
      boxShadow: {
        card: '0 3px 10px rgba(0,0,0,0.08)',
        button: '0 2px 5px rgba(92,107,192,0.2)',
        hover: '0 5px 15px rgba(92,107,192,0.3)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
} satisfies Config;