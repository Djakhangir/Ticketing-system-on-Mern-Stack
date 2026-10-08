import React, { useEffect, useState, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { userLogout } from "../../../Api/userApi";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../../Api/notificationApi";

const timeAgo = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export const Headers = () => {
  const history = useHistory();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const role = user?.role || sessionStorage.getItem("role") || "tenant";

  const [notis, setNotis] = useState([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const unread = notis.filter((n) => !n.read).length;

  const load = async () => {
    try {
      const data = await getNotifications();
      if (data.status === "success") setNotis(data.result || []);
    } catch (e) {
      /* silent — bell simply stays empty */
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 20000); // light polling
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const logMeOut = () => {
    sessionStorage.clear();
    localStorage.removeItem("buildingmgmSite");
    userLogout();
    history.push("/");
  };

  const openNoti = async (n) => {
    if (!n.read) {
      await markNotificationRead(n._id);
      setNotis((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
    }
    setOpen(false);
    if (n.link) history.push(n.link);
  };

  const clearAll = async () => {
    await markAllNotificationsRead();
    setNotis((prev) => prev.map((x) => ({ ...x, read: true })));
  };

  const isStaff = role !== "tenant";
  const active = (p) => (location.pathname === p ? "navlink active" : "navlink");

  return (
    <nav className="lux-nav">
      <div className="brand" onClick={() => history.push("/dashboard")} style={{ cursor: "pointer" }}>
        ✦ Résidence
      </div>

      <div className="links">
        <span className={active("/dashboard")} onClick={() => history.push("/dashboard")}>
          Dashboard
        </span>
        <span className={active("/tickets")} onClick={() => history.push("/tickets")}>
          {isStaff ? "Tickets" : "My Requests"}
        </span>
        {!isStaff && (
          <span className={active("/add-ticket")} onClick={() => history.push("/add-ticket")}>
            New Request
          </span>
        )}
        <span className={active("/packages")} onClick={() => history.push("/packages")}>
          Packages
        </span>
        {isStaff && (
          <span className={active("/log-package")} onClick={() => history.push("/log-package")}>
            Log Package
          </span>
        )}

        <div className="lux-bell" ref={panelRef}>
          <FontAwesomeIcon
            icon={faBell}
            style={{ fontSize: 18, color: "var(--lux-ink-soft)" }}
            onClick={() => setOpen(!open)}
          />
          {unread > 0 && <span className="dot">{unread}</span>}

          {open && (
            <div className="lux-panel lux-glass">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px" }}>
                <strong>Notifications</strong>
                {unread > 0 && (
                  <span className="lux-badge gold" style={{ cursor: "pointer" }} onClick={clearAll}>
                    Mark all read
                  </span>
                )}
              </div>
              {notis.length === 0 && <p className="lux-muted" style={{ padding: 12 }}>Nothing yet.</p>}
              {notis.slice(0, 20).map((n) => (
                <div
                  key={n._id}
                  className={`lux-noti ${n.read ? "" : "unread"}`}
                  onClick={() => openNoti(n)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="t">{n.title}</div>
                  {n.body && <div className="b">{n.body}</div>}
                  <div className="time">{timeAgo(n.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <span className="navlink" onClick={logMeOut}>
          Logout
        </span>
      </div>
    </nav>
  );
};
