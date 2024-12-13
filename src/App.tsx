import { useState } from 'react'
import { BrowserRouter, HashRouter, Route, Router, Routes } from "react-router-dom"
import Earth from "./pages/Earth"
import MountH from "./pages/MountH"
import './App.css'

function App() {
    return (
        <>
            <div style={{ width: "100vw", height: "100vh" }}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/earth" element={<Earth />} />
                        <Route path="/" element={<Earth />} />
                        <Route path="/mountH" element={<MountH />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    )
}

export default App
