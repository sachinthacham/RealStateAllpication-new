import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  // 1. Create a Transporter (Connect to your email provider)
  // For Gmail, you might need an "App Password"
  // For testing, use Mailtrap.io (highly recommended for dev)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,     // e.g., sandbox.smtp.mailtrap.io
    port: Number(process.env.SMTP_PORT), // e.g., 2525
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // 2. Define Email Options
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  // 3. Send
  await transporter.sendMail(message);
};

export default sendEmail;