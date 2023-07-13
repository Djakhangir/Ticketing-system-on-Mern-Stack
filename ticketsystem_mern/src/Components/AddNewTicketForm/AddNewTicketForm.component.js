import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
// import PropTypes from "prop-types";

import "./AddNewTicketForm.style.css";
import { shortText } from "../../Utils/Validation";
import { openNewTicket } from "./AddTicketAction";
import { resetSuccessMsg } from "./AddTicketSlice";

const initialData = {
  subject: "",
  issueDate: "",
  message: "",
  // media: []
};
const initialErrorData = {
  subject: false,
  issueDate: false,
  message: false,
  // media, false,
};

const AddNewTicketForm = () => {
  const dispatch = useDispatch();
  const {
    user: { name },
  } = useSelector((state) => state.user);
  const {
    isLoading, error, successMsg
  } = useSelector((state) => state.openTicket);

  const [formData, setformData] = useState(initialData);
  const [formErrorData, setformErrorData] = useState(initialErrorData);

  useEffect(() => {
    return () => {
      successMsg && dispatch(resetSuccessMsg())
    }
  }, [dispatch, formData, formErrorData]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setformData({
      ...formData,
      [name]: value,
    });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setformErrorData(initialErrorData);
    const isSubjectValid = await shortText(formData.subject);
    setformErrorData({
      ...initialErrorData,
      subject: !isSubjectValid,
    });
    dispatch(openNewTicket({ ...formData, sender: name }));
  };

  return (
    <div className="jumbotron add-new-ticket mt-3">
      <h1 className="text-info text-center">Add New Ticket</h1>
      <hr />
      <div>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMsg && <Alert variant="primary">{successMsg}</Alert>}
        {isLoading && <Spinner variant="primary" animation="border"/>}
      </div>
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
            <Form.Text className="text-danger">
              {formErrorData.subject && "Subject is required"}
            </Form.Text>
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm={3}>
            Issue Created
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="date"
              name="issueDate"
              onChange={handleOnChange}
              value={formData.issueDate}
              required
            ></Form.Control>
          </Col>
        </Form.Group>
        <Form.Group>
          <Form.Label> Details </Form.Label>
          <Form.Control
            as="textarea"
            name="message"
            onChange={handleOnChange}
            rows="5"
            value={formData.message}
            required
          ></Form.Control>
        </Form.Group>
        <br />
        <Button type="submit" variant="info" block="true">
          Open Ticket
        </Button>
      </Form>
    </div>
  );
};

export default AddNewTicketForm;

// AddNewTicketForm.propTypes = {
//     handleOnSubmit: PropTypes.func.isRequired,
//     handleOnChange: PropTypes.func.isRequired,
//     formData: PropTypes.object.isRequired,
//     formErrorData: PropTypes.object.isRequired
// }
