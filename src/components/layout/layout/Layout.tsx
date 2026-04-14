import { useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../redux/store"
import { populate } from "../../../redux/coinsSlice"
import { coinsService } from "../../../services/CoinsService"
import { useTheme } from "../../../hooks/useTheme"
import Navbar from "../navbar/Navbar"
import Footer from "../footer/Footer"
import "./Layout.css"

export interface OutletContext {
    search: string
}

export default function Layout() {
    const dispatch = useAppDispatch()
    const { theme, toggle } = useTheme()
    const location = useLocation()
    const selectedCount = useAppSelector(s => s.selectedCoins.ids.length)
    const coinsLoaded = useAppSelector(s => s.coins.loaded)

    const [search, setSearch] = useState("")
    const [loadError, setLoadError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        async function load() {
            if (coinsLoaded) return
            try {
                const coins = await coinsService.getTop100()
                if (!cancelled) dispatch(populate(coins))
            } catch (err) {
                if (!cancelled) setLoadError(err instanceof Error ? err.message : "Failed to load coins")
            }
        }
        load()
        return () => {
            cancelled = true
        }
    }, [coinsLoaded, dispatch])

    const showSearch = location.pathname === "/"

    return (
        <div className="Layout">
            <Navbar
                search={search}
                onSearchChange={setSearch}
                showSearch={showSearch}
                theme={theme}
                onToggleTheme={toggle}
                selectedCount={selectedCount}
            />
            <main className="Layout-main">
                {loadError && (
                    <div className="Layout-error">
                        <span className="Layout-errorTag">ERR</span>
                        <span>{loadError}</span>
                    </div>
                )}
                <Outlet context={{ search } satisfies OutletContext} />
            </main>
            <Footer />
        </div>
    )
}
