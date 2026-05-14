import express from "express";

import {
  enrollStudent,
  getMyCourses,
} from "../controllers/enrollmentController.js";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================
// ENROLL IN COURSE
// =========================
router.post(
  "/enroll",
  verifyToken,
  authorizeRoles("student"),
  enrollStudent
);

// =========================
// GET MY COURSES
// =========================
router.get(
  "/my-courses",
  verifyToken,
  authorizeRoles("student"),
  getMyCourses
);

export default router;