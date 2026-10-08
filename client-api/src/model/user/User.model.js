const { UserSchema } = require("./User.schema");

const insertUser = (userObj) => UserSchema(userObj).save();

const getUserByEmail = (email) => {
  if (!email) return null;
  return UserSchema.findOne({ email });
};

const getUserById = (_id) => {
  if (!_id) return null;
  return UserSchema.findById(_id);
};

// Staff directory queries used for assignment and oversight.
const getUsersByRole = (role, building) => {
  const query = { role };
  if (building) query.building = building;
  return UserSchema.find(query).select("name email role building apartment phone");
};

// Everyone who should be notified about activity in a building's ticket:
// the tenant owner is handled separately; here we return the staff pool.
const getBuildingStaff = (building) =>
  UserSchema.find({
    building,
    role: { $in: ["superintendent", "management", "landlord"] },
  }).select("name email role building phone");

const storeUserRefreshJWT = (_id, token) =>
  UserSchema.findOneAndUpdate(
    { _id },
    { $set: { "refreshJWT.token": token, "refreshJWT.addedAt": Date.now() } },
    { new: true }
  );

const updatePassword = (email, newhashedPass) =>
  UserSchema.findOneAndUpdate(
    { email },
    { $set: { password: newhashedPass } },
    { new: true }
  );

const verifyUser = (_id, email) =>
  UserSchema.findOneAndUpdate(
    { _id, email, isVerified: false },
    { $set: { isVerified: true } },
    { new: true }
  );

module.exports = {
  insertUser,
  getUserByEmail,
  getUserById,
  getUsersByRole,
  getBuildingStaff,
  storeUserRefreshJWT,
  updatePassword,
  verifyUser,
};
