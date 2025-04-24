/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Adjust this based on your project structure and file types (e.g., .jsx, .tsx)
      "./public/index.html",      // Include this if you might use Tailwind classes directly in your main HTML file
    ],
    theme: {
      extend: {}, // You can customize Tailwind's theme here later
    },
    plugins: [],
}