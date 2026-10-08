const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  insertPackage,
  getPackagesForTenant,
  getPackagesForBuilding,
  markPickedUp,
} = require("../model/package/Package.model");
const { UserSchema } = require("../model/user/User.schema");
const {
  userAuthorization,
  staffOnly,
} = require("../middlewares/authorization.middleware");
const { notifyUser } = require("../helpers/notification.helper");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/images"),
  filename: (req, file, cb) =>
    cb(null, `pkg_${Date.now()}_${file.originalname}`.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// ---- Log a package (staff / concierge) ----
// This is the manual stand-in for lobby-camera detection: logging a package
// resolves the tenant by building+apartment and notifies them.
router.post(
  "/",
  userAuthorization,
  staffOnly,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { apartment, courier, note } = req.body;
      const building = req.body.building || req.user.building;
      if (!building || !apartment) {
        return res.json({
          status: "error",
          message: "Building and apartment are required",
        });
      }

      const tenant = await UserSchema.findOne({
        role: "tenant",
        building,
        apartment,
      });

      const photo = req.file
        ? { name: req.file.filename, size: req.file.size, type: req.file.mimetype }
        : undefined;

      const result = await insertPackage({
        building,
        apartment,
        recipientId: tenant ? tenant._id : null,
        courier: courier || "",
        note: note || "",
        photo,
        loggedBy: req.user._id,
        loggedByName: req.user.name,
      });

      if (tenant) {
        await notifyUser(tenant, {
          type: "package",
          title: "A package is waiting in the lobby",
          body: `${courier ? courier + " · " : ""}Please collect it at your convenience.`,
          link: "/packages",
        });
      }

      return res.json({ status: "success", message: "Package logged", result });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  }
);

// ---- List packages (role-aware) ----
router.get("/", userAuthorization, async (req, res) => {
  try {
    let result;
    if (req.user.role === "tenant") {
      result = await getPackagesForTenant(req.user.building, req.user.apartment);
    } else if (req.user.role === "superintendent") {
      result = await getPackagesForBuilding(req.user.building);
    } else {
      result = await getPackagesForBuilding(req.query.building);
    }
    return res.json({ status: "success", result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// ---- Mark picked up ----
router.patch("/:_id/pickup", userAuthorization, async (req, res) => {
  try {
    const result = await markPickedUp(req.params._id);
    return res.json({ status: "success", message: "Marked as picked up", result });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

module.exports = router;
