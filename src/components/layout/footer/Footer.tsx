import "./Footer.css"

export default function Footer() {
    return (
        <footer className="Footer">
            <div className="Footer-row">
                <span className="Footer-cell">◇ CRYPTONITE TERMINAL</span>
                <span className="Footer-cell Footer-cell--dim">data · coingecko · cryptocompare</span>
                <span className="Footer-cell Footer-cell--dim">oracle · nvidia nim</span>
                <span className="Footer-cell">EOF // {new Date().getUTCFullYear()}</span>
            </div>
            <div className="Footer-ticker" aria-hidden="true">
                <span className="Footer-tickerTrack">
                    &nbsp;▸ NO FINANCIAL ADVICE · DO YOUR OWN RESEARCH · MARKETS ARE HAZARDOUS · SIGNAL NOT CERTAINTY · NO FINANCIAL ADVICE · DO YOUR OWN RESEARCH · MARKETS ARE HAZARDOUS · SIGNAL NOT CERTAINTY
                </span>
            </div>
        </footer>
    )
}
