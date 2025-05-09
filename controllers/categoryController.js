const Category = require("../models/categoryModel");
const { getIO } = require("../lib/socket");
// Controller: Creating a category in the DB
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const existingCategory = await Category.findOne({ name, userId });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists." });
    }

    const newCategory = await Category.create({ name, userId });
    // Match data emitted in the socket event by emitting only necessary properties
    const categoryData = {
      id: newCategory._id.toString(),  // Ensure it's a string if needed
      name: newCategory.name,
    };

    // Send response to the client
    res.status(201).json(categoryData);
    
    // Emit to clients (socket.js part) -- example of the socket interaction 
    // Note: This would be part of the socket server, not in the controller directly
    getIO().emit("new_category", categoryData);  // Emit to all connected clients

  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Get All Categories 
const getCategories = async (req, res) => {
  try {
    const userId = req.user.id;
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
    const userId = req.user.id;

    const existingCategory = await Category.findOne({ name, userId });
    if (existingCategory) {
      return res.status(400).json({ error: "Category with this name already exists." });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, userId },
      { name },
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
    const userId = req.user.id;

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

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
