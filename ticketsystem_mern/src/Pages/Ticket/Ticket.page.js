import React, { useCallback, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { getTicket, updateReplyTicket, closeTicket } from "../../Api/ticketApi";
import { mediaUrl } from "../../Api/http";
import ChatWindow from "../../Components/Chat/ChatWindow";
import StaffPanel from "../../Components/Staff/StaffPanel";
import StatusBadge from "../../Components/Ticket-table/StatusBadge";

const Ticket = () => {
  const { tId } = useParams();
  const history = useHistory();
  const { user } = useSelector((state) => state.user);
  const role = user?.role || sessionStorage.getItem("role") || "tenant";
  const isStaff = role !== "tenant";

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await getTicket(tId);
      if (res.data.status === "success" && res.data.result?.length) {
        setTicket(res.data.result[0]);
      } else {
        setNotFound(true);
      }
    } catch (e) {
      setNotFound(true);
    }
    setLoading(false);
  }, [tId]);

  useEffect(() => {
    load();
  }, [load]);

  const onSend = async (message) => {
    await updateReplyTicket(tId, { message });
    await load();
  };

  const onClose = async () => {
    await closeTicket(tId);
    await load();
  };

  if (loading) return <span className="lux-spinner" />;
  if (notFound || !ticket)
    return (
      <div>
        <p className="lux-muted">Ticket not found.</p>
        <button className="lux-btn lux-btn-ghost" onClick={() => history.push("/tickets")}>
          Back to tickets
        </button>
      </div>
    );

  const closed = ticket.status === "Closed";

  return (
    <div>
      <p className="lux-kicker">{ticket.category} · {ticket.priority}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: "2.2rem", margin: "2px 0" }}>{ticket.subject}</h1>
        <StatusBadge status={ticket.status} />
        {ticket.priority === "Emergency" && <span className="lux-badge rose">Emergency</span>}
      </div>
      <p className="lux-soft">
        {isStaff ? `Apt ${ticket.apartment || "—"} · ${ticket.building || ""} · ` : ""}
        Opened {new Date(ticket.openAt).toLocaleString()}
        {ticket.assignedName ? ` · Handled by ${ticket.assignedName}` : ""}
        {ticket.contactPhone ? ` · ☎ ${ticket.contactPhone}` : ""}
      </p>

      {ticket.media?.length > 0 && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          {ticket.media.map((m) => (
            <a key={m.name} href={mediaUrl + m.name} target="_blank" rel="noreferrer">
              <img
                src={mediaUrl + m.name}
                alt={m.name}
                style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(212,175,55,0.35)" }}
              />
            </a>
          ))}
        </div>
      )}

      <div className="lux-grid" style={{ gridTemplateColumns: isStaff ? "1.6fr 1fr" : "1fr", gap: 22, marginTop: 22, alignItems: "start" }}>
        <div>
          <ChatWindow
            conversations={ticket.conversations || []}
            myName={user?.name}
            onSend={onSend}
            disabled={closed}
          />
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            {!closed && (
              <button className="lux-btn lux-btn-ghost lux-btn-sm" onClick={onClose}>
                Close ticket
              </button>
            )}
            <button className="lux-btn lux-btn-ghost lux-btn-sm" onClick={() => history.push("/tickets")}>
              Back
            </button>
          </div>
        </div>

        {isStaff && <StaffPanel ticket={ticket} myRole={role} onChange={load} />}
      </div>
    </div>
  );
};

export default Ticket;
