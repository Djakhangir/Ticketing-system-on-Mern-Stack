import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { loginPending, loginSuccess, loginFail } from "./loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getUserProfile } from "../../Pages/Dashboard/userAction";

import { userLogin } from "../../Api/userApi";
import "./login.css";

const LoginForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { isLoading, isAuth, error } = useSelector((state) => state.login);


  const [email, setemail] = useState(""); //J.atahanov@yahoo.com
  const [password, setpassword] = useState(""); //12345678As@1
  const [eye, setEye] = useState(false);
  // const [zoomedIn, setzoomedIn] = useState(false)

  useEffect(() => {
    sessionStorage.getItem("accessJWT") && history.push("/dashboard");
  }, [history, isAuth]);


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

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return alert("You missed one of the required fields");
    }
    dispatch(loginPending());
    try {
      const isAuth = await userLogin({ email, password });
      if (isAuth.status === "error") {
        return dispatch(loginFail(isAuth.message));
      }
      // setzoomedIn(true)
      dispatch(loginSuccess());
      dispatch(getUserProfile());
      history.push("/dashboard");
      console.log(isAuth);
    } catch (error) {
      dispatch(loginFail(error.message));
    }
  };

  const handleTheEye = () => {
    setEye(!eye);
  };

  return (
    <Container className="login-container">
      <Row>
        <Col>
          <h1 className="text text-center"> Have an account? </h1> <hr />
          {error && <Alert variant="danger">{error}</Alert>}
          <Form autoComplete="off" onSubmit={handleOnSubmit}>
            <Form.Group className="mt-3">
              <Form.Control
              className="login-email"
                size="sm"
                onChange={handleonChange}
                type="email"
                name="email"
                value={email}
                placeholder="Enter Email"
                required
              ></Form.Control>
            </Form.Group>
            <br />
            <InputGroup>
              <Form.Control
              className="login-password"
                size="sm"
                type={eye ? "text" : "password"}
                name="password"
                value={password}
                placeholder="Password"
                onChange={handleonChange}
                required
              ></Form.Control>
              <FontAwesomeIcon
                onClick={handleTheEye}
                icon={!eye ? faEyeSlash : faEye}
                style={{
                  cursor: "pointer",
                  zIndex: "999",
                  position: "absolute",
                  left: "90%",
                  top: "16px",
                }}
              />
            </InputGroup>

            <br />
            <Button type="submit"> Login </Button>
            {isLoading && <Spinner variant="primary" animation="border" />}
          </Form>
          <hr />
        </Col>
      </Row>
      <Row className="py-1">
        <Col >
          <a className="forgetPassBtn" href="/password-reset">
            Forgot Password ?
          </a>
        </Col>
      </Row>
      <Row >
        <Col>
          <p  className="registrationBtnContainer">Don't have an account?
          <a className="registrationBtn" href="/registration"> SIGN UP</a> </p>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;

LoginForm.propTypes = {
  loginFormSwitcher: PropTypes.func.isRequired,
};
