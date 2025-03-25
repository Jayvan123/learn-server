const Category = require("../models/categoryModel");

// Create a Category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user?.id;

    const trimmedName = name.trim();
    const existingCategory = await Category.findOne({ name: trimmedName, userId });

    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists." });
    }

    const newCategory = await Category.create({ name: trimmedName, userId });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get All Categories 
const getCategories = async (req, res) => {
  try {
    const userId = req.user?.id;
    const categories = await Category.find({ userId });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a Category 
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const userId = req.user?.id;

    const trimmedName = name.trim();
    const existingCategory = await Category.findOne({ name: trimmedName, userId });

    if (existingCategory) {
      return res.status(400).json({ error: "Category with this name already exists." });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, userId },
      { name: trimmedName },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const deletedCategory = await Category.findOneAndDelete({ _id: id, userId });

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };
