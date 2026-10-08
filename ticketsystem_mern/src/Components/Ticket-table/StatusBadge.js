import React from "react";

// Maps a ticket status to a themed pill.
const TONE = {
  "Pending operator response": "gold",
  "Pending tenant response": "gold",
  "In progress": "emerald",
  "Awaiting parts": "rose",
  "Appointment scheduled": "emerald",
  Closed: "dim",
};

const StatusBadge = ({ status }) => (
  <span className={`lux-badge ${TONE[status] || ""}`}>{status}</span>
);

export default StatusBadge;
