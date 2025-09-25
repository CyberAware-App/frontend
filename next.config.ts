import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const getRoot = (rootPath = "/") => fileURLToPath(new URL(rootPath, import.meta.url));

const nextConfig: NextConfig = {
	devIndicators: {
		position: "bottom-right",
	},

	typedRoutes: true,

	logging: {
		fetches: {
			fullUrl: true,
		},
	},

	turbopack: {
		root: getRoot(),
	},

	eslint: {
		ignoreDuringBuilds: true,
	},

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatar.iran.liara.run",
				pathname: "/**",
			},
		],
	},

	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
