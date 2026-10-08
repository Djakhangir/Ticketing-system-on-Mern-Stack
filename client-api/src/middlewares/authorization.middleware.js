const { verifyAccessJWT } = require("../helpers/jwt.helper");
const { getJWT, deleteJWT } = require("../helpers/redis.helper");
const { getUserById } = require("../model/user/User.model");

// Validate the access token and attach the full user (role, building,
// apartment) to the request so downstream handlers can make role decisions.
const userAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;

  const decoded = await verifyAccessJWT(authorization);

  if (decoded.email) {
    const userId = await getJWT(authorization);
    if (!userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.userId = userId;
    req.user = user;
    return next();
  }

  deleteJWT(authorization);
  return res
    .status(403)
    .json({ message: "Forbidden due to User Authorization" });
};

// Guard a route to specific roles. Must run after userAuthorization.
const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ status: "error", message: "You do not have access to this resource" });
  }
  next();
};

// Convenience: any non-tenant staff member.
const staffOnly = allowRoles("superintendent", "management", "landlord");

module.exports = {
  userAuthorization,
  allowRoles,
  staffOnly,
};
