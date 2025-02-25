const Lesson = require("../models/Lesson");

// 📌 Create a new lesson
exports.createLesson = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id; // Assuming user is authenticated

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required." });
    }

    const newLesson = await Lesson.create({ userId, title, content });
    res.status(201).json(newLesson);
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 📌 Get all lessons for the logged-in user
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

// 📌 Get a single lesson by ID
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

// 📌 Update a lesson
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

// 📌 Delete a lesson
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
