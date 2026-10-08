const { NotificationSchema } = require("./Notification.schema");

const insertNotification = (obj) => NotificationSchema(obj).save();

const getNotifications = (userId) =>
  NotificationSchema.find({ userId }).sort({ createdAt: -1 }).limit(100);

const markRead = ({ _id, userId }) =>
  NotificationSchema.findOneAndUpdate(
    { _id, userId },
    { read: true },
    { new: true }
  );

const markAllRead = (userId) =>
  NotificationSchema.updateMany({ userId, read: false }, { read: true });

module.exports = {
  insertNotification,
  getNotifications,
  markRead,
  markAllRead,
};
