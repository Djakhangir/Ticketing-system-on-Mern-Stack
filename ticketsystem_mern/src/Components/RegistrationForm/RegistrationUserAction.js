import { userRegistration } from "../../Api/userApi";
import {
  registrationError,
  registrationPending,
  registrationSuccess,
} from "./RegistrationUserSlice";

export const registrationUserAction = (formData) => async (dispatch) => {
  try {
    //api call
    dispatch(registrationPending());
    const result = await userRegistration(formData);

    let message = "";
    if (result.message.includes("duplicate key error collection")) {
      message = "What??? This email already has an account!";
    } else {
       message = result.message;
    };

    if(result.status === "success") {
      dispatch(registrationSuccess(message))
    } else { 
      dispatch(registrationError(message));
    }
    //TODO: fix the error message in backend for new user has already an account
    console.log(result);
  } catch (error) {
    dispatch(registrationError(error.message));
  }
};
