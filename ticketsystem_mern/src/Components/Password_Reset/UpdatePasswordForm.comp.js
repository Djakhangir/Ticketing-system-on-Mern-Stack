import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  Container,
  Row,
  Button,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import { updatePassword } from "./PasswordAction";

const initialState = {
  pin: "",
  password: "12345678As@",
  confirmPassword: "12345678As@",
};

const passwordVerification = {
  isLengthy: false,
  hasUpper: false,
  hasLower: false,
  hasNumber: false,
  hasSpclChar: false,
  confirmPassword: false,
};

const UpdatePasswordForm = () => {
  const dispatch = useDispatch();
  const { isLoading, status, message, displayPassResetForm } = useSelector(
    (state) => state.password
  );
  //initial states
  const [newPassword, setNewPassword] = useState(initialState);
  const [passwordError, setPasswordError] = useState(passwordVerification);

  //changes on input field
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setNewPassword({ ...newPassword, [name]: value });

    //password check on requirements
    if (name === "password") {
      const isLengthy = value.length > 8;
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpclChar = /[!@#$%&*_-]/.test(value);
      setPasswordError({
        ...passwordError,
        isLengthy,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpclChar,
      });
    }

    //check if password an dconfirma password field matche
    if (name === "confirmPassword") {
      setPasswordError({
        ...passwordError,
        confirmPassword: newPassword.password === value,
      });
    }
  };

  //submit the form
  const handleOnSubmit = (e) => {
    //prevents on reloading everytime we click the button;
    e.preventDefault();
    const { pin, password } = newPassword;
    const newPasswordObj = {
      pin,
      password,
      // email,
    };
    console.log(pin, password);
    dispatch(updatePassword(newPasswordObj));
  };

  return (
    <div className="registerForm">
      <Container>
        <Row>
          <Col>
            <h1 className="text-light text-center">Update Password</h1>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            {message && (
              <Alert variant={status === "success" ? "success" : "danger"}>
                {message}
              </Alert>
            )}
            {isLoading && (
              <Spinner variant="primary" animation="border"></Spinner>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <Form onSubmit={handleOnSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>OTP</Form.Label>
                <Form.Control
                  type="number"
                  name="pin"
                  value={newPassword.pin}
                  onChange={handleOnChange}
                  placeholder="OTP"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={newPassword.password}
                  onChange={handleOnChange}
                  placeholder="Password"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={newPassword.confirmPassword}
                  onChange={handleOnChange}
                  placeholder="Confirm Password"
                />
              </Form.Group>
              <Form.Text>
                {!passwordError.confirmPassword && (
                  <div className="text-danger mb-3">Password doesn't match</div>
                )}
              </Form.Text>
              <ul className="mb-5">
                <li
                  className={
                    passwordError.isLengthy ? "text-success" : "text-danger"
                  }
                >
                  Min 8 charachters
                </li>
                <li
                  className={
                    passwordError.hasUpper ? "text-success" : "text-danger"
                  }
                >
                  At least one upper case
                </li>
                <li
                  className={
                    passwordError.hasLower ? "text-success" : "text-danger"
                  }
                >
                  At least one lower case
                </li>
                <li
                  className={
                    passwordError.hasNumber ? "text-success" : "text-danger"
                  }
                >
                  At least one number
                </li>
                <li
                  className={
                    passwordError.hasSpclChar ? "text-success" : "text-danger"
                  }
                >
                  At least one of the special characters i.e. @#$%&
                </li>
              </ul>

              <Button
                variant="primary"
                type="submit"
                disabled={Object.values(passwordError).includes(false)}
              >
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UpdatePasswordForm;
