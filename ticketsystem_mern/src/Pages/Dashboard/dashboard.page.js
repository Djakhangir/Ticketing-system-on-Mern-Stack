import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllTickets } from "../../Api/ticketApi";
import { getPackages } from "../../Api/packageApi";
import StatusBadge from "../../Components/Ticket-table/StatusBadge";

const ROLE_TITLES = {
  tenant: "Your residence",
  superintendent: "Building operations",
  management: "Management office",
  landlord: "Portfolio oversight",
};

const Dashboard = () => {
  const history = useHistory();
  const { user } = useSelector((state) => state.user);
  const role = user?.role || sessionStorage.getItem("role") || "tenant";
  const isStaff = role !== "tenant";

  const [tickets, setTickets] = useState([]);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const t = await getAllTickets();
        if (t.data.status === "success") setTickets(t.data.result || []);
        const p = await getPackages();
        if (p.status === "success") setPackages(p.result || []);
      } catch (e) {
        /* handled by empty states */
      }
    })();
  }, []);

  const open = tickets.filter((t) => t.status !== "Closed");
  const awaitingParts = tickets.filter((t) => t.status === "Awaiting parts");
  const appointments = tickets.filter((t) => t.appointment?.status === "Scheduled");
  const emergencies = tickets.filter((t) => t.priority === "Emergency" && t.status !== "Closed");
  const pkgWaiting = packages.filter((p) => p.status === "Awaiting pickup");

  const stats = isStaff
    ? [
        { num: open.length, lbl: "Open tickets" },
        { num: emergencies.length, lbl: "Emergencies" },
        { num: awaitingParts.length, lbl: "Awaiting parts" },
        { num: appointments.length, lbl: "Appointments" },
      ]
    : [
        { num: open.length, lbl: "Active requests" },
        { num: appointments.length, lbl: "Appointments" },
        { num: pkgWaiting.length, lbl: "Packages waiting" },
        { num: tickets.length, lbl: "Total requests" },
      ];

  return (
    <div>
      <p className="lux-kicker">{ROLE_TITLES[role]}</p>
      <h1 style={{ fontSize: "2.6rem", margin: "2px 0 4px" }}>
        Good day, {user?.name || "there"}
      </h1>
      <p className="lux-soft">
        {user?.building || "Your building"}
        {role === "tenant" && user?.apartment ? ` · Apartment ${user.apartment}` : ""}
      </p>

      <div className="lux-grid cols-4" style={{ marginTop: 26 }}>
        {stats.map((s) => (
          <div className="lux-card lux-stat" key={s.lbl}>
            <div className="num">{s.num}</div>
            <div className="lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
        {!isStaff && (
          <button className="lux-btn" onClick={() => history.push("/add-ticket")}>
            + New maintenance request
          </button>
        )}
        {isStaff && (
          <button className="lux-btn" onClick={() => history.push("/log-package")}>
            + Log a lobby package
          </button>
        )}
        <button className="lux-btn lux-btn-ghost" onClick={() => history.push("/tickets")}>
          {isStaff ? "Manage tickets" : "View my requests"}
        </button>
        <button className="lux-btn lux-btn-ghost" onClick={() => history.push("/packages")}>
          Packages
        </button>
      </div>

      {pkgWaiting.length > 0 && !isStaff && (
        <div className="lux-card lux-rise" style={{ marginTop: 26, borderColor: "rgba(212,175,55,0.5)" }}>
          <p className="lux-kicker">Concierge</p>
          <h3 style={{ margin: "4px 0" }}>
            You have {pkgWaiting.length} package{pkgWaiting.length > 1 ? "s" : ""} waiting in the lobby
          </h3>
          <button className="lux-btn lux-btn-sm" onClick={() => history.push("/packages")}>
            View packages
          </button>
        </div>
      )}

      <h3 style={{ marginTop: 34 }}>Recent {isStaff ? "tickets" : "requests"}</h3>
      <hr className="lux-hairline" />
      {tickets.length === 0 && <p className="lux-muted">Nothing here yet.</p>}
      {tickets.slice(0, 6).map((t) => (
        <div className="lux-row" key={t._id} onClick={() => history.push(`/ticket/${t._id}`)}>
          <div>
            <strong>{t.subject}</strong>
            <div className="lux-muted" style={{ fontSize: "0.85rem" }}>
              {isStaff ? `Apt ${t.apartment || "—"} · ` : ""}
              {t.category} · {new Date(t.openAt).toLocaleDateString()}
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

export default Dashboard;
