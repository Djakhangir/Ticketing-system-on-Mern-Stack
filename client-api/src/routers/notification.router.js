const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markRead,
  markAllRead,
} = require("../model/notification/Notification.model");
const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");

// List the current user's notifications (newest first).
router.get("/", userAuthorization, async (req, res) => {
  try {
    const result = await getNotifications(req.user._id);
    return res.json({ status: "success", result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// Mark a single notification read.
router.patch("/:_id", userAuthorization, async (req, res) => {
  try {
    await markRead({ _id: req.params._id, userId: req.user._id });
    return res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// Mark all read.
router.patch("/", userAuthorization, async (req, res) => {
  try {
    await markAllRead(req.user._id);
    return res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

module.exports = router;
