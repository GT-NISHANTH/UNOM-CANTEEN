const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    rollNo: {
        type: String
    },

    mobile: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String
    },

    username: {
        type: String,
        sparse: true // Allows null/missing for non-admins
    },

    photo: {
        type: String
    },

    password: {
        type: String
    },

    role: {
        type: String,
        enum: ["student", "customer", "admin"],
        default: "customer"
    }
});

module.exports = mongoose.model("User", userSchema);
