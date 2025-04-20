const express = require('express');
const multer = require('multer');
const { extractPDFText } = require('../controllers/pdfController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage

// Handle PDF uploads (single or multiple)
router.post('/extract-text', upload.array('pdfs'), extractPDFText);

module.exports = router;