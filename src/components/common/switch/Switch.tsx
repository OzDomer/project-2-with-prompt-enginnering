import "./Switch.css"

interface SwitchProps {
    checked: boolean
    onChange: (next: boolean) => void
    label?: string
    id?: string
}

export default function Switch({ checked, onChange, label, id }: SwitchProps) {
    return (
        <label className="Switch" htmlFor={id}>
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                className="Switch-input"
            />
            <span className="Switch-track" aria-hidden="true">
                <span className="Switch-thumb" />
                <span className="Switch-on">ON</span>
                <span className="Switch-off">OFF</span>
            </span>
            {label && <span className="Switch-label">{label}</span>}
        </label>
    )
}
