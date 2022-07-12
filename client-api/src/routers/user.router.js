//setup the router and import it to app.js;
const express = require('express');
const router = express.Router()

//create new user
const { insertUser, getUserByEmail } = require('../model/user/User.model');

//password encryption
const { hashPassword, comparePassword } = require('../helpers/bycript.helper');
const { createAccessJWT, createRefreshJWT } = require('../helpers/jwt.helper')
const { json } = require('body-parser');

//router has get, post, all methods;
// When router.all() it will always opass through this router. next() is nessesary;
router.all('/', (req, res, next) => {
    // res.json({ message: "return from user router" });
    next();
})

//create new user route
router.post('/', async(req, res, next) => {
    const { name, company, email, address, phone, password } = req.body;
    try {
        //hash password
        const hashPass = await hashPassword(password);
        const newUserObj = { name, company, email, address, phone, password: hashPass }
        const result = await insertUser(newUserObj);
        console.log(result);
        res.json({ message: "New User Created", result });

    } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
    }
    const result = await insertUser(req.body);
    console.log(result);

})

// User sign in Routers
router.post('/login', async(req, res) => {
    console.log(req.body);
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
    console.log(result);
    if (!result) {
        return res.json({ status: "error", message: "Invalid email or password" });
    }
    //import and use helper jwt function to generate token;
    const accessJWT = await createAccessJWT(user.email, `${user._id}`);
    const refreshJWT = await createRefreshJWT(user.email);
    res.json({ status: "success", message: "Login successfull", accessJWT, refreshJWT });

})

//export the router;
module.exports = router