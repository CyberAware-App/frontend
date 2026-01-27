import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { SonnerToaster } from "@/components/common/Toaster";
import { cnJoin } from "../lib/utils/cn";
import { Providers } from "./Providers";
import "../tailwind.css";

const workSans = Work_Sans({
	subsets: ["latin"],
	variable: "--font-work-sans",
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	description:
		"A modern cybersecurity education platform designed to teach digital safety in just 10 modules",
	title: "CyberAware",
};

function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" data-scroll-behavior="smooth">
			<body className={cnJoin(workSans.variable)}>
				<Providers>{children}</Providers>

				<SonnerToaster />
			</body>
		</html>
	);
}

export default RootLayout;
