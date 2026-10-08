//setup the router and import it to app.js;
const express = require("express");
const router = express.Router();

//create new user
const {
  insertUser,
  getUserByEmail,
  getUserById,
  getUsersByRole,
  updatePassword,
  storeUserRefreshJWT,
  verifyUser,
} = require("../model/user/User.model");

//password encryption
const { hashPassword, comparePassword } = require("../helpers/bycript.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const {
  userAuthorization,
  staffOnly,
} = require("../middlewares/authorization.middleware");
const {
  setPasswordResetPin,
  getPinByEmailPin,
  deletePinFromDB,
} = require("../model/resetPin/ResetPin.model");
const { emailProcessor } = require("../helpers/email.helper");
const {
  resetPasswordRequestValidation,
  updatePasswordValidation,
  newUserValidation,
} = require("../middlewares/formValidation.middleware");
const { deleteJWT } = require("../helpers/redis.helper");

// Frontend origin where users land after clicking the email verification link.
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const verificationURL = `${CLIENT_ORIGIN}/verification/`;

//router has get, post, all methods;
// When router.all() it will always opass through this router. next() is nessesary;
router.all("/", (req, res, next) => {
  // res.json({ message: "return from user router" });
  next();
});

//Get user profile router
router.get("/", userAuthorization, async (req, res) => {
  const { _id, name, email, role, building, apartment, phone } = req.user;
  res.json({
    user: { _id, name, email, role, building, apartment, phone },
  });
});

// Staff directory: list users of a given role (optionally within a building).
// Used by superintendents/management to assign tickets to professionals.
router.get("/staff", userAuthorization, staffOnly, async (req, res) => {
  try {
    const { role, building } = req.query;
    const targetRole = role || "superintendent";
    const scope = building || req.user.building;
    const users = await getUsersByRole(targetRole, scope);
    return res.json({ status: "success", users });
  } catch (error) {
    return res.json({ status: "error", message: error.message });
  }
});

//Verify user after sign up
router.patch("/verify", async (req, res) => {
  try {
    const { _id, email } = req.body;

    const result = await verifyUser(_id, email);
    if (result && result.id) {
      return res.json({
        status: "success",
        message: "Your account has been activated, you may sign in now.",
      });
    }

    return res.json({
      // status: "success",
      // message: "Your account has been activated, you may sign in now.",
  // this check for result and result.id?  
      status: "error",
      message: "Invalid request, something is wrong!",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "error",
      message: "Invalid request!",
    });
  }
});

//create new user route
router.post("/", newUserValidation, async (req, res) => {
  const { name, role, building, apartment, email, address, phone, password } =
    req.body;
  try {
    const hashPass = await hashPassword(password);
    const newUserObj = {
      name,
      role,
      building,
      apartment: role === "tenant" ? apartment : "",
      email,
      address,
      phone,
      password: hashPass,
    };
    const result = await insertUser(newUserObj);

    // send the confirmation email
    await emailProcessor({
      email,
      type: "new-user-confirmation-required",
      verificationLink: verificationURL + result._id + "/" + email,
    });

    res.json({ status: "success", message: "New User Created", result });
  } catch (error) {
    const message = error.message.includes("duplicate key")
      ? "This email already has an account"
      : "Unable to create new user at the moment. Please try again.";
    res.json({ status: "error", message });
  }
});

// User sign in Routers
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ status: "error", message: "Invalid form" });
  }

  try {
    ///get user with email from db;
    const user = await getUserByEmail(email);

    // Unknown email: respond with the same generic message as a bad password
    // so we don't leak which emails exist, and avoid dereferencing null.
    if (!user || !user._id) {
      return res.json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.json({
        status: "error",
        message:
          "Your account has not been verified yet. Please check your email and verify your account before able to login.",
      });
    }

    ///hash our password and compare with the db;
    const result = await comparePassword(password, user.password);
    if (!result) {
      return res.json({
        status: "error",
        message: "Invalid email or password",
      });
    }
    //import and use helper jwt function to generate token;
    const accessJWT = await createAccessJWT(user.email, `${user._id}`);
    const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

    res.json({
      status: "success",
      message: "Login successfull",
      accessJWT,
      refreshJWT,
      role: user.role,
      building: user.building,
      apartment: user.apartment,
      name: user.name,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: "Unable to sign you in right now. Please try again later.",
    });
  }
});

//reset password by requesting new password
router.post(
  "/reset-password",
  resetPasswordRequestValidation,
  async (req, res) => {
    const { email } = req.body;
    const user = await getUserByEmail(email);

    //if not user create 6 digit number for the pin
    if (user && user._id) {
      //generate the random pin
      const setPin = await setPasswordResetPin(email);
      //generate and send email to the client with pin to reset password
      await emailProcessor({
        email,
        pin: setPin.pin,
        type: "request-new-password",
      });
    }

    res.json({
      status: "success",
      message:
        "The password reset pin will be sent shortly, if we have your email in our database",
    });
  });

//reset password, updated password
router.patch("/reset-password", updatePasswordValidation, async (req, res) => {
  const { email, pin, newPassword } = req.body;
  const getPin = await getPinByEmailPin(email, pin);

  if (getPin?._id) {
    const dbDate = getPin.addedAt;
    const expiresIn = 1;
    let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);

    const today = new Date();
    if (today > expDate) {
      return res.json({ status: "error", message: "Invalid or expired pin" });
    }

    // encrypt password
    const hashedPassword = await hashPassword(newPassword);

    const user = await updatePassword(email, hashedPassword);

    if (user._id) {
      // Send email notification
      await emailProcessor({ email, type: "password-update-success" });

      // Delete pin from db
      deletePinFromDB(email, pin);
      return res.json({
        status: "success",
        message: "Password updated successfully",
      });
    }
  }
  res.json({
    status: "error",
    message: "Unable to update password. Please try again later",
  });
});

// user logout and invalidate jwts
router.delete("/logout", userAuthorization, async (req, res) => {
  const { authorization } = req.headers;

  //data coming form db
  const _id = req.userId;

  //delete the access token from redis db
  deleteJWT(authorization);

  //delete the refresh token from redis db
  const result = await storeUserRefreshJWT(_id, "");

  if (result._id) {
    return res.json({ status: "success", message: "Logged out successfully" });
  }
  res.json({
    status: "error",
    message: "Unable to log you out. Please try again later",
  });
});

//export the router;
module.exports = router;
