import React from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
        {
            label: "Revenue",
            data: [5000, 7000, 3000, 4000, 6500, 8000],
            backgroundColor: "rgba(54, 162, 235, 0.5)",
        },
    ],
};

const options = {
    responsive: true,
    plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Monthly Revenue" },
    },
};

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard" style={{ padding: "2rem" }}>
            <h1>Admin Dashboard</h1>
            <Bar data={data} options={options} />
            <Link to="/" style={{ marginTop: "1rem", display: "inline-block" }}>
                ← Back to Home
            </Link>
        </div>
    );
};

export default AdminDashboard;
