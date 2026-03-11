const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    items: [
        {
            food: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food"
            },
            quantity: Number
        }
    ],

    totalAmount: {
        type: Number
    },

    status: {
        type: String,
        default: "Preparing"
    },

    tokenNumber: {
        type: Number
    },

    paymentStatus: {
        type: String,
        default: "Pending"
    }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
