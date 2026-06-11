/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cixio: {
          blue:    "#1259FB", // primary electric blue
          navy:    "#1236AE", // deep navy
          dark:    "#0B1E6B", // darkest navy for text/headers
          light:   "#EEF3FF", // very light blue tint
          bg:      "#F4F7FF", // page background
          hover:   "#0E4DE0", // blue on hover
          muted:   "#6B88D4", // muted blue for secondary text
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
