const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  buildingName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  uniqueCode: {
    type: String,
    required: true
  },
  qrCodeUrl: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('QRCode', qrCodeSchema);