import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

import './AddNewTicketForm.style.css'

const AddNewTicketForm = ({ handleOnSubmit, handleOnChange, formData, formErrorData }) => {
    console.log(formData);
  return (
    <div className="jumbotron add-new-ticket mt-3">
      <h1 className='text-info text-center'>Add New Ticket</h1>
      <hr/>
      <Form autoComplete="off" onSubmit={handleOnSubmit}>
        <Form.Group as={Row}>
          <Form.Label column sm={3}>
            Subject
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              name="subject"
              onChange={handleOnChange}
              placeholder="Subject"
              value={formData.subject}
              required
            ></Form.Control>
            <Form.Text className="text-danger">{formErrorData.subject && 'Subject is required'}</Form.Text>
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm={3}>
            Issue Created
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="date"
              name="issuedate"
              onChange={handleOnChange}
              value={formData.issuedate}
              required
            ></Form.Control>
          </Col>
        </Form.Group>
        <Form.Group>
          <Form.Label> Details </Form.Label>
          <Form.Control
            as="textarea"
            name="details"
            onChange={handleOnChange}
            rows="5"
            value={formData.details}
            required
          ></Form.Control>
        </Form.Group>
        <br />
        <Button type="submit" variant="info" block='true'>
          Submit Form
        </Button>
      </Form>
    </div>
  );
};

export default AddNewTicketForm;

AddNewTicketForm.propTypes = {
    handleOnSubmit: PropTypes.func.isRequired,
    handleOnChange: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    formErrorData: PropTypes.object.isRequired
}