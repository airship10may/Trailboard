import { isPremiumActive, type Entitlement } from "./entitlement";

export const THEME_STORAGE_KEY = "trailboard.theme";

export type AppTheme = "light" | "dark" | "soft-dark" | "ivory" | "ash-grey";

export const THEME_OPTIONS: Array<{
  value: AppTheme;
  label: string;
  premiumOnly: boolean;
}> = [
  { value: "light", label: "Light", premiumOnly: false },
  { value: "dark", label: "Dark", premiumOnly: false },
  { value: "soft-dark", label: "Soft Dark", premiumOnly: true },
  { value: "ivory", label: "Ivory", premiumOnly: true },
  { value: "ash-grey", label: "Ash Grey", premiumOnly: true },
];

const PREMIUM_THEME_SET = new Set<AppTheme>(["soft-dark", "ivory", "ash-grey"]);

export function isTheme(value: unknown): value is AppTheme {
  return THEME_OPTIONS.some((option) => option.value === value);
}

export function isPremiumTheme(theme: AppTheme) {
  return PREMIUM_THEME_SET.has(theme);
}

export function getThemeFromStorage(): AppTheme {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(saved) ? saved : "light";
}

export function resolveThemeForEntitlement(
  theme: AppTheme,
  entitlement: Entitlement
): AppTheme {
  if (!isPremiumTheme(theme)) return theme;
  return isPremiumActive(entitlement) ? theme : "light";
}

export function applyThemeToDocument(theme: AppTheme) {
  const html = document.documentElement;
  const isDarkMode = theme === "dark" || theme === "soft-dark";
  html.classList.toggle("dark", isDarkMode);

  if (theme === "light" || theme === "dark") {
    html.removeAttribute("data-theme");
  } else {
    html.setAttribute("data-theme", theme);
  }

  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
