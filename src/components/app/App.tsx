import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import Layout from "../layout/layout/Layout"
import Home from "../home/Home"
import Reports from "../reports/Reports"
import Ai from "../ai/Ai"
import About from "../about/About"
import "./App.css"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="ai" element={<Ai />} />
                    <Route path="about" element={<About />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
