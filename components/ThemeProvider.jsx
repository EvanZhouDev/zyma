"use client";

import React, { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

const ThemeProvider = () => {
	const [theme, _setTheme] = useLocalStorage("theme", "github")

	useEffect(() => {
		const body = document.body;
		body.setAttribute("data-theme", theme);
	}, [theme]);

	return <></>;
};

export default ThemeProvider;
