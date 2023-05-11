import { fetchTicketLoading, fetchTicketSuccess, fetchTicketFail, searchTickets } from "./ticketsSlice";
import axios from 'axios';

export const fetchAllTickets = () => async dispatch => {
    dispatch(fetchTicketLoading());
    //fetch the data from api
    try {
        const result = await axios.get('http://localhost:3001/v1/ticket', {
            headers: {
                Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkouYXRhaGFub3ZAeWFob28uY29tIiwiaWF0IjoxNjgzNzgxNTI2LCJleHAiOjE2ODM3ODI0MjZ9.5tqQdH3awY_LnBRnhGixHNP81SUO_G6Pgql2ZIwcsWg'
            }
        })
        console.log(result)
        dispatch(fetchTicketSuccess(result.data.result))
    } catch (error) {
        dispatch(fetchTicketFail(error.message))
    }
};

export const filterSearchTicket = str => dispatch => {
    dispatch(searchTickets(str));
}