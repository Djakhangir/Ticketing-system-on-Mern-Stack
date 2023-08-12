import { configureStore } from "@reduxjs/toolkit";
import ticketsReducer from "./Pages/Ticket-List/ticketsSlice";
import loginReducer from './Components/Login/loginSlice';
import userReducer from "./Pages/Dashboard/userSlice";
import newTicketReducer from './Components/AddNewTicketForm/AddTicketSlice';
import registrationReducer from "./Components/RegistrationForm/RegistrationUserSlice";
import passwordReducer from "./Components/Password_Reset/PasswordSlice";


const store = configureStore({
    reducer: {
        tickets: ticketsReducer,
        login: loginReducer,
        user: userReducer,
        openTicket: newTicketReducer,
        userRegistration: registrationReducer,
        password:passwordReducer 
    },
});

export default store;