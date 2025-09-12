const Transaction = require("../models/transactionModel");

//add transaction
const addTransactions = async (req, res) => {
    try {
        const { title, amount, category, createdAt } = req.body;
        if (!title || !amount || !category) {
            return res.status(400).json({ message: "Title,amount and category is required" });
        }

        const newTransaction = new Transaction({
            title,
            amount,
            category,
            user: req.user.id,
            createdAt: createdAt ? new Date(createdAt) : undefined
        });

        await newTransaction.save();
        return res.status(201).json({ message: "New Transaction added successfully", newTransaction });
    } catch (error) {
        console.error("Error in transaction controller: ", error.message); 
        return res.status(500).json("Server Error");
    }
}

//get one transaction
const getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById({
            _id: req.params.id,
            user: req.user.id
        });
        if (!transaction) return res.status(404).json({ message: "No Transaction found" });

        res.status(200).json({ transaction });
    } catch (error) {
        console.error("Error in getTransaction controller: ", error); 
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

//get all transactions
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id });
        if (!transactions.length) {
            return res.status(404).json({ message: "No Transactions Found" });
        }
        return res.status(200).json(transactions);
    } catch (error) {
        console.error("Error in getAllTransactions: ", error.message); 
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

//edit transaction
const editTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        const { title, amount, category, createdAt } = req.body;
        let updated = false;

        if (title) { transaction.title = title; updated = true; }
        if (amount) { transaction.amount = amount; updated = true; }
        if (category) { transaction.category = category; updated = true; }
        if (createdAt) { transaction.createdAt = new Date(createdAt); updated = true; } 

        if (!updated) {
            return res.status(400).json({ message: "No valid field to update" });
        }

        await transaction.save();

        return res.status(200).json({
            message: "Transaction updated successfully",
            transaction
        });

    } catch (error) {
        console.error("Error in editTransaction controller: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


//delete transaction
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        await transaction.deleteOne();

        return res.status(200).json({ message: "Transaction deleted successfully", transaction });
    } catch (error) {
        console.error("Error in deleteTransaction: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { addTransactions, getTransaction, getAllTransactions, editTransaction, deleteTransaction };