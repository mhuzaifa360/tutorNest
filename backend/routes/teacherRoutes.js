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



router.get("/getTeachers",verifyToken,authorizeRoles("admin","teacher"),getTeachers,); // GET ALL TEACHERS
router.post("/createTeacher", createTeacher); // CREATE TEACHER
router.get("/getSingleTeacher/:id", verifyToken, getSingleTeacher); // GET SINGLE TEACHER
router.put("/updateTeacher/:id", verifyToken, authorizeRoles("teacher"), updateTeacher, ); // UPDATE TEACHER
router.delete("/deleteTeacher/:id",verifyToken,authorizeRoles("teacher","admin"), deleteTeachers,); // DELETE TEACHER

export default router;
