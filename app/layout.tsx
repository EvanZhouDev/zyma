import Navbar from "@/components/Navbar.jsx";
import { GeistSans } from "geist/font/sans";
import type React from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata = {
	metadataBase: new URL(defaultUrl),
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
