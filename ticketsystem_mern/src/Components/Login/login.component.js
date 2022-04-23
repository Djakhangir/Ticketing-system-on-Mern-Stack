import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const LoginForm = ({ handleonChange, email, password, handleOnSubmit, loginFormSwitcher}) => {
  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-info text-center"> Tenant Login </h1> <hr />
          <Form autoComplete="off" onSubmit={handleOnSubmit}>
            <Form.Group>
              <Form.Label> Email Address </Form.Label>
              <Form.Control
                onChange={handleonChange}
                type="email"
                name="email"
                value={email}
                placeholder="Enter Email"
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label> Password </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={handleonChange}
                required
              ></Form.Control>
            </Form.Group>
            <br />
            <Button type="submit"> Login </Button>
          </Form>
          <hr />
        </Col>
      </Row>
      <Row>
        <Col>
          <a href="#!" onClick={() => loginFormSwitcher(true)}> Forget Password ? </a>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;

LoginForm.propTypes = {
  email: PropTypes.string.isRequired,
  handleonChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  loginFormSwitcher: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
};
