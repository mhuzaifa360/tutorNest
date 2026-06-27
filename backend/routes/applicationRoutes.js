import express from "express";
import {
  acceptApplication,
  applyJob,
  deleteApplication,
  getApplications,
  getSingleApplication,
  getStudentApplications,
  getTeacherApplications,
  rejectApplication,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Backward-compatible legacy endpoints.
router.post("/apply", verifyToken, authorizeRoles("teacher"), applyJob);
router.get("/getApplications", verifyToken, getApplications);
router.get("/getSingleApplication/:id", verifyToken, getSingleApplication);
router.put("/updateApplication/:id", verifyToken, authorizeRoles("student"), updateApplicationStatus);
router.delete("/deleteApplication/:id", verifyToken, deleteApplication);

// Production REST endpoints.
router.post("/", verifyToken, authorizeRoles("teacher"), applyJob);
router.get("/", verifyToken, getApplications);
router.get("/student", verifyToken, authorizeRoles("student"), getStudentApplications);
router.get("/teacher", verifyToken, authorizeRoles("teacher"), getTeacherApplications);
router.patch("/:id/accept", verifyToken, authorizeRoles("student"), acceptApplication);
router.patch("/:id/reject", verifyToken, authorizeRoles("student"), rejectApplication);
router.get("/:id", verifyToken, getSingleApplication);

export default router;
