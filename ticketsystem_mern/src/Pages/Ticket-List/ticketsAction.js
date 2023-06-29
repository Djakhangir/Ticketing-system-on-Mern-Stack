import { fetchTicketLoading, fetchTicketSuccess, fetchTicketFail, searchTickets, fetchSingleTicketFail, fetchSingleTicketSuccess, fetchSingleTicketLoading } from "./ticketsSlice";
import { getAllTickets, getTicket } from "../../Api/ticketApi";

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

//Actions for single ticket only
export const fetchTicket = (_id) => async dispatch => {
    dispatch(fetchSingleTicketLoading());
    try {
        //fetch the data from api
        const result = await getTicket(_id);
        dispatch(fetchSingleTicketSuccess(result.data.result[0]))
    } catch (error) {
        dispatch(fetchSingleTicketFail(error.message))
    }
};