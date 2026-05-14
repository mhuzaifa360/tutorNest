import express from "express";
import { studentSignup } from "../controllers/studentAuthController.js";

const router = express.Router();

// Student Signup
router.post("/student/signup", studentSignup);

export default router;