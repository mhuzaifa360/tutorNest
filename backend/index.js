import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import jobsRoutes from "./routes/jobsRoutes.js"
import applicationRoutes from "./routes/applicationRoutes.js"; 
import reviewRoutes from "./routes/reviewsRoutes.js";

// DB CONNECTION
import { connectDB, sequelize } from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// STATIC FILES (UPLOADS)
const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use("/uploads", express.static(uploadDir));

// MIDDLEWARES
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// BASE API PREFIX (v1)
const API_PREFIX = "/v1";

// ROUTES
app.use(`${API_PREFIX}/auth`, authRoutes);  // auth routes
app.use(`${API_PREFIX}/students`, studentRoutes); // student routes
app.use(`${API_PREFIX}/teachers`, teacherRoutes); // teacher routes
app.use(`${API_PREFIX}/courses`, courseRoutes); // course routes
app.use(`${API_PREFIX}/enrollments`, enrollmentRoutes); // enrollment routes
app.use(`${API_PREFIX}/jobs`, jobsRoutes); // jobs routes
app.use(`${API_PREFIX}/applications`, applicationRoutes); // application routes
app.use(`${API_PREFIX}/reviews`, reviewRoutes); // review routes


// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("🚀 TutorNest API Running");
});


// SERVER START
const startServer = async () => {
  try {
    const dbConnected = await connectDB();

    if (!dbConnected) {
      console.error("❌ Database connection failed");
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
      console.log(`📡 API Base URL: http://localhost:${PORT}${API_PREFIX}`);
    });
  } catch (error) {
    console.error("❌ Server error:", error.message);  
    process.exit(1);
  }
};

startServer();

export default app;