import express from "express";
import { createJob, deleteJob, getJobs, getSingleJob, updateJob } from "../controllers/jobControllers.js";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";
import { rankedJobs } from "../utils/rankJob.js";

const router = express.Router();

// Ranked jobs must stay before /:id.
router.get("/ranked", rankedJobs);

// Backward-compatible legacy endpoints.
router.post("/createJob", verifyToken, authorizeRoles("student"), createJob);
router.get("/getJobs", verifyToken, getJobs);
router.get("/getSingleJob/:id", verifyToken, getSingleJob);
router.put("/updateJob/:id", verifyToken, authorizeRoles("student"), updateJob);
router.delete("/deleteJob/:id", verifyToken, authorizeRoles("student"), deleteJob);

// Production REST endpoints.
router.get("/", verifyToken, getJobs);
router.post("/", verifyToken, authorizeRoles("student"), createJob);
router.get("/:id", verifyToken, getSingleJob);
router.put("/:id", verifyToken, authorizeRoles("student", "admin"), updateJob);
router.delete("/:id", verifyToken, authorizeRoles("student", "admin"), deleteJob);

export default router;
