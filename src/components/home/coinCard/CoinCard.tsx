import { useState } from "react"
import type { Coin } from "../../../models/Coin"
import Switch from "../../common/switch/Switch"
import { formatCompact, formatPercent } from "../../../util/format"
import "./CoinCard.css"

interface CoinCardProps {
    coin: Coin
    selected: boolean
    onToggle: (coin: Coin, next: boolean) => void
    onMoreInfo: (coin: Coin) => void
}

export default function CoinCard({ coin, selected, onToggle, onMoreInfo }: CoinCardProps) {
    const { id, symbol, name, image, current_price, price_change_percentage_24h, market_cap_rank } = coin
    const [imgFailed, setImgFailed] = useState(false)
    const direction = price_change_percentage_24h >= 0 ? "up" : "down"

    return (
        <article className={`CoinCard${selected ? " CoinCard--selected" : ""}`} data-direction={direction}>
            <div className="CoinCard-topRow">
                <span className="CoinCard-rank">#{String(market_cap_rank ?? 0).padStart(3, "0")}</span>
                <span className={`CoinCard-trend CoinCard-trend--${direction}`}>
                    {direction === "up" ? "▲" : "▼"} {formatPercent(price_change_percentage_24h ?? 0)}
                </span>
            </div>

            <div className="CoinCard-identity">
                <div className="CoinCard-iconWrap">
                    {!imgFailed ? (
                        <img
                            src={image}
                            alt=""
                            className="CoinCard-icon"
                            onError={() => setImgFailed(true)}
                            loading="lazy"
                        />
                    ) : (
                        <span className="CoinCard-iconFallback">{symbol.slice(0, 1).toUpperCase()}</span>
                    )}
                </div>
                <div className="CoinCard-labels">
                    <span className="CoinCard-symbol">{symbol.toUpperCase()}</span>
                    <span className="CoinCard-name">{name}</span>
                </div>
            </div>

            <div className="CoinCard-price">
                <span className="CoinCard-priceValue">
                    ${current_price < 1 ? current_price?.toFixed(6) : current_price?.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </span>
                <span className="CoinCard-priceLabel">USD · SPOT</span>
            </div>

            <div className="CoinCard-bars">
                <div className="CoinCard-bar">
                    <span className="CoinCard-barLabel">MCAP</span>
                    <span className="CoinCard-barValue">${formatCompact(coin.market_cap)}</span>
                </div>
                <div className="CoinCard-bar">
                    <span className="CoinCard-barLabel">VOL</span>
                    <span className="CoinCard-barValue">${formatCompact(coin.total_volume)}</span>
                </div>
            </div>

            <div className="CoinCard-actions">
                <button className="CoinCard-moreBtn" onClick={() => onMoreInfo(coin)}>
                    <span>MORE INFO</span>
                    <span className="CoinCard-moreBtnArrow">→</span>
                </button>
                <Switch
                    id={`switch-${id}`}
                    checked={selected}
                    onChange={next => onToggle(coin, next)}
                />
            </div>

            <span className="CoinCard-corner CoinCard-corner--tl" aria-hidden />
            <span className="CoinCard-corner CoinCard-corner--br" aria-hidden />
        </article>
    )
}
