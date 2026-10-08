// Maintenance ticket raised by a tenant and worked by building staff.
// Carries the full chat thread, any ordered parts, and a scheduled
// professional appointment.

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const STATUSES = [
  "Pending operator response",
  "Pending tenant response",
  "In progress",
  "Awaiting parts",
  "Appointment scheduled",
  "Closed",
];

const CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Heating/Cooling",
  "Appliance",
  "Structural",
  "Pest control",
  "Flooding",
  "General",
];

const PRIORITIES = ["Low", "Medium", "High", "Emergency"];

const mediaItem = {
  name: String,
  size: Number,
  type: String,
};

const TicketSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  building: { type: String, maxLength: 80, default: "" },
  apartment: { type: String, maxLength: 20, default: "" },
  contactPhone: { type: String, maxLength: 20, default: "" },

  subject: { type: String, maxLength: 100, required: true, default: "" },
  category: { type: String, enum: CATEGORIES, default: "General" },
  priority: { type: String, enum: PRIORITIES, default: "Medium" },

  openAt: { type: Date, required: true, default: Date.now },
  status: {
    type: String,
    enum: STATUSES,
    required: true,
    default: "Pending operator response",
  },

  // Staff member (superintendent/professional) handling this ticket.
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
  assignedName: { type: String, default: "" },

  media: [mediaItem],

  conversations: [
    {
      senderId: { type: Schema.Types.ObjectId, ref: "User" },
      sender: { type: String, maxLength: 50, required: true, default: "" },
      senderRole: { type: String, default: "" },
      message: { type: String, maxLength: 1000, required: true, default: "" },
      msgAt: { type: Date, required: true, default: Date.now },
    },
  ],

  // Parts ordered for the repair: added manually by staff, then tracked
  // from ordered -> arrived so an appointment can be booked.
  parts: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, default: 1 },
      supplier: { type: String, default: "" },
      status: {
        type: String,
        enum: ["Ordered", "Pending arrival", "Arrived", "Cancelled"],
        default: "Ordered",
      },
      orderedAt: { type: Date, default: Date.now },
      note: { type: String, default: "" },
    },
  ],

  // A single scheduled professional visit for this ticket.
  appointment: {
    scheduledFor: { type: Date, default: null },
    professional: { type: String, default: "" },
    note: { type: String, default: "" },
    status: {
      type: String,
      enum: ["None", "Scheduled", "Completed", "Cancelled"],
      default: "None",
    },
  },
});

module.exports = {
  TicketSchema: mongoose.model("Ticket", TicketSchema),
  STATUSES,
  CATEGORIES,
  PRIORITIES,
};
