import express from "express";

import {
  createTeacher,
  getTeachers,
  getSingleTeacher,
  updateTeacher,
  deleteTeachers,
} from "../controllers/teacherController.js";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================
// CREATE TEACHER
// =========================
router.post("/createTeachers", createTeacher);

// =========================
// GET ALL TEACHERS
// =========================
router.get(
  "/getTeachers",
  verifyToken,
  authorizeRoles("admin", "teacher"), // future-ready
  getTeachers,
);

// =========================
// GET SINGLE TEACHER
// =========================
router.get("/getSingleTeacher/:id", verifyToken, getSingleTeacher);

// =========================
// UPDATE TEACHER
// =========================
router.put(
  "/updateTeacher/:id",
  verifyToken,
  authorizeRoles("teacher"),
  updateTeacher,
);

// =========================
// DELETE TEACHER
// =========================
router.delete(
  "/deleteTeachers/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteTeachers,
);

export default router;
