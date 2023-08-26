//setup the router and import it to app.js;
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { insertTicket, getTickets, getTicketById, updateClientReply, updateTicketStatus, deleteTicket } = require('../model/ticket/Ticket.model');
const { userAuthorization } = require("../middlewares/authorization.middleware");
const { createNewTicketValidation, replyMessageValidation } = require("../middlewares/formValidation.middleware");

//image upload 

// // Set up storage with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// // Add the image upload route
router.post('/upload', upload.single('media'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  const imageUrl = 'uploads/' + req.file.filename;
  res.status(200).send(imageUrl);
});

//router has get, post, all methods;
router.all('/', (req, res, next) => {
    // res.json({ message: "return from ticket router" });
    next();
})
debugger;
// create new ticket and
// - Authorize every request with JWT
router.post('/', createNewTicketValidation, userAuthorization, async(req, res) => {

    try {
        // Receive new ticket Data
        const { subject, sender, message } = req.body;
        const userId = req.userId;
        debugger;
        console.log(req.body)
// Get the media data from req.file
const mediaData = req.file;
debugger;
        const ticketObj = {
            clientId: userId,
            subject,
            conversations: [{
                sender,
                message
            }],
            media:
            {
                name: mediaData.filename, // Use the name of the uploaded file
                size: mediaData.size,
                type: mediaData.mimetype,
            }
            
        }
        console.log(ticketObj)
        debugger;
        const result = await insertTicket(ticketObj);
        console.log(result)
        debugger;
        if (result.id) {
            return res.json({ status: 'success', message: 'New ticket has been created!' })
        }
        res.json({ status: 'error', message: "Unable to create a new ticket, please try again later" })
    } catch (error) {
        res.json({ status: 'error', message: error.message })
    }
    
})

// - Retrive all the ticket for the specific user
router.get('/', userAuthorization, async(req, res) => {

    try {
        const userId = req.userId;
        const result = await getTickets(userId);

        return res.json({ status: 'success', result })

    } catch (error) {
        res.json({ status: 'error', message: error.message })
    }

})

// - Retrive a ticket from mongodb
router.get('/:_id', userAuthorization, async(req, res) => {

    try {
        const { _id } = req.params;
        const clientId = req.userId;
        const result = await getTicketById(_id, clientId);

        return res.json({ status: 'success', result })

    } catch (error) {
        res.json({ status: 'error', message: error.message })
    }

})

// - Update (reply) message conversation in the ticket database )
//TODO: send the clientId as well for security reason to avoid ticket manipulation/hacking, 
//so that prevents from that loophole, to avoid that somebody can send somebody's ticket to another, reply etc.
router.put('/:_id', replyMessageValidation, userAuthorization, async(req, res) => {

    try {
        const { message, sender } = req.body;
        const { _id } = req.params;
        const clientId = req.userId;
        const result = await updateClientReply({ _id, message, sender });

        if (result._id) {
            return res.json({ status: 'success', message: 'Your message updated' })
        }
        res.json({ status: 'error', message: 'Unable to update your message. Please try again later' })

    } catch (error) {
        res.json({ status: 'error', message: error.message })
    }

})

// - Update ticket status // Close, operator responsive pending, client response pending
router.patch('/close-ticket/:_id', userAuthorization, async(req, res) => {

    try {
        const { _id } = req.params;
        const clientId = req.userId;
        const result = await updateTicketStatus({ _id, clientId });

        if (result._id) {
            return res.json({ status: 'success', message: 'This ticket has been closed.' })
        }
        res.json({ status: 'error', message: 'Unable to close the ticket.' })

    } catch (error) {
        res.json({ status: 'error', message: error.message })
    }

})

// - Delete ticket form mongodb
// no need to have this in life crm, but added just in case;
router.delete('/:_id', userAuthorization, async(req, res) => {

    try {
        const { _id } = req.params;
        const clientId = req.userId;
        const result = await deleteTicket({ _id, clientId });

        return res.json({ status: 'success', message: 'This ticket has been deleted.' })

    } catch (error) {
        res.json({ status: 'error', message: error.message })
    }

})

//export the router;
module.exports = router

