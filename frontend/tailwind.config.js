/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: "#2160C4", // BLUE (main brand)
        secondary: "#FFFFFF", // WHITE (success/accent)

        // BACKGROUND COLORS
        lightBlueBG: "#E0E8F6", // LIGHT BLUE BG
        lightGreyBG: "#F3F4F6", // LIGHT GREY BG
        greyBG: "#EBECEE", // GREY BACKGROUND
        blueBG : "#2160C4", // BLUE BACKGROUND
        
        // TEXT COLORS
        textWhite : "#FFFFFF",
        textBlue : "#205DBE",
        textGrey : "#686E8B",
        textBlack : "#282C34",
        starBG : "#F59F0A",
      },
    },
  },
  plugins: [],
};
