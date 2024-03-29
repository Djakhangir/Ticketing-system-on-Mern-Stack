import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import PageBreadcrumb from "../../Components/Breadcrumb/PageBreadcrumb.component";
import MessageHistory from "../../Components/Message-History/MessageHistory.component";
import UpdateTicket from "../../Components/UpdateTicket/UpdateTicket.component";
// import tickets from "../../Assets/data/mock-data.json";
import { useParams } from "react-router-dom";
import { fetchTicket, closeTicket } from "../Ticket-List/ticketsAction";
import { resetResponseMsg } from "../Ticket-List/ticketsSlice";
import './Ticket.page.style.css';

// const ticket = tickets[0];
const Ticket = () => {
  const { tId } = useParams();
  const dispatch = useDispatch();
  const { isLoading, error, selectedTicket, replyTicketError, replyMsg } = useSelector(
    (state) => state.tickets
  );

  // const [message, setmessage] = useState("");
  // const [ticket, setTicket] = useState("");

  useEffect(() => {
    dispatch(fetchTicket(tId));
    return () => {
      (replyTicketError || replyMsg) && dispatch(resetResponseMsg());
    }
  }, [tId, dispatch, replyTicketError, replyMsg]);

  return (
    <Container className="ticket-container">
      <Row>
        <Col>
          <PageBreadcrumb pageName="Ticket" />
        </Col>
      </Row>
      <Row>
        <Col>
          {isLoading && <Spinner variant="primary" animation="border" />}
          {error && <Alert variant="danger">{error}</Alert>}
          {replyTicketError && <Alert variant="danger">{replyTicketError}</Alert>}
          {replyMsg && <Alert variant="success">{replyMsg}</Alert>}
        </Col>
      </Row>
      <Row>
        <Col className="text-weight-bolder text-dark ">
          <div className="subject"> <span className="header">Subject: </span> {selectedTicket.subject} </div>
          <div className="date"><span className="header">
            Ticket Opened: </span>
            { selectedTicket.openAt &&
              new Date(selectedTicket.openAt).toLocaleString()}
          </div>
          <div className="status"><span className="header"> Status: </span> {selectedTicket.status} </div>
        </Col>
        <Col className="text-right">
          <Button
            variant="dark"
            className="close-ticket-btn"
            onClick={() => dispatch(closeTicket(tId))}
            disabled={selectedTicket.status === "Closed"}
          >
            Close ticket
          </Button>
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
