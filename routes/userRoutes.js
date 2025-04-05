const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');

// Multer (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CRUD
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUserById);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

// Upload profile picture
router.post('/:userId/profile-pic', upload.single('image'), userController.uploadProfilePic);

module.exports = router;
