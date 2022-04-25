import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TicketTable from '../../Components/Ticket-table/TicketTable.component';
import PageBreadcrumb from '../../Components/Breadcrumb/PageBreadcrumb.component';
import mockTickets from '../../Assets/data/mock-data.json';

const Dashboard = () => {
  return (
    <Container>
        <Row><Col>
        <PageBreadcrumb pageName="Dashboard"/></Col></Row>
      <Row>
        <Col className='text-center mt-5 mb-2'>
          <Button variant="info" style={{'fontSize':'2rem', 'padding': '10px 30px'}}>Add New Ticket</Button>
        </Col>
      </Row>
      <Row>
        <Col className='text-center mb-2'>
         <div>Total Tickets: 50</div>
         <div>Pending Tickets: 5</div>
        </Col>
      </Row>

      <Row>
        <Col className='text-center mt-2'>
         Recently Added Tickets
        </Col>
      </Row>
      <hr/>
      <Row>
        <Col className='recent-ticket'>
        <TicketTable mockTickets={mockTickets}/>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
