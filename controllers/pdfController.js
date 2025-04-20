const pdf = require('pdf-parse');
const fs = require('fs').promises;

/**
 * Extracts text from a single PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} Extracted text
 */
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (err) {
    throw new Error(`PDF extraction failed: ${err.message}`);
  }
};

/**
 * Handles single/multiple PDF uploads and extracts text
 * @param {Express.Request} req - Express request object (with Multer files)
 * @param {Express.Response} res - Express response object
 */
const extractPDFText = async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No PDF files uploaded.' });
    }

    const results = [];
    for (const file of req.files) {
      try {
        const text = await extractTextFromPDF(file.path);
        results.push({
          originalname: file.originalname,
          text: text,
          status: 'success'
        });

        // Delete the temporary file (optional)
        await fs.unlink(file.path);
      } catch (err) {
        results.push({
          originalname: file.originalname,
          error: err.message,
          status: 'failed'
        });
      }
    }

    // Return extracted text for user review
    res.status(200).json({
      success: true,
      results: results
    });

  } catch (err) {
    res.status(500).json({
      error: 'Server error: ' + err.message
    });
  }
};

module.exports = {
  extractPDFText
};