import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        darkRed: '#a92921',
        darkGreen: '#0a7533',
      },
      maxWidth: {
        '200': '200px',
      },
    },
  },
  plugins: [],
} satisfies Config
