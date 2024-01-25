module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'bottom': '0 1px 0px 0 rgba(0, 0, 0, 0.10)',
      },
      colors: {
        // ? This is the custom color scheme used to style the elements of the flowchart
        "node-purple": {
          50: "#EEEEFF",
          100: "#ACA9F1",
          200: "#5452F6",
        },
        "node-blue": {
          50: "#E7F4FF",
          100: "#83C4F8",
          200: "#2097F6",
        },
        "node-red": {
          50: "#FEEBEA",
          100: "#F3A39E",
          200: "#DE1306",
        },
        "node-orange": {
          50: "#FFECEA",
          100: "#FCBCB3",
          200: "#FF5A43",
        },
        "node-green": {
          50: "#E5FDE8",
          100: "#93C69B",
          200: "#65BF73",
        },
        "bgdarkcolor":"#353744",
      },
    },
  },
  plugins: [],
};
