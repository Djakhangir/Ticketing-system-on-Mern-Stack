import axios from "axios";
import { rootUrl } from "./http";

const otpRequestUrl = rootUrl + "user/reset-password";
const updatePassUrl = rootUrl + "user/reset-password";

export const requestPasswordOtp = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await axios.post(otpRequestUrl, { email });

      console.log(data)
        resolve(data)
      
    } catch (error) {
      reject(error);
    }
  });
};

export const updateUserPassword = (passwordObj) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await axios.patch(updatePassUrl, passwordObj );

      console.log(data)
        resolve(data)
      
    } catch (error) {
      reject(error);
    }
  });
};
