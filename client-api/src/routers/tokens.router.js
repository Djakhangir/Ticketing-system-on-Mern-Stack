//setup the router and import it to app.js;
const { json } = require('body-parser');
const express = require('express');
const { decode } = require('jsonwebtoken');
const router = express.Router()

const { verifyRefreshJWT, createAccessJWT } = require("../helpers/jwt.helper");
const { getUserByEmail } = require("../model/user/User.model");

//router has get, post, all methods;
// When router.all() it will always pass through this router and return refreshed token. 
router.get('/', async(req, res) => {
    const { authorization } = req.headers

    //make sure token is valid
    const decoded = await verifyRefreshJWT(authorization)

    if (decoded.email) {
        // check if the JWT exist in dtbase
        const userProf = await getUserByEmail(decoded.email);
        if (userProf._id) {
            // check if it is not expired
            let tokenExp = userProf.refreshJWT.addedAt;
            const dbRefreshToken = userProf.refreshJWT.token;

            tokenExp = tokenExp.setDate(tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY)

            const currentDate = new Date();

            if (dbRefreshToken !== authorization && tokenExp < currentDate) {
                return res.status(403).json({ message: "Forbidden, token expired" });
            }

            const accessJWT = await createAccessJWT(decoded.email, userProf._id.toString());
            //delete old token from redis database;


            return res.json({ status: "success", accessJWT })
        }
    }
    res.status(403).json({ message: "Forbidden" });
})

module.exports = router;