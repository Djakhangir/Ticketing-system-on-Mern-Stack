import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

const SearchForm = ({handleOnChange, str}) => {
  return (
    <div>
      
      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Search:
          </Form.Label>
          <Col sm="10">
            <Form.Control
              name="searchString"
              onChange={handleOnChange}
              value={str}
              placeholder="Search ..."
            ></Form.Control>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default SearchForm;

SearchForm.propTypes = {
    handleOnChange: PropTypes.func.isRequired,
    str: PropTypes.string.isRequired,
}