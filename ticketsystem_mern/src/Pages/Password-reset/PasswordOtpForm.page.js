import React, { useState } from "react";
import "./PasswordOtpForm.page.css";
import PasswordReset from "../../Components/Password_Reset/PasswordReset.component";

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

export const PasswordOtpForm = () => {

  const loginFormSwitcher = (formType) => {
    // setshowresetform(formType);
  };

  return (
    <div className="password-reset bg-info">
      <div className="jumbotron m-3">
        <PasswordReset />
      </div>
    </div>
  );
};
