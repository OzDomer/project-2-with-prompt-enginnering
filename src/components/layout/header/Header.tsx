import { useEffect, useState } from "react"
import "./Header.css"

interface HeaderProps {
    title: string
    subtitle?: string
    stats?: { label: string; value: string }[]
}

export default function Header({ title, subtitle, stats }: HeaderProps) {
    const [tick, setTick] = useState<string>(() => new Date().toLocaleTimeString("en-US", { hour12: false }))

    useEffect(() => {
        const id = setInterval(() => {
            setTick(new Date().toLocaleTimeString("en-US", { hour12: false }))
        }, 1000)
        return () => clearInterval(id)
    }, [])

    return (
        <header className="Header">
            <div className="Header-meta">
                <span className="Header-metaDot" />
                <span className="Header-metaText">LIVE · {tick} UTC</span>
            </div>
            <h1 className="Header-title">
                <span className="Header-titleSlash">{"// "}</span>
                {title}
            </h1>
            {subtitle && <p className="Header-subtitle">{subtitle}</p>}
            {stats && stats.length > 0 && (
                <div className="Header-stats">
                    {stats.map(s => (
                        <div key={s.label} className="Header-stat">
                            <span className="Header-statLabel">{s.label}</span>
                            <span className="Header-statValue">{s.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </header>
    )
}
