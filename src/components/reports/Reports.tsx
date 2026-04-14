import { useMemo } from "react"
import { Link } from "react-router-dom"
import { useAppSelector } from "../../redux/store"
import type { Coin } from "../../models/Coin"
import Header from "../layout/header/Header"
import RealtimeChart from "./realtimeChart/RealtimeChart"
import "./Reports.css"

export default function Reports() {
    const coins = useAppSelector(s => s.coins.coins)
    const selectedIds = useAppSelector(s => s.selectedCoins.ids)

    const selectedCoins = useMemo(
        () => selectedIds.map(id => coins.find(c => c.id === id)).filter((c): c is Coin => !!c),
        [selectedIds, coins]
    )

    return (
        <div className="Reports">
            <Header
                title="SIGNAL"
                subtitle="Price telemetry for your tracking slate, streamed once per second from a single pooled request. USD only. Lines render as they arrive — silence means no tick."
                stats={[
                    { label: "STREAMS", value: String(selectedCoins.length).padStart(2, "0") },
                    { label: "INTERVAL", value: "1s" },
                    { label: "CURRENCY", value: "USD" },
                    { label: "BUFFER", value: "60 ticks" }
                ]}
            />

            {selectedCoins.length === 0 ? (
                <div className="Reports-empty">
                    <div className="Reports-emptyBox">
                        <span className="Reports-emptyGlyph">/ / /</span>
                        <h3 className="Reports-emptyTitle">NO TRACKING SLATE</h3>
                        <p className="Reports-emptyText">
                            Return to the market floor and flip the ON switch on up to five assets.
                        </p>
                        <Link to="/" className="Reports-emptyCta">
                            → OPEN MARKET
                        </Link>
                    </div>
                </div>
            ) : (
                <RealtimeChart coins={selectedCoins} />
            )}
        </div>
    )
}
