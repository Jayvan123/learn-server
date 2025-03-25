const express = require("express");
const router = express.Router();
const { createCategory, getCategories, updateCategory, deleteCategory } = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const { validateCategory, validateCategoryId } = require("../middleware/validators/categoryValidator");

router.post("/", 
    authMiddleware, 
    validateCategory, 
    createCategory
);

router.get("/", 
    authMiddleware, 
    getCategories
);

router.put("/:id", 
    authMiddleware, 
    validateCategoryId, 
    validateCategory, 
    updateCategory
);

router.delete("/:id", 
    authMiddleware, 
    validateCategoryId, 
    deleteCategory
);

module.exports = router;
