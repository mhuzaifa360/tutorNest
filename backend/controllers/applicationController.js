import { Application } from "../models/index.js";

// APPLY ON JOB
export const applyJob = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const { jobId, message } = req.body;

    // ❌ check duplicate application
    const existing = await Application.findOne({
      where: { jobId, tutorId },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already applied on this job",
      });
    }

    const application = await Application.create({
      jobId,
      tutorId,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted",
      data: application,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error applying job",
      error: error.message,
    });
  }
};

// GET ALL APPLICATIONS (ADMIN / JOB OWNER)
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
    const application = await Application.findByPk(req.params.id);

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

// UPDATE STATUS (ACCEPT / REJECT)
export const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    await application.update({ status });

    return res.status(200).json({
      success: true,
      message: "Application status updated",
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
    const application = await Application.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    await application.destroy();

    return res.status(200).json({
      success: true,
      message: "Application deleted",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting application",
      error: error.message,
    });
  }
};