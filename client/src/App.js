import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Orders from "./pages/Orders";
import AdminAnalytics from "./pages/AdminAnalytics";

const Home = () => (
    <div style={{ padding: "2rem" }}>
        <h1>Welcome to Smart Canteen</h1>
        <nav>
            <ul>
                <li>
                    <Link to="/orders">Orders</Link>
                </li>
                <li>
                    <Link to="/admin-analytics">Admin Analytics</Link>
                </li>
            </ul>
        </nav>
    </div>
);

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/admin-analytics" element={<AdminAnalytics />} />
                <Route path="/analytics" element={<AdminAnalytics />} />
            </Routes>
        </Router>
    );
};

export default App;
