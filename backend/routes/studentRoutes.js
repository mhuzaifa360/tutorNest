import express from "express";

import {
  createStudent,
  getStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createStudent", createStudent); // CREATE STUDENT
router.get("/getSingleStudent/:id", verifyToken, getSingleStudent); // GET SINGLE STUDENT
router.put("/updateStudent/:id", verifyToken, updateStudent); // UPDATE STUDENT
router.get(
  "/getStudents",
  verifyToken,
  authorizeRoles("teacher"), // optional: teacher only
  getStudents,
); // GET ALL STUDENTS
router.delete(
  "/deleteStudent/:id",
  verifyToken,
  authorizeRoles("teacher"),
  deleteStudent,
); // DELETE STUDENT

export default router;
