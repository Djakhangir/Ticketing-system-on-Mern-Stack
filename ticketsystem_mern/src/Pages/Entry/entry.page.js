import React, { useState } from "react";
import "./entry.page.css";
import LoginForm from "../../Components/Login/login.component";
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

const Entry = () => {
  const [showresetform, setshowresetform] = useState(false);

  const handleOnResetSubmit = (e) => {
    e.preventDefault();
  };

  const loginFormSwitcher = (formType) => {
    setshowresetform(formType);
  };

  return (
    <div className="entry-page bg-info loginPage">
      <div className="jumbotron m-3">
        {!showresetform ? (
          <LoginForm loginFormSwitcher={loginFormSwitcher} />
        ) : (
          <PasswordReset
            handleOnResetSubmit={handleOnResetSubmit}
            loginFormSwitcher={loginFormSwitcher}
          />
        )}
      </div>
    </div>
  );
};

export default Entry;
