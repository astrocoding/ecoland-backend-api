const express = require('express');
const router = express.Router();
const landController = require('../controllers/Lands');
const authMiddleware = require('../middleware/AuthUser');

router.get('/', authMiddleware.authMiddleware, landController.getAllLands); 
router.get('/:id', authMiddleware.authMiddleware, landController.getLandById);
router.post('/', authMiddleware.authMiddleware, authMiddleware.isAdminMiddleware, landController.createLand);
router.put('/:id', authMiddleware.authMiddleware, authMiddleware.isAdminMiddleware, landController.updateLand); // Auth first, then isAdmin
router.delete('/:id', authMiddleware.authMiddleware, authMiddleware.isAdminMiddleware, landController.deleteLand); // Auth first, then isAdmin
router.get('/filter', authMiddleware.authMiddleware, landController.filterLandsByLocation);
router.get('/search', authMiddleware.authMiddleware, landController.searchLands);

module.exports = router;