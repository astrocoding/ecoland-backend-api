const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 8080;


db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const landRoutes = require('./routes/landRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

app.use('/auth', authRoutes);
app.use('/lands', landRoutes);
app.use('/rentals', rentalRoutes);
app.use('/transactions', transactionRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});