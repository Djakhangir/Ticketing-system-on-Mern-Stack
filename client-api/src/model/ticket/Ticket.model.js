const { TicketSchema } = require('./Ticket.schema')

const insertTicket = ticketObj => {

    return new Promise((resolve, reject) => {
        try {
            TicketSchema(ticketObj).save().then(data =>
                resolve(data)
            ).catch(err => reject(err))
        } catch (error) {
            reject(error);
        }
    })


}

module.exports = {
    insertTicket,
}