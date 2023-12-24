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
				"secondary-hover": "var(--secondary-hover)",
				"secondary-active": "var(--secondary-active)",
			},
		},
	},
	plugins: [tailwindNesting(), autoprefixer(), require("daisyui")],
	daisyui: {
		darkTheme: "githubDark",
		themes: [
			{
				github: {
					primary: "#0A69DA", // Blue Color on GitHub

					secondary: "#F6F8FA", // Normal color of buttons
					// "--secondary-hover": "#F3F4F6", // Hover color of buttons
					"--secondary-hover": "#F3F4F6", // Hover color of buttons
					"--secondary-active": "#EBECEF",  // Active color of buttons
					"secondary-content": "#24292F", // Color of text on buttons like "Star" (Repo)

					"base-100": "#FFFFFF", // Main background on GitHub
					"base-200": "#D0D7DE", // Border Color on GitHub
				},
				githubDark: {
					primary: "#3081F7",

					secondary: "#21262D",
					"--secondary-hover": "#30363D",
					"--secondary-active": "#282D34",
					"secondary-content": "#C8D1D9",

					"base-100": "#0D1116",
					"base-200": "#373B41",
				},
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
