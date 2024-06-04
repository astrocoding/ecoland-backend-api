const db = require('../config/db');

const getAllLands = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM lands WHERE availability = 1');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching lands' });
  }
};

const getLandById = async (req, res) => {
  const landId = req.params.id;

  try {
    const [rows] = await db.execute('SELECT * FROM lands WHERE id = ? AND availability = 1', [landId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Land not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching land' });
  }
};

const createLand = async (req, res) => {
  const { name, location, description, size, price_per_day, verified } = req.body;

  try {
    const [result] = await db.execute('INSERT INTO lands (name, location, description, size, price_per_day, verified, availability) VALUES (?, ?, ?, ?, ?, ?, 1)', [name, location, description, size, price_per_day, verified]);
    res.status(201).json({ message: 'Land created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating land' });
  }
};

const updateLand = async (req, res) => {
  const landId = req.params.id;
  const { name, location, description, size, price_per_day, verified, availability } = req.body;

  try {
    const [result] = await db.execute('UPDATE lands SET name = ?, location = ?, description = ?, size = ?, price_per_day = ?, verified = ?, availability = ? WHERE id = ?', [name, location, description, size, price_per_day, verified, availability, landId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Land not found' });
    }
    res.json({ message: 'Land updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating land' });
  }
};

const deleteLand = async (req, res) => {
  const landId = req.params.id;

  try {
    const [result] = await db.execute('DELETE FROM lands WHERE id = ?', [landId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Land not found' });
    }
    res.json({ message: 'Land deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting land' });
  }
};

const filterLandsByLocation = async (req, res) => {
  const location = req.query.location;

  try {
    const [rows] = await db.execute('SELECT * FROM lands WHERE location LIKE ? AND availability = 1', [`%${location}%`]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching lands' });
  }
};

const searchLands = async (req, res) => {
  const keyword = req.query.keyword;

  try {
    const [rows] = await db.execute('SELECT * FROM lands WHERE name LIKE ? OR location LIKE ? AND availability = 1', [`%${keyword}%`, `%${keyword}%`]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching lands' });
  }
};

module.exports = { 
  getAllLands,
  getLandById,
  createLand,
  updateLand,
  deleteLand,
  filterLandsByLocation,
  searchLands
};
