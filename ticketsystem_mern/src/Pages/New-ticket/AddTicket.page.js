import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import PageBreadcrumb from "../../Components/Breadcrumb/PageBreadcrumb.component";
import AddNewTicketForm from "../../Components/AddNewTicketForm/AddNewTicketForm.component";

const initialData = {
  subject: "",
  issuedate: "",
  details: "",
};
const AddTicket = () => {
  const [formData, setformData] = useState(initialData);

  useEffect(() => {}, [formData]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setformData({
      ...formData,
      [name]: value,
    });
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log("Form is recieved", formData);
  };

  return (
    <Container>
      <Row>
        <Col>
          <PageBreadcrumb pageName="New Ticket" />
        </Col>
      </Row>
      <Row>
        <Col>
          <AddNewTicketForm
            handleOnSubmit={handleOnSubmit}
            handleOnChange={handleOnChange}
            formData={formData}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AddTicket;
