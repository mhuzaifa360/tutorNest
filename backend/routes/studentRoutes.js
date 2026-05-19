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

// CREATE STUDENT | Role: Any (Public)
router.post("/createStudent", createStudent); 

// GET SINGLE STUDENT | Role: Authenticated Users
router.get("/getSingleStudent/:id", verifyToken, getSingleStudent); 

// UPDATE STUDENT | Role: Authenticated Users (Self usually)
router.put("/updateStudent/:id", verifyToken, updateStudent); 

// GET ALL STUDENTS | Role: teacher
router.get(
  "/getStudents",
  verifyToken,
  authorizeRoles("teacher"), 
  getStudents,
); 

// DELETE STUDENT | Role: teacher
router.delete(
  "/deleteStudent/:id",
  verifyToken,
  authorizeRoles("teacher"),
  deleteStudent,
);

export default router;
