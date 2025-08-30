import { BaseLayout } from "../-components";

function AuthLayout({ children }: { children: React.ReactNode }) {
	return <BaseLayout className="bg-cyberaware-aeces-blue">{children}</BaseLayout>;
}

export default AuthLayout;
