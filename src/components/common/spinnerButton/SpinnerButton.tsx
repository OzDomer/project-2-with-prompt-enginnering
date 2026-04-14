import type { ButtonHTMLAttributes, ReactNode } from "react"
import Spinner from "../spinner/Spinner"
import "./SpinnerButton.css"

interface SpinnerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean
    children: ReactNode
    variant?: "primary" | "ghost" | "danger"
}

export default function SpinnerButton({ loading, children, variant = "primary", disabled, className, ...rest }: SpinnerButtonProps) {
    const classes = ["SpinnerButton", `SpinnerButton--${variant}`, className].filter(Boolean).join(" ")
    return (
        <button
            type="button"
            className={classes}
            disabled={disabled || loading}
            aria-busy={loading}
            {...rest}
        >
            <span className="SpinnerButton-content" data-loading={loading ? "true" : "false"}>
                {children}
            </span>
            {loading && (
                <span className="SpinnerButton-spinner">
                    <Spinner size="sm" />
                </span>
            )}
        </button>
    )
}
