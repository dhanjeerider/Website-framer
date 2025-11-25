import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	// Minimal root layout required by Next.js app router
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<title>MockupGen AI</title>
			</head>
			<body>{children}</body>
		</html>
	);
}
