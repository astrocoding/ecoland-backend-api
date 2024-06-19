import express from "express";
import { Login, Register, Me } from "../controllers/Auth.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/me', verifyUser, Me);
router.post('/login', Login);
router.post('/register', Register);

// Untuk route logout, tidak perlu middleware karena JWT bersifat stateless dan tidak memerlukan logout server-side
router.delete('/logout', logOut); 

export default router;
