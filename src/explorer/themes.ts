import type { BundledTheme } from "shiki"

export const editorThemes: { id: BundledTheme; name: string }[] = [
    { id: "tokyo-night", name: "Tokyo Night" },
    { id: "rose-pine", name: "Rosé Pine" },
    { id: "rose-pine-moon", name: "Rosé Pine Moon" },
    { id: "rose-pine-dawn", name: "Rosé Pine Dawn" },
    { id: "nord", name: "Nord" },
    { id: "catppuccin-mocha", name: "Catppuccin Mocha" },
    { id: "catppuccin-macchiato", name: "Catppuccin Macchiato" },
    { id: "catppuccin-frappe", name: "Catppuccin Frappé" },
    { id: "catppuccin-latte", name: "Catppuccin Latte" },
    { id: "dracula", name: "Dracula" },
    { id: "gruvbox-dark-hard", name: "Gruvbox" },
    { id: "github-light", name: "GitHub Light" },
]

export const isEditorTheme = (theme: unknown): theme is BundledTheme =>
    typeof theme === "string" && editorThemes.some(({ id }) => id === theme)
