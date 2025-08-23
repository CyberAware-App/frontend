import { BaseLayout } from "@/app/-components";

function ModuleLayout({ children }: { children: React.ReactNode }) {
	return <BaseLayout className="relative">{children}</BaseLayout>;
}

export default ModuleLayout;
