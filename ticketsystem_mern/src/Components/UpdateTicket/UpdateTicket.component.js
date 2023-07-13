import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Form, Button } from "react-bootstrap";
import { replyOnTicket } from "../../Pages/Ticket-List/ticketsAction";

const UpdateTicket = ({ _id }) => {
  const {
    user: { name },
  } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const handleOnChange = (e) => {
    setMessage(e.target.value);
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    const msgObj = {
      message,
      sender: name,
    };
    dispatch(replyOnTicket(_id, msgObj));
    setMessage('')
  };
  return (
    <div>
      <Form onSubmit={handleOnSubmit}>
        <Form.Label>Reply</Form.Label>
        <Form.Text>Please reply here or update the ticket</Form.Text>
        <Form.Control
          as="textarea"
          row="5"
          name="detail"
          value={message}
          onChange={handleOnChange}
        />
        <div className="text-right mt-3 mb-3">
          <Button variant="info" type="submit">
            Reply
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UpdateTicket;

UpdateTicket.propTypes = {
  _id: PropTypes.string.isRequired,
};
