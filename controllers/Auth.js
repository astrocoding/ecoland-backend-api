import User from "../models/UserModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const secretKey = 'your-secret-key'; // Ganti dengan kunci rahasia Anda yang aman

export const Login = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });

    const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
    const uuid = user.uuid;
    const name = user.name;
    const email = user.email;
    const role = user.role;
    res.status(200).json({ uuid, name, email, role, token });
};

export const Register = async (req, res) => {
    const { name, email, password } = req.body;
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "user"
        });
        res.status(201).json({ msg: "Daftar akun berhasil!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const Me = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ msg: "harap login" });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "harap login" });

    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: {
                id: decoded.userId
            }
        });
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
        res.status(200).json(user);
    } catch (error) {
        return res.status(403).json({ msg: "Token tidak valid" });
    }
};

export const logOut = (req, res) => {
    // Tidak ada aksi spesifik untuk logout dengan JWT di server
    res.status(200).json({ msg: "Anda telah logout" });
};
