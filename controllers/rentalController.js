const db = require('../config/db');

const createRental = async (req, res) => {
  const { landId, userId, startDate, endDate } = req.body;

  try {
    const [landRows] = await db.execute('SELECT * FROM lands WHERE id = ? AND availability = 1', [landId]);
    if (landRows.length === 0) {
      return res.status(404).json({ message: 'Land not found or unavailable' });
    }

    const land = landRows[0];
    const price = land.price_per_day * (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

    const [result] = await db.execute('INSERT INTO rentals (land_id, user_id, start_date, end_date, price, status) VALUES (?, ?, ?, ?, ?, ?)', [landId, userId, startDate, endDate, price, 'pending']);
    res.status(201).json({ message: 'Rental request created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating rental request' });
  }
};

const getRentalsByUserId = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [rows] = await db.execute('SELECT * FROM rentals WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching rentals' });
  }
};

const getRentalById = async (req, res) => {
  const rentalId = req.params.id;

  try {
    const [rows] = await db.execute('SELECT * FROM rentals WHERE id = ?', [rentalId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching rental' });
  }
};

const updateRentalStatus = async (req, res) => {
  const rentalId = req.params.id;
  const { status } = req.body;

  try {
    const [result] = await db.execute('UPDATE rentals SET status = ? WHERE id = ?', [status, rentalId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    res.json({ message: 'Rental status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating rental status' });
  }
};

module.exports = {
  createRental,
  getRentalsByUserId,
  getRentalById,
  updateRentalStatus
};