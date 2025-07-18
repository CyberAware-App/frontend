import { isBrowser } from "@zayne-labs/toolkit-core";
import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";

type ThemeStore = {
	actions: {
		initThemeOnLoad: () => void;
		setTheme: (newTheme: "dark" | "light") => void;
		toggleTheme: () => void;
	};
	isDarkMode: boolean;

	systemTheme: "dark" | "light";

	theme: "dark" | "light" | "system";
};

const getPrefersDarkMode = () => {
	return isBrowser() && globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
};

// Store Object Initialization
const themeStoreObjectFn: StateCreator<ThemeStore> = (set, get) => ({
	isDarkMode: getPrefersDarkMode(),

	systemTheme: getPrefersDarkMode() ? "dark" : "light",

	theme: "system",

	// eslint-disable-next-line perfectionist/sort-objects
	actions: {
		initThemeOnLoad: () => {
			const { systemTheme, theme: persistedTheme } = get();

			document.documentElement.dataset.theme =
				persistedTheme === "system" ? systemTheme : persistedTheme;
		},

		setTheme: (newTheme: "dark" | "light") => {
			document.documentElement.dataset.theme = newTheme;

			set({ isDarkMode: newTheme === "dark", theme: newTheme });
		},

		toggleTheme: () => {
			const { actions, systemTheme, theme: persistedTheme } = get();

			const currentTheme = persistedTheme === "system" ? systemTheme : persistedTheme;

			const newTheme = currentTheme === "light" ? "dark" : "light";

			actions.setTheme(newTheme);
		},
	},
});

// Store hook Creation
export const useThemeStore = create<ThemeStore>()(
	persist(themeStoreObjectFn, {
		migrate: (persistedState) => persistedState,

		name: "colorScheme",

		partialize: ({ isDarkMode, theme }) => ({ isDarkMode, theme }),
		version: 1,
	})
);
