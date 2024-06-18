const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/History');
const authMiddleware = require('../middleware/AuthUser');

router.post('/', authMiddleware, rentalController.createRental);
router.get('/', authMiddleware, rentalController.getRentalsByUserId);
router.get('/:id', authMiddleware, rentalController.getRentalById);
router.put('/:id/status', authMiddleware, rentalController.updateRentalStatus);

module.exports = router;