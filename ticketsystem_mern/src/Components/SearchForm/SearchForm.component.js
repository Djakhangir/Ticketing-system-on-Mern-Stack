import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { filterSearchTicket } from "../../Pages/Ticket-List/ticketsAction";
import './SearchForm.style.css';

const SearchForm = () => {
  const dispatch = useDispatch()
  const handleOnChange = e => {
    const {value} = e.target
    dispatch(filterSearchTicket(value))
  }

  return (
    <div className="search-container">
      <Form>
        <Form.Group as={Row} className="mb-3">
          {/* <Form.Label column sm="1">
            Search:
          </Form.Label> */}
          <Col >
            <Form.Control
              name="searchString"
              onChange={handleOnChange}
              placeholder="Search ..."
            ></Form.Control>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default SearchForm;
