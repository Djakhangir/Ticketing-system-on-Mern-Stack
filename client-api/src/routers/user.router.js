//setup the router and import it to app.js;
const express = require('express');
const router = express.Router()

//create new user
const { insertUser, getUserByEmail, getUserById } = require('../model/user/User.model');

//password encryption
const { hashPassword, comparePassword } = require('../helpers/bycript.helper');
const { createAccessJWT, createRefreshJWT } = require('../helpers/jwt.helper');
const { userAuthorization } = require("../middlewares/authorization.middleware");
const { setPasswordResetPin } = require("../model/resetPin/ResetPin.model");

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

router.post('/reset-password', async(req, res) => {
    const { email } = req.body;
    const user = await getUserByEmail(email)

    //if not user create 6 digit number for the pin
    if (user && user._id) {
        const setPin = await setPasswordResetPin(email);

        return res.json(setPin);
    }

    res.json({
        status: "error",
        message: "If the email exist in our databse, the password reset pin will be sent shortly"
    });
});

//export the router;
module.exports = router