import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to: string, subject: string, html: string, text?: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"SkillSync" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    return {
      messageId: info.messageId,
      success: true,
    };
  } catch (error: any) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

const sendWelcomeEmail = async (to: string, name: string) => {
  const subject = "Welcome to SkillSync!";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to SkillSync, ${name}!</h2>
      <p>We're excited to have you on board.</p>
      <p>SkillSync is your professional collaboration hub for freelancers and clients.</p>
      <p>Get started by:</p>
      <ul>
        <li>Creating your profile</li>
        <li>Browsing projects</li>
        <li>Connecting with professionals</li>
      </ul>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br>The SkillSync Team</p>
    </div>
  `;

  return await sendEmail(to, subject, html);
};

const sendProjectInvitationEmail = async (to: string, projectName: string, inviterName: string) => {
  const subject = `You've been invited to join "${projectName}" on SkillSync`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Project Invitation</h2>
      <p>${inviterName} has invited you to join the project "${projectName}" on SkillSync.</p>
      <p>Log in to your SkillSync account to view the project details and accept the invitation.</p>
      <p>Best regards,<br>The SkillSync Team</p>
    </div>
  `;

  return await sendEmail(to, subject, html);
};
const sendPaymentConfirmationEmail = async (
  to: string,
  amount: number,
  currency: string,
  projectName: string,
) => {
  const subject = `Payment Confirmation for "${projectName}"`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Payment Confirmation</h2>
      <p>Your payment of ${currency.toUpperCase()} ${(amount / 100).toFixed(2)} for the project "${projectName}" has been processed successfully.</p>
      <p>Thank you for using SkillSync for your project payments.</p>
      <p>Best regards,<br>The SkillSync Team</p>
    </div>
  `;

  return await sendEmail(to, subject, html);
};

const sendMilestoneCompletionEmail = async (
  to: string,
  milestoneTitle: string,
  projectName: string,
) => {
  const subject = `Milestone Completed: "${milestoneTitle}" in "${projectName}"`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Milestone Completed</h2>
      <p>The milestone "${milestoneTitle}" in the project "${projectName}" has been marked as completed.</p>
      <p>Please review the deliverables and process the next payment if applicable.</p>
      <p>Best regards,<br>The SkillSync Team</p>
    </div>
  `;

  return await sendEmail(to, subject, html);
};

const sendVerificationEmail = async (to: string, name: string, token: string) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  const verifyUrl = `${clientUrl}/auth/verify-email?token=${token}`;
  const subject = "Verify your SkillSync email";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hi ${name}, verify your email</h2>
      <p>Click the button below to verify your SkillSync account:</p>
      <p><a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;">Verify Email</a></p>
      <p>Or copy this link: ${verifyUrl}</p>
      <p>This link expires in 24 hours.</p>
    </div>
  `;
  return await sendEmail(to, subject, html);
};

const sendPasswordResetEmail = async (to: string, name: string, token: string) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  const resetUrl = `${clientUrl}/auth/reset-password?token=${token}`;
  const subject = "Reset your SkillSync password";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password reset request</h2>
      <p>Hi ${name}, we received a request to reset your password.</p>
      <p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;">Reset Password</a></p>
      <p>Or copy this link: ${resetUrl}</p>
      <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
    </div>
  `;
  return await sendEmail(to, subject, html);
};

export const EmailUtils = {
  sendEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendProjectInvitationEmail,
  sendPaymentConfirmationEmail,
  sendMilestoneCompletionEmail,
};
