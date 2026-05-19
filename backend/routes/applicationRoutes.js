import express from "express";

import {
  applyJob,
  getApplications,
  getSingleApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";

import {
  verifyToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// APPLY ON JOB
router.post(
  "/apply",
  verifyToken,
  authorizeRoles("teacher"),
  applyJob
);

// GET ALL
router.get(
  "/",
  verifyToken,
  getApplications
);

// GET SINGLE
router.get(
  "/:id",
  verifyToken,
  getSingleApplication
);

// UPDATE
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("student"),
  updateApplication
);

// DELETE
router.delete(
  "/:id",
  verifyToken,
  deleteApplication
);

export default router;