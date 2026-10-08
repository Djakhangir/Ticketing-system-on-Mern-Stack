import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { logPackage } from "../../Api/packageApi";

const LogPackage = () => {
  const history = useHistory();
  const { user } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    building: user?.building || "",
    apartment: "",
    courier: "",
    note: "",
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const upd = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    if (!form.apartment) {
      return setStatus({ type: "error", msg: "Apartment is required" });
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("photo", file);
      const res = await logPackage(fd);
      if (res.status === "success") {
        setStatus({ type: "ok", msg: "Package logged. The tenant has been notified." });
        setTimeout(() => history.push("/packages"), 1300);
      } else {
        setStatus({ type: "error", msg: res.message || "Could not log package" });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Could not log package. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div>
      <p className="lux-kicker">Concierge</p>
      <h1 style={{ fontSize: "2.4rem", marginTop: 2 }}>Log a lobby package</h1>
      <p className="lux-soft">Record a delivery to notify the resident it is waiting.</p>

      <div className="lux-card" style={{ marginTop: 20, maxWidth: 640 }}>
        {status.msg && <div className={`lux-alert ${status.type}`}>{status.msg}</div>}
        <form onSubmit={submit}>
          <div className="lux-grid cols-2">
            <div>
              <label className="lux-label">Building</label>
              <input className="lux-input" name="building" value={form.building} onChange={upd} placeholder="Building" />
            </div>
            <div>
              <label className="lux-label">Apartment</label>
              <input className="lux-input" name="apartment" value={form.apartment} onChange={upd} placeholder="e.g. 12B" required />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label className="lux-label">Courier (optional)</label>
            <input className="lux-input" name="courier" value={form.courier} onChange={upd} placeholder="UPS, FedEx, Amazon…" />
          </div>

          <div style={{ marginTop: 16 }}>
            <label className="lux-label">Note (optional)</label>
            <textarea className="lux-textarea" name="note" rows={3} value={form.note} onChange={upd} placeholder="Large box, fragile, left at desk…" />
          </div>

          <div style={{ marginTop: 16 }}>
            <label className="lux-label">Photo (optional)</label>
            <input className="lux-input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          </div>

          <div style={{ height: 22 }} />
          <button className="lux-btn" disabled={loading}>
            {loading ? <span className="lux-spinner" /> : "Log package"}
          </button>
          <button type="button" className="lux-btn lux-btn-ghost" style={{ marginLeft: 10 }} onClick={() => history.push("/packages")}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogPackage;
