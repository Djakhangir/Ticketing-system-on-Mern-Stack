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
import { registrationUserAction } from "./RegistrationUserAction";
import  "./RegistrationForm.styles.css";

const initialState = {
  name: "Jake A",
  phone: "400000001",
  email: "jake.a.s@gmail.com",
  company: "glosoft",
  address: "2 mindy dr M Nj 08057",
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

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const { isLoading, status, message } = useSelector(
    (state) => state.userRegistration
  );
  //initial states
  const [newUser, setNewUser] = useState(initialState);
  const [passwordError, setPasswordError] = useState(passwordVerification);

  // prevent rerendering the page
  useEffect(() => {}, [newUser]);

  //changes on input field
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });

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
        confirmPassword: newUser.password === value,
      });
    }
  };

  //submit the form
  const handleOnSubmit = (e) => {
    //prevents on reloading everytime we click the button;
    e.preventDefault();

    const { name, phone, email, company, address, password } = newUser;
    const newRegistration = {
      name,
      phone,
      email,
      company,
      address,
      password,
    };

    dispatch(registrationUserAction(newRegistration));
  };

  return (
    <div className="registerForm">
      <Container>
        <Row>
          <Col>
            <h1 className="text-dark text-center">User Registration</h1>
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
          </Col>
        </Row>
        <Row>
          <Col>
            <Form onSubmit={handleOnSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                className="registration-name"
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleOnChange}
                  placeholder="Your Full Name"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                className="registration-phone"
                  type="number"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleOnChange}
                  placeholder="Phone Number"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                className="registration-email"
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleOnChange}
                  placeholder="Enter email"
                />
                <Form.Text className="text-muted m-3">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                className="registration-company"
                  type="text"
                  name="company"
                  value={newUser.company}
                  onChange={handleOnChange}
                  placeholder="Company Name"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                className="registration-address"
                  type="text"
                  name="address"
                  value={newUser.address}
                  onChange={handleOnChange}
                  placeholder="Full Address"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                className="registration-password"
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleOnChange}
                  placeholder="Password"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                className="registration-confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={newUser.confirmPassword}
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
              {isLoading && <Spinner variant="info" animation="border" />}
            </Form>
          </Col>
        </Row>
        <Row className="py-4 text-center">
          <Col>
            Already have an account?
            <a className="login-btn" href="/">LOG IN</a>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegistrationForm;
