/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        display: ["'Playfair Display'", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        cream: {
          50: "#fdfcf7",
          100: "#faf7ed",
          200: "#f4eedb",
        },
        ink: {
          900: "#1a1208",
          800: "#2d2010",
          700: "#4a3520",
        },
        sage: {
          400: "#7a9e7e",
          500: "#5c8460",
          600: "#3f6142",
        },
        amber: {
          warm: "#c8752a",
        }
      },
      boxShadow: {
        card: "4px 4px 0px #1a1208",
        "card-lg": "6px 6px 0px #1a1208",
        "card-hover": "2px 2px 0px #1a1208",
      },
      keyframes: {
        "flip-in": {
          "0%": { transform: "rotateY(90deg)", opacity: "0" },
          "100%": { transform: "rotateY(0deg)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "pop": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" },
          "100%": { transform: "scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
      animation: {
        "flip-in": "flip-in 0.35s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "pop": "pop 0.2s ease-out",
        wiggle: "wiggle 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};
