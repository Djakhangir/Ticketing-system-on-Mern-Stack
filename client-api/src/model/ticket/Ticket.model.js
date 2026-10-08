const { TicketSchema } = require("./Ticket.schema");

const insertTicket = (ticketObj) => TicketSchema(ticketObj).save();

// Tenant view: only their own tickets.
const getTickets = (clientId) =>
  TicketSchema.find({ clientId }).sort({ openAt: -1 });

// Staff view: every ticket in a building (management/landlord may pass no
// building to see all).
const getTicketsForStaff = (building) => {
  const query = building ? { building } : {};
  return TicketSchema.find(query).sort({ openAt: -1 });
};

// Tenant fetch is scoped by clientId; staff fetch by _id only.
const getTicketById = (_id, clientId) => {
  const query = clientId ? { _id, clientId } : { _id };
  return TicketSchema.findOne(query);
};

const addReply = ({ _id, message, sender, senderId, senderRole, status }) =>
  TicketSchema.findOneAndUpdate(
    { _id },
    {
      ...(status ? { status } : {}),
      $push: { conversations: { message, sender, senderId, senderRole } },
    },
    { new: true }
  );

const updateTicketStatus = ({ _id, status }) =>
  TicketSchema.findOneAndUpdate({ _id }, { status }, { new: true });

const assignTicket = ({ _id, assignedTo, assignedName }) =>
  TicketSchema.findOneAndUpdate(
    { _id },
    { assignedTo, assignedName, status: "In progress" },
    { new: true }
  );

const addPart = ({ _id, part }) =>
  TicketSchema.findOneAndUpdate(
    { _id },
    { $push: { parts: part }, status: "Awaiting parts" },
    { new: true }
  );

const updatePartStatus = ({ _id, partId, status }) =>
  TicketSchema.findOneAndUpdate(
    { _id, "parts._id": partId },
    { $set: { "parts.$.status": status } },
    { new: true }
  );

const setAppointment = ({ _id, appointment }) =>
  TicketSchema.findOneAndUpdate(
    { _id },
    { appointment, status: "Appointment scheduled" },
    { new: true }
  );

const deleteTicket = ({ _id, clientId }) => {
  const query = clientId ? { _id, clientId } : { _id };
  return TicketSchema.findOneAndDelete(query);
};

module.exports = {
  insertTicket,
  getTickets,
  getTicketsForStaff,
  getTicketById,
  addReply,
  updateTicketStatus,
  assignTicket,
  addPart,
  updatePartStatus,
  setAppointment,
  deleteTicket,
};
