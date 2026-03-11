const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", async (req, res) => {
    try {
        const { name, mobile, password, role, rollNo, username, email, photo } = req.body;

        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const user = new User({
            name,
            mobile,
            password: hashedPassword,
            role,
            rollNo,
            username,
            email,
            photo
        });

        await user.save();

        res.json({
            message: "User registered successfully"
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user & get token (Categorized: Student, Customer, Admin)
router.post("/login", async (req, res) => {
    try {
        const { role, mobile, password, rollNo, username, email } = req.body;
        let user;

        if (role === 'student') {
            // Student login: rollNo and mobile
            user = await User.findOne({ rollNo, mobile, role: 'student' });
            if (!user) return res.status(400).json({ message: "Student record not found" });
            // For students, we bypass password check as per requirements (rollNo + phone)
        } else if (role === 'admin') {
            // Admin login: username, email, and password
            user = await User.findOne({ username, email, role: 'admin' });
            if (!user) return res.status(400).json({ message: "Admin record not found" });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(400).json({ message: "Invalid admin credentials" });
        } else {
            // Default/Customer login: mobile and password
            user = await User.findOne({ mobile, role: 'customer' });
            if (!user) return res.status(400).json({ message: "Customer not found" });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                mobile: user.mobile,
                role: user.role,
                rollNo: user.rollNo,
                email: user.email,
                photo: user.photo
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
