import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: {
		position: "bottom-right",
	},

	typedRoutes: true,

	turbopack: {
		root: path.dirname(fileURLToPath(import.meta.url)),
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
