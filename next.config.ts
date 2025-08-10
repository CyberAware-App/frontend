import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: {
		position: "bottom-right",
	},

	eslint: {
		ignoreDuringBuilds: true,
	},

	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
