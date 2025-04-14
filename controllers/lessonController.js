const Lesson = require("../models/lessonModel");
const Category =require("../models/categoryModel")

// Create a new lesson
const createLesson = async (req, res) => {
  try {
    const { title, content, categoryName } = req.body;
    const userId = req.user?.id;

    const categoryToFind = categoryName?.trim() || "default";

    let category = await Category.findOne({ name: categoryToFind, userId });

    if (!category) {
      category = await Category.create({ name: categoryToFind, userId });
    }

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
const getLessons = async (req, res) => {
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
const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    res.status(200).json(lesson);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { title, content } = req.body;

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });


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
const deleteLesson = async (req, res) => {
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

const getLatestLessons = async (req, res) => {
  try {
    const userId = req.params.userId;

    const latestLessons = await Lesson.find({ userId })
      .sort({ createdAt: -1 }) // latest first
      .limit(5)
      .populate("categoryId", "name"); // optional: populate category name

    res.status(200).json({ lessons: latestLessons });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch latest lessons", error });
  }
};

const countUserLessons = async (req, res) => {
  try {
    const userId = req.params.userId;

    const lessonCount = await Lesson.countDocuments({ userId });

    res.status(200).json({ total: lessonCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to count user's lessons", error });
  }
};

module.exports = { 
  createLesson, 
  getLessons, 
  getLessonById, 
  updateLesson, 
  deleteLesson, 
  getLatestLessons,
  countUserLessons
};