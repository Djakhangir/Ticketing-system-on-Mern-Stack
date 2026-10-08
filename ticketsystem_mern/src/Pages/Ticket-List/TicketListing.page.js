import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllTickets } from "../../Api/ticketApi";
import StatusBadge from "../../Components/Ticket-table/StatusBadge";

const FILTERS = ["All", "Open", "Awaiting parts", "Appointment scheduled", "Closed"];

const TicketList = () => {
  const history = useHistory();
  const { user } = useSelector((state) => state.user);
  const role = user?.role || sessionStorage.getItem("role") || "tenant";
  const isStaff = role !== "tenant";

  const [tickets, setTickets] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllTickets();
        if (res.data.status === "success") setTickets(res.data.result || []);
      } catch (e) {
        /* empty state below */
      }
      setLoading(false);
    })();
  }, []);

  const visible = tickets.filter((t) => {
    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Open"
        ? t.status !== "Closed"
        : t.status === filter;
    const hay = `${t.subject} ${t.category} ${t.apartment} ${t.assignedName}`.toLowerCase();
    return matchesFilter && hay.includes(q.toLowerCase());
  });

  return (
    <div>
      <p className="lux-kicker">{isStaff ? "Operations" : "Your history"}</p>
      <h1 style={{ fontSize: "2.4rem", marginTop: 2 }}>
        {isStaff ? "All tickets" : "My requests"}
      </h1>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginTop: 18 }}>
        <input
          className="lux-input"
          style={{ maxWidth: 300 }}
          placeholder="Search subject, unit, category…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <span
              key={f}
              className={`lux-badge ${filter === f ? "gold" : "dim"}`}
              style={{ cursor: "pointer" }}
              onClick={() => setFilter(f)}
            >
              {f}
            </span>
          ))}
        </div>
        {!isStaff && (
          <button
            className="lux-btn lux-btn-sm"
            style={{ marginLeft: "auto" }}
            onClick={() => history.push("/add-ticket")}
          >
            + New request
          </button>
        )}
      </div>

      <hr className="lux-hairline" />

      {loading && <span className="lux-spinner" />}
      {!loading && visible.length === 0 && <p className="lux-muted">No tickets match.</p>}

      {visible.map((t) => (
        <div className="lux-row" key={t._id} onClick={() => history.push(`/ticket/${t._id}`)}>
          <div>
            <strong>{t.subject}</strong>
            <div className="lux-muted" style={{ fontSize: "0.85rem" }}>
              {isStaff ? `Apt ${t.apartment || "—"} · ` : ""}
              {t.category} · Opened {new Date(t.openAt).toLocaleDateString()}
              {t.assignedName ? ` · ${t.assignedName}` : ""}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {t.priority === "Emergency" && <span className="lux-badge rose">Emergency</span>}
            <StatusBadge status={t.status} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketList;
