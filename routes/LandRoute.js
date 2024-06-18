import express from "express";
import {
    getLands,
    getLandById,
    createLand,
    updateLand,
    deleteLand,
    rentalLand
} from "../controllers/Lands.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/lands',verifyUser, getLands);
router.get('/lands/:id',verifyUser, getLandById);
router.patch('/lands/:id',verifyUser, rentalLand);
// Admin only
router.post('/lands-admin',verifyUser, adminOnly, createLand);
router.patch('/lands-admin/:id',verifyUser, adminOnly, updateLand);
router.delete('/lands-admin/:id',verifyUser, adminOnly, deleteLand);

export default router;