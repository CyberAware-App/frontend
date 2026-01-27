import Image from "next/image";
import { NavLink } from "@/components/common/NavLink";
import { sessionQuery } from "@/lib/react-query/queryOptions";
import { logoLarge } from "@/public/assets";
import { BaseLayout } from "../-components";
import { HydrationBoundary } from "../HydrationBoundary.client";

function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<HydrationBoundary onPrefetch={(client) => client.prefetchQuery(sessionQuery())}>
			<BaseLayout className="bg-cyberaware-aeces-blue">
				<div className="flex w-full max-w-[430px] grow flex-col gap-[56px]">
					<NavLink href="/" className="mt-[76px] flex items-center px-3">
						<Image src={logoLarge} alt="Logo" className="w-[44px]" />
						<h3 className="text-[22px] font-medium text-white">CyberAware</h3>
					</NavLink>

					{children}
				</div>
			</BaseLayout>
		</HydrationBoundary>
	);
}

export default AuthLayout;
