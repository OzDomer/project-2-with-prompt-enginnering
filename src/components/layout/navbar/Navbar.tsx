import { NavLink } from "react-router-dom"
import type { Theme } from "../../../hooks/useTheme"
import "./Navbar.css"

interface NavbarProps {
    search: string
    onSearchChange: (next: string) => void
    showSearch: boolean
    theme: Theme
    onToggleTheme: () => void
    selectedCount: number
}

const LINKS = [
    { to: "/", label: "MARKET", end: true },
    { to: "/reports", label: "SIGNAL" },
    { to: "/ai", label: "ORACLE" },
    { to: "/about", label: "DOSSIER" }
]

export default function Navbar({ search, onSearchChange, showSearch, theme, onToggleTheme, selectedCount }: NavbarProps) {
    return (
        <nav className="Navbar">
            <div className="Navbar-left">
                <NavLink to="/" className="Navbar-brand" end>
                    <span className="Navbar-brandGlyph">◆</span>
                    <span className="Navbar-brandText">CRYPTONITE</span>
                </NavLink>
                <span className="Navbar-tagline">// terminal · v1.0</span>
            </div>

            <ul className="Navbar-links">
                {LINKS.map(link => (
                    <li key={link.to}>
                        <NavLink
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) => "Navbar-link" + (isActive ? " is-active" : "")}
                        >
                            <span className="Navbar-linkBracket">[</span>
                            {link.label}
                            <span className="Navbar-linkBracket">]</span>
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className="Navbar-right">
                <div className={"Navbar-search" + (showSearch ? "" : " Navbar-search--hidden")} aria-hidden={!showSearch}>
                    <span className="Navbar-searchPrompt">$</span>
                    <input
                        value={search}
                        onChange={e => onSearchChange(e.target.value)}
                        placeholder="grep symbol|name"
                        className="Navbar-searchInput"
                        aria-label="Search coins"
                        tabIndex={showSearch ? 0 : -1}
                    />
                    <span className="Navbar-searchCursor" />
                </div>

                <div className="Navbar-chip" title="Selected coins">
                    <span className="Navbar-chipDot" />
                    <span className="Navbar-chipText">{selectedCount}/5</span>
                </div>

                <button
                    onClick={onToggleTheme}
                    className="Navbar-theme"
                    aria-label="Toggle theme"
                    title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                    <span className="Navbar-themeIcon" data-theme={theme}>
                        {theme === "dark" ? "☾" : "☀"}
                    </span>
                </button>
            </div>
        </nav>
    )
}
