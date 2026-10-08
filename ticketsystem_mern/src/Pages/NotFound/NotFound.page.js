import React from "react";
import { useHistory } from "react-router-dom";

const NotFound = () => {
  const history = useHistory();
  return (
    <div className="lux-notfound">
      <div className="code">404</div>
      <h2 style={{ margin: 0 }}>This door doesn't open.</h2>
      <p className="lux-soft" style={{ maxWidth: 420 }}>
        The page you're looking for isn't here. Let's get you back to familiar halls.
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="lux-btn" onClick={() => history.push("/")}>
          Back home
        </button>
        <button className="lux-btn lux-btn-ghost" onClick={() => history.push("/login")}>
          Sign in
        </button>
      </div>
    </div>
  );
};

export default NotFound;
