import {
  fetchTicketLoading,
  fetchTicketSuccess,
  fetchTicketFail,
  searchTickets,
  fetchSingleTicketFail,
  fetchSingleTicketSuccess,
  fetchSingleTicketLoading,
  replyTicketLoading,
  replyTicketSuccess,
  replyTicketFail,
  closeTicketLoading,
  closeTicketSuccess,
  closeTicketFail,
} from "./ticketsSlice";
import {
  getAllTickets,
  getTicket,
  updateReplyTicket,
  updateTicketStatustoClose,
} from "../../Api/ticketApi";

export const fetchAllTickets = () => async (dispatch) => {
  dispatch(fetchTicketLoading());

  try {
    //fetch the data from api
    const result = await getAllTickets();
    result.data.result.length && dispatch(fetchTicketSuccess(result.data.result));
  } catch (error) {
    dispatch(fetchTicketFail(error.message));
  }
};

export const filterSearchTicket = (str) => (dispatch) => {
  dispatch(searchTickets(str));
};

//Actions for single ticket only
export const fetchTicket = (_id) => async (dispatch) => {
  dispatch(fetchSingleTicketLoading());
  try {
    //fetch the data from api
    const result = await getTicket(_id);
    dispatch(
      fetchSingleTicketSuccess(
        result.data.result.length && result.data.result[0]
      )
    );
  } catch (error) {
    dispatch(fetchSingleTicketFail(error.message));
  }
};

//Actions to reply on single ticket
export const replyOnTicket = (_id, msgObj) => async (dispatch) => {
  dispatch(replyTicketLoading());
  try {
    const result = await updateReplyTicket(_id, msgObj);
    console.log(result);
    if (result.status === "error") {
      return dispatch(replyTicketFail(result.message));
    }
    dispatch(fetchTicket(_id));
    dispatch(replyTicketSuccess(result.message));
  } catch (error) {
    dispatch(replyTicketFail(error.message));
  }
};

//Actions to close a ticket
export const closeTicket = (_id) => async (dispatch) => {
  dispatch(closeTicketLoading());
  try {
    const result = await updateTicketStatustoClose(_id);
    console.log(result);
    if (result.status === "error") {
      return dispatch(closeTicketFail(result.message));
    }
    dispatch(fetchTicket(_id));
    dispatch(closeTicketSuccess(result.message));
  } catch (error) {
    dispatch(closeTicketFail(error.message));
  }
};
