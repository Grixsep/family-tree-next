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
        'family-blue': '#3B82F6',
        'family-pink': '#EC4899',
        'family-green': '#10B981',
        'family-purple': '#8B5CF6',
      },
    },
  },
  plugins: [],
}
