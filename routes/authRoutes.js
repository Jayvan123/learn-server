const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const User = require('../models/userModel');
const validationError = require('../utils/validationError');

const router = express.Router();

router.post('/register', 
  body('firstName').isString().notEmpty().withMessage('First name is required'),
  body('lastName').isString().notEmpty().withMessage('Last name is required'),
  body('username')
    .isString().notEmpty().withMessage('Username is required')
    .custom(async (username) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) throw new Error('Username already exists');
    }),
  body('email')
    .isEmail().withMessage('Invalid email format')
    .custom(async (email) => {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) throw new Error('Email already exists');
    }),
  body('password')
    .isString()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
, validationError, register);


router.post('/login', 
  body('username').isString().notEmpty().withMessage('Username is required'),
  body('password').isString().notEmpty().withMessage('Password is required')
, validationError, login);

module.exports = router;
