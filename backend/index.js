import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// ROUTES
import authRoutes from './routes/authRoutes.js'
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

// DB CONNECTION (external file)
import { connectDB } from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use("/uploads", express.static("uploads"));

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/courses", courseRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("🚀 TutorNest API Running");
});

// SERVER START (only after DB connection)
const startServer = async () => {
  try {
    const dbConnected = await connectDB();

    if (!dbConnected) {
      console.error("❌ Database connection failed");
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server error:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;