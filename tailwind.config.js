const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
	theme: {
		extend: {
			colors: {
				primary: "#010851",
				secondary: "#9A7AF1",
				tertiary: "#707070",
				pink: "#EE9AE5",
			},
			boxShadow: {
				"3xl": "0px 10px 50px 0px rgba(1, 8, 81, 0.15)",
			},
		},
	},
	plugins: [flowbite.plugin()],
};
