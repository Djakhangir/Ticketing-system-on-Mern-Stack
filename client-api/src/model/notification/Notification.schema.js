// In-app notification. One row per recipient per event. Email/SMS delivery is
// handled separately by the notification helper; this powers the in-app bell.

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["ticket", "message", "parts", "appointment", "package", "system"],
    default: "system",
  },
  title: { type: String, required: true },
  body: { type: String, default: "" },
  // Optional deep-link target inside the app, e.g. "/ticket/<id>".
  link: { type: String, default: "" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = {
  NotificationSchema: mongoose.model("Notification", NotificationSchema),
};
