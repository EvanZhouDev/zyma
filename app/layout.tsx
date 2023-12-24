import { ROOT_URL } from "@/components/constants";
import { GeistSans } from "geist/font/sans";
import type React from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import ThemeHandler from "@/components/ThemeHandler";

export const metadata = {
	metadataBase: new URL(ROOT_URL),
	title: "Zyma",
	description:
		"Zyma is a simple attendance tracker, enabling easy check-in for anyone from clubs to corporation meetings.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${GeistSans.className} w-full h-full`}>
			<body className="w-full h-full">
				{children}
				<Toaster />
				<ThemeHandler />
			</body>
		</html>
	);
}
