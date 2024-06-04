const db = require('../config/db');

const createTransaction = async (req, res) => {
  const { rentalId, amount, paymentType } = req.body;

  try {
    const [rentalRows] = await db.execute('SELECT * FROM rentals WHERE id = ?', [rentalId]);
    if (rentalRows.length === 0) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    const [result] = await db.execute('INSERT INTO transactions (rental_id, amount, payment_type, status) VALUES (?, ?, ?, ?)', [rentalId, amount, paymentType, 'pending']);
    res.status(201).json({ message: 'Transaction created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating transaction' });
  }
};

const getTransactionsByUserId = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [rows] = await db.execute('SELECT * FROM transactions WHERE rental_id IN (SELECT id FROM rentals WHERE user_id = ?)', [userId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};

const updateTransactionStatus = async (req, res) => {
  const transactionId = req.params.id;
  const { status } = req.body;

  try {
    const [result] = await db.execute('UPDATE transactions SET status = ? WHERE id = ?', [status, transactionId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating transaction status' });
  }
};

module.exports = {
  createTransaction,
  getTransactionsByUserId,
  updateTransactionStatus
};
