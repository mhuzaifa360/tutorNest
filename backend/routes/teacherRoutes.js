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
import { rankedTeachers } from "../utils/rankTeacher.js";
import { browseTeachers, getTeacherDetail } from "../controllers/studentModuleController.js";
import upload, { handleUpload } from "../utils/multer.js";
// define routes
const router = express.Router();

// CANONICAL TEACHER BROWSE ROUTES | Role: authenticated users
router.get("/", verifyToken, browseTeachers);



// GET ALL TEACHERS | Role: admin, teacher
router.get("/getTeachers",verifyToken,authorizeRoles("admin","teacher"),getTeachers,); 

// CREATE TEACHER | Role: Any (Public)
router.post("/createTeacher", createTeacher); 

// GET SINGLE TEACHER WITH RATING | Role: Authenticated Users
router.get("/getTeacherRating/:id", getSingleTeacher);  

// UPDATE TEACHER | Role: teacher
router.put(
  "/updateTeacher/:id",
  verifyToken,
  authorizeRoles("teacher"),
  handleUpload(upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "cnicFront", maxCount: 1 },
    { name: "cnicBack", maxCount: 1 },
    { name: "degree", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
    { name: "degreeCertificate", maxCount: 1 },
    { name: "experienceCertificate", maxCount: 1 },
  ])),
  updateTeacher,
); 

// DELETE TEACHER | Role: teacher, admin
router.delete("/deleteTeacher/:id",verifyToken,authorizeRoles("teacher","admin"), deleteTeachers,);

// RANKED TEACHERS | Role: Any (Public)
router.get("/ranked", rankedTeachers);

// CANONICAL TEACHER DETAIL ROUTE | Role: authenticated users
router.get("/:id", verifyToken, getTeacherDetail);
export default router;
