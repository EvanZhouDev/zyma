import Navbar from "@/components/Navbar.jsx";
import { ROOT_URL } from "@/components/constants";
import { GeistSans } from "geist/font/sans";
import type React from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
	metadataBase: new URL(ROOT_URL),
	title: "Next.js and Supabase Starter Kit",
	description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={GeistSans.className + " w-full h-full"}>
			<body className="w-full h-full">
				<Navbar />
				{children}
				<Toaster />
			</body>
		</html>
	);
}
