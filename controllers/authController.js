const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Register
const register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({ firstName, lastName, username, email, password: hashedPassword }).save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login with username
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const { _id, firstName, lastName, email } = user;
    res.json({ 
      token, 
      user: { id: _id, firstName, lastName, username, email } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };
