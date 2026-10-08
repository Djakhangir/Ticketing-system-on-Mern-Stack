// A package/parcel logged at the lobby for a tenant. In this build it is
// entered manually by concierge/superintendent (the "camera detected a box"
// event is simulated by that manual log), which fires a tenant notification.

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PackageSchema = new Schema({
  building: { type: String, required: true },
  apartment: { type: String, required: true },
  // Resolved tenant recipient, if we could match building+apartment.
  recipientId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  courier: { type: String, default: "" },
  note: { type: String, default: "" },
  photo: { name: String, size: Number, type: String },
  status: {
    type: String,
    enum: ["Awaiting pickup", "Picked up"],
    default: "Awaiting pickup",
  },
  loggedBy: { type: Schema.Types.ObjectId, ref: "User" },
  loggedByName: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  pickedUpAt: { type: Date, default: null },
});

module.exports = {
  PackageSchema: mongoose.model("Package", PackageSchema),
};
