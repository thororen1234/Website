import type { ThemeRegistration } from "shiki/core"

type ThemeModule = Promise<{ default: ThemeRegistration }>

interface EditorTheme {
    id: string
    label: string
    load(): ThemeModule
}

export const EDITOR_THEMES: EditorTheme[] = [
    {
        id: "tokyo-night",
        label: "Tokyo Night",
        load: () => import("shiki/themes/tokyo-night.mjs"),
    },
    {
        id: "rose-pine",
        label: "Rosé Pine",
        load: () => import("shiki/themes/rose-pine.mjs"),
    },
    {
        id: "rose-pine-moon",
        label: "Rosé Pine Moon",
        load: () => import("shiki/themes/rose-pine-moon.mjs"),
    },
    {
        id: "rose-pine-dawn",
        label: "Rosé Pine Dawn",
        load: () => import("shiki/themes/rose-pine-dawn.mjs"),
    },
    { id: "nord", label: "Nord", load: () => import("shiki/themes/nord.mjs") },
    {
        id: "catppuccin-mocha",
        label: "Catppuccin Mocha",
        load: () => import("shiki/themes/catppuccin-mocha.mjs"),
    },
    {
        id: "catppuccin-macchiato",
        label: "Catppuccin Macchiato",
        load: () => import("shiki/themes/catppuccin-macchiato.mjs"),
    },
    {
        id: "catppuccin-frappe",
        label: "Catppuccin Frappé",
        load: () => import("shiki/themes/catppuccin-frappe.mjs"),
    },
    {
        id: "catppuccin-latte",
        label: "Catppuccin Latte",
        load: () => import("shiki/themes/catppuccin-latte.mjs"),
    },
    {
        id: "dracula",
        label: "Dracula",
        load: () => import("shiki/themes/dracula.mjs"),
    },
    {
        id: "gruvbox-dark-hard",
        label: "Gruvbox",
        load: () => import("shiki/themes/gruvbox-dark-hard.mjs"),
    },
    {
        id: "github-light",
        label: "GitHub Light",
        load: () => import("shiki/themes/github-light.mjs"),
    },
]

export const DEFAULT_EDITOR_THEME = "tokyo-night"

export const isEditorTheme = (id: unknown): id is string =>
    EDITOR_THEMES.some((theme) => theme.id === id)
