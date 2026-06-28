import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import jobsRoutes from "./routes/jobsRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js"; 
import reviewRoutes from "./routes/reviewsRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js"; 
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminAnalyticsRoutes from "./routes/adminAnalyticsRoutes.js";
import adminManagementRoutes from "./routes/adminManagementRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import recommendRoutes from "./routes/recommendTeacherRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import studentModuleRoutes from "./routes/studentModuleRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { setupSocket } from "./socket/socket.js";
import emailRoutes from "./routes/emailRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import hireRequestRoutes from "./routes/hireRequestRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";

// DB CONNECTION
import { connectDB, sequelize } from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// STATIC FILES (UPLOADS)
const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use("/uploads/profile", express.static(`${uploadDir}/profile`));

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
app.use(`${API_PREFIX}/savedJobs`, savedJobRoutes); // saved job routes
app.use(`${API_PREFIX}/notifications`, notificationRoutes); // notification routes
app.use(`${API_PREFIX}/admin`, adminRoutes); // admin routes
app.use(`${API_PREFIX}/admin`, adminAnalyticsRoutes);// admin analytics routes
app.use(`${API_PREFIX}/admin`, adminManagementRoutes); // admin management routes
app.use(`${API_PREFIX}/search`, searchRoutes); // search routes
app.use(`${API_PREFIX}/recommend`, recommendRoutes); // recommendation routes
app.use(`${API_PREFIX}/profile`, profileRoutes); // profile routes
app.use(`${API_PREFIX}/student`, studentModuleRoutes); // student module routes
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes); // unified dashboard routes
app.use(`${API_PREFIX}/messages`, messageRoutes); // unified messaging routes
app.use(`${API_PREFIX}/chat`, chatRoutes); // chat routes
app.use(`${API_PREFIX}/email`, emailRoutes); // email service routes
app.use(`${API_PREFIX}/upload`, uploadRoutes); // upload routes
app.use(`${API_PREFIX}/verification`, verificationRoutes); // verification workflow routes
app.use(`${API_PREFIX}/payments`, paymentRoutes); // payment service routes
app.use(`${API_PREFIX}/hire-requests`, hireRequestRoutes); // direct teacher hiring requests
app.use(`${API_PREFIX}/meetings`, meetingRoutes); // student-teacher meeting scheduling
 
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

    const server = http.createServer(app);

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Stop the existing server or set a different PORT.`);
      } else {
        console.error("HTTP server error:", error.message);
      }
      process.exit(1);
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
      console.log(`📡 API Base URL: http://localhost:${PORT}${API_PREFIX}`);
    });

    // Initialize Socket.io
    try {
      const io = setupSocket(server);
      app.set("io", io);
      console.log("📡 Socket.io initialized");
    } catch (err) {
      console.warn("Socket.io failed to initialize:", err.message);
    }
  } catch (error) {
    console.error("❌ Server error:", error.message);  
    process.exit(1);
  }
};

startServer();

export default app;
