/** @type {import('tailwindcss').Config} */
const autoprefixer = require("autoprefixer");
const tailwindNesting = require("tailwindcss/nesting");

module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				// Some nice colors:
				// Dark green: #496727
				// Bright green: #C9EE9E
				// Baby blue: #C5EAE7
				// Weird magenta: #a7264b
				// Bubblegum pink: #d46c91
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				btn: {
					background: "hsl(var(--btn-background))",
					"background-hover": "hsl(var(--btn-background-hover))",
				},
			},
		},
	},
	plugins: [tailwindNesting(), autoprefixer(), require("daisyui")],
	daisyui: {
		darkTheme: "materialYouDark",
		themes: [
			{
				materialYou: {
					primary: "#4f6630",
					"primary-content": "#ffffff",
					secondary: "#dfe6cf",
					"secondary-content": "#46483F",
					neutral: "#f5f4ec",
					"base-100": "#fefcf7",
				},
				materialYouDark: {
					primary: "#A4C77D",
					"primary-content": "#1D3700",
					secondary: "#424937",
					"secondary-content": "#DDE6CD",
					neutral: "#22261D",
					"base-100": "#1B1C18",
				},
			},
		],
	},
};
