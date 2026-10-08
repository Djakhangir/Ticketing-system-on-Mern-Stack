const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const {
  insertTicket,
  getTickets,
  getTicketsForStaff,
  getTicketById,
  addReply,
  updateTicketStatus,
  assignTicket,
  addPart,
  updatePartStatus,
  setAppointment,
  deleteTicket,
} = require("../model/ticket/Ticket.model");
const { getUserById, getBuildingStaff } = require("../model/user/User.model");
const {
  userAuthorization,
  staffOnly,
} = require("../middlewares/authorization.middleware");
const { notifyUser, notifyMany } = require("../helpers/notification.helper");

// Store uploaded images on disk under uploads/images.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/images"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}_${file.originalname}`.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

const isStaff = (role) =>
  ["superintendent", "management", "landlord"].includes(role);

// Notify the counterpart(s) when a ticket thread changes.
const notifyCounterpart = async ({ ticket, actorRole, title, body }) => {
  if (isStaff(actorRole)) {
    // Staff acted -> notify the tenant owner.
    const tenant = await getUserById(ticket.clientId);
    await notifyUser(tenant, {
      type: "message",
      title,
      body,
      link: `/ticket/${ticket._id}`,
    });
  } else {
    // Tenant acted -> notify building staff.
    const staff = await getBuildingStaff(ticket.building);
    await notifyMany(staff, {
      type: "ticket",
      title,
      body,
      link: `/ticket/${ticket._id}`,
    });
  }
};

