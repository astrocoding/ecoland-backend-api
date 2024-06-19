import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import { Storage } from '@google-cloud/storage';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import db from "./config/db.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import LandRoute from "./routes/LandRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import TransactionRoute from "./routes/TransactionsRoute.js";
import HistoryRoute from "./routes/HistoryRoute.js";
import bodyParser from 'body-parser';

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

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

(async()=>{
    await db.sync();
})();

app.use(session({
    secret: 'hxaqfgKv172cvNFvzKmLFkVhYPYWNXQc',
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto',
        httpOnly: true,
        sameSite: 'lax',
        domain: '.onrender.com'
    }
}));

app.use(cors({
    credentials: true,
    origin: ['https://ecoland-frontend-test.vercel.app']
}));

app.use(express.json());
app.use(UserRoute);
app.use(LandRoute);
app.use(AuthRoute);
app.use(TransactionRoute);
app.use(HistoryRoute);

store.sync();

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
