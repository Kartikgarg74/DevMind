module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#10131A",
        neonAqua: "#00FFF7",
        neonIndigo: "#7F5CFF",
        neonEmerald: "#00FF85",
        neonBlue: "#1E90FF",
        textPrimary: "#F8F8FF",
        textSecondary: "#A0AEC0",
        card: "#181C24",
        border: "#23283A",
        accent: "#7F5CFF",
      },
      fontFamily: {
        mono: ["Fira Code", "JetBrains Mono", "monospace"],
        sans: ["Inter", "Roboto", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 16px #00FFF7",
        card: "0 2px 24px 0 rgba(0,0,0,0.12)",
      },
      borderRadius: {
        xl: "1.25rem",
        '2xl': "2rem",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
    },
  },
  plugins: [],
}
