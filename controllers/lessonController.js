const Lesson = require("../models/lessonModel");
const Category =require("../models/categoryModel")

// Create a new lesson
exports.createLesson = async (req, res) => {
  try {
    console.log("User in Request:", req.user);

    const { title, content, categoryName } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized. No user attached to request." });
    }

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required." });
    }

    // Use provided category name or fallback to "default"
    const categoryToFind = categoryName?.trim() || "default";

    // Check if the category exists, if not, create it
    let category = await Category.findOne({ name: categoryToFind, userId });

    if (!category) {
      category = await Category.create({ name: categoryToFind, userId });
    }

    // Create the lesson with the found or newly created category
    const newLesson = await Lesson.create({
      userId,
      title,
      content,
      categoryId: category._id,
    });

    res.status(201).json(newLesson);
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Get all lessons for the logged-in user
exports.getLessons = async (req, res) => {
  try {
    const userId = req.user.id;
    const lessons = await Lesson.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a single lesson by ID
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    res.status(200).json(lesson);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a lesson
exports.updateLesson = async (req, res) => {
  try {
    const { title, content } = req.body;
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    // Update fields if provided
    if (title) lesson.title = title;
    if (content) lesson.content = content;

    await lesson.save();
    res.status(200).json({ message: "Lesson updated successfully", lesson });
  } catch (error) {
    console.error("Error updating lesson:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a lesson
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    await lesson.deleteOne();
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
