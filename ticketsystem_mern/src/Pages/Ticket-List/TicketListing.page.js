import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageBreadcrumb from "../../Components/Breadcrumb/PageBreadcrumb.component";
import SearchForm from "../../Components/SearchForm/SearchForm.component";
import TicketTable from "../../Components/Ticket-table/TicketTable.component";
import tickets from "../../Assets/data/mock-data.json";
import { useDispatch } from "react-redux";
import { fetchAllTickets } from "./ticketsAction";

const TicketList = () => {
  const dispatch = useDispatch();

  const [str, setstr] = useState("");

  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [str, dispatch]);


  return (
    <Container>
      <Row>
        <Col>
          <PageBreadcrumb pageName="Ticket List" />
        </Col>{" "}
      </Row>{" "}
      <Row className="mt-4">
        <Col>
          <Link to="/add-ticket">
            <Button variant="info"> Add New Ticket </Button>{" "}
          </Link>{" "}
        </Col>{" "}
        <Col className="text-right">
          <SearchForm />
        </Col>{" "}
      </Row>{" "}
      <hr />
      <Row>
        <Col>
          <TicketTable />{" "}
        </Col>{" "}
      </Row>{" "}
    </Container>
  );
};

export default TicketList;
