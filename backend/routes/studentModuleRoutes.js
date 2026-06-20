import express from "express";
import {
  getConversations,
  getJobApplicationsForStudent,
  getMessages,
  getMyJobs,
  getSavedTeachers,
  getStudentOverview,
  removeSavedTeacher,
  saveTeacher,
  sendMessage,
  updateStudentApplication,
} from "../controllers/studentModuleController.js";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken, authorizeRoles("student"));

router.get("/overview", getStudentOverview);
router.get("/saved-teachers", getSavedTeachers);
router.post("/saved-teachers", saveTeacher);
router.delete("/saved-teachers/:teacherId", removeSavedTeacher);

router.get("/jobs", getMyJobs);
router.get("/applications", getJobApplicationsForStudent);
router.put("/applications/:id", updateStudentApplication);

router.get("/conversations", getConversations);
router.get("/messages/:role/:id", getMessages);
router.post("/messages", sendMessage);

export default router;
