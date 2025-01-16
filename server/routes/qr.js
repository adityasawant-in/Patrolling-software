const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post('/create', upload.single('qrImage'), qrController.createQRCode);
// router.get('/', qrController.getQRCodes); 
// router.delete('/:id', qrController.deleteQRCode);

module.exports = router;
