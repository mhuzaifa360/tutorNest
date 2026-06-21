import express from "express";
import {
  submitVerificationRequest,
  getVerificationRequests,
  updateVerificationStatus,
} from "../controllers/verificationController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/request",
  verifyToken,
  authorizeRoles("teacher"),
  submitVerificationRequest
);

router.get(
  "/requests",
  verifyToken,
  authorizeRoles("admin"),
  getVerificationRequests
);

router.put(
  "/requests/:id",
  verifyToken,
  authorizeRoles("admin"),
  updateVerificationStatus
);

export default router;
