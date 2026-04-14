import { useMemo, useState } from "react"
import { useOutletContext } from "react-router-dom"
import type { Coin } from "../../models/Coin"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { add, remove, swap, MAX_SELECTED } from "../../redux/selectedCoinsSlice"
import type { OutletContext } from "../layout/layout/Layout"
import Header from "../layout/header/Header"
import Spinner from "../common/spinner/Spinner"
import CoinGrid from "./coinGrid/CoinGrid"
import MoreInfoModal from "./moreInfoModal/MoreInfoModal"
import LimitDialog from "./limitDialog/LimitDialog"
import "./Home.css"

export default function Home() {
    const { search } = useOutletContext<OutletContext>()
    const dispatch = useAppDispatch()
    const coins = useAppSelector(s => s.coins.coins)
    const loaded = useAppSelector(s => s.coins.loaded)
    const selectedIds = useAppSelector(s => s.selectedCoins.ids)

    const [infoCoin, setInfoCoin] = useState<Coin | null>(null)
    const [pendingCoin, setPendingCoin] = useState<Coin | null>(null)

    const filtered = useMemo(() => {
        const input = search.trim().toLowerCase()
        if (!input) return coins
        return coins.filter(c =>
            c.symbol.toLowerCase().includes(input) ||
            c.name.toLowerCase().includes(input)
        )
    }, [coins, search])

    const selectedCoins = useMemo(
        () => selectedIds.map(id => coins.find(c => c.id === id)).filter((c): c is Coin => !!c),
        [selectedIds, coins]
    )

    const handleToggle = (coin: Coin, next: boolean) => {
        if (!next) {
            dispatch(remove(coin.id))
            return
        }
        if (selectedIds.length >= MAX_SELECTED) {
            setPendingCoin(coin)
            return
        }
        dispatch(add(coin.id))
    }

    const handleSwap = (removeId: string) => {
        if (!pendingCoin) return
        dispatch(swap({ removeId, addId: pendingCoin.id }))
        setPendingCoin(null)
    }

    const gainers = filtered.filter(c => (c.price_change_percentage_24h ?? 0) > 0).length
    const losers = filtered.length - gainers

    return (
        <div className="Home">
            <Header
                title="MARKET"
                subtitle="One hundred of the most-watched crypto assets, updated at source. Toggle any coin into your tracking slate — up to five — to stream live signal and invoke the oracle."
                stats={[
                    { label: "LISTED", value: String(coins.length).padStart(3, "0") },
                    { label: "MATCHES", value: String(filtered.length).padStart(3, "0") },
                    { label: "TRACKING", value: `${selectedIds.length}/${MAX_SELECTED}` },
                    { label: "GAINERS", value: String(gainers).padStart(3, "0") },
                    { label: "LOSERS", value: String(losers).padStart(3, "0") }
                ]}
            />

            {!loaded && (
                <div className="Home-loading">
                    <Spinner label="decoding market feed" size="lg" />
                </div>
            )}

            {loaded && (
                <CoinGrid
                    coins={filtered}
                    selectedIds={selectedIds}
                    onToggle={handleToggle}
                    onMoreInfo={setInfoCoin}
                />
            )}

            <MoreInfoModal coin={infoCoin} onClose={() => setInfoCoin(null)} />
            <LimitDialog
                open={!!pendingCoin}
                selectedCoins={selectedCoins}
                pendingCoin={pendingCoin}
                onSwap={handleSwap}
                onCancel={() => setPendingCoin(null)}
            />
        </div>
    )
}
