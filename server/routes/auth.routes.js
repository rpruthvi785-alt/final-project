const express = require('express');
const router = express.Router();
const { signup, login, getMe, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
