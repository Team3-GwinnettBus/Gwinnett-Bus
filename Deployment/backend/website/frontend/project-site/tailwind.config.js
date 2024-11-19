// tailwind.config.js
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "#001112",
        card: "#1a1a1a",
        primary: "#333333",
        accent: "#b3b3b3",
        text: "#e0e0e0",
        border: "#4d4d4d",
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [animate], // Use the imported plugin
};
