import type { Coin } from "../../../models/Coin"
import type { AiRecommendation } from "../../../models/AiRecommendation"
import SpinnerButton from "../../common/spinnerButton/SpinnerButton"
import "./RecommendationCard.css"

interface RecommendationCardProps {
    coin: Coin
    recommendation: AiRecommendation | null
    loading: boolean
    error: string | null
    onRequest: (coin: Coin) => void
}

export default function RecommendationCard({ coin, recommendation, loading, error, onRequest }: RecommendationCardProps) {
    const verdict = recommendation?.verdict
    const tone = verdict === "buy" ? "positive" : verdict === "don't buy" ? "negative" : "neutral"

    return (
        <article className={`RecommendationCard RecommendationCard--${tone}`}>
            <div className="RecommendationCard-head">
                <div className="RecommendationCard-identity">
                    <img src={coin.image} alt="" className="RecommendationCard-icon" />
                    <div>
                        <span className="RecommendationCard-symbol">{coin.symbol.toUpperCase()}</span>
                        <span className="RecommendationCard-name">{coin.name}</span>
                    </div>
                </div>
                {verdict && (
                    <span className={`RecommendationCard-verdict RecommendationCard-verdict--${tone}`}>
                        {verdict === "buy" ? "◆ BUY" : "✕ DON'T BUY"}
                    </span>
                )}
            </div>

            <div className="RecommendationCard-body">
                {!recommendation && !loading && !error && (
                    <p className="RecommendationCard-idle">
                        <span className="RecommendationCard-idleCursor">▌</span> Awaiting invocation. The oracle needs a prompt.
                    </p>
                )}

                {loading && (
                    <p className="RecommendationCard-loading">
                        <span className="RecommendationCard-loadingDots"><span /><span /><span /></span>
                        Consulting the oracle · analyzing 200d trajectory
                    </p>
                )}

                {error && (
                    <p className="RecommendationCard-error">
                        <strong>FAULT ·</strong> {error}
                    </p>
                )}

                {recommendation && !loading && (
                    <div className="RecommendationCard-explanation">
                        <span className="RecommendationCard-quote">"</span>
                        <p>{recommendation.explanation}</p>
                    </div>
                )}
            </div>

            <div className="RecommendationCard-footer">
                <SpinnerButton
                    variant="primary"
                    loading={loading}
                    onClick={() => onRequest(coin)}
                >
                    {recommendation ? "RE-RUN ORACLE" : "INVOKE ORACLE"}
                </SpinnerButton>
            </div>
        </article>
    )
}
