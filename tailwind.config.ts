const colors = require("tailwindcss/colors");
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,md,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,jsx,ts,tsx,md,mdx}",
  ],
  theme: {
    // fontSize: {
    //   xs: ".75rem",
    //   sm: ".875rem",
    //   base: "1rem",
    //   lg: "1.125rem",
    //   xl: "1.25rem",
    //   "2xl": "1.5rem",
    //   "3xl": "1.875rem",
    //   "4xl": "2.25rem",
    //   "5xl": "3rem",
    //   "6xl": "4rem",
    // },
    extend: {
      fontFamily: {
        mono: "Recursive",
        display: "Family",
        sans: ["Inter", "sans-serif"],
      },
      textColor: {
        primary: "rgba(20, 9, 0, 0.84)",
        body: "rgba(20, 9, 0, 0.64)",
        secondary: "rgba(0, 0, 0, 0.50)",
      },
      colors: {
        sand: "#EFE7DD",
        "sand-50": "rgba(239, 231, 221, 0.50)",
        "sand-25": "rgba(239, 231, 221, 0.25)",
        "sand-dark": "#E5D9CA",
        primary: "rgb(19, 114, 95)",
      },
      boxShadow: {
        1: "0px 1px 1px rgba(0, 0, 0, 0.01), 0px 1px 1px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.24), 0px 0px 0px rgba(0, 0, 0, 0.27), 0px 0px 0px rgba(0, 0, 0, 0.28), 0px 2px 3px rgb(0 0 0 / 5%)",
        2: "0px 2px 4px rgba(0, 0, 0, 0.01), 0px 1px 4px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.09), 0px 0px 2px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1)",
        3: "0px 7px 9px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.05), 0px 2px 6px rgba(0, 0, 0, 0.09), 0px 0px 3px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1)",
        4: "0px 17px 9px rgba(0, 0, 0, 0.01), 0px 10px 8px rgba(0, 0, 0, 0.04), 0px 4px 6px rgba(0, 0, 0, 0.07), 0px 1px 3px rgba(0, 0, 0, 0.08), 0px 0px 0px rgba(0, 0, 0, 0.08)",
        light:
          "0px 4px 9px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.40)",
      },
    },
  },

  plugins: [require("@tailwindcss/typography")],
};

export default config;
