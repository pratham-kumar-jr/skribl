module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      backgroundImage: {
        doodle: "url('./src/assests/bg.jpeg')",
      },
      fontFamily: {
        title: ["whale"],
      },
      margin: {
        "1/16": "8%",
        "1/20": "5%",
        "1/8": "16%",
        "1/5": "20%",
        "2/5": "40%",
        "1/3": "33.33%",
      },
      minWidth: {
        "3/10": "30%",
      },
      padding: {
        "1/16": "8%",
        "1/25": "4%",
        "1/50": "2%",
        "1/20": "5%",
        "1/8": "16%",
        "1/5": "20%",
        "2/5": "40%",
        "1/3": "33.33%",
      },
      height: {
        "1/10": "10%",
        "9/10": "90%",
      },
    },
  },
  plugins: [],
};
