const User = require('../models/user.models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendTemplateEmail } = require('../config/email');

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    const newUser = new User({ name, email, password: hashedPassword, otp, otpExpiry });
    await newUser.save();

    await sendTemplateEmail(email, 'Verify your account', 'verify_account', { name, otp });

    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ message: 'All fields are required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'User not found.' });
    if (!user.isVerified) return res.status(403).json({ message: 'User is not verified.' });

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = await jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    try {
      await sendTemplateEmail(user.email, 'Login Notification', 'login_notification', { name: user.name, time: new Date().toISOString(), ip: req.ip });
    } catch (err) {
      console.warn('Failed to send login notification:', err.message || err);
    }

    return res.status(200).json({ message: 'Login successful.', token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
    await user.save();

    await sendTemplateEmail(user.email, 'Password Reset OTP', 'forgot_password', { name: user.name || '', otp });

    return res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error during password reset:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

const resetPassword = async (req, res) => {
  const { otp, newPassword } = req.body;
  try {
    if (!otp || !newPassword) return res.status(400).json({ message: 'All fields are required.' });

    const user = await User.findOne({ otp });
    if (!user) return res.status(400).json({ message: 'Invalid OTP.' });
    if (user.otpExpiry && user.otpExpiry < Date.now()) return res.status(400).json({ message: 'OTP has expired.' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    try {
      await sendTemplateEmail(user.email, 'Password Reset Successful', 'reset_success', { name: user.name || '' });
    } catch (err) {
      console.warn('Failed to send reset-success email:', err.message || err);
    }

    return res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error during password reset:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

const verifyotp = async (req, res) => {
  const { otp } = req.body;
  try {
    if (!otp) return res.status(400).json({ message: 'OTP is required.' });
    const user = await User.findOne({ otp });
    if (!user) return res.status(400).json({ message: 'Invalid OTP.' });
    if (user.otpExpiry && user.otpExpiry < Date.now()) return res.status(400).json({ message: 'OTP has expired.' });

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    return res.status(200).json({ message: 'User verified successfully.' });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ message: 'Email is required.' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
    await user.save();

    try {
      await sendTemplateEmail(user.email, 'Your OTP', 'verify_account', { name: user.name || '', otp });
    } catch (err) {
      console.warn('Failed to send OTP email:', err.message || err);
    }

    return res.status(200).json({ message: 'OTP resent successfully.' });
  } catch (error) {
    console.error('Error during resending OTP:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

const getAllUsers = async (req, res) => {
  const { userId } = req.user;
  try {
    const adminUser = await User.findById(userId);
    if (adminUser.role !== 'admin') return res.status(403).json({ message: 'Access denied. Admins only.' });
    const users = await User.find().select('-password -otp -otpExpiresAt');
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { signup, login, forgetPassword, resetPassword, verifyotp, resendOtp, getAllUsers };