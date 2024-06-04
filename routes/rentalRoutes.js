const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, rentalController.createRental);
router.get('/', authMiddleware, rentalController.getRentalsByUserId);
router.get('/:id', authMiddleware, rentalController.getRentalById);
router.put('/:id/status', authMiddleware, rentalController.updateRentalStatus);

module.exports = router;