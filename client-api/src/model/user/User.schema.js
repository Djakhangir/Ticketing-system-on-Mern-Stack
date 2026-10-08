// User schema: apartment management platform.
// A single account model with a role that drives access:
//   tenant         - lives in a unit, opens maintenance tickets
//   superintendent - on-site staff, handles/assigns tickets for their building
//   management     - management office, oversees buildings, staff, parts
//   landlord       - owner, read-mostly oversight across everything

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ROLES = ["tenant", "superintendent", "management", "landlord"];

const UserSchema = new Schema({
  name: {
    type: String,
    maxLength: 50,
    required: true,
  },
  role: {
    type: String,
    enum: ROLES,
    required: true,
    default: "tenant",
  },
  // Building the account belongs to / is responsible for (e.g. "Maple Court").
  building: {
    type: String,
    maxLength: 80,
    default: "",
  },
  // Unit/apartment number, only meaningful for tenants (e.g. "AAA", "12B").
  apartment: {
    type: String,
    maxLength: 20,
    default: "",
  },
  address: {
    type: String,
    maxLength: 100,
    default: "",
  },
  phone: {
    type: String,
    maxLength: 20,
    default: "",
  },
  email: {
    type: String,
    maxLength: 50,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 100,
    required: true,
  },
  refreshJWT: {
    token: {
      type: String,
      maxLength: 500,
      default: "",
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = {
  UserSchema: mongoose.model("User", UserSchema),
  ROLES,
};
