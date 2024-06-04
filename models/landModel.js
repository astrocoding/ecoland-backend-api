const db = require('../config/db');

const getAllLands = async () => {
  try {
    const [rows] = await db.execute('SELECT * FROM lands WHERE availability = 1');
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getLandById = async (landId) => {
  try {
    const [rows] = await db.execute('SELECT * FROM lands WHERE id = ?', [landId]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createLand = async (landData) => {
  try {
    const [result] = await db.execute('INSERT INTO lands (name, location, description, size, price_per_day, verified) VALUES (?, ?, ?, ?, ?, ?)', [landData.name, landData.location, landData.description, landData.size, landData.price_per_day, landData.verified]);
    return result.insertId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateLand = async (landId, landData) => {
  try {
    const [result] = await db.execute('UPDATE lands SET name = ?, location = ?, description = ?, size = ?, price_per_day = ?, verified = ?, availability = ? WHERE id = ?', [landData.name, landData.location, landData.description, landData.size, landData.price_per_day, landData.verified, landData.availability, landId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteLand = async (landId) => {
  try {
    const [result] = await db.execute('DELETE FROM lands WHERE id = ?', [landId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const filterLandsByLocation = async (location) => {
  try {
    const [rows] = await db.execute('SELECT * FROM lands WHERE location LIKE ? AND availability = 1', [`%${location}%`]);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const searchLands = async (searchTerm) => {
  try {
    const [rows] = await db.execute('SELECT * FROM lands WHERE name LIKE ? OR description LIKE ? AND availability = 1', [`%${searchTerm}%`, `%${searchTerm}%`]);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
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
