import Header from "../layout/header/Header"
import "./About.css"

export default function About() {
    return (
        <div className="About">
            <Header
                title="DOSSIER"
                subtitle="What this thing is, who built it, and why the fonts are like that."
            />

            <div className="About-grid">
                <section className="About-panel About-panel--wide">
                    <h2 className="About-panelTitle">// PROJECT</h2>
                    <p>
                        <strong>Cryptonite</strong> is a single-page cryptocurrency terminal built as the
                        second project for the John Bryce full-stack course. It tracks the hundred
                        largest coins by market cap, streams live prices once per second for a
                        five-coin tracking slate, and pipes trajectory data to a language model to
                        produce a buy / don't-buy verdict on demand.
                    </p>
                    <p>
                        Data flows from CoinGecko and CryptoCompare on the market side and from
                        OpenAI's Chat Completions API (gpt-4o-mini) on the oracle side. API keys never leave the browser — if
                        you store one, it sits in <code>localStorage</code> under your own name, and
                        you can purge it at any moment from the Oracle page.
                    </p>
                </section>

                <section className="About-panel">
                    <h2 className="About-panelTitle">// STACK</h2>
                    <ul className="About-list">
                        <li><span>FRAMEWORK</span><strong>React + TypeScript</strong></li>
                        <li><span>BUILD</span><strong>Vite</strong></li>
                        <li><span>STATE</span><strong>Redux Toolkit</strong></li>
                        <li><span>ROUTING</span><strong>react-router-dom</strong></li>
                        <li><span>CHARTS</span><strong>recharts</strong></li>
                        <li><span>HTTP</span><strong>axios</strong></li>
                    </ul>
                </section>

                <section className="About-panel About-panel--author">
                    <div className="About-portrait" aria-hidden="true">
                        <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="grain" width="2" height="2" patternUnits="userSpaceOnUse">
                                    <rect width="1" height="1" fill="currentColor" opacity="0.2" />
                                </pattern>
                            </defs>
                            <rect width="120" height="120" fill="var(--surface)" />
                            <circle cx="60" cy="48" r="22" fill="var(--accent)" opacity="0.9" />
                            <rect x="28" y="72" width="64" height="36" fill="var(--accent)" opacity="0.9" />
                            <rect width="120" height="120" fill="url(#grain)" />
                            <path d="M0 84 L120 84" stroke="var(--bg)" strokeWidth="4" strokeDasharray="2 4" />
                        </svg>
                    </div>
                    <h2 className="About-panelTitle">// ENGINEER</h2>
                    <p className="About-authorName">Oz Domer</p>
                    <p className="About-authorMeta">Student · John Bryce · Full Stack · 45800-5</p>
                    <p className="About-authorBlurb">
                        Backend-inclined, newly dabbling in UI. Built this terminal partly to learn
                        Redux and mostly to make numbers look menacing.
                    </p>
                </section>

                <section className="About-panel About-panel--notes">
                    <h2 className="About-panelTitle">// NOTES</h2>
                    <ol className="About-notes">
                        <li>No financial advice is offered, implied, or insinuated anywhere in this application.</li>
                        <li>The oracle is a general-purpose LLM; its verdicts are narrative, not prophetic.</li>
                        <li>Your tracking slate is persisted in <code>localStorage</code> across sessions.</li>
                        <li>Selecting a sixth coin triggers a dialog that will not dismiss until you resolve it.</li>
                    </ol>
                </section>
            </div>
        </div>
    )
}
