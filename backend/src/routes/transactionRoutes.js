const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const { addTransactions, getTransaction, getAllTransactions, editTransaction, deleteTransaction } = require("../controllers/transactionController");

const router = express.Router();

router.use(verifyToken)

router.post("/add", addTransactions);
router.get("/", getAllTransactions);
router.get("/:id", getTransaction);
router.patch("/:id/edit", editTransaction);
router.delete("/:id/delete", deleteTransaction);

module.exports = router;