import axios from "axios";
import { rootUrl, authHeader } from "./http";

const ticketUrl = rootUrl + "ticket/";

export const getAllTickets = () => axios.get(ticketUrl, authHeader());

export const getTicket = (_id) => axios.get(ticketUrl + _id, authHeader());

export const createNewTicket = async (formData) => {
  const result = await axios.post(ticketUrl, formData, authHeader());
  return result.data;
};

export const updateReplyTicket = async (_id, msgObj) => {
  const result = await axios.put(ticketUrl + _id, msgObj, authHeader());
  return result.data;
};

export const closeTicket = async (_id) => {
  const result = await axios.patch(
    ticketUrl + "close-ticket/" + _id,
    {},
    authHeader()
  );
  return result.data;
};

// ---- Staff actions ----
export const assignTicket = async (_id, assignedTo) => {
  const result = await axios.patch(
    ticketUrl + "assign/" + _id,
    { assignedTo },
    authHeader()
  );
  return result.data;
};

export const setTicketStatus = async (_id, status) => {
  const result = await axios.patch(
    ticketUrl + "status/" + _id,
    { status },
    authHeader()
  );
  return result.data;
};

export const addPart = async (_id, part) => {
  const result = await axios.post(ticketUrl + "parts/" + _id, part, authHeader());
  return result.data;
};

export const updatePartStatus = async (_id, partId, status) => {
  const result = await axios.patch(
    `${ticketUrl}parts/${_id}/${partId}`,
    { status },
    authHeader()
  );
  return result.data;
};

export const scheduleAppointment = async (_id, appointment) => {
  const result = await axios.post(
    ticketUrl + "appointment/" + _id,
    appointment,
    authHeader()
  );
  return result.data;
};

export const getStaffDirectory = async (role = "superintendent") => {
  const result = await axios.get(
    `${rootUrl}user/staff?role=${role}`,
    authHeader()
  );
  return result.data;
};
