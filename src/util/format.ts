export function formatCurrency(value: number, currency: "USD" | "EUR" | "ILS"): string {
    const locale = currency === "EUR" ? "de-DE" : currency === "ILS" ? "he-IL" : "en-US"
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: value < 1 ? 6 : 2
    }).format(value)
}

export function formatCompact(value: number): string {
    return new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2
    }).format(value)
}

export function formatPercent(value: number): string {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(2)}%`
}

export function formatTime(ts: number): string {
    const d = new Date(ts)
    return d.toLocaleTimeString("en-US", { hour12: false })
}
