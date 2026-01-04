const express = require('express');
const { signup, login, forgetPassword, resetPassword, verifyotp, resendOtp, getAllUsers } = require('../controller/user.controller');
const isAuth = require('../config/authe');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/forget-password', forgetPassword);
router.put('/reset-password', resetPassword);
router.put('/verify-otp', verifyotp);
router.put('/resend-otp', resendOtp);
router.get('/get-All-users', isAuth, getAllUsers);

module.exports = router;