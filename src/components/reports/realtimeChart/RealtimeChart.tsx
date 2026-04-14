import { useEffect, useMemo, useRef, useState } from "react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { Coin } from "../../../models/Coin"
import type { ChartPoint } from "../../../models/ChartPoint"
import { priceMultiService } from "../../../services/PriceMultiService"
import { formatCurrency, formatTime } from "../../../util/format"
import "./RealtimeChart.css"

interface RealtimeChartProps {
    coins: Coin[]
}

const POLL_INTERVAL_MS = 1000
const MAX_POINTS = 60
const PALETTE = ["#00ff9d", "#ffb627", "#5df9ff", "#ff4d6d", "#c084fc"]

export default function RealtimeChart({ coins }: RealtimeChartProps) {
    const [points, setPoints] = useState<ChartPoint[]>([])
    const [status, setStatus] = useState<"connecting" | "live" | "error">("connecting")
    const [error, setError] = useState<string | null>(null)
    const [paused, setPaused] = useState(false)
    const symbolsKey = useMemo(() => coins.map(c => c.symbol.toUpperCase()).sort().join(","), [coins])
    const pausedRef = useRef(paused)
    pausedRef.current = paused

    useEffect(() => {
        setPoints([])
    }, [symbolsKey])

    useEffect(() => {
        if (coins.length === 0) return
        let cancelled = false
        const symbols = coins.map(c => c.symbol.toUpperCase())

        async function poll() {
            if (pausedRef.current) return
            try {
                const data = await priceMultiService.getPrices(symbols)
                if (cancelled) return
                const now = Date.now()
                const point: ChartPoint = { time: now }
                for (const sym of symbols) {
                    const price = data[sym]?.USD
                    if (typeof price === "number") point[sym] = price
                }
                setStatus("live")
                setError(null)
                setPoints(prev => {
                    const next = [...prev, point]
                    return next.length > MAX_POINTS ? next.slice(next.length - MAX_POINTS) : next
                })
            } catch (err) {
                if (cancelled) return
                setStatus("error")
                setError(err instanceof Error ? err.message : "feed interrupted")
            }
        }

        poll()
        const id = setInterval(poll, POLL_INTERVAL_MS)
        return () => {
            cancelled = true
            clearInterval(id)
        }
    }, [symbolsKey, coins])

    const latest = points[points.length - 1]

    return (
        <div className="RealtimeChart">
            <div className="RealtimeChart-head">
                <div className="RealtimeChart-status">
                    <span className={`RealtimeChart-statusDot RealtimeChart-statusDot--${status}`} />
                    <span className="RealtimeChart-statusText">
                        {status === "live" && "FEED · LIVE"}
                        {status === "connecting" && "FEED · HANDSHAKE"}
                        {status === "error" && "FEED · STALL"}
                    </span>
                    <span className="RealtimeChart-statusMeta">
                        · {points.length}/{MAX_POINTS} ticks · 1s poll
                    </span>
                </div>
                <button
                    className="RealtimeChart-pauseBtn"
                    onClick={() => setPaused(p => !p)}
                    aria-pressed={paused}
                >
                    {paused ? "▶ RESUME" : "■ PAUSE"}
                </button>
            </div>

            {error && (
                <div className="RealtimeChart-error">
                    <span className="RealtimeChart-errorTag">STALL</span>
                    <span>{error}</span>
                </div>
            )}

            <div className="RealtimeChart-frame">
                <ResponsiveContainer width="100%" height={460}>
                    <LineChart data={points} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                        <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" />
                        <XAxis
                            dataKey="time"
                            tickFormatter={formatTime}
                            stroke="var(--text-faint)"
                            tick={{ fontFamily: "Share Tech Mono, monospace", fontSize: 10, fill: "var(--text-dim)" }}
                            minTickGap={40}
                        />
                        <YAxis
                            stroke="var(--text-faint)"
                            tick={{ fontFamily: "Share Tech Mono, monospace", fontSize: 10, fill: "var(--text-dim)" }}
                            domain={["auto", "auto"]}
                            tickFormatter={v => (v < 1 ? `$${v.toFixed(4)}` : `$${v.toLocaleString("en-US", { maximumFractionDigits: 2 })}`)}
                            width={80}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "var(--surface-raised)",
                                border: "1px solid var(--accent)",
                                fontFamily: "Share Tech Mono, monospace",
                                fontSize: 12,
                                color: "var(--text)"
                            }}
                            labelFormatter={v => `T · ${formatTime(Number(v))}`}
                            formatter={(value, name) => {
                                const num = typeof value === "number" ? value : Number(value)
                                return [formatCurrency(num, "USD"), String(name)]
                            }}
                        />
                        <Legend
                            verticalAlign="top"
                            height={28}
                            iconType="square"
                            wrapperStyle={{ fontFamily: "Share Tech Mono, monospace", fontSize: 11, letterSpacing: "0.12em" }}
                        />
                        {coins.map((coin, i) => (
                            <Line
                                key={coin.id}
                                type="monotone"
                                dataKey={coin.symbol.toUpperCase()}
                                name={coin.symbol.toUpperCase()}
                                stroke={PALETTE[i % PALETTE.length]}
                                strokeWidth={1.5}
                                dot={false}
                                isAnimationActive={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="RealtimeChart-readouts">
                {coins.map((coin, i) => {
                    const sym = coin.symbol.toUpperCase()
                    const price = latest?.[sym]
                    return (
                        <div key={coin.id} className="RealtimeChart-readout" style={{ borderLeftColor: PALETTE[i % PALETTE.length] }}>
                            <span className="RealtimeChart-readoutSymbol">{sym}</span>
                            <span className="RealtimeChart-readoutValue">
                                {typeof price === "number" ? formatCurrency(price, "USD") : "—"}
                            </span>
                            <span className="RealtimeChart-readoutName">{coin.name}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
