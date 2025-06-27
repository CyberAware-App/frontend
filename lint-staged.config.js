export default {
	"*.{js,ts,jsx,tsx}": () => "pnpm lint:eslint",
	"*.{ts,tsx}": () => "pnpm lint:type-check",
};
