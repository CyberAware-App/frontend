import { allowedNextJsExportNames, zayne } from "@zayne-labs/eslint-config";

export default zayne(
	{
		ignores: ["dist/**", "build/**", ".next/**", "postcss.config.js"],
		react: {
			nextjs: true,
			refresh: {
				overrides: {
					"react-refresh/only-export-components": [
						"warn",
						{ allowExportNames: allowedNextJsExportNames, customHOCs: ["withProtection"] },
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
