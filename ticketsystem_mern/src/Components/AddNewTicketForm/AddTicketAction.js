import { createNewTicket } from "../../Api/ticketApi";
import {
  openNewTicketPending,
  openNewTicketSuccess,
  openNewTicketFail,
} from "./AddTicketSlice";

export const openNewTicket = (formData) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(openNewTicketPending());
      const result = await createNewTicket(formData);
      if (result.status === "error") {
        return dispatch(openNewTicketFail(result.message));
      }

      dispatch(openNewTicketSuccess(result.message));
    } catch (error) {
      console.log(error);
      dispatch(openNewTicketFail(error.message));
    }
  });
};
