"use client";

import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { Toaster as Sonner } from "sonner";
import { useThemeStore } from "@/lib/zustand/themeStore";

function SonnerToaster(props: InferProps<typeof Sonner>) {
	const { theme = "dark" } = useThemeStore((state) => state);

	return (
		<Sonner
			theme={theme}
			// eslint-disable-next-line tailwindcss-better/no-unregistered-classes
			className="toaster group"
			richColors={true}
			position="bottom-right"
			duration={4000}
			closeButton={true}
			toastOptions={{
				classNames: {
					description: "group-[.toaster]:text-[14px]",

					title: "group-[.toaster]:text-base group-[.toaster]:font-bold",

					toast: "group toast p-5 mx-auto max-w-[280px] md:max-w-[300px]",
				},
			}}
			{...props}
		/>
	);
}

export { SonnerToaster };
