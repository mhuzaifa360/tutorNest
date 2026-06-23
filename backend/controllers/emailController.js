import crypto from "crypto";
import { Student, Teacher } from "../models/index.js";
import Admin from "../models/adminModel.js";
import { EmailToken } from "../models/emailTokenModel.js";
import { sendEmail } from "../services/emailService.js";
import { emailTemplates } from "../utils/emailTemplates.js";

const ROLE_MODELS = {
  student: Student,
  teacher: Teacher,
  admin: Admin,
};

const createTokenRecord = async (userId, userRole, type) => {
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(
    Date.now() +
      (Number(process.env.EMAIL_TOKEN_EXPIRES_MINUTES) || 60) *
        60 *
        1000
  );

  return EmailToken.create({
    userId,
    userRole,
    token,
    type,
    expiresAt,
  });
};

const findUser = async (role, email) => {
  const Model = ROLE_MODELS[role];
  if (!Model) return null;
  return Model.findOne({ where: { email: email.trim().toLowerCase() } });
};

const normalizeRole = (role) => {
  if (!role) return null;
  const normalized = role.toString().trim().toLowerCase();
  return ["student", "teacher", "admin"].includes(normalized)
    ? normalized
    : null;
};

export const sendEmailVerification = async (req, res) => {
  try {
    const { email, role } = req.body;
    const normalizedRole = normalizeRole(role);

    if (!email || !normalizedRole) {
      return res.status(400).json({
        success: false,
        message: "Email and role are required",
      });
    }

    const user = await findUser(normalizedRole, email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No ${normalizedRole} account found for that email`,
      });
    }

    const tokenRecord = await createTokenRecord(
      user.id,
      normalizedRole,
      "verification"
    );

    const name =
      user.firstName ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}` 
      : user.name 
      || user.email 
      || "TutorNest user";
    const template = emailTemplates.verification(name, tokenRecord.token);

    await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
    });

    return res.status(200).json({
      success: true,
      message: "Verification email sent",
      data: { token: tokenRecord.token },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send verification email",
      error: error.message,
    });
  }
};

export const sendPasswordReset = async (req, res) => {
  try {
    const { email, role } = req.body;
    const normalizedRole = normalizeRole(role);

    if (!email || !normalizedRole) {
      return res.status(400).json({
        success: false,
        message: "Email and role are required",
      });
    }

    const user = await findUser(normalizedRole, email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No ${normalizedRole} account found for that email`,
      });
    }

    const tokenRecord = await createTokenRecord(
      user.id,
      normalizedRole,
      "password_reset"
    );

    const name =
      user.firstName ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}` 
      : user.name 
      || user.email 
      || "TutorNest user";
    const template = emailTemplates.resetPassword(name, tokenRecord.token);

    await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset email sent",
      data: { token: tokenRecord.token },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send password reset email",
      error: error.message,
    });
  }
};

export const sendNotificationEmail = async (req, res) => {
  try {
    const { email, role, title, message } = req.body;
    const normalizedRole = normalizeRole(role);

    if (!email || !normalizedRole || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "Email, role, title, and message are required",
      });
    }

    const user = await findUser(normalizedRole, email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No ${normalizedRole} account found for that email`,
      });
    }

    const template = emailTemplates.notification(title, message);

    await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
    });

    return res.status(200).json({
      success: true,
      message: "Notification email sent",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send notification email",
      error: error.message,
    });
  }
};
