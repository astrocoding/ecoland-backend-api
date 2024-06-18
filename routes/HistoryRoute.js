import express from 'express';
import { getHistory } from '../controllers/History.js';
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

// GET history by user ID
router.get('/history/:id', verifyUser, getHistory);

export default router;
