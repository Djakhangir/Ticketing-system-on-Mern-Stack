import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPackages, markPackagePickedUp } from "../../Api/packageApi";
import { mediaUrl } from "../../Api/http";

const Packages = () => {
  const history = useHistory();
  const { user } = useSelector((state) => state.user);
  const role = user?.role || sessionStorage.getItem("role") || "tenant";
  const isStaff = role !== "tenant";

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await getPackages();
      if (res.status === "success") setPackages(res.result || []);
    } catch (e) {
      /* empty state below */
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const pickup = async (_id) => {
    await markPackagePickedUp(_id);
    await load();
  };

  const waiting = packages.filter((p) => p.status === "Awaiting pickup");
  const collected = packages.filter((p) => p.status !== "Awaiting pickup");

  return (
    <div>
      <p className="lux-kicker">Concierge</p>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: "2.4rem", margin: "2px 0" }}>Lobby packages</h1>
        {isStaff && (
          <button
            className="lux-btn lux-btn-sm"
            style={{ marginLeft: "auto" }}
            onClick={() => history.push("/log-package")}
          >
            + Log a package
          </button>
        )}
      </div>

      <hr className="lux-hairline" />
      {loading && <span className="lux-spinner" />}
      {!loading && packages.length === 0 && (
        <p className="lux-muted">No packages on record.</p>
      )}

      {waiting.length > 0 && <h3>Awaiting pickup</h3>}
      {waiting.map((p) => (
        <div className="lux-row" key={p._id}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {p.photo?.name && (
              <img
                src={mediaUrl + p.photo.name}
                alt="package"
                style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10 }}
              />
            )}
            <div>
              <strong>Apt {p.apartment}</strong>
              {p.courier ? ` · ${p.courier}` : ""}
              <div className="lux-muted" style={{ fontSize: "0.85rem" }}>
                Logged {new Date(p.createdAt).toLocaleString()}
                {p.loggedByName ? ` · by ${p.loggedByName}` : ""}
              </div>
              {p.note && <div className="lux-soft" style={{ fontSize: "0.85rem" }}>{p.note}</div>}
            </div>
          </div>
          <button className="lux-btn lux-btn-sm" onClick={() => pickup(p._id)}>
            Mark picked up
          </button>
        </div>
      ))}

      {collected.length > 0 && <h3 style={{ marginTop: 24 }}>Collected</h3>}
      {collected.map((p) => (
        <div className="lux-row" key={p._id}>
          <div>
            <strong>Apt {p.apartment}</strong>
            {p.courier ? ` · ${p.courier}` : ""}
            <div className="lux-muted" style={{ fontSize: "0.85rem" }}>
              Picked up {p.pickedUpAt ? new Date(p.pickedUpAt).toLocaleString() : ""}
            </div>
          </div>
          <span className="lux-badge dim">Collected</span>
        </div>
      ))}
    </div>
  );
};

export default Packages;
