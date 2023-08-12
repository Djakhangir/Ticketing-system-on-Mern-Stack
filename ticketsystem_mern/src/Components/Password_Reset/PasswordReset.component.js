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
    const { name, value } = e.target;
    setEmail(value);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-light text-center"> Reset Password </h1> <hr />
          {message && (
            <Alert variant={status === "success" ? "success" : "danger"}>
              {message}
            </Alert>
          )}
          {isLoading && (
            <Spinner variant="primary" animation="border"></Spinner>
          )}
          <Form autoComplete="off" onSubmit={handleOnResetSubmit}>
            <Form.Group>
              <Form.Control
                onChange={handleonChange}
                type="email"
                name="email"
                value={email}
                placeholder="Enter Email"
                required
              ></Form.Control>
            </Form.Group>
            <br />
            <Button type="submit"> Reset Password </Button>
          </Form>
          <hr />
        </Col>
      </Row>
      <Row>
        <Col>
          <a href="/"> Login Now </a>
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordReset;
