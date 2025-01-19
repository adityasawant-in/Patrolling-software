const QRCodeModel = require('../models/QRCode');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

exports.createQRCode = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { buildingName, location, uniqueCode } = req.body;

    // Check if file is provided in the request
    console.log("file : ", req?.file);
    
    if (!buildingName || !location || !uniqueCode) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'QR code image is required' });
    }

    // Convert the file buffer to base64
    const fileStr = req.file.buffer.toString('base64');

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

// Fetch QR codes
exports.getQRCodes = async (req, res) => {
  try {
    const qrCodes = await QRCodeModel.find();
    res.status(200).json(qrCodes);
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    res.status(500).json({ message: 'Failed to fetch QR codes' });
  }
};

// Delete QR code
exports.deleteQRCode = async (req, res) => {
  try {
    const qrCode = await QRCodeModel.findById(req.params.id);
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    // Optionally, delete from Cloudinary as well
    await cloudinary.uploader.destroy(qrCode.public_id);

    await QRCodeModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'QR code deleted successfully' });
  } catch (error) {
    console.error('Error deleting QR code:', error);
    res.status(500).json({ message: 'Failed to delete QR code', error: error.message });
  }
};
