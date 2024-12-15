import { HashRouter, Route, Routes } from "react-router-dom"
import Earth from "./pages/Earth"
import MountH from "./pages/MountH"
import './App.css'

function App() {
    return (
        <>
            <div style={{ width: "100vw", height: "100vh" }}>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<Earth />} />
                        <Route path="/mountH" element={<MountH />} />
                    </Routes>
                </HashRouter>
            </div>
        </>
    )
}

export default App
