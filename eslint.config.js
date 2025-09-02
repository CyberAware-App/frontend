import { allowedNextJsExportNames, zayne } from "@zayne-labs/eslint-config";

export default zayne({
	ignores: ["dist/**", "build/**", ".next/**", "postcss.config.js"],
	react: {
		nextjs: true,
		overrides: {
			"react-refresh/only-export-components": [
				"warn",
				{ allowExportNames: allowedNextJsExportNames, customHOCs: ["withProtection"] },
			],
		},
	},
	tailwindcssBetter: true,
	tanstack: {
		query: true,
	},
	typescript: true,
}).overrides({
	"zayne/perfectionist/rules": {
		files: ["./lib/api/callBackendApi/**.ts"],
	},
});
