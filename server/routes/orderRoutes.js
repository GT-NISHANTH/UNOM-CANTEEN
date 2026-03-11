const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");

// PLACE ORDER (Student/Customer)
router.post("/", auth(["student", "customer"]), async (req, res) => {
    try {
        const { items, totalAmount } = req.body;
        const tokenNumber = Math.floor(1000 + Math.random() * 9000);

        const order = new Order({
            user: req.user.id, // Use authenticated user ID
            items,
            totalAmount,
            tokenNumber,
            status: "Pending"
        });

        await order.save();
        res.json(order);
    } catch (error) {
        console.error("Order placement error:", error);
        res.status(500).json({ message: "Failed to place order", error: error.message });
    }
});

// GET ALL ORDERS (ADMIN ONLY)
router.get("/", auth(["admin"]), async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user")
            .populate("items.food");
        res.json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

// UPDATE ORDER STATUS (ADMIN ONLY)
router.put("/:id", auth(["admin"]), async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        const io = req.app.get("io");
        if (io) {
            io.emit("orderUpdated", order);
        }

        res.json(order);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET ORDERS BY STATUS (ADMIN ONLY)
router.get("/status/:status", auth(["admin"]), async (req, res) => {
    try {
        const orders = await Order.find({ status: req.params.status })
            .populate("user")
            .populate("items.food");
        res.json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET ORDERS BY USER (Self or Admin)
router.get("/user/:userId", auth(), async (req, res) => {
    try {
        // Only allow if user is matching their own ID OR is an admin
        if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        const orders = await Order.find({ user: req.params.userId })
            .populate("items.food");
        res.json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

// DAILY SALES (ADMIN ONLY)
router.get("/sales/today", auth(["admin"]), async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sales = await Order.aggregate([
            { $match: { createdAt: { $gte: today } } },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);
        res.json(sales);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
