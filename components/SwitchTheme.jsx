"use client";

import { MoonIcon, SunIcon } from "@primer/octicons-react";
import React, { useLayoutEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

const SwitchTheme = () => {
	// Function to get the initial theme value from the local storage
	const getInitialTheme = () => {
		const savedTheme = window.localStorage.getItem("theme");
		return savedTheme ? savedTheme : "github";
	};

	// We store the theme in localStorage to preserve the state on next visit
	const [theme, setTheme] = useLocalStorage("theme", getInitialTheme());

	// Toggles the theme
	const toggleTheme = () => {
		setTheme(theme === "github" ? "githubDark" : "github");
	};

	useLayoutEffect(() => {
		const body = document.body;
		body.setAttribute("data-theme", theme);
	}, [theme]);

	return (
		<button onClick={toggleTheme} className="swap">
			<SunIcon
				className={`fill-current w-8 h-8 mx-5 ${
					theme === "githubDark" ? "swap-on" : "swap-off"
				}`}
			/>
			<MoonIcon
				className={`fill-current w-8 h-8 mx-5 ${
					theme === "github" ? "swap-on" : "swap-off"
				}`}
			/>
		</button>
	);
};

export default SwitchTheme;
