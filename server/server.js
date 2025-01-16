// server/server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Updated CORS configuration
app.use(cors({
  origin: "*" , // Add both frontend URLs
  credentials: true, // Allow cookies to be sent with requests
}))

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/qr', require('./routes/qr'));

// Database connection
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
