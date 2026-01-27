import { zayne } from "@zayne-labs/eslint-config";
import { getDefaultAllowedNextJsExportNames } from "@zayne-labs/eslint-config/constants/defaults";

export default zayne(
	{
		ignores: ["dist/**", "build/**", ".next/**", "postcss.config.js", "./DEVELOPER-GUIDE.md"],
		react: {
			compiler: {
				overrides: {
					"react-hooks/rule-suppression": "off",
				},
			},
			nextjs: true,
			refresh: {
				overrides: {
					"react-refresh/only-export-components": [
						"warn",
						{
							allowExportNames: getDefaultAllowedNextJsExportNames(),
							customHOCs: ["withProtection"],
						},
					],
				},
			},
		},
		tailwindcssBetter: true,
		tanstack: {
			query: true,
		},
		typescript: true,
	},
	{
		files: ["./src/components/animated/primitives/**.tsx"],
		rules: {
			"react-hooks/preserve-manual-memoization": "off",
		},
	}
);
