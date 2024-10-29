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
        background: "#001112", // Almost pure black background
        card: "#1a1a1a", // Very dark gray for card backgrounds
        primary: "#333333", // Dark gray for primary elements
        accent: "#b3b3b3", // Lighter gray accent color for buttons and links
        text: "#e0e0e0", // Light gray text for readability on black
        border: "#4d4d4d", // Dark gray border for cards and inputs
      },
      transitionDuration: {
        400: "400ms", // Custom transition duration
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // Keep the animation plugin
  ],
};
