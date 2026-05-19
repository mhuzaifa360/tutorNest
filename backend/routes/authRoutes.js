import express from "express";

import {
  signupStudent,
  loginStudent,
} from "../controllers/studentAuthController.js";

import {
  signupTeacher,
  loginTeacher,
} from "../controllers/teacherAuthController.js";

import upload from '../utils/multer.js'

const router = express.Router();


// =========================
// STUDENT AUTH (Public)
// =========================
// Role: Any (Public)
router.post("/student/signup", upload.single("profileImage"), signupStudent);
// Role: Any (Public)
router.post("/student/login", loginStudent);


// =========================
// TEACHER AUTH (Public)
// =========================
// Role: Any (Public)
router.post("/teacher/signup", upload.single("profileImage"), signupTeacher);
// Role: Any (Public)
router.post("/teacher/login", loginTeacher);


export default router;