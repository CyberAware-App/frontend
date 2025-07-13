import Image from "next/image";
import { NavLink } from "@/components/common/NavLink";
import { Teleport } from "@/components/common/teleport";
import { logoLarge } from "@/public/assets";
import { BaseLayout } from "../-components";

function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<BaseLayout className="relative bg-cyberaware-aeces-blue">
			<Teleport to="#main" insertPosition="afterbegin">
				<NavLink href="/" className="absolute top-[76px] flex items-center self-start">
					<Image src={logoLarge} alt="Logo" className="w-[44px]" />
					<h3 className="text-[24px] font-medium text-white">CyberAware</h3>
				</NavLink>
			</Teleport>

			{children}
		</BaseLayout>
	);
}

export default AuthLayout;
