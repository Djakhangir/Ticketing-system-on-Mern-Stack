import React from "react";
import { useSelector } from "react-redux";
import "./PasswordOtpForm.page.css";
import PasswordReset from "../../Components/Password_Reset/PasswordReset.component";
import UpdatePasswordForm from "../../Components/Password_Reset/UpdatePasswordForm.comp";

//WorkFlow

//Create password reset page
// Add Request OTp form
//Add redux store with redux - toolkit to handle the network status
//sest otp to email from api (api exists)
//Load form to input OTp and new password
// New password must match confirm password for validation
//Connct to API endpoint
//Add reducer through Redux-toolkit to handle the network staus and pride
//Send email otp and new password to update the password

const PasswordOtpForm = () => {
  const { displayPassResetForm } = useSelector((state) => state.password);

  return (
    <div className="password-reset">
      <div className="jumbotron m-3">
        {displayPassResetForm ? <UpdatePasswordForm /> : <PasswordReset />}
        <div className="text-center">
        <a className="loginBtn" href="/"> Login Now </a>
        </div>
      </div>
          
    </div>
  );
};

export default PasswordOtpForm;
