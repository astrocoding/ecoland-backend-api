import express from "express";
import { getTransactions, getTransactionById, createTransaction, updateTransactionStatus, deleteTransaction } from "../controllers/Transactions.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/transactions', verifyUser, getTransactions);
router.get('/transactions/:id', verifyUser, getTransactionById);
router.post('/transactions', verifyUser, createTransaction);
router.patch('/transactions/:id', verifyUser, adminOnly, updateTransactionStatus);
router.delete('/transactions/:id', verifyUser, adminOnly, deleteTransaction);

export default router;
