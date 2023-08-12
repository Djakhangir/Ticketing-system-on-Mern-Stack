import axios from "axios";

const rootUrl = "http://localhost:3001/v1/";
const otpRequestUrl = rootUrl + "user/reset-password";

export const requestPasswordOtp = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await axios.post(otpRequestUrl, { email });

      console.log(data)
        resolve(data)
      
    } catch (error) {
      reject(error);
    }
  });
};
