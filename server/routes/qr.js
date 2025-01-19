const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const multer = require('multer');

// Set up multer for image handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

// Route to create a QR code (with image upload)
router.post('/create', upload.single('qrImage'), qrController.createQRCode);

// Route to fetch all QR codes
router.get('/', qrController.getQRCodes);

// Route to delete a QR code by ID
router.delete('/:id', qrController.deleteQRCode);

module.exports = router;
