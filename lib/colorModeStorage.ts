export const COLOR_MODE_STORAGE_KEY = "blog-appearance";

export type ColorAppearance = "light" | "dark";

export function readStoredAppearance(): ColorAppearance | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function writeStoredAppearance(value: ColorAppearance): void {
  try {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, value);
  } catch {
    /* ignore */
  }
}

export function applyColorSchemeToDocument(value: ColorAppearance): void {
  if (typeof document === "undefined") return;
  document.documentElement.style.colorScheme = value;
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) meta.setAttribute("content", value);
}
