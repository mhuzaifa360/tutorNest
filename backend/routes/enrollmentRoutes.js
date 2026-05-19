import express from "express";

import {
  enrollStudent,
  getMyCourses,
} from "../controllers/enrollmentController.js";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ENROLL IN COURSE | Role: student
router.post("/enroll",verifyToken,authorizeRoles("student"),enrollStudent);

// GET MY COURSES | Role: student
router.get("/my-courses",verifyToken,authorizeRoles("student"),getMyCourses);

export default router;