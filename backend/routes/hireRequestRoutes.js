import express from "express";
import { createHireRequest } from "../controllers/hireRequestController.js";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("student"), createHireRequest);

export default router;
