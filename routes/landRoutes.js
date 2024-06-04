const express = require('express');
const router = express.Router();
const landController = require('../controllers/landController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdminMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, landController.getAllLands);
router.get('/:id', authMiddleware, landController.getLandById);
router.post('/', authMiddleware, isAdminMiddleware, landController.createLand);
router.put('/:id', authMiddleware, isAdminMiddleware, landController.updateLand);
router.delete('/:id', authMiddleware, isAdminMiddleware, landController.deleteLand);
router.get('/filter', authMiddleware, landController.filterLandsByLocation);
router.get('/search', authMiddleware, landController.searchLands);

module.exports = router;