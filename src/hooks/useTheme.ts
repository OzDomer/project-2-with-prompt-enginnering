import { useEffect, useState } from "react"

export type Theme = "dark" | "light"
const STORAGE_KEY = "cryptonite.theme"

function getInitialTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "dark" || stored === "light") return stored
    return "dark"
}

export function useTheme(): { theme: Theme; toggle: () => void } {
    const [theme, setTheme] = useState<Theme>(getInitialTheme)

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        localStorage.setItem(STORAGE_KEY, theme)
    }, [theme])

    const toggle = () => setTheme(prev => (prev === "dark" ? "light" : "dark"))

    return { theme, toggle }
}
