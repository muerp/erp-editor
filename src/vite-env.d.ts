/// <reference types="vite/client" />

declare global {
    interface Window {
        pdfjsWorker: string
        __theme: string
        __setPreferredTheme: (theme: string) => void
    }
}