const { body, param, validationResult } = require("express-validator");


const validateCategory = [
  body("name")
    .trim()
    .notEmpty().withMessage("Category name is required."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


const validateCategoryId = [
  param("id")
    .isMongoId().withMessage("Invalid category ID."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateCategory, validateCategoryId };