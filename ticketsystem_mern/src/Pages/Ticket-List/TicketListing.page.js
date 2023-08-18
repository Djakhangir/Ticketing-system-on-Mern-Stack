import React, { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageBreadcrumb from "../../Components/Breadcrumb/PageBreadcrumb.component";
import SearchForm from "../../Components/SearchForm/SearchForm.component";
import TicketTable from "../../Components/Ticket-table/TicketTable.component";
import { useDispatch } from "react-redux";
import { fetchAllTickets } from "./ticketsAction";

const TicketList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [dispatch]);

  return (
    <Container>
      <Row>
        <Col>
          <PageBreadcrumb pageName="Ticket List" />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Link to="/add-ticket">
            <Button variant="secondary"> Add New Ticket </Button>
          </Link>
        </Col>
        <Col className="text-right">
          <SearchForm />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <TicketTable />
        </Col>
      </Row>
    </Container>
  );
};

export default TicketList;
