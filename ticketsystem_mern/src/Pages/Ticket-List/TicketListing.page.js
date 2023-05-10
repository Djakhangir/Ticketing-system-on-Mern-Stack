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
  const [showFiltered, setshowFiltered] = useState(tickets);

  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [str, showFiltered]);

  const handleOnChange = (e) => {
    const { value } = e.target;
    setstr(value);
    filterTickerBySearch(value);
  };

  const filterTickerBySearch = (str) => {
    const displayTicket = tickets.filter((info) =>
      info.subject.toLowerCase().includes(str.toLowerCase())
    );

    setshowFiltered(displayTicket);
  };

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
          <SearchForm handleOnChange={handleOnChange} str={str} />{" "}
        </Col>{" "}
      </Row>{" "}
      <hr />
      <Row>
        <Col>
          <TicketTable mockTickets={showFiltered} />{" "}
        </Col>{" "}
      </Row>{" "}
    </Container>
  );
};

export default TicketList;
