//setup the router and import it to app.js;
const express = require("express");
const router = express.Router();

// ###TODO: create new admin
// const {
//   insertUser,
//   getUserByEmail,
//   getUserById,
//   updatePassword,
//   storeUserRefreshJWT,
//   verifyUser,
// } = require("../model/user/User.model");

// ###TODO: password encryption
const { hashPassword, comparePassword } = require("../helpers/bycript.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const {
  userAuthorization,
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
const { verify } = require("jsonwebtoken");
const { deleteJWT } = require("../helpers/redis.helper");

//router has get, post, all methods;
// When router.all() it will always opass through this router. next() is nessesary;
router.all("/", (req, res, next) => {
  // res.json({ message: "return from user router" });
  next();
});

//Get user profile router
router.get("/", userAuthorization, async (req, res) => {
  const _id = req.userId;
  const userProfile = await getUserById(_id);
  const { name, email } = userProfile;
  res.json({
    user: {
      _id,
      name,
      email,
    },
  });
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
router.post("/", newUserValidation, async (req, res, next) => {
  const { name, company, email, address, phone, password } = req.body;
  try {
    //hash password
    const hashPass = await hashPassword(password);
    const newUserObj = {
      name,
      company,
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
    //TODO: fix the error message in backend for new user has already an account

    // console.log(error);
    // const message =
    //   "Unable to create new user at the moment, Please try again or contact administration!";

    // if (error.message.includes("duplicate key error collection")) {
    //   const message = "This email already has an account";
    // }
    res.json({ status: "error", message});
  }
});

// User sign in Routers
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ status: "error", message: "Invalid form" });
  }

  ///get user with email from db;
  const user = await getUserByEmail(email);

  if (!user.isVerified) {
    return res.json({
      status: "error",
      message:
        "Your account has not been verified yet. Please check your email and verify your account before able to login.",
    });
  }
  /// get the password from db;
  const passwordFromDb = user && user._id ? user.password : null;
  if (!passwordFromDb)
    return res.json({ status: "error", message: "Invalid email or password" });

  ///hash our password and compare with the db;
  const result = await comparePassword(password, passwordFromDb);
  if (!result) {
    return res.json({ status: "error", message: "Invalid email or password" });
  }
  //import and use helper jwt function to generate token;
  const accessJWT = await createAccessJWT(user.email, `${user._id}`);
  const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

  res.json({
    status: "success",
    message: "Login successfull",
    accessJWT,
    refreshJWT,
  });
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
console.log(setPin);   
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
