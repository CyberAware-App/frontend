import { BaseLayout } from "../-components";

function DashboardLayout({ children }: { children: React.ReactNode }) {
	return <BaseLayout className="bg-cyberaware-aeces-blue">{children}</BaseLayout>;
}

export default DashboardLayout;
