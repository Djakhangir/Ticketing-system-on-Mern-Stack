//setup the router and import it to app.js;
const express = require('express');
const router = express.Router()

//create new user
const { insertUser, getUserByEmail, getUserById, updatePassword } = require('../model/user/User.model');

//password encryption
const { hashPassword, comparePassword } = require('../helpers/bycript.helper');
const { createAccessJWT, createRefreshJWT } = require('../helpers/jwt.helper');
const { userAuthorization } = require("../middlewares/authorization.middleware");
const { setPasswordResetPin, getPinByEmailPin, deletePinFromDB } = require("../model/resetPin/ResetPin.model");
const { emailProcessor } = require('../helpers/email.helper');
const { resetPasswordRequestValidation, updatePasswordValidation } = require('../middlewares/formValidation.middleware');

//router has get, post, all methods;
// When router.all() it will always opass through this router. next() is nessesary;
router.all('/', (req, res, next) => {
    // res.json({ message: "return from user router" });
    next();
})


//Get user profile router
router.get("/", userAuthorization, async(req, res) => {
    const _id = req.userId;
    const userProfile = await getUserById(_id)
        //this data is fetch const _id = req.usrId from database
        // const user = {
        //     "name": "Jake Atakhanov",
        //     "company": "AJBuilding",
        //     "address": "2 Mindy dr Moorestown NJ 08057",
        //     "phone": "6142661131",
        //     "email": "J.atahanov@yahoo.com",
        //     "password": "secret1123"
        // }
    res.json({ user: userProfile })
})

//create new user route
router.post('/', async(req, res, next) => {
    const { name, company, email, address, phone, password } = req.body;
    try {
        //hash password
        const hashPass = await hashPassword(password);
        const newUserObj = { name, company, email, address, phone, password: hashPass }
        const result = await insertUser(newUserObj);
        res.json({ message: "New User Created", result });

    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
    const result = insertUser(req.body);
})

// User sign in Routers
router.post('/login', async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ status: "error", message: "Invalid form" });
    }

    ///get user with email from db;
    const user = await getUserByEmail(email)

    /// get the password from db;
    const passwordFromDb = user && user._id ? user.password : null;
    if (!passwordFromDb)
        return res.json({ status: "error", message: "Invalid email or password" });

    ///hash our password and compare with the db;
    const result = await comparePassword(password, passwordFromDb)
    if (!result) {
        return res.json({ status: "error", message: "Invalid email or password" });
    }
    //import and use helper jwt function to generate token;
    const accessJWT = await createAccessJWT(user.email, `${user._id}`);
    const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

    res.json({ status: "successs", message: "Login successfull", accessJWT, refreshJWT });

})

router.post('/reset-password', resetPasswordRequestValidation, async(req, res) => {
    const { email } = req.body;
    const user = await getUserByEmail(email)

    //if not user create 6 digit number for the pin
    if (user && user._id) {
        //generate the random pin
        const setPin = await setPasswordResetPin(email);

        //generate and send email to the client with pin to reset password
        await emailProcessor({ email, pin: setPin.pin, type: 'request-new-pass' })

        return res.json({
            status: "success",
            message: "If the email exist in our database, the password reset pin will be sent shortly"
        })
    }

    res.json({
        status: "error",
        message: "If the email exist in our database, the password reset pin will be sent shortly"
    });
});

router.patch('/reset-password', updatePasswordValidation, async(req, res) => {
    const { email, pin, newPassword } = req.body;
    const getPin = await getPinByEmailPin(email, pin)

    if (getPin._id) {
        const dbDate = getPin.addedAt;
        const expiresIn = 1
        let expDate = dbDate.setDate(dbDate.getDate() + expiresIn)

        const today = new Date();
        if (today > expDate) {
            return res.json({ status: 'error', message: 'Invalid or expired pin' })
        }

        // encrypt password
        const hashedPassword = await hashPassword(newPassword)

        const user = await updatePassword(email, hashedPassword);

        if (user._id) {

            // Send email notification
            await emailProcessor({ email, type: 'password-update-success' })

            // Delete pin from db
            deletePinFromDB(email, pin)
            return res.json({ status: "success", message: "Password updated successfully" })
        }
    }
    res.json({ status: "error", message: "Unable to update password. Please try again later" });
});


//export the router;
module.exports = router