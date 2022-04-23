import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const PasswordReset = ({ handleonChange, email, handleOnResetSubmit, loginFormSwitcher }) => {
  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-info text-center"> Reset Password </h1> <hr />
          <Form autoComplete="off" onSubmit={handleOnResetSubmit}>
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
            </Form.Group><br/>
            <Button type="submit" > Reset Password </Button>
          </Form>
          <hr />
        </Col>
      </Row>
      <Row>
        <Col>
          <a href="#!" onClick={()=>loginFormSwitcher(false)}> Login Now </a>
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordReset;

PasswordReset.propTypes = {
  email: PropTypes.string.isRequired,
  handleonChange: PropTypes.func.isRequired,
  handleOnResetSubmit: PropTypes.func.isRequired,
  loginFormSwitcher: PropTypes.func.isRequired,
};
