import express from "express";

import {
  applyJob,
  getApplications,
  getSingleApplication,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/applicationController.js";

import {
  verifyToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// APPLY ON JOB  |  Role: teacher
router.post(
  "/apply",
  verifyToken,
  authorizeRoles("teacher"),
  applyJob
);

// GET ALL APPLICATIONS  |  Role: teacher, student
router.get(
  "/getApplications",
  verifyToken,
  getApplications
);

// GET SINGLE APPLICATION  |  Role: teacher, student
router.get(
  "/getSingleApplication/:id",
  verifyToken,
  getSingleApplication
);

// UPDATE APPLICATION (accept / reject)  |  Role: student
router.put(
  "/updateApplication/:id",
  verifyToken,
  authorizeRoles("student"),
  updateApplicationStatus
);

// DELETE APPLICATION  |  Role: teacher (withdraw own application)
router.delete(
  "/deleteApplication/:id",
  verifyToken,
  deleteApplication
);

export default router;