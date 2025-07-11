import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { cnJoin } from "../lib/utils/cn";
import { Providers } from "./Providers";
import "../tailwind.css";

const workSans = Work_Sans({
	variable: "--font-work-sans",
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "CyberAware",
	description:
		"Learn how to protect your digital world in just 10 days. Designed for lecturers, staff, and students",
};

function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={cnJoin(workSans.variable)}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

export default RootLayout;