// ---- Create ticket (tenants) ----
// Multer must run before we read text fields from a multipart body.
router.post(
  "/",
  userAuthorization,
  upload.any("media"),
  async (req, res) => {
    try {
      const { subject, message, category, priority, contactPhone } = req.body;
      const user = req.user;

      if (!subject || !message) {
        return res.json({
          status: "error",
          message: "Subject and message are required",
        });
      }

      const media = (req.files || []).map((file) => ({
        name: file.filename,
        size: file.size,
        type: file.mimetype,
      }));

      const ticketObj = {
        clientId: user._id,
        building: user.building,
        apartment: user.apartment,
        contactPhone: contactPhone || user.phone || "",
        subject,
        category: category || "General",
        priority: priority || "Medium",
        media,
        conversations: [
          {
            senderId: user._id,
            sender: user.name,
            senderRole: user.role,
            message,
          },
        ],
      };

      const result = await insertTicket(ticketObj);

      const staff = await getBuildingStaff(user.building);
      await notifyMany(staff, {
        type: "ticket",
        title: `New ${priority || "Medium"} ticket · Apt ${user.apartment}`,
        body: subject,
        link: `/ticket/${result._id}`,
      });

      return res.json({
        status: "success",
        message: "New ticket has been created!",
        result,
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  }
);

// ---- List tickets (role-aware) ----
router.get("/", userAuthorization, async (req, res) => {
  try {
    const { role, building } = req.user;
    let result;
    if (role === "tenant") {
      result = await getTickets(req.user._id);
    } else if (role === "superintendent") {
      result = await getTicketsForStaff(building);
    } else {
      // management + landlord: everything (optionally filtered by ?building=)
      result = await getTicketsForStaff(req.query.building);
    }
    return res.json({ status: "success", result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// ---- Single ticket ----
router.get("/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.user.role === "tenant" ? req.user._id : null;
    const ticket = await getTicketById(_id, clientId);
    return res.json({ status: "success", result: ticket ? [ticket] : [] });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// ---- Reply to thread (tenant or staff) ----
router.put("/:_id", userAuthorization, async (req, res) => {
  try {
    const { message } = req.body;
    const { _id } = req.params;
    const user = req.user;

    if (!message) {
      return res.json({ status: "error", message: "Message is required" });
    }

    // Tenants may only reply to their own tickets.
    const clientId = user.role === "tenant" ? user._id : null;
    const existing = await getTicketById(_id, clientId);
    if (!existing) {
      return res.json({ status: "error", message: "Ticket not found" });
    }

    const status = isStaff(user.role)
      ? "Pending tenant response"
      : "Pending operator response";

    const result = await addReply({
      _id,
      message,
      sender: user.name,
      senderId: user._id,
      senderRole: user.role,
      status,
    });

    await notifyCounterpart({
      ticket: existing,
      actorRole: user.role,
      title: `New reply · ${existing.subject}`,
      body: `${user.name}: ${message.slice(0, 120)}`,
    });

    return res.json({ status: "success", message: "Your message was sent", result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// ---- Assign ticket (staff) ----
router.patch("/assign/:_id", userAuthorization, staffOnly, async (req, res) => {
  try {
    const { _id } = req.params;
    const { assignedTo } = req.body;
    const assignee = await getUserById(assignedTo);
    if (!assignee) {
      return res.json({ status: "error", message: "Assignee not found" });
    }
    const result = await assignTicket({
      _id,
      assignedTo,
      assignedName: assignee.name,
    });
    await notifyUser(assignee, {
      type: "ticket",
      title: "You were assigned a ticket",
      body: result.subject,
      link: `/ticket/${_id}`,
    });
    const tenant = await getUserById(result.clientId);
    await notifyUser(tenant, {
      type: "ticket",
      title: "Your ticket is being handled",
      body: `${assignee.name} is now handling: ${result.subject}`,
      link: `/ticket/${_id}`,
    });
    return res.json({ status: "success", message: "Ticket assigned", result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// ---- Update status (staff) ----
router.patch("/status/:_id", userAuthorization, staffOnly, async (req, res) => {
  try {
    const { _id } = req.params;
    const { status } = req.body;
    const result = await updateTicketStatus({ _id, status });
    const tenant = await getUserById(result.clientId);
    await notifyUser(tenant, {
      type: "ticket",
      title: `Ticket status: ${status}`,
      body: result.subject,
      link: `/ticket/${_id}`,
    });
    return res.json({ status: "success", message: "Status updated", result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// Tenant convenience: close own ticket.
router.patch("/close-ticket/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.user.role === "tenant" ? req.user._id : null;
    const existing = await getTicketById(_id, clientId);
    if (!existing) {
      return res.json({ status: "error", message: "Ticket not found" });
    }
    const result = await updateTicketStatus({ _id, status: "Closed" });
    return res.json({ status: "success", message: "This ticket has been closed.", result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// ---- Parts (staff) ----
router.post("/parts/:_id", userAuthorization, staffOnly, async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, quantity, supplier, note } = req.body;
    if (!name) return res.json({ status: "error", message: "Part name is required" });
    const result = await addPart({
      _id,
      part: { name, quantity: quantity || 1, supplier, note, status: "Ordered" },
    });
    const tenant = await getUserById(result.clientId);
    await notifyUser(tenant, {
      type: "parts",
      title: "Parts ordered for your repair",
      body: `${name} (x${quantity || 1})`,
      link: `/ticket/${_id}`,
    });
    return res.json({ status: "success", message: "Part added", result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

router.patch(
  "/parts/:_id/:partId",
  userAuthorization,
  staffOnly,
  async (req, res) => {
    try {
      const { _id, partId } = req.params;
      const { status } = req.body;
      const result = await updatePartStatus({ _id, partId, status });
      if (status === "Arrived") {
        const tenant = await getUserById(result.clientId);
        await notifyUser(tenant, {
          type: "parts",
          title: "Parts have arrived",
          body: "Your building can now schedule the repair appointment.",
          link: `/ticket/${_id}`,
        });
      }
      return res.json({ status: "success", message: "Part updated", result });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  }
);

// ---- Appointment (staff) ----
router.post("/appointment/:_id", userAuthorization, staffOnly, async (req, res) => {
  try {
    const { _id } = req.params;
    const { scheduledFor, professional, note } = req.body;
    if (!scheduledFor) {
      return res.json({ status: "error", message: "A date/time is required" });
    }
    const result = await setAppointment({
      _id,
      appointment: {
        scheduledFor,
        professional: professional || "",
        note: note || "",
        status: "Scheduled",
      },
    });
    const tenant = await getUserById(result.clientId);
    await notifyUser(tenant, {
      type: "appointment",
      title: "Repair appointment scheduled",
      body: `${professional || "A professional"} will visit on ${new Date(
        scheduledFor
      ).toLocaleString()}`,
      link: `/ticket/${_id}`,
    });
    return res.json({ status: "success", message: "Appointment scheduled", result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// ---- Delete (owner or management/landlord) ----
router.delete("/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.user.role === "tenant" ? req.user._id : null;
    await deleteTicket({ _id, clientId });
    return res.json({ status: "success", message: "This ticket has been deleted." });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

module.exports = router;
