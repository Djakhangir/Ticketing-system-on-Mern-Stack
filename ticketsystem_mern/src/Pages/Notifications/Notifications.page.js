import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../Api/notificationApi";

const TYPE_TONE = {
  ticket: "gold",
  message: "gold",
  parts: "emerald",
  appointment: "emerald",
  package: "rose",
  system: "dim",
};

const Notifications = () => {
  const history = useHistory();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await getNotifications();
      if (res.status === "success") setItems(res.result || []);
    } catch (e) {
      /* empty state below */
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const open = async (n) => {
    if (!n.read) await markNotificationRead(n._id);
    if (n.link) history.push(n.link);
    else load();
  };

  const allRead = async () => {
    await markAllNotificationsRead();
    await load();
  };

  const unread = items.filter((n) => !n.read).length;

  return (
    <div>
      <p className="lux-kicker">Inbox</p>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: "2.4rem", margin: "2px 0" }}>Notifications</h1>
        {unread > 0 && <span className="lux-badge gold">{unread} unread</span>}
        {unread > 0 && (
          <button className="lux-btn lux-btn-ghost lux-btn-sm" style={{ marginLeft: "auto" }} onClick={allRead}>
            Mark all read
          </button>
        )}
      </div>

      <hr className="lux-hairline" />
      {loading && <span className="lux-spinner" />}
      {!loading && items.length === 0 && <p className="lux-muted">You're all caught up.</p>}

      {items.map((n) => (
        <div
          className="lux-row"
          key={n._id}
          style={{ cursor: "pointer", opacity: n.read ? 0.6 : 1 }}
          onClick={() => open(n)}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className={`lux-badge ${TYPE_TONE[n.type] || "dim"}`}>{n.type}</span>
              <strong>{n.title}</strong>
              {!n.read && <span className="dot" />}
            </div>
            <div className="lux-soft" style={{ fontSize: "0.9rem", marginTop: 4 }}>{n.body}</div>
            <div className="lux-muted" style={{ fontSize: "0.8rem" }}>
              {new Date(n.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
