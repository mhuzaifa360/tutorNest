import { VerificationRequest, Teacher } from "../models/index.js";

export const submitVerificationRequest = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Only teachers can submit verification requests",
      });
    }

    const { cnicUrl, documentUrls } = req.body;

    if (!cnicUrl || !Array.isArray(documentUrls) || documentUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: "cnicUrl and documentUrls are required",
      });
    }

    const existingRequest = await VerificationRequest.findOne({
      where: { teacherId: req.user.id },
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "A verification request already exists for this teacher",
      });
    }

    const request = await VerificationRequest.create({
      teacherId: req.user.id,
      cnicUrl,
      documentUrls,
      status: "pending",
    });

    await Teacher.update(
      { status: "pending" },
      { where: { id: req.user.id } }
    );

    return res.status(201).json({
      success: true,
      message: "Verification request submitted",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit verification request",
      error: error.message,
    });
  }
};

export const getVerificationRequests = async (req, res) => {
  try {
    const requests = await VerificationRequest.findAll({
      include: [
        {
          model: Teacher,
          as: "teacher",
          attributes: ["id", "firstName", "lastName", "email", "status"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch verification requests",
      error: error.message,
    });
  }
};

export const updateVerificationStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const request = await VerificationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Verification request not found",
      });
    }

    await request.update({ status, adminNotes });
    await Teacher.update(
      { status },
      { where: { id: request.teacherId } }
    );

    return res.status(200).json({
      success: true,
      message: "Verification status updated",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update verification status",
      error: error.message,
    });
  }
};
