import Image from "next/image";
import { NavLink } from "@/components/common/NavLink";
import { logoLarge } from "@/public/assets";
import { BaseLayout } from "../-components";

function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<BaseLayout className="bg-cyberaware-aeces-blue">
			<div className="flex w-full max-w-[430px] grow flex-col gap-[56px]">
				<NavLink href="/" className="mt-[76px] flex items-center px-3">
					<Image src={logoLarge} alt="Logo" className="w-[44px]" />
					<h3 className="text-[22px] font-medium text-white">CyberAware</h3>
				</NavLink>

				{children}
			</div>
		</BaseLayout>
	);
}

export default AuthLayout;
