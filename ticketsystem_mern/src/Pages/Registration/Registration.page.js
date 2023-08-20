import React from "react";
import "./Registration.style.css";
import RegistrationForm from "../../Components/RegistrationForm/RegistrationForm.component";

export const Registration = () => {
    
  return (
    <div className="registration-page">

      <div className="jumbotron registration-box">
        <RegistrationForm/>
      </div>
    </div>
  );
};
