import express from "express";

import {
  signupStudent,
  loginStudent,
} from "../controllers/studentAuthController.js";

import {
  signupTeacher,
  loginTeacher,
} from "../controllers/teacherAuthController.js";

import upload from "../middleware/multer.js";

const router = express.Router();


// =========================
// STUDENT AUTH
// =========================
router.post("/student/signup", upload.single("profileImage"), signupStudent);
router.post("/student/login", loginStudent);


// =========================
// TEACHER AUTH
// =========================
router.post("/teacher/signup", upload.single("profileImage"), signupTeacher);
router.post("/teacher/login", loginTeacher);


export default router;