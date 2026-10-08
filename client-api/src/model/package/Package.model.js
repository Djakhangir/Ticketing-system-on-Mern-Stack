const { PackageSchema } = require("./Package.schema");

const insertPackage = (obj) => PackageSchema(obj).save();

// Tenant view: packages for their building+apartment.
const getPackagesForTenant = (building, apartment) =>
  PackageSchema.find({ building, apartment }).sort({ createdAt: -1 });

// Staff view: everything in a building.
const getPackagesForBuilding = (building) => {
  const query = building ? { building } : {};
  return PackageSchema.find(query).sort({ createdAt: -1 });
};

const markPickedUp = (_id) =>
  PackageSchema.findOneAndUpdate(
    { _id },
    { status: "Picked up", pickedUpAt: Date.now() },
    { new: true }
  );

module.exports = {
  insertPackage,
  getPackagesForTenant,
  getPackagesForBuilding,
  markPickedUp,
};
