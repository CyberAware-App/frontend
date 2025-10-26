import type { NextConfig } from "next";
// import { fileURLToPath } from "node:url";

// const getRoot = (rootPath = "/") => fileURLToPath(new URL(rootPath, import.meta.url));

const nextConfig: NextConfig = {
	devIndicators: {
		position: "bottom-right",
	},

	experimental: {
		turbopackFileSystemCacheForDev: true,
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

	typedRoutes: true,

	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
