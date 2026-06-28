import express from "express";
import { createMeeting, getMeetings, updateMeeting } from "../controllers/meetingController.js";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken, authorizeRoles("student", "teacher", "admin"));

router.get("/", getMeetings);
router.post("/", authorizeRoles("student"), createMeeting);
router.patch("/:id", authorizeRoles("teacher"), updateMeeting);

export default router;
