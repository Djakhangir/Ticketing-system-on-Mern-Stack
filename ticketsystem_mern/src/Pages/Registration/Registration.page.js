import React from "react";
import "./Registration.style.css";
import RegistrationForm from "../../Components/RegistrationForm/RegistrationForm.component";

export const Registration = () => {
    
  return (
    <div className="registration-page bg-info">

      <div className="jumbotron m-3">
        <RegistrationForm/>
      </div>
    </div>
  );
};
