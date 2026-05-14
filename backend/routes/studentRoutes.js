import express from "express";

import {
  createStudent,
  getStudents,
  getSingleStudent,
  updateStudent,
  deleteStudents,
} from "../controllers/studentController.js";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================
// CREATE STUDENT
// =========================
router.post("/createStudents", createStudent);

// =========================
// GET ALL STUDENTS
// =========================
router.get(
  "/getStudents",
  verifyToken,
  authorizeRoles("teacher"), // optional: teacher only
  getStudents,
);

// =========================
// GET SINGLE STUDENT
// =========================
router.get("/getSingleStudent/:id", verifyToken, getSingleStudent);

// =========================
// UPDATE STUDENT
// =========================
router.put("/updateStudent/:id", verifyToken, updateStudent);

// =========================
// DELETE STUDENT
// =========================
router.delete(
  "/deleteStudents/:id",
  verifyToken,
  authorizeRoles("teacher"),
  deleteStudents,
);

export default router;
