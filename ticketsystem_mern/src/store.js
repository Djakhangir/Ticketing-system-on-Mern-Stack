import { configureStore } from "@reduxjs/toolkit";
import loginReducer from './Components/Login/loginSlice';
import userReducer from "./Pages/Dashboard/userSlice";
import passwordReducer from "./Components/Password_Reset/PasswordSlice";


const store = configureStore({
    reducer: {
        login: loginReducer,
        user: userReducer,
        password: passwordReducer,
    },
});

export default store;