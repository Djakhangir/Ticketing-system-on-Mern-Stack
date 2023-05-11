import { fetchTicketLoading, fetchTicketSuccess, fetchTicketFail, searchTickets } from "./ticketsSlice";
import { getAllTickets } from "../../Api/ticketApi";

export const fetchAllTickets = () => async dispatch => {
    dispatch(fetchTicketLoading());

    try {
        //fetch the data from api
        const result = await getAllTickets();

        dispatch(fetchTicketSuccess(result.data.result))
    } catch (error) {
        dispatch(fetchTicketFail(error.message))
    }
};

export const filterSearchTicket = str => dispatch => {
    dispatch(searchTickets(str));
}