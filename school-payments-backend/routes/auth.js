const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if(!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
  try {
    const exists = await User.findOne({ email });
    if(exists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, role });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ message: 'Email and password required' });
  try {
    const user = await User.findOne({ email });
    if(!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await user.matchPassword(password);
    if(!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (admin only)
const { protect, admin } = require('../middleware/auth');
router.get('/users', protect, admin, async (req,res)=>{
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch(error){
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
