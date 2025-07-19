import { SidebarRootProvider } from "@/components/ui/sidebar";
import { BaseLayout } from "../-components";
import { DashboardSideBar } from "./-components/DashboardSideBar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<BaseLayout className="bg-cyberaware-aeces-blue">
			<SidebarRootProvider className="w-fit">
				<DashboardSideBar />
				{children}
			</SidebarRootProvider>
		</BaseLayout>
	);
}

export default DashboardLayout;
