import React, { useState } from "react";
import "./entry.page.css";
import LoginForm from "../../Components/Login/login.component";
import PasswordReset from "../../Components/Password_Reset/PasswordReset.component";

const Entry = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showresetform, setshowresetform] = useState(false);

  const handleonChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "email":
        setemail(value);
        break;

      case "password":
        setpassword(value);
        break;
      default:
        break;
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return alert("You missed one of the required fileds");
    }

    //TODO
    // call Api to submit
    console.log(email, password);
  };

  const handleOnResetSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please fill an Email");
    }

    //TODO
    // call Api to submit
    console.log(email);
  };

  const loginFormSwitcher = (formType) => {
    setshowresetform(formType);
  };

  return (
    <div className="entry-page bg-info">
      <div className="jumbotron m-3">
        {!showresetform ? (
          <LoginForm
            email={email}
            handleonChange={handleonChange}
            handleOnSubmit={handleOnSubmit}
            loginFormSwitcher={loginFormSwitcher}
            password={password}
          />
        ) : (
          <PasswordReset
            email={email}
            handleonChange={handleonChange}
            handleOnResetSubmit={handleOnResetSubmit}
            loginFormSwitcher={loginFormSwitcher}
          />
        )}
      </div>
    </div>
  );
};

export default Entry;
