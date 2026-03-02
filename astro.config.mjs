// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'

// https://astro.build/config
export default defineConfig({
    output: 'static',
    vite: {
        plugins: [tailwindcss()],
        // build: {
        //     sourcemap: true,
        // },
    },
    integrations: [icon()],
})
