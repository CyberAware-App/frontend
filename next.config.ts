import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: {
		position: "bottom-right",
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
