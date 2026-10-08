import React, { useEffect, useState } from "react";
import {
  assignTicket,
  setTicketStatus,
  addPart,
  updatePartStatus,
  scheduleAppointment,
  getStaffDirectory,
} from "../../Api/ticketApi";

const STATUSES = [
  "Pending operator response",
  "Pending tenant response",
  "In progress",
  "Awaiting parts",
  "Appointment scheduled",
  "Closed",
];

const PART_STATES = ["Ordered", "Pending arrival", "Arrived", "Cancelled"];

// Staff-only side panel: assign, status, parts and appointment controls.
// Landlords see the same data read-only (oversight).
const StaffPanel = ({ ticket, myRole, onChange }) => {
  const readOnly = myRole === "landlord";

  const [directory, setDirectory] = useState([]);
  const [assignee, setAssignee] = useState(ticket.assignedTo || "");
  const [status, setStatus] = useState(ticket.status);
  const [busy, setBusy] = useState("");

  const [part, setPart] = useState({ name: "", quantity: 1, supplier: "", note: "" });
  const [appt, setAppt] = useState({ scheduledFor: "", professional: "", note: "" });

  useEffect(() => {
    if (readOnly) return;
    (async () => {
      try {
        const res = await getStaffDirectory("superintendent");
        if (res.status === "success") setDirectory(res.result || []);
      } catch (e) {
        /* directory optional */
      }
    })();
  }, [readOnly]);

  const run = async (key, fn) => {
    setBusy(key);
    try {
      const res = await fn();
      if (res.status === "success") await onChange();
    } catch (e) {
      /* surfaced by parent refresh */
    }
    setBusy("");
  };

  const partsArrived =
    ticket.parts?.length > 0 && ticket.parts.every((p) => p.status === "Arrived" || p.status === "Cancelled");

  return (
    <div className="lux-card" style={{ marginTop: 0 }}>
      <p className="lux-kicker">Operations</p>
      <h3 style={{ margin: "4px 0 14px" }}>Manage this ticket</h3>

      {/* Assign */}
      <label className="lux-label">Assigned to</label>
      {readOnly ? (
        <p className="lux-soft">{ticket.assignedName || "Unassigned"}</p>
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <select
            className="lux-select"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="">Unassigned</option>
            {directory.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            className="lux-btn lux-btn-sm"
            disabled={!assignee || busy === "assign"}
            onClick={() => run("assign", () => assignTicket(ticket._id, assignee))}
          >
            {busy === "assign" ? <span className="lux-spinner" /> : "Assign"}
          </button>
        </div>
      )}

      {/* Status */}
      <div style={{ marginTop: 16 }}>
        <label className="lux-label">Status</label>
        {readOnly ? (
          <p className="lux-soft">{ticket.status}</p>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <select
              className="lux-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              className="lux-btn lux-btn-sm"
              disabled={status === ticket.status || busy === "status"}
              onClick={() => run("status", () => setTicketStatus(ticket._id, status))}
            >
              {busy === "status" ? <span className="lux-spinner" /> : "Set"}
            </button>
          </div>
        )}
      </div>

      <hr className="lux-hairline" />

      {/* Parts */}
      <p className="lux-kicker">Parts order</p>
      {(!ticket.parts || ticket.parts.length === 0) && (
        <p className="lux-muted" style={{ fontSize: "0.85rem" }}>No parts ordered.</p>
      )}
      {ticket.parts?.map((p) => (
        <div
          key={p._id}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 }}
        >
          <div>
            <strong>{p.name}</strong> <span className="lux-muted">×{p.quantity}</span>
            {p.supplier ? <div className="lux-muted" style={{ fontSize: "0.8rem" }}>{p.supplier}</div> : null}
          </div>
          {readOnly ? (
            <span className="lux-badge dim">{p.status}</span>
          ) : (
            <select
              className="lux-select"
              style={{ maxWidth: 150 }}
              value={p.status}
              onChange={(e) => run("part-" + p._id, () => updatePartStatus(ticket._id, p._id, e.target.value))}
            >
              {PART_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}

      {!readOnly && (
        <div style={{ marginTop: 10 }}>
          <input
            className="lux-input"
            placeholder="Part name"
            value={part.name}
            onChange={(e) => setPart({ ...part, name: e.target.value })}
          />
          <div className="lux-grid cols-2" style={{ marginTop: 8 }}>
            <input
              className="lux-input"
              type="number"
              min={1}
              placeholder="Qty"
              value={part.quantity}
              onChange={(e) => setPart({ ...part, quantity: e.target.value })}
            />
            <input
              className="lux-input"
              placeholder="Supplier"
              value={part.supplier}
              onChange={(e) => setPart({ ...part, supplier: e.target.value })}
            />
          </div>
          <button
            className="lux-btn lux-btn-sm"
            style={{ marginTop: 10 }}
            disabled={!part.name || busy === "add-part"}
            onClick={() =>
              run("add-part", async () => {
                const res = await addPart(ticket._id, part);
                if (res.status === "success") setPart({ name: "", quantity: 1, supplier: "", note: "" });
                return res;
              })
            }
          >
            {busy === "add-part" ? <span className="lux-spinner" /> : "Order part"}
          </button>
        </div>
      )}

      <hr className="lux-hairline" />

      {/* Appointment */}
      <p className="lux-kicker">Appointment</p>
      {ticket.appointment?.status === "Scheduled" ? (
        <p className="lux-soft">
          {ticket.appointment.professional || "A professional"} ·{" "}
          {new Date(ticket.appointment.scheduledFor).toLocaleString()}
        </p>
      ) : (
        <p className="lux-muted" style={{ fontSize: "0.85rem" }}>None scheduled.</p>
      )}

      {!readOnly && (
        <div style={{ marginTop: 10 }}>
          {!partsArrived && ticket.parts?.length > 0 && (
            <p className="lux-muted" style={{ fontSize: "0.8rem" }}>
              Tip: mark parts as Arrived before booking.
            </p>
          )}
          <input
            className="lux-input"
            type="datetime-local"
            value={appt.scheduledFor}
            onChange={(e) => setAppt({ ...appt, scheduledFor: e.target.value })}
          />
          <input
            className="lux-input"
            style={{ marginTop: 8 }}
            placeholder="Professional / vendor"
            value={appt.professional}
            onChange={(e) => setAppt({ ...appt, professional: e.target.value })}
          />
          <input
            className="lux-input"
            style={{ marginTop: 8 }}
            placeholder="Note (optional)"
            value={appt.note}
            onChange={(e) => setAppt({ ...appt, note: e.target.value })}
          />
          <button
            className="lux-btn lux-btn-sm"
            style={{ marginTop: 10 }}
            disabled={!appt.scheduledFor || busy === "appt"}
            onClick={() =>
              run("appt", async () => {
                const res = await scheduleAppointment(ticket._id, appt);
                if (res.status === "success") setAppt({ scheduledFor: "", professional: "", note: "" });
                return res;
              })
            }
          >
            {busy === "appt" ? <span className="lux-spinner" /> : "Schedule appointment"}
          </button>
        </div>
      )}
    </div>
  );
};

export default StaffPanel;
