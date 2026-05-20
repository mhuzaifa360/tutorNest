import express from "express";

import {
  createAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdmin,
  deleteAdmin,
  approveTeacher,
  rejectTeacher,
  blockStudent,
  getDashboardStats,
} from "../controllers/adminController.js";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// PUBLIC
router.post("/signupAdmin", createAdmin);
router.post("/loginAdmin", loginAdmin);

// PRIVATE (ADMIN ONLY)
router.get("/profile", verifyToken, authorizeRoles("admin"), getAdminProfile);

router.put("/update", verifyToken, authorizeRoles("admin"), updateAdmin);

router.delete("/delete", verifyToken, authorizeRoles("admin"), deleteAdmin);

// DASHBOARD
router.get("/stats",verifyToken,authorizeRoles("admin"),getDashboardStats);

// TEACHER APPROVAL
router.put("/teacher/approve/:id",verifyToken,authorizeRoles("admin"),approveTeacher);

// TEACHER REJECTION
router.put("/teacher/reject/:id",verifyToken,authorizeRoles("admin"),rejectTeacher);

// BLOCK STUDENT
router.delete("/student/block/:id",verifyToken,authorizeRoles("admin"),blockStudent);

export default router;