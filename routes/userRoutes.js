const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const multer = require('multer');
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    uploadProfilePic
} = require('../controllers/userController');
const authMiddleware = require("../middleware/authMiddleware");
const validationError = require('../utils/validationError');

const storage = multer.memoryStorage();
const upload = multer({ storage });




// Get All Users
router.get('/', 
    authMiddleware,
    getAllUsers);

// Get User by ID
router.get(
  '/:userId',
  authMiddleware,
  param('userId').isMongoId().withMessage('Invalid user ID'),
  validationError,
  getUserById
);

// Update User
router.put(
  '/:userId',
  authMiddleware,
  param('userId').isMongoId().withMessage('Invalid user ID'),
  body('firstName')
    .optional()
    .isString().withMessage('First name must be a string')
    .notEmpty().withMessage('First name cannot be empty'),
  body('lastName')
    .optional()
    .isString().withMessage('Last name must be a string')
    .notEmpty().withMessage('Last name cannot be empty'),
  body('username')
    .optional()
    .isString().withMessage('Username must be a string')
    .notEmpty().withMessage('Username cannot be empty'),
  body('email')
    .optional()
    .isString().withMessage('Email must be a string')
    .isEmail().withMessage('Must be a valid email'),
  body('password')
    .optional()
    .isString().withMessage('Password must be a string')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validationError,
  updateUser
);

// Delete User
router.delete(
  '/:userId',
  authMiddleware,
  param('userId').isMongoId().withMessage('Invalid user ID'),
  validationError,
  deleteUser
);

// Upload Profile Pic
router.post(
  '/:userId/profile-pic',
  authMiddleware,
  param('userId').isMongoId().withMessage('Invalid user ID'),
  upload.single('image'),
  validationError,
  uploadProfilePic
);

module.exports = router;
