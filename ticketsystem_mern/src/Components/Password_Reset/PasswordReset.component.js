import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const PasswordReset = () => {

  const handleOnResetSubmit =(e) => {
    e.preventDefault();
  }
  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-light text-center"> Reset Password </h1> <hr />
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
            </Form.Group><br/>
            <Button type="submit" > Reset Password </Button>
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
