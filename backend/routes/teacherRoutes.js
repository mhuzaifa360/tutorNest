import express from "express";
import {
  createTeacher,
  getTeachers,
  getSingleTeacher,
  updateTeacher,
  deleteTeachers,
} from "../controllers/teacherController.js";
// import token and authentication
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
// define routes
const router = express.Router();



// GET ALL TEACHERS | Role: admin, teacher
router.get("/getTeachers",verifyToken,authorizeRoles("admin","teacher"),getTeachers,); 

// CREATE TEACHER | Role: Any (Public)
router.post("/createTeacher", createTeacher); 

// GET SINGLE TEACHER WITH RATING | Role: Authenticated Users
router.get("/getTeacherRating/:id", getSingleTeacher);  

// UPDATE TEACHER | Role: teacher
router.put("/updateTeacher/:id", verifyToken, authorizeRoles("teacher"), updateTeacher, ); 

// DELETE TEACHER | Role: teacher, admin
router.delete("/deleteTeacher/:id",verifyToken,authorizeRoles("teacher","admin"), deleteTeachers,);

export default router;
