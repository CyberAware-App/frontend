import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	ignores: ["dist/**", "build/**", ".next/**", "postcss.config.js"],
	react: {
		nextjs: true,
	},
	tailwindcssBetter: true,
	perfectionist: false,
	tanstack: {
		query: true,
	},
	typescript: true,
});
