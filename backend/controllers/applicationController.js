import { Application, Job } from "../models/index.js";

// APPLY ON JOB
export const applyJob = async (req, res) => {
  try {
    const tutorId = req.user.id;

    const { jobId, message } = req.body;

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const alreadyApplied = await Application.findOne({
      where: {
        jobId,
        tutorId,
      },
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "Already applied",
      });
    }

    const application = await Application.create({
      jobId,
      tutorId,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Applied successfully",
      data: application,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error applying",
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

// UPDATE APPLICATION
export const updateApplication = async (req, res) => {
  try {

    const application = await Application.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    await application.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Application updated",
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