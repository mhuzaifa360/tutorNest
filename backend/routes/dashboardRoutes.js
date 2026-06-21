import express from "express";
import {
  getAdminDashboard,
  getStudentDashboard,
  getTeacherDashboard,
} from "../controllers/dashboardController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/student/:id",
  verifyToken,
  authorizeRoles("student", "admin"),
  getStudentDashboard
);

router.get(
  "/teacher/:id",
  verifyToken,
  authorizeRoles("teacher", "admin"),
  getTeacherDashboard
);

router.get("/admin", verifyToken, authorizeRoles("admin"), getAdminDashboard);

export default router;
