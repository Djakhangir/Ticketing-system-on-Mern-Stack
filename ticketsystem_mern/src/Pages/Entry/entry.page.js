import React, { useState } from "react";
import "./entry.page.css";
import LoginForm from "../../Components/Login/login.component";
import PasswordReset from "../../Components/Password_Reset/PasswordReset.component";

const Entry = () => {
  const [showresetform, setshowresetform] = useState(false);

  const handleOnResetSubmit = (e) => {
    e.preventDefault();
  };

  const loginFormSwitcher = (formType) => {
    setshowresetform(formType);
  };

  return (
    <div className="entry-page bg-info">
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
