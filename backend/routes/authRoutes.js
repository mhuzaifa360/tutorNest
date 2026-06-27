import express from "express";

import {
  signupStudent,
  loginStudent,
} from "../controllers/studentAuthController.js";

import {
  signupTeacher,
  loginTeacher,
} from "../controllers/teacherAuthController.js";

import upload, { handleUpload } from '../utils/multer.js'
import { loginAdmin as unifiedAdminLogin } from "../controllers/adminManagementController.js";

const router = express.Router();

router.post("/login", (req, res, next) => {
  if (req.body?.role === "admin") {
    return unifiedAdminLogin(req, res, next);
  }

  return res.status(400).json({
    success: false,
    message: "Use student or teacher login endpoint, or pass role admin",
  });
});


// STUDENT AUTH (Public)
// Role: Any (Public)
router.post("/student/signup", handleUpload(upload.single("profileImage")), signupStudent);
// Role: Any (Public)
router.post("/student/login", loginStudent);


// TEACHER AUTH (Public)
// Role: Any (Public)
// Accept multiple fields on teacher signup: profileImage + documents
router.post(
  "/teacher/signup",
  handleUpload(upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "cnicFront", maxCount: 1 },
    { name: "cnicBack", maxCount: 1 },
    { name: "degree", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
    { name: "degreeCertificate", maxCount: 1 },
    { name: "experienceCertificate", maxCount: 1 },
  ])),
  signupTeacher
);
// Role: Any (Public)
router.post("/teacher/login", loginTeacher);


export default router;
