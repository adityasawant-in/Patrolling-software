// routes/protected.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// A protected route that only authenticated users can access
router.route('/dashboard').get((req, res) => {
  res.json({ message: 'Welcome to your dashboard', user: req.user });
});

module.exports = router;
