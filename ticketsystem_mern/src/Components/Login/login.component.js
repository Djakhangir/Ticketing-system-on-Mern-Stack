import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { loginPending, loginSuccess, loginFail } from "./loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';

import { userLogin } from "../../Api/userApi";

const LoginForm = ({ loginFormSwitcher }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { isLoading, isAuth, error } = useSelector((state) => state.login);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

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
      if(isAuth.status === 'error'){
        dispatch(loginFail(isAuth.message));
      }
      dispatch(loginSuccess());
      history.push('/dashboard');
      console.log(isAuth);
    } catch (error) {
      dispatch(loginFail(error.message));
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-info text-center"> Tenant Login </h1> <hr />
          {error && <Alert variant="danger">{error}</Alert>}
          <Form autoComplete="off" onSubmit={handleOnSubmit}>
            <Form.Group>
              <Form.Label> Email Address </Form.Label>{" "}
              <Form.Control
                onChange={handleonChange}
                type="email"
                name="email"
                value={email}
                placeholder="Enter Email"
                required
              ></Form.Control>{" "}
            </Form.Group>{" "}
            <Form.Group>
              <Form.Label> Password </Form.Label>{" "}
              <Form.Control
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={handleonChange}
                required
              ></Form.Control>{" "}
            </Form.Group>{" "}
            <br />
            <Button type="submit"> Login </Button>
            {isLoading && <Spinner variant="primary" animation="border" />}
          </Form>{" "}
          <hr />
        </Col>{" "}
      </Row>{" "}
      <Row>
        <Col>
          <a href="#!" onClick={() => loginFormSwitcher(true)}>
            {" "}
            Forget Password ?{" "}
          </a>{" "}
        </Col>{" "}
      </Row>{" "}
    </Container>
  );
};

export default LoginForm;

LoginForm.propTypes = {
  loginFormSwitcher: PropTypes.func.isRequired,
};
