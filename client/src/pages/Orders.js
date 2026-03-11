import React from "react";
import { Link } from "react-router-dom";

const Orders = () => {
    return (
        <div className="orders-page" style={{ padding: "2rem" }}>
            <h1>Orders</h1>
            <p>This is the Orders page. Add your order list and details here.</p>
            <Link to="/" className="back-link" style={{ marginTop: "1rem", display: "inline-block" }}>
                ← Back to Home
            </Link>
            <Link to="/tracking">
                <button>Track Order</button>
            </Link>
        </div>
    );
};

export default Orders;
