import { BaseLayout } from "../-components";

// import { SideBar } from "./-components/SideBar";

const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<BaseLayout className="relative bg-cyberaware-aeces-blue">
			{/* <SideBar /> */}
			{children}
		</BaseLayout>
	);
};

export default layout;
