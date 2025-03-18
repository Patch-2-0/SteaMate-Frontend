/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {  
        pixel: ['"Press Start 2P"', "sans-serif"],
      },
      colors: {
        neonBlue: "#6271f8",
        neonPurple: "#9e82e3",
        neonPink: "#e095b2",
        darkBlue: "#141453",
      },
      boxShadow: {
        glow: "0px 0px 8px #6271f8", // 네온 느낌 그림자
      },
    },
  },
  plugins: [],
};
