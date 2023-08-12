import { otpReqPending, otpReqSuccess, otpReqFail } from "./PasswordSlice";
import { requestPasswordOtp } from "../../Api/passwordApi";

export const sendPasswordResetOtp = (email) => async dispatch => {
  try {
    dispatch(otpReqPending());
    const { status, message } = await requestPasswordOtp(email);

    if (status === "success") {
      return dispatch(otpReqSuccess({ message, email }));
    } 
      dispatch(otpReqFail(message));

  } catch (error) {
    dispatch(otpReqFail(error.message));
  }
};
