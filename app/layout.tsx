import type { Metadata } from "next";
import { Albert_Sans, Inter } from "next/font/google";
import { cnJoin } from "../lib/utils/cn";
import "../tailwind.css";
import { Providers } from "./Providers";

const albertSans = Albert_Sans({
	variable: "--font-albert-sans",
	subsets: ["latin"],
});

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "CyberAware",
	// description:
	// 	"A secure platform to report incidents, threats, or safety concerns. anonymously and effectively.",
};

function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={cnJoin(albertSans.variable, inter.variable)}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

export default RootLayout;
