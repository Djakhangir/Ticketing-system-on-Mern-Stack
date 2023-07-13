import { configureStore } from "@reduxjs/toolkit";
import ticketsReducer from "./Pages/Ticket-List/ticketsSlice";
import loginReducer from './Components/Login/loginSlice';
import userReducer from "./Pages/Dashboard/userSlice";
import newTicketReducer from './Components/AddNewTicketForm/AddTicketSlice';


const store = configureStore({
    reducer: {
        tickets: ticketsReducer,
        login: loginReducer,
        user: userReducer,
        openTicket: newTicketReducer,
    },
});

export default store;