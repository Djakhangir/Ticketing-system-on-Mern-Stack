import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { userRegistration } from "../../Api/userApi";

const ROLES = [
  { value: "tenant", label: "Tenant", hint: "I live in a unit and raise requests" },
  { value: "superintendent", label: "Superintendent", hint: "On-site staff for a building" },
  { value: "management", label: "Management office", hint: "Oversee buildings & staff" },
  { value: "landlord", label: "Landlord", hint: "Owner oversight" },
];

export const Registration = () => {
  const history = useHistory();
  const [form, setForm] = useState({
    name: "",
    role: "tenant",
    building: "",
    apartment: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const upd = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    if (form.password !== form.confirm) {
      return setStatus({ type: "error", msg: "Passwords do not match" });
    }
    if (form.password.length < 8) {
      return setStatus({ type: "error", msg: "Password must be at least 8 characters" });
    }
    setLoading(true);
    try {
      const { confirm, ...payload } = form;
      const res = await userRegistration(payload);
      if (res.status === "success") {
        setStatus({
          type: "ok",
          msg: "Account created. Check your email to verify, then sign in.",
        });
        setTimeout(() => history.push("/"), 2500);
      } else {
        setStatus({ type: "error", msg: res.message || "Registration failed" });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Registration failed. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div className="lux-entry" style={{ padding: "40px 16px", minHeight: "100vh" }}>
      <div className="lux-scene" aria-hidden="true">
        <div className="lux-facade"><div className="lux-door" /></div>
      </div>

      <div
        className="lux-auth lux-glass lux-rise"
        style={{ width: "min(94vw, 560px)", maxHeight: "92vh", overflowY: "auto" }}
      >
        <p className="lux-kicker">Join the residence</p>
        <h1>Create your account</h1>
        <p className="sub">One elegant place for every apartment matter.</p>

        {status.msg && <div className={`lux-alert ${status.type}`}>{status.msg}</div>}

        <form onSubmit={submit}>
          <label className="lux-label">I am a…</label>
          <select className="lux-select" name="role" value={form.role} onChange={upd}>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label} — {r.hint}
              </option>
            ))}
          </select>

          <div className="lux-grid cols-2" style={{ marginTop: 16 }}>
            <div>
              <label className="lux-label">Full name</label>
              <input className="lux-input" name="name" value={form.name} onChange={upd} required />
            </div>
            <div>
              <label className="lux-label">Building</label>
              <input
                className="lux-input"
                name="building"
                value={form.building}
                onChange={upd}
                placeholder="e.g. Maple Court"
                required
              />
            </div>
          </div>

          {form.role === "tenant" && (
            <div style={{ marginTop: 16 }}>
              <label className="lux-label">Apartment / Unit</label>
              <input
                className="lux-input"
                name="apartment"
                value={form.apartment}
                onChange={upd}
                placeholder="e.g. AAA or 12B"
                required
              />
            </div>
          )}

          <div className="lux-grid cols-2" style={{ marginTop: 16 }}>
            <div>
              <label className="lux-label">Phone</label>
              <input className="lux-input" name="phone" value={form.phone} onChange={upd} placeholder="Optional" />
            </div>
            <div>
              <label className="lux-label">Address</label>
              <input className="lux-input" name="address" value={form.address} onChange={upd} placeholder="Optional" />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label className="lux-label">Email</label>
            <input className="lux-input" type="email" name="email" value={form.email} onChange={upd} required />
          </div>

          <div className="lux-grid cols-2" style={{ marginTop: 16 }}>
            <div>
              <label className="lux-label">Password</label>
              <input className="lux-input" type="password" name="password" value={form.password} onChange={upd} required />
            </div>
            <div>
              <label className="lux-label">Confirm</label>
              <input className="lux-input" type="password" name="confirm" value={form.confirm} onChange={upd} required />
            </div>
          </div>

          <div style={{ height: 22 }} />
          <button className="lux-btn" style={{ width: "100%" }} disabled={loading}>
            {loading ? <span className="lux-spinner" /> : "Create account"}
          </button>
        </form>

        <hr className="lux-hairline" />
        <p className="lux-muted" style={{ textAlign: "center" }}>
          Already registered? <a href="/">Sign in</a>
        </p>
      </div>
    </div>
  );
};
