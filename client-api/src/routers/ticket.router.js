//setup the router and import it to app.js;
const express = require('express');
const router = express.Router();
const { insertTicket } = require('../model/ticket/Ticket.model');
const { userAuthorization } = require("../middlewares/authorization.middleware");

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

router.post('/', userAuthorization, async(req, res) => {

    try {
        // Receive new ticket Data
        const { subject, sender, message } = req.body;
        const userId = req.userId;

        const ticketObj = {
            clientId: userId,
            subject,
            converstaions: [{
                sender,
                message
            }]
        }
        const result = await insertTicket(ticketObj);
        if (result.id) {
            return res.json({ status: 'success', message: 'New ticket has been created!' })
        }
        res.json({ status: 'error', message: "Unable to create a new ticket, please try again later" })
    } catch (error) {
        res.json({ status: 'error', message: error.message })
    }

})

//export the router;
module.exports = router