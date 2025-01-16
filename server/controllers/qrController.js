// server/controllers/qrController.js
const QRCodeModel = require('../models/QRCode');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

exports.createQRCode = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { buildingName, location, uniqueCode } = req.body;

    console.log("file : ", req?.file);
    
    if (!buildingName || !location || !uniqueCode) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Convert the file buffer to base64
    const fileStr = req.file ? req.file.buffer.toString('base64') : null;
    
    if (!fileStr) {
      return res.status(400).json({ message: 'QR code image is required' });
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(
      `data:image/png;base64,${fileStr}`,
      { 
        folder: 'qrcodes',
        resource_type: 'image'
      }
    );

    // Create new QR code document
    const qrCode = new QRCodeModel({
      buildingName,
      location,
      uniqueCode,
      qrCodeUrl: uploadResponse.secure_url,
    });

    await qrCode.save();
    console.log('Saved QR code:', qrCode);
    
    res.status(201).json(qrCode);
  } catch (error) {
    console.error('QR Code creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create QR code',
      error: error.message 
    });
  }
};