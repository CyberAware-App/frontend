import React from "react";
import { BaseLayout } from "../-components";

const layout = ({ children }: { children: React.ReactNode }) => {
	return <BaseLayout className="relative bg-cyberaware-aeces-blue">{children}</BaseLayout>;
};

export default layout;
