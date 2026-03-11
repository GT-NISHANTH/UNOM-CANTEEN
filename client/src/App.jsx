import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import AdminDashboard from './pages/AdminDashboard'
import Payment from './pages/Payment'
import Tracking from './pages/Tracking'

function App() {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/tracking" element={<Tracking />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App
