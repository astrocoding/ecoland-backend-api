const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/Transactions');
const authMiddleware = require('../middleware/AuthUser');

router.post('/', authMiddleware, transactionController.createTransaction);
router.get('/', authMiddleware, transactionController.getTransactionsByUserId);
router.put('/:id/status', authMiddleware, transactionController.updateTransactionStatus);

module.exports = router;