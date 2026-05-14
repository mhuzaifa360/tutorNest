import express from "express";

import {
  createCourse,
  getCourses,
  getSingleCourse,
} from "../controllers/courseController.js";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================
// CREATE COURSE (teacher only)
// =========================
router.post(
  "/createCourse",
  verifyToken,
  authorizeRoles("teacher"),
  createCourse
);

// =========================
// GET ALL COURSES
// =========================
router.get("/getCourses", getCourses);

// =========================
// GET SINGLE COURSE
// =========================
router.get("/getSingleCourse/:id", getSingleCourse);

export default router;