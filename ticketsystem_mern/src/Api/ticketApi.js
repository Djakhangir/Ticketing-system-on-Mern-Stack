import axios from "axios";

const rootUrl = 'http://localhost:3001/v1/'
const getAllTicketsUrl = rootUrl + 'ticket'
const ticketUrl = rootUrl + 'ticket/'
const closeTicketUrl = rootUrl + "ticket/close-ticket/"

export const getAllTickets = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await axios.get(getAllTicketsUrl, {
                headers: {
                    Authorization: sessionStorage.getItem('accessJWT')
                }
            });
            resolve(result);
        } catch (error) {
            reject(error)
        }
    })
}

export const getTicket = (_id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await axios.get(ticketUrl + _id, {
                headers: {
                    Authorization: sessionStorage.getItem('accessJWT')
                }
            });
            resolve(result);
        } catch (error) {
            console.log(error.message)
            reject(error)
        }
    })
}

export const updateReplyTicket = (_id, msgObj) => {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await axios.put(ticketUrl + _id, msgObj, {
                headers: {
                    Authorization: sessionStorage.getItem('accessJWT')
                },
            });

            resolve(result.data);
        } catch (error) {
            console.log(error.message)
            reject(error)
        }
    })
}

export const updateTicketStatustoClose = (_id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await axios.patch(closeTicketUrl + _id, {}, {
                headers: {
                    Authorization: sessionStorage.getItem('accessJWT')
                },
            });

            resolve(result.data);
        } catch (error) {
            console.log(error.message)
            reject(error)
        }
    })
}

export const createNewTicket = (formData) => {
    console.log("from Api", formData)
    return new Promise(async(resolve, reject) => {
        try {
            const result = await axios.post(ticketUrl, formData, {
                headers: {
                    Authorization: sessionStorage.getItem('accessJWT')
                },
            });
console.log(result.data)
            resolve(result.data);
        } catch (error) {
            console.log(error.message)
            reject(error)
        }
    })
}

