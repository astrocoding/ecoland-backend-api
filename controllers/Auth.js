import User from "../models/UserModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

// Secret key untuk menandatangani token JWT
const SECRET_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTg4MTM5MDIsImV4cCI6MTc1MDM0OTkwMiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.2HsoyOpk4pUbm71yBHpBVDgvRhxUSgMkmbN-eW6scGQ';

export const Login = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });

    const uuid = user.uuid;
    const name = user.name;
    const email = user.email;
    const role = user.role;

    // Buat token JWT
    const token = jwt.sign({ uuid, name, email, role }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ token, uuid, name, email, role });
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
    const user = await User.findOne({
        attributes: ['uuid', 'name', 'email', 'role'],
        where: {
            uuid: req.user.uuid
        }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    res.status(200).json(user);
};

// Fungsi logout tidak diperlukan lagi karena JWT bersifat stateless
export const logOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
        res.status(200).json({ msg: "Anda telah logout" });
    });
};

