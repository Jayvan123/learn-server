// routes/userRoutes.js
const express = require('express');
const { searchUsers } = require('../controllers/userController'); // Adjust the path according to your project structure

const router = express.Router();

// Search users by first name, last name, or username
router.get('/search', searchUsers);

module.exports = router;
