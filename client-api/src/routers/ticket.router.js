//setup the router and import it to app.js;
const express = require('express');
const router = express.Router()

// TODO: Workflow
// - Create url endpoints
// - Receive new ticket Data
// - Authorize every request with JWT
// - Insert in mongodb
// - Retrive all the ticket for the specific user
// - Retrive a ticket from mongodb
// - Update message conversation in the ticket database
// - Update ticjet status // Closer, operator responsive pending, client response pending
// - Delete ticket form mongodb

//router has get, post, all methods;
router.all('/', (req, res, next) => {
    // res.json({ message: "return from ticket router" });
    next();
})

router.post('/', (req, res) => {
    // Receive new ticket Data
    const { subject, sender, message } = req.body;

    console.log(req.body)
        // Insert in mongodb
    res.json({ message: "TODO: create new ticket" })
})

//export the router;
module.exports = router