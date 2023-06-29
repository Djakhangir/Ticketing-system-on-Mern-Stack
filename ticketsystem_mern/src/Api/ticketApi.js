import axios from "axios";

const rootUrl = 'http://localhost:3001/v1/'
const getAllTicketsUrl = rootUrl + 'ticket'
const getSingleTicketUrl = rootUrl + 'ticket/'

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
            const result = await axios.get(getSingleTicketUrl + _id, {
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