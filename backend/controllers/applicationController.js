import { Application, Job } from "../models/index.js";
import { createNotification } from "./notificationController.js";

// APPLY ON JOB
export const applyJob = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const { jobId, message } = req.body;

    // CHECK JOB EXISTS
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ❌ PREVENT DUPLICATE APPLICATION
    const existing = await Application.findOne({
      where: { jobId, tutorId },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already applied on this job",
      });
    }

    // CREATE APPLICATION
    const application = await Application.create({
      jobId,
      tutorId,
      message,
    });

    // 🔔 CREATE NOTIFICATION FOR STUDENT
    await createNotification({
      userId: job.studentId,
      title: "New Application",
      message: "A tutor applied on your job",
      type: "application",
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error applying on job",
      error: error.message,
    });
  }
};

// GET ALL APPLICATIONS
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.findAll();

    return res.status(200).json({
      success: true,
      data: applications,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching applications",
      error: error.message,
    });
  }
};

// GET SINGLE APPLICATION
export const getSingleApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: application,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching application",
      error: error.message,
    });
  }
};

// UPDATE APPLICATION STATUS
export const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const { status } = req.body;

    // VALIDATION
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // UPDATE STATUS
    await application.update({ status });

    // 🔔 NOTIFICATION FOR TUTOR
    await createNotification({
      userId: application.tutorId,
      title: "Application Updated",
      message: `Your application has been ${status}`,
      type: "application",
    });

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating application",
      error: error.message,
    });
  }
};

// DELETE APPLICATION
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    await application.destroy();

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting application",
      error: error.message,
    });
  }
};