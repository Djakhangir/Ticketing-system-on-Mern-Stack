import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  status: "",
  message: "",
  displayPassResetForm: false
};

const passwordReset = createSlice({
  name: "passwordReset",
  initialState,
  reducers: {
    otpReqPending: (state) => {
      state.isLoading = true;
    },
    otpReqSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.status = "success";
      state.message = payload.message;
      state.displayPassResetForm = true;
    },
    otpReqFail: (state, { payload }) => {
      state.isLoading = false;
      state.status = "error";
      state.message = payload;
    },
    updatePasswordSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.status = "success";
      state.message = payload.message;
    },
  },
});

const { reducer, actions } = passwordReset;

export const { otpReqPending, otpReqSuccess, otpReqFail, updatePasswordSuccess } = actions;
export default reducer;
