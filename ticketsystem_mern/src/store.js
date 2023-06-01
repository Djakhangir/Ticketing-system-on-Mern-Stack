import { configureStore } from "@reduxjs/toolkit";
import ticketsReducer from "./Pages/Ticket-List/ticketsSlice";
import loginReducer from './Components/Login/loginSlice';
import userReducer from "./Pages/Dashboard/userSlice";

const store = configureStore({
    reducer: {
        tickets: ticketsReducer,
        login: loginReducer,
        user: userReducer
    },
});

export default store;