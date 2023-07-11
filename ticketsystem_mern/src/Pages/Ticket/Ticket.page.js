import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import PageBreadcrumb from "../../Components/Breadcrumb/PageBreadcrumb.component";
import MessageHistory from "../../Components/Message-History/MessageHistory.component";
import UpdateTicket from "../../Components/UpdateTicket/UpdateTicket.component";
// import tickets from "../../Assets/data/mock-data.json";
import { useParams } from "react-router-dom";
import { fetchTicket } from "../Ticket-List/ticketsAction";

// const ticket = tickets[0];
const Ticket = () => {
  const { tId } = useParams();
  const dispatch = useDispatch();
  const { isLoading, error, selectedTicket } = useSelector(
    (state) => state.tickets
  );

  const [message, setmessage] = useState("");
  const [ticket, setTicket] = useState("");

  useEffect(() => {
    dispatch(fetchTicket(tId));
  }, [message, tId, dispatch]);

  return (
    <Container>
      <Row>
        <Col>
          <PageBreadcrumb pageName="Ticket" />
        </Col>
      </Row>
      <Row>
        <Col>
          {isLoading && <Spinner variant="primary" animation="border" />}
          {error && <Alert variant="danger">{error}</Alert>}
        </Col>
      </Row>
      <Row>
        <Col className="text-weight-bolder text-secondary">
          <div className="subject"> Subject: {selectedTicket.subject} </div>
          <div className="date"> Ticket Opened: {selectedTicket.openAt && new Date(selectedTicket.openAt).toLocaleString()} </div>
          <div className="status"> Status: {selectedTicket.status} </div>
        </Col>
        <Col className="text-right">
          <Button variant="outline-info"> Close ticket </Button>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          {selectedTicket.conversations && (
            <MessageHistory msg={selectedTicket.conversations} />
          )}
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <UpdateTicket _id={tId} />
        </Col>
      </Row>
    </Container>
  );
};

export default Ticket;
