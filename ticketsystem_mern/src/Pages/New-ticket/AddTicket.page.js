import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import PageBreadcrumb from "../../Components/Breadcrumb/PageBreadcrumb.component";
import AddNewTicketForm from "../../Components/AddNewTicketForm/AddNewTicketForm.component";

const AddTicket = () => {
  return (
    <Container>
      <Row>
        <Col>
          <PageBreadcrumb pageName="New Ticket" />
        </Col>
      </Row>
      <Row>
        <Col>
          <AddNewTicketForm />
        </Col>
      </Row>
    </Container>
  );
};

export default AddTicket;
