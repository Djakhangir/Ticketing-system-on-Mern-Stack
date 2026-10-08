import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { createNewTicket } from "../../Api/ticketApi";

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

const AddTicket = () => {
  const history = useHistory();
  const { user } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    subject: "",
    category: "General",
    priority: "Medium",
    message: "",
    contactPhone: user?.phone || "",
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const upd = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    if (!form.subject || !form.message) {
      return setStatus({ type: "error", msg: "Please add a subject and describe the issue" });
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("media", file);
      const res = await createNewTicket(fd);
      if (res.status === "success") {
        setStatus({ type: "ok", msg: "Request submitted. Your building has been notified." });
        setTimeout(() => history.push("/tickets"), 1400);
      } else {
        setStatus({ type: "error", msg: res.message || "Could not submit request" });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Could not submit request. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div>
      <p className="lux-kicker">New request</p>
      <h1 style={{ fontSize: "2.4rem", marginTop: 2 }}>Tell us what needs care</h1>
      <p className="lux-soft">
        {user?.building}
        {user?.apartment ? ` · Apartment ${user.apartment}` : ""}
      </p>

      <div className="lux-card" style={{ marginTop: 20, maxWidth: 720 }}>
        {status.msg && <div className={`lux-alert ${status.type}`}>{status.msg}</div>}
        <form onSubmit={submit}>
          <label className="lux-label">Subject</label>
          <input
            className="lux-input"
            name="subject"
            value={form.subject}
            onChange={upd}
            placeholder="e.g. Leaking kitchen faucet"
            required
          />

          <div className="lux-grid cols-2" style={{ marginTop: 16 }}>
            <div>
              <label className="lux-label">Category</label>
              <select className="lux-select" name="category" value={form.category} onChange={upd}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="lux-label">Priority</label>
              <select className="lux-select" name="priority" value={form.priority} onChange={upd}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label className="lux-label">Describe the issue</label>
            <textarea
              className="lux-textarea"
              name="message"
              rows={5}
              value={form.message}
              onChange={upd}
              placeholder="What is happening, where, and since when?"
              required
            />
          </div>

          <div className="lux-grid cols-2" style={{ marginTop: 16 }}>
            <div>
              <label className="lux-label">Contact phone</label>
              <input
                className="lux-input"
                name="contactPhone"
                value={form.contactPhone}
                onChange={upd}
                placeholder="Best number to reach you"
              />
            </div>
            <div>
              <label className="lux-label">Photo (optional)</label>
              <input
                className="lux-input"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>

          <div style={{ height: 22 }} />
          <button className="lux-btn" disabled={loading}>
            {loading ? <span className="lux-spinner" /> : "Submit request"}
          </button>
          <button
            type="button"
            className="lux-btn lux-btn-ghost"
            style={{ marginLeft: 10 }}
            onClick={() => history.push("/dashboard")}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTicket;
