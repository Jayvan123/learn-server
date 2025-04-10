const express = require("express");
const { body, param, validationResult } = require("express-validator");
const router = express.Router();
const validationError = require('../utils/validationError');
const authMiddleware = require("../middleware/authMiddleware");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");




// Routes
router.post(
  "/",
  authMiddleware,
  body("name")
    .exists().withMessage("Category name is required.")
    .isString().withMessage("Category name must be a string.")
    .trim()
    .isLength({ min: 2 }).withMessage("Category name must be at least 2 characters long."),
    validationError,
  createCategory
);

router.get(
  "/",
  authMiddleware,
  getCategories
);

router.put(
  "/:id",
  authMiddleware,
  param("id")
    .isMongoId().withMessage("Invalid category ID."),
  body("name")
    .exists().withMessage("Category name is required.")
    .isString().withMessage("Category name must be a string.")
    .trim(),
    validationError,
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  param("id")
    .isMongoId().withMessage("Invalid category ID."),
    validationError,
  deleteCategory
);

module.exports = router;
