import { useState } from "react"
import type { Coin } from "../../../models/Coin"
import Modal from "../../common/modal/Modal"
import "./LimitDialog.css"

interface LimitDialogProps {
    open: boolean
    selectedCoins: Coin[]
    pendingCoin: Coin | null
    onSwap: (removeId: string) => void
    onCancel: () => void
}

export default function LimitDialog({ open, selectedCoins, pendingCoin, onSwap, onCancel }: LimitDialogProps) {
    const [chosenId, setChosenId] = useState<string | null>(null)

    const handleConfirm = () => {
        if (chosenId) {
            onSwap(chosenId)
            setChosenId(null)
        }
    }

    const handleCancel = () => {
        setChosenId(null)
        onCancel()
    }

    return (
        <Modal open={open} onClose={() => { /* non-dismissible */ }} dismissible={false} size="md">
            <div className="LimitDialog">
                <div className="LimitDialog-warning">
                    <span className="LimitDialog-warningBadge">MAX · 5/5</span>
                    <p className="LimitDialog-warningText">
                        The tracking slate is saturated. To add
                        {pendingCoin && (
                            <span className="LimitDialog-pendingChip">
                                {" "}<strong>{pendingCoin.symbol.toUpperCase()}</strong>
                            </span>
                        )}
                        , you must deselect one of the five current entries.
                    </p>
                </div>

                <div className="LimitDialog-list">
                    {selectedCoins.map(coin => (
                        <button
                            key={coin.id}
                            type="button"
                            className={`LimitDialog-item${chosenId === coin.id ? " is-chosen" : ""}`}
                            onClick={() => setChosenId(coin.id)}
                        >
                            <span className="LimitDialog-itemRadio" aria-hidden>
                                <span />
                            </span>
                            <img src={coin.image} alt="" className="LimitDialog-itemIcon" />
                            <span className="LimitDialog-itemSymbol">{coin.symbol.toUpperCase()}</span>
                            <span className="LimitDialog-itemName">{coin.name}</span>
                            <span className="LimitDialog-itemAction">{chosenId === coin.id ? "REMOVE" : "KEEP"}</span>
                        </button>
                    ))}
                </div>

                <div className="LimitDialog-footer">
                    <button
                        type="button"
                        className="LimitDialog-btn LimitDialog-btn--ghost"
                        onClick={handleCancel}
                    >
                        ABORT · KEEP ALL
                    </button>
                    <button
                        type="button"
                        className="LimitDialog-btn LimitDialog-btn--primary"
                        disabled={!chosenId}
                        onClick={handleConfirm}
                    >
                        {chosenId
                            ? `SWAP → ${pendingCoin?.symbol.toUpperCase() ?? ""}`
                            : "SELECT ONE TO REMOVE"}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
