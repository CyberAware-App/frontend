"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { NavLink } from "@/components/common/NavLink";
import { usePageBlocker } from "@/lib/hooks";
import { sessionQuery } from "@/lib/react-query/queryOptions";
import { logoLarge } from "@/public/assets";
import { BaseLayout } from "../-components";
import { LoadingScreen } from "../-components/LoadingScreen";

function AuthLayout({ children }: { children: React.ReactNode }) {
	const sessionQueryResult = useQuery(sessionQuery());

	usePageBlocker({
		condition: Boolean(sessionQueryResult.data),
		message: "You cannot access this page while logged in!",
		redirectPath: "/dashboard",
	});

	if (sessionQueryResult.isPending) {
		return <LoadingScreen text="Just a moment..." />;
	}

	return (
		<BaseLayout className="bg-cyberaware-aeces-blue">
			{!sessionQueryResult.data && (
				<div className="flex w-full max-w-[430px] grow flex-col gap-[56px]">
					<NavLink href="/" className="mt-[76px] flex items-center px-3">
						<Image src={logoLarge} alt="Logo" className="w-[44px]" />
						<h3 className="text-[22px] font-medium text-white">CyberAware</h3>
					</NavLink>

					{children}
				</div>
			)}
		</BaseLayout>
	);
}

export default AuthLayout;
