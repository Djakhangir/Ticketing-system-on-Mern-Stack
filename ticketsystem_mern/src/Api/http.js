import axios from "axios";

// Central place for the API origin and auth header so every module agrees.
// REACT_APP_API_ORIGIN is baked in at build time (see .env / deploy config);
// falls back to localhost for local development.
export const API_ORIGIN =
  process.env.REACT_APP_API_ORIGIN || "http://localhost:3001";
export const rootUrl = `${API_ORIGIN}/v1/`;
export const mediaUrl = `${API_ORIGIN}/uploads/images/`;

export const authHeader = () => ({
  headers: { Authorization: sessionStorage.getItem("accessJWT") },
});

export default axios;
