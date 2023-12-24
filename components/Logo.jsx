"use client";
import Image from "next/image";
import React from "react";
import { useLocalStorage } from "usehooks-ts";

export default function Logo({ className, size }) {
	// Function to get the initial theme value from the local storage
	const getInitialTheme = () => {
		const savedTheme = window.localStorage.getItem("theme");
		return savedTheme ? savedTheme : "github";
	};

	// We store the theme in localStorage to preserve the state on next visit
	const [theme, _] = useLocalStorage("theme", getInitialTheme());

	return (
		<>
			<Image
				src={theme === "githubDark" ? "/zymaDark.svg" : "/zyma.svg"}
				alt="Zyma Logo"
				width={size}
				height={size}
				className={className}
			/>
		</>
	);
}
