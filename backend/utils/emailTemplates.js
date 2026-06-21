const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const APP_NAME = "TutorNest";

export const emailTemplates = {
  verification: (name, token) => ({
    subject: "Verify your TutorNest email",
    html: `<p>Hi ${name || "Learner"},</p>
      <p>Thanks for signing up for TutorNest! Click the button below to verify your email address.</p>
      <p><a href="${FRONTEND_URL}/verify-email?token=${token}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;">Verify Email</a></p>
      <p>If the button does not work, paste this token in the verification page:</p>
      <pre style="background:#f3f4f6;padding:12px;border-radius:8px;">${token}</pre>
      <p>Thanks,<br/>The ${APP_NAME} Team</p>`,
  }),

  resetPassword: (name, token) => ({
    subject: "Reset your TutorNest password",
    html: `<p>Hi ${name || "Learner"},</p>
      <p>We received a request to reset your password. Click the button below to continue.</p>
      <p><a href="${FRONTEND_URL}/reset-password?token=${token}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;">Reset Password</a></p>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
      <p>Token: <strong>${token}</strong></p>
      <p>Thanks,<br/>The ${APP_NAME} Team</p>`,
  }),

  notification: (title, message) => ({
    subject: title,
    html: `<p>${message}</p>
      <p>Visit TutorNest to review the latest update.</p>`,
  }),
};
