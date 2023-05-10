import { configureStore } from "@reduxjs/toolkit";
import ticketsReducer from "./Pages/Ticket-List/ticketsSlice";

const store = configureStore({
    reducer: { tickets: ticketsReducer },
});

export default store;