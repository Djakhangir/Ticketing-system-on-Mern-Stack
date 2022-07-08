//setup the router and import it to app.js;
const express = require('express');
const router = express.Router()

//router has get, post, all methods;
router.all('/', (req, res, next) => {
    res.json({ message: "return from ticket router" });
})

//export the router;
module.exports = router