const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, 
      required: true, 
      trim: true 
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
  }
);


CategorySchema.index(
  { 
    name: 1, 
    userId: 1 
  }, 
  { 
    unique: true 
  }
);

module.exports = mongoose.model("Category", CategorySchema);
