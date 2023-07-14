import React from "react";
import { Col, Container, Row, Button, Form } from "react-bootstrap";

const RegistrationForm = () => {
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <h1 className="text-info">User Registration</h1>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" placeholder="Your Full Name" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="number" placeholder="Phone Number" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Company Name</Form.Label>
                <Form.Control type="text" placeholder="Comany Name" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="Full Address" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" />
              </Form.Group>
              <ul className="mb-5">
                <li className="text-danger">Min 8 charachters</li>
                <li className="text-danger">At least one upper case</li>
                <li className="text-danger">At least one lower case</li>
                <li className="text-danger">At least one number</li>
                <li className="text-danger">
                  At least one of the special Characters i.e. @#$%&
                </li>
              </ul>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegistrationForm;
