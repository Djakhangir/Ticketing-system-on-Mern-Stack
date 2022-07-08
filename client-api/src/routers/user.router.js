//setup the router and import it to app.js;
const express = require('express');
const router = express.Router()

//create new user
const { insertUser } = require('../model/user/User.model');

//password encryption
const { hashPassword } = require('../helpers/bycript.helper');

//router has get, post, all methods;
// When router.all() it will always opass through this router. next() is nessesary;
router.all('/', (req, res, next) => {
    // console.log(name)
    // res.json({ message: "return from user router" });
    next();
})
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

//export the router;
module.exports = router