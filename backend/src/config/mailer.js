import nodemailer from "nodemailer";

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER and EMAIL_PASS are required for password reset emails");
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Blog App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; background:#0b0c0f; padding:28px;">
        <div style="max-width:520px; margin:auto; background:#15161a; border:1px solid #2a2d35; border-radius:12px; padding:28px; color:#ffffff;">
          <h2 style="margin:0 0 12px; font-size:24px;">Password reset request</h2>
          <p style="color:#cfd0d5; line-height:1.6;">Hi ${name || "there"},</p>
          <p style="color:#cfd0d5; line-height:1.6;">Click the button below to create a new password. This link will expire in 15 minutes.</p>
          <a href="${resetUrl}" style="display:inline-block; margin:18px 0; padding:12px 18px; background:#ffc414; color:#000000; text-decoration:none; border-radius:8px; font-weight:700;">Reset Password</a>
          <p style="color:#8d93a1; font-size:13px; line-height:1.6;">If the button does not work, open this link:</p>
          <p style="word-break:break-all; color:#ffc414; font-size:13px;">${resetUrl}</p>
          <p style="color:#8d93a1; font-size:13px;">If you did not request this, you can ignore this email.</p>
        </div>
      </div>
    `,
  });
};

export { sendPasswordResetEmail };