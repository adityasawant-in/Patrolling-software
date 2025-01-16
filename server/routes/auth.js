const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.route('/login').post(authController.login);
router.route('/logout').post(authController.logout);
router.route('/verify').get( authController.verify);

module.exports = router;


