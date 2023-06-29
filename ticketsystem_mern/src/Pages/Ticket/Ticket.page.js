import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Container, Row, Col, Button } from "react-bootstrap";
import PageBreadcrumb from "../../Components/Breadcrumb/PageBreadcrumb.component";
import MessageHistory from "../../Components/Message-History/MessageHistory.component";
import UpdateTicket from "../../Components/UpdateTicket/UpdateTicket.component";
import tickets from "../../Assets/data/mock-data.json";
import { useParams } from "react-router-dom";
import { fetchTicket } from '../Ticket-List/ticketsAction';

// const ticket = tickets[0];
const Ticket = () => {
  const { tId } = useParams();
  const dispatch = useDispatch();
  const [message, setmessage] = useState("");
  const [ticket, setTicket] = useState("");
  useEffect(() => {
    dispatch(fetchTicket(tId))
  }, [message, tId, dispatch]);
  const handleOnChange = (e) => {
    setmessage(e.target.value);
  };
  const handleOnSubmit = () => {
    // tempo solution before api integrated
    alert("From Submitted");
  };
  return (
    <Container>
      <Row>
        <Col>
          <PageBreadcrumb pageName="Ticket" />
        </Col>{" "}
      </Row>{" "}
      <Row>
        <Col className="text-weight-bolder text-secondary">
          <div className="subject"> Subject: {ticket.subject} </div>{" "}
          <div className="date"> Ticket Opened: {ticket.addedAt} </div>{" "}
          <div className="status"> Status: {ticket.status} </div>{" "}
        </Col>{" "}
        <Col className="text-right">
          <Button variant="outline-info"> Close ticket </Button>{" "}
        </Col>{" "}
      </Row>{" "}
      <Row className="mt-4">
        <Col>
          {" "}
          {tickets.history && <MessageHistory msg={ticket.history} />}{" "}
        </Col>{" "}
      </Row>{" "}
      <Row className="mt-4">
        <Col>
          <UpdateTicket
            msg={message}
            handleOnChange={handleOnChange}
            handleOnSubmit={handleOnSubmit}
          />{" "}
        </Col>{" "}
      </Row>{" "}
    </Container>
  );
};

export default Ticket;
