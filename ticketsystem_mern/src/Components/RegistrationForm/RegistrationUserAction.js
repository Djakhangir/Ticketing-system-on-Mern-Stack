import { userRegistration } from "../../Api/userApi";
import {
  registrationFailed,
  registrationPending,
  registrationSuccess,
} from "./RegistrationUserSlice";

export const registrationUserAction = (formData) => async (dispatch) => {
  try {
    //api call
    dispatch(registrationPending());
    const result = await userRegistration(formData);
    result.status === "success"
      ? dispatch(registrationSuccess(result.message))
      : dispatch(registrationFailed(result.message));
//TODO: fix the error message in backend for new user has already ana ccount
    console.log(result);
    //feedback
    //updates redux store
  } catch (error) {
    dispatch(registrationFailed(error.message));
  }
};
