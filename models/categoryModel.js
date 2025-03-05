const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Ensure each user has unique category names
CategorySchema.index({ name: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Category", CategorySchema);
