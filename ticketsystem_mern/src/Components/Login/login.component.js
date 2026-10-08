import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { loginPending, loginSuccess, loginFail } from "./loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getUserProfile } from "../../Pages/Dashboard/userAction";
import { userLogin } from "../../Api/userApi";

// Cinematic sign-in: a frosted glass panel floats over a grand lobby facade.
// On a successful login the whole scene rushes through the golden doorway
// before we route into the app.
const LoginForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isLoading, isAuth, error } = useSelector((state) => state.login);

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [eye, setEye] = useState(false);
  const [zooming, setZooming] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("accessJWT")) history.push("/dashboard");
  }, [history, isAuth]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginPending());
    try {
      const res = await userLogin({ email, password });
      if (res.status === "error") return dispatch(loginFail(res.message));
      dispatch(loginSuccess());
      dispatch(getUserProfile());
      // Play the zoom, then travel into the building.
      setZooming(true);
      setTimeout(() => history.push("/dashboard"), 1450);
    } catch (err) {
      dispatch(loginFail(typeof err === "string" ? err : err.message));
    }
  };

  return (
    <div className={`lux-entry ${zooming ? "zooming" : ""}`}>
      <div className="lux-scene" aria-hidden="true">
        <div className="lux-facade">
          <div className="lux-door" />
        </div>
      </div>

      <div className="lux-auth lux-glass lux-rise">
        <p className="lux-kicker">The Residences</p>
        <h1>Welcome home</h1>
        <p className="sub">Sign in to your building concierge.</p>

        {error && <div className="lux-alert error">{error}</div>}

        <form autoComplete="off" onSubmit={handleOnSubmit}>
          <label className="lux-label">Email</label>
          <input
            className="lux-input"
            type="email"
            value={email}
            placeholder="you@residence.com"
            onChange={(e) => setemail(e.target.value)}
            required
          />
          <div style={{ height: 16 }} />
          <label className="lux-label">Password</label>
          <div style={{ position: "relative" }}>
            <input
              className="lux-input"
              type={eye ? "text" : "password"}
              value={password}
              placeholder="••••••••"
              onChange={(e) => setpassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              onClick={() => setEye(!eye)}
              icon={eye ? faEye : faEyeSlash}
              style={{
                cursor: "pointer",
                position: "absolute",
                right: 14,
                top: 14,
                color: "var(--lux-ink-dim)",
              }}
            />
          </div>

          <div style={{ height: 24 }} />
          <button className="lux-btn" type="submit" style={{ width: "100%" }} disabled={isLoading}>
            {isLoading ? <span className="lux-spinner" /> : "Enter"}
          </button>
        </form>

        <hr className="lux-hairline" />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <a href="/password-reset">Forgot password?</a>
          <a href="/registration">Create account</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
