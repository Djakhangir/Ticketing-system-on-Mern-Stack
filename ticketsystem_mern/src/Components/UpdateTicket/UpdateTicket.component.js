import React from "react";
import PropTypes from "prop-types";
import { Form, Button } from "react-bootstrap";

const UpdateTicket = ({msg, handleOnChange, handleOnSubmit}) => {
  return (
    <Form onSubmit={handleOnSubmit}>
      <Form.Label>Reply</Form.Label>
      <Form.Text>Please reply here or update the ticket</Form.Text>
      <Form.Control as="textarea" row="5" name="detail" value={msg} onChange={handleOnChange}/>
      <div className="text-right mt-3 mb-3">
        <Button variant="info" type="submit">
          Reply
        </Button>
      </div>
    </Form>
  );
};

export default UpdateTicket;

UpdateTicket.propTypes = {
    msg: PropTypes.string.isRequired,
    handleOnChange: PropTypes.func.isRequired,
    handleOnSubmit: PropTypes.func.isRequired,
  };