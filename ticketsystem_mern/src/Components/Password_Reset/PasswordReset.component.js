import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { sendPasswordResetOtp } from "./PasswordAction";

// ###TODO: error message and alerts does not work properly since there is some bug to be found

const PasswordReset = () => {
  const dispatch = useDispatch();
  const { isLoading, status, message } = useSelector((state) => state.password);
  const [email, setEmail] = useState("");

  const handleOnResetSubmit = (e) => {
    e.preventDefault();

    dispatch(sendPasswordResetOtp(email));
  };

  const handleonChange = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  return (
    <Container className="forgot-password-container">
      <Row className="justify-content-center align-items-center">
        <Col > 
        {/* xs={10} sm={8} md={6} lg={4} */}
          <h1 className="text-light text-center"> Forgot your password? </h1> 
          <p className="text-warning">
              Don't worry, we've got you covered. Enter your email to reset your password.
            </p><hr />
          {message && (
            <Alert variant={status === "success" ? "success" : "danger"}>
              {message}
            </Alert>
          )}
          {isLoading && (
            <Spinner variant="primary" animation="border"></Spinner>
          )}
          <Form autoComplete="off" onSubmit={handleOnResetSubmit}>
            <Form.Group controlId="email">
              <Form.Control
                onChange={handleonChange}
                type="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                required
              ></Form.Control>
            </Form.Group>
            <br />
            <Button variant="primary" type="submit" className="btn-block"> Reset Password </Button>
          </Form>
          <hr />
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordReset;
