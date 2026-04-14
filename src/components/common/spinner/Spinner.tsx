import "./Spinner.css"

interface SpinnerProps {
    label?: string
    size?: "sm" | "md" | "lg"
}

export default function Spinner({ label, size = "md" }: SpinnerProps) {
    return (
        <div className={`Spinner Spinner--${size}`} role="status" aria-live="polite">
            <div className="Spinner-ring">
                <span />
                <span />
                <span />
            </div>
            {label && <span className="Spinner-label">{label}</span>}
        </div>
    )
}
