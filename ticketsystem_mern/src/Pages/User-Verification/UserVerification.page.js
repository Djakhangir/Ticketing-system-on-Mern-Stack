import React, { useEffect, useState } from "react";
import "./UserVerification.css";
import { Spinner, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { userVerification } from "../../Api/userApi";

const initialResponse = {
  status: "",
  message: "",
};

export const UserVerification = () => {
  const { _id, email } = useParams();
  const [response, setResponse] = useState(initialResponse);

  const data = { _id, email };

  useEffect(() => {
    const apiCall = async () => {
      const result = await userVerification(data);
      setResponse(result);
    };
    !response.status && apiCall();
  }, []);
  // call the Api and send the _id to verify user
  return (
    <div className="userVerification-page bg-info">
      <div className="jumbotron box">
        {!response.status && <Spinner variant="info" animation="border" />}
        {response.status && (
          <Alert variant={response.status === "success" ? "success" : "danger"}>
            {response.message}
          </Alert>
        )}

{/* {error && <Alert variant="danger">{error}</Alert>}
        {successMsg && <Alert variant="primary">{successMsg}</Alert>} */}
      </div>
    </div>
  );
};
