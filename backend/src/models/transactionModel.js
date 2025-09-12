const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: { type: Date, default: Date.now }
}
)

module.exports = mongoose.model('Transaction', transactionSchema);