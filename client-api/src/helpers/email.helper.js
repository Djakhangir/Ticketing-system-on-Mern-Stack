const nodemailer = require("nodemailer");

// Credentials come from env in any real deployment. For local dev we fall back
// to a shared Ethereal test inbox (messages are captured, never delivered).
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER || "mable69@ethereal.email",
    pass: process.env.SMTP_PASS || "91EACsBe2TT5NU3C1k",
  },
});

const FROM = process.env.SMTP_FROM || '"BuildingMGM" <no-reply@buildingmgm.app>';

const send = async (emailInfo) => {
  try {
    const result = await transporter.sendMail({ from: FROM, ...emailInfo });
    if (process.env.NODE_ENV !== "production") {
      console.log("Email sent:", result.messageId);
      const preview = nodemailer.getTestMessageUrl(result);
      if (preview) console.log("Preview URL:", preview);
    }
    return result;
  } catch (err) {
    console.log("Email send failed:", err.message);
  }
};

const emailProcessor = ({
  email,
  pin,
  type,
  verificationLink = "",
  subject = "",
  body = "",
}) => {
  switch (type) {
    case "request-new-password":
      return send({
        to: email,
        subject: "Password reset PIN",
        html: `<b>Hello,</b>
          <p>Here is your password reset PIN: <b>${pin}</b></p>
          <p>This PIN will expire in 1 day.</p>`,
      });

    case "password-update-success":
      return send({
        to: email,
        subject: "Your password was updated",
        html: `<b>Hello,</b><p>Your password was updated successfully.</p>`,
      });

    case "new-user-confirmation-required":
      return send({
        to: email,
        subject: "Verify your account",
        html: `<b>Welcome,</b>
          <p>Please verify your account before you sign in:</p>
          <p><a href="${verificationLink}">${verificationLink}</a></p>`,
      });

    // Generic transactional notification (new message, package, parts, etc.).
    case "notification":
      return send({
        to: email,
        subject: subject || "Update from your building",
        html: `<b>Hello,</b><p>${body}</p>`,
      });

    default:
      break;
  }
};

module.exports = { emailProcessor };
