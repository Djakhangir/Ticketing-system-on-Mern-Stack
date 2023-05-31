import { configureStore } from "@reduxjs/toolkit";
import ticketsReducer from "./Pages/Ticket-List/ticketsSlice";
import loginReducer from './Components/Login/loginSlice';

const store = configureStore({
    reducer: {
        tickets: ticketsReducer,
        login: loginReducer
    },
});

export default store;