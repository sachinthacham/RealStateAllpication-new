import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@realestate-app.com";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"; // frontend url

// Configure the transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Generic send email function
export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!SMTP_HOST) {
    // fallback in dev: log to console
    console.log("📧 [DEV EMAIL MOCK]");
    console.log("TO:", to);
    console.log("SUBJECT:", subject);
    console.log("BODY:", html);
    return true;
  }

  const info = await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  console.log("📧 Email sent:", info.messageId);
  return info;
};

// Send verification email
export const sendVerificationEmail = async (to: string, token: string) => {
  const url = `${CLIENT_URL}/verify-email?token=${token}`;
  const html = `
    <h2>Verify your email</h2>
    <p>Click the link below to verify your account:</p>
    <a href="${url}" target="_blank">${url}</a>
  `;
  return sendEmail(to, "Verify your email address", html);
};

// Send password reset email
export const sendPasswordResetEmail = async (to: string, token: string) => {
  const url = `${CLIENT_URL}/reset-password?token=${token}`;
  const html = `
    <h2>Reset your password</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${url}" target="_blank">${url}</a>
  `;
  return sendEmail(to, "Reset your password", html);
};

// Send booking confirmation email
export const sendBookingConfirmationEmail = async (
  to: string,
  propertyTitle: string,
  bookingId: string
) => {
  const url = `${CLIENT_URL}/bookings/${bookingId}`;
  const html = `
    <h2>Booking Confirmed</h2>
    <p>Your booking for <strong>${propertyTitle}</strong> has been confirmed.</p>
    <p>You can view details here: <a href="${url}" target="_blank">${url}</a></p>
  `;
  return sendEmail(to, "Booking Confirmation", html);
};

// Generic notification email
export const sendNotificationEmail = async (to: string, subject: string, message: string) => {
  const html = `
    <h2>${subject}</h2>
    <p>${message}</p>
  `;
  return sendEmail(to, subject, html);
};
