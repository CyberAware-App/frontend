import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	ignores: ["dist/**", "build/**", ".next/**", "postcss.config.js"],
	react: {
		nextjs: true,
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
