//setup the router and import it to app.js;
const express = require('express');
const router = express.Router()
const { insertTicket } = require('../model/ticket/Ticket.model');
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

router.post('/', async(req, res) => {

    try {
        // Receive new ticket Data
        const { subject, sender, message } = req.body;
        const ticketObj = {
            clientId: '62d78d69f3b7619920e2f082',
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