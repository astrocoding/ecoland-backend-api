import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Storage } from '@google-cloud/storage';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import db from "./config/db.js";
import UserRoute from "./routes/UserRoute.js";
import LandRoute from "./routes/LandRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import TransactionRoute from "./routes/TransactionsRoute.js";
import HistoryRoute from "./routes/HistoryRoute.js";
import bodyParser from 'body-parser';
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Konfigurasi ES Module untuk mendapatkan __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Sinkronisasi database
(async()=>{
    await db.sync();
})();

// Middleware untuk memverifikasi token JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "Mohon login ke akun Anda!" });

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ msg: "Token tidak valid" });
        req.userId = decoded.uuid;
        next();
    });
};

// app.use(cors({
//     credentials: true,
//     origin: ['https://ecoland-frontend.vercel.app/', 'http://localhost:5173']
// }));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(AuthRoute);
app.use(UserRoute);
app.use(LandRoute);
app.use(TransactionRoute);
app.use(HistoryRoute);

// Google Cloud Storage setup
const gc = new Storage({
    keyFilename: path.join(__dirname, './keys/submission-mgce-zaenalalfian-0-d30d4045eddc.json'),
    projectId: 'submission-mgce-zaenalalfian-0',
});

const bucket = gc.bucket('submission-zaenalalfian');

// Fungsi untuk membuat nama file acak
const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const randomFileName = generateRandomString(8) + path.extname(req.file.originalname);
    const blob = bucket.file(randomFileName);
    const blobStream = blob.createWriteStream({
        resumable: false,
    });

    blobStream.on('error', (err) => {
        console.error(err);
        res.status(500).send({ message: 'Error uploading file.', error: err });
    });

    blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        res.status(200).send({ message: 'File uploaded successfully.', url: publicUrl });
    });

    blobStream.end(req.file.buffer);
});

app.get('/', (req, res) => {
  res.json({ message: 'Server berhasil berjalan tanpa masalah' });
});

const PORT = 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, ()=> {
    console.log('Server up and running...');
});
