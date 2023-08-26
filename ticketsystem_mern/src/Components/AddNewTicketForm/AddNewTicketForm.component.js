import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import axios from 'axios';
// import PropTypes from "prop-types";

import "./AddNewTicketForm.style.css";
import { shortText } from "../../Utils/Validation";
import { openNewTicket } from "./AddTicketAction";
import { resetSuccessMsg } from "./AddTicketSlice";

const initialData = {
  subject: "test",
  issueDate: "08/24/2023",
  message: "ssss",
  media: []
};
const initialErrorData = {
  subject: false,
  issueDate: false,
  message: false,
  // media, null,
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
    // const [image, setImage] = useState(initialData);

  useEffect(() => {
    return () => {
      successMsg && dispatch(resetSuccessMsg())
    }
  }, [dispatch, formData, formErrorData]);

  const handleOnChange = (e) => {
    const { name, files } = e.target;
    console.log(e.target)

    if (name === 'media') {
      setformData({
        ...formData,
        [name]: Array.from(files), // Convert files to an array
      });
    } else {
      setformData({
        ...formData,
        [name]: e.target.value,
      });
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
  
    const isSubjectValid = await shortText(formData.subject);
    if (!isSubjectValid) {
      setformErrorData({
        ...initialErrorData,
        subject: true, 
      });
      return;
    }
   
 const formDataToSend = new FormData();
 formDataToSend.append(`subject`, formData.subject)
 formDataToSend.append(`issueDate`, formData.issueDate)
 formDataToSend.append(`message`, formData.message)

 formData.media.forEach((file, index) => {
  formDataToSend.append(`media-${index}`, file);
});

console.log(formData)
console.log(formDataToSend)
    dispatch(openNewTicket({ ...formData, sender: name}));
  };

  return (
    <div className="jumbotron add-new-ticket mt-3">
      <h1 className="text-dark text-center">Add New Ticket</h1>
      <hr />
      <div>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMsg && <Alert variant="primary">{successMsg}</Alert>}
        {isLoading && <Spinner variant="primary" animation="border"/>}
      </div>
      <Form autoComplete="off" onSubmit={handleOnSubmit} encType="multipart/form-data" className="add-new-ticket-form">
        <Form.Group as={Row}>
          <Form.Label className="add-new-ticket-label" column sm={3}>
            Subject
          </Form.Label>
          <Col sm={9}>
            <Form.Control
            className="add-new-ticket-subject"
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
        <br/>
        <Form.Group as={Row}>
          <Form.Label column sm={3}>
            Issue Created
          </Form.Label>
          
          <Col sm={5}>
            <Form.Control
            className="add-new-ticket-issueDate"
              type="date"
              name="issueDate"
              onChange={handleOnChange}
              value={formData.issueDate}
              placeholder="MM/DD/YYYY"
              required
            ></Form.Control>
          </Col>
        </Form.Group>
        <Form.Group>
          <Form.Label> Details </Form.Label>
          <Form.Control
          className="add-new-ticket-message"
            as="textarea"
            name="message"
            onChange={handleOnChange}
            rows="5"
            value={formData.message}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label> Upload File </Form.Label>
          <Form.Control
          className="add-new-ticket-image"
            type="file"
            name="media"
            onChange={handleOnChange}
            // value={formData.media}
            multiple
            // required
          ></Form.Control>
        </Form.Group>
        <br />
        <Button type="submit" variant="secondary" block="true">
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
