// Single entry point for notifying a user. Fans out to three channels:
//   1. in-app  (persisted, powers the notification bell)
//   2. email   (nodemailer)
//   3. SMS     (stubbed until a provider is configured)
// Failures on any one channel never block the others.

const { insertNotification } = require("../model/notification/Notification.model");
const { emailProcessor } = require("./email.helper");
const { sendSMS } = require("./sms.helper");

// user: a User document (needs _id, email, phone)
const notifyUser = async (user, { type, title, body = "", link = "" }) => {
  if (!user) return;

  const tasks = [];

  tasks.push(
    insertNotification({ userId: user._id, type, title, body, link }).catch(
      (e) => console.log("in-app notify failed:", e.message)
    )
  );

  if (user.email) {
    tasks.push(
      Promise.resolve(
        emailProcessor({
          email: user.email,
          type: "notification",
          subject: title,
          body,
        })
      ).catch((e) => console.log("email notify failed:", e.message))
    );
  }

  if (user.phone) {
    tasks.push(
      sendSMS({ to: user.phone, body: `${title} — ${body}` }).catch((e) =>
        console.log("sms notify failed:", e.message)
      )
    );
  }

  await Promise.all(tasks);
};

const notifyMany = async (users, payload) => {
  await Promise.all((users || []).map((u) => notifyUser(u, payload)));
};

module.exports = { notifyUser, notifyMany };
