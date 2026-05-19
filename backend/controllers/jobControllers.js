import { Job } from "../models/index.js";

// CREATE JOB
export const createJob = async (req, res) => {
  try {
    const studentId = req.user.id;

    const job = await Job.create({
      ...req.body,
      studentId,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating job",
      error: error.message,
    });
  }
};

// GET ALL JOBS
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();

    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching jobs",
      error: error.message,
    });
  }
};

// GET SINGLE JOB
export const getSingleJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching job",
      error: error.message,
    });
  }
};

// UPDATE JOB
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ownership check
    if (job.studentId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    await job.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating job",
      error: error.message,
    });
  }
};

// DELETE JOB
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.studentId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    await job.destroy();

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting job",
      error: error.message,
    });
  }
};