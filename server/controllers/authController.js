// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Assuming you have a User model

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id }, // You can include other data here as needed
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send the token as a cookie
    res.cookie('authToken', token, {
      httpOnly: true, // Makes the cookie inaccessible to JavaScript (security)
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
      sameSite: 'Strict', // Makes the cookie only sent in the same-site context
      maxAge: 3600000, // 1 hour expiration
    });

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: 'Logged out successfully' });
};

// Verify JWT Token (protected route)
exports.verify = (req, res) => {
  res.json({ message: 'User is authenticated', user: req.user });
};
