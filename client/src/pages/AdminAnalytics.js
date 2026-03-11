import React from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
        {
            label: "Orders",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
    ],
};

const options = {
    responsive: true,
    plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Monthly Orders" },
    },
};

const AdminAnalytics = () => {
    return (
        <div className="admin-analytics" style={{ padding: "2rem" }}>
            <h1>Admin Analytics</h1>
            <Bar data={data} options={options} />
            <Link to="/" style={{ marginTop: "1rem", display: "inline-block" }}>
                ← Back to Home
            </Link>
        </div>
    );
};

export default AdminAnalytics;
