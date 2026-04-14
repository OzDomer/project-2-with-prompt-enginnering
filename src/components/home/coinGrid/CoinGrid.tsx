import type { Coin } from "../../../models/Coin"
import CoinCard from "../coinCard/CoinCard"
import "./CoinGrid.css"

interface CoinGridProps {
    coins: Coin[]
    selectedIds: string[]
    onToggle: (coin: Coin, next: boolean) => void
    onMoreInfo: (coin: Coin) => void
}

export default function CoinGrid({ coins, selectedIds, onToggle, onMoreInfo }: CoinGridProps) {
    if (coins.length === 0) {
        return (
            <div className="CoinGrid-empty">
                <span className="CoinGrid-emptyGlyph">∅</span>
                <span className="CoinGrid-emptyText">NO MATCHES · REFINE QUERY</span>
            </div>
        )
    }

    return (
        <div className="CoinGrid">
            {coins.map((coin, index) => (
                <div key={coin.id} className="CoinGrid-cell" style={{ animationDelay: `${Math.min(index * 18, 600)}ms` }}>
                    <CoinCard
                        coin={coin}
                        selected={selectedIds.includes(coin.id)}
                        onToggle={onToggle}
                        onMoreInfo={onMoreInfo}
                    />
                </div>
            ))}
        </div>
    )
}
