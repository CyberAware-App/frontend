import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: {
		position: "bottom-left",
	},

	eslint: {
		ignoreDuringBuilds: true,
	},

	experimental: {
		devtoolNewPanelUI: true,
		devtoolSegmentExplorer: true,
	},

	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
