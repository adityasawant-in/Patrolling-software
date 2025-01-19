// server/server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const QRCodeModel = require('./models/QRCode');

require('dotenv').config();

const app = express();

// Updated CORS configuration
app.use(cors({
  origin: "http://localhost:5173" , // Add both frontend URLs
  credentials: true, // Allow cookies to be sent with requests
}))

//delete qr logic
app.delete('/api/qr/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Request to delete QR code with ID: ${id}`);

    if (!id) {
      return res.status(400).json({ message: 'ID parameter is required' });
    }

    const deletedQRCode = await QRCodeModel.findByIdAndDelete(id);

    if (!deletedQRCode) {
      console.error(`QR code with ID: ${id} not found`);
      return res.status(404).json({ message: 'QR code not found' });
    }

    console.log(`QR code with ID: ${id} deleted successfully`);
    res.status(200).json({ message: 'QR code deleted successfully' });
  } catch (error) {
    console.error('Error deleting QR code:', error.message);
    res.status(500).json({ message: 'Failed to delete QR code', error: error.message });
  }
});



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
