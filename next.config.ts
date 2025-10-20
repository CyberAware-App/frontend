import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const getRoot = (rootPath = "/") => fileURLToPath(new URL(rootPath, import.meta.url));

const nextConfig: NextConfig = {
	devIndicators: {
		position: "bottom-right",
	},

	eslint: {
		ignoreDuringBuilds: true,
	},

	images: {
		remotePatterns: [
			{
				hostname: "avatar.iran.liara.run",
				pathname: "/**",
				protocol: "https",
			},
		],
	},

	logging: {
		fetches: {
			fullUrl: true,
		},
	},

	turbopack: {
		root: getRoot(),
	},

	typedRoutes: true,

	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
