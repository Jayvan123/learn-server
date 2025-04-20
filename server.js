
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const dbConnection = require("./lib/db");
const authRoutes = require("./routes/authRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const questionRoutes = require("./routes/questionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const attemptRoutes = require("./routes/attemptRoutes");
const pdfRoutes = require("./routes/pdfRoutes");

dotenv.config();
const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();
const PORT = process.env.PORT || 5000;

console.log(process.env.CLOUDINARY_API_KEY);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", 
             "https://thinkbox.vercel.app", 
             "https://learn-server-sroc.onrender.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pdf", pdfRoutes)

// Database connection
dbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
 