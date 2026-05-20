import express from "express";
import {
  createCourse,
  getCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse
} from "../controllers/courseController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();


// GET ALL COURSES | Role: Authenticated Users (Student, Teacher, Admin)
router.get("/getCourses", verifyToken, authorizeRoles("admin", "teacher", "student"), getCourses);

// GET SINGLE COURSE | Role: Authenticated Users (Student, Teacher, Admin)
router.get("/getSingleCourse/:id", verifyToken, getSingleCourse);

// CREATE COURSE | Role: teacher
router.post("/createCourse",verifyToken,authorizeRoles("teacher"),createCourse);

// UPDATE COURSE | Role: teacher
router.put("/updateCourse/:id",verifyToken,authorizeRoles("teacher"),updateCourse);

// DELETE COURSE | Role: teacher (only owner)
router.delete("/deleteCourse/:id", verifyToken,authorizeRoles("teacher"),deleteCourse);

export default router;