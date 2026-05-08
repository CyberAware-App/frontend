import { zayne } from "@zayne-labs/eslint-config";
import { getDefaultAllowedNextJsExportNames } from "@zayne-labs/eslint-config/constants/defaults";

export default zayne({
	ignores: ["dist/**", "build/**", ".next/**", "postcss.config.js", "./DEVELOPER-GUIDE.md"],
	react: {
		nextjs: true,
		overrides: {
			"react-refresh/only-export-components": [
				"warn",
				{
					allowExportNames: getDefaultAllowedNextJsExportNames(),
					extraHOCs: ["withProtection"],
				},
			],
		},
	},
	tailwindcssBetter: true,
	tanstack: {
		query: true,
	},
	typescript: true,
});
