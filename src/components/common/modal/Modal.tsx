import { useEffect, type ReactNode } from "react"
import "./Modal.css"

interface ModalProps {
    open: boolean
    onClose: () => void
    title?: string
    children: ReactNode
    dismissible?: boolean
    size?: "sm" | "md" | "lg"
}

export default function Modal({ open, onClose, title, children, dismissible = true, size = "md" }: ModalProps) {
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && dismissible) onClose()
        }
        window.addEventListener("keydown", onKey)
        document.body.style.overflow = "hidden"
        return () => {
            window.removeEventListener("keydown", onKey)
            document.body.style.overflow = ""
        }
    }, [open, onClose, dismissible])

    if (!open) return null

    return (
        <div className="Modal-backdrop" onClick={dismissible ? onClose : undefined}>
            <div
                className={`Modal Modal--${size}`}
                role="dialog"
                aria-modal="true"
                onClick={e => e.stopPropagation()}
            >
                <div className="Modal-corners" aria-hidden="true">
                    <span /><span /><span /><span />
                </div>
                {(title || dismissible) && (
                    <header className="Modal-header">
                        {title && <h2 className="Modal-title">{title}</h2>}
                        {dismissible && (
                            <button className="Modal-close" onClick={onClose} aria-label="Close">
                                ×
                            </button>
                        )}
                    </header>
                )}
                <div className="Modal-body">{children}</div>
            </div>
        </div>
    )
}
