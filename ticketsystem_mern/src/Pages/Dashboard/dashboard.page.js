import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import TicketTable from "../../Components/Ticket-table/TicketTable.component";
import PageBreadcrumb from "../../Components/Breadcrumb/PageBreadcrumb.component";
import mockTickets from "../../Assets/data/mock-data.json";
import { fetchAllTickets } from "../Ticket-List/ticketsAction";
import './dashboard.style.css'

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tickets } = useSelector((state) => state.tickets);

  useEffect(() => {
    if (!tickets.length) {
      dispatch(fetchAllTickets());
    }
  }, [tickets, dispatch]);

  const pendingTickets = tickets.filter((row) => row.status !== "Closed");
  const totalTickets = tickets.length;

  return (
    <Container className="dashboard"  fluid bg="dark"  expand="md">
      {/* fixed data-bs-theme="dark" */}
      <Row>
        <Col>
          <PageBreadcrumb pageName="Dashboard" />
        </Col>
      </Row>
      <Row>
        <Col className="text-center mt-5 mb-2">
          <Link to="/add-ticket">
            <Button
              variant="light"
              style={{ fontSize: "2rem", padding: "10px 30px"}}
            >
              Add New Ticket
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col className="text-center mb-2">
          <div> Total Tickets: {totalTickets} </div>
          <div> Pending Tickets: {pendingTickets.length} </div>
        </Col>
      </Row>
      <Row>
        <Col className="text-center mt-2">Recently Added Tickets </Col>
      </Row>
      <hr />
      <Row>
        <Col className="recent-ticket">
          <TicketTable />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
