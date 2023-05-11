import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { filterSearchTicket } from "../../Pages/Ticket-List/ticketsAction";

const SearchForm = () => {
  const dispatch = useDispatch()
  const handleOnChange = e => {
    const {value} = e.target
    dispatch(filterSearchTicket(value))
  }
  
  return (
    <div>
      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Search:
          </Form.Label>{" "}
          <Col sm="10">
            <Form.Control
              name="searchString"
              onChange={handleOnChange}
              placeholder="Search ..."
            ></Form.Control>{" "}
          </Col>{" "}
        </Form.Group>{" "}
      </Form>{" "}
    </div>
  );
};

export default SearchForm;
