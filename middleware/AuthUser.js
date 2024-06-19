import jwt from 'jsonwebtoken';
import User from "../models/UserModel.js";

const secretKey = 'hxaqfgKv172cvNFvzKmLFkVhYPYWNXQc'; // Ganti dengan kunci rahasia Anda yang aman

export const verifyUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findOne({
            where: {
                id: decoded.userId
            }
        });

        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
        
        req.userId = user.id;
        req.role = user.role;
        next();
    } catch (error) {
        return res.status(403).json({ msg: "Token tidak valid" });
    }
};

export const adminOnly = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findOne({
            where: {
                id: decoded.userId
            }
        });

        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
        if (user.role !== "admin") return res.status(403).json({ msg: "Akses terlarang" });
        
        next();
    } catch (error) {
        return res.status(403).json({ msg: "Token tidak valid" });
    }
};
