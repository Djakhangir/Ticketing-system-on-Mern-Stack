import { fetchTicketLoading, fetchTicketSuccess, fetchTicketFail } from "./ticketsSlice";
import axios from 'axios';

export const fetchAllTickets = () => async dispatch => {
    dispatch(fetchTicketLoading());
    //fetch the data from api
    try {
        const result = await axios.get('http://localhost:3001/v1/ticket', {
            headers: {
                Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkouYXRhaGFub3ZAeWFob28uY29tIiwiaWF0IjoxNjgzNjkwNjMzLCJleHAiOjE2ODM2OTE1MzN9.MNS0USQG-rAfwaqF1IHnsCfLtM-v0Obs_XbGDhgsN18'
            }
        })
        console.log(result)
        dispatch(fetchTicketSuccess(result.data.result))
    } catch (error) {
        dispatch(fetchTicketFail(error.message))
    }
}