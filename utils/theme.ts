import type { ThemeDefinition } from "vuetify";

// String that represents the name of the theme I am using
export const LIGHT_THEME = "light";
// Light mode theme
export const light: ThemeDefinition = {
	dark: false,
	colors: {
		background: "#FFFFFF",
		surface: "#FFFFFF",
		primary: "#4F46E5",
		secondary: "#9333EA",
		error: "#EF4444",
		info: "#3B82F6",
		success: "#10B981",
		warning: "#F59E0B",
	},
};

// String that represents the name of the dark theme I am using
export const DARK_THEME = "dark";
// Dark mode theme
export const dark: ThemeDefinition = {
	dark: true,
	colors: {
		background: "#020617",
		surface: "#0F172A",
		primary: "#6366F1",
		secondary: "#A855f7",
		error: "#Ef4444",
		info: "#3B82F6",
		success: "#10B981",
		warning: "#F59E0B",
	},
};