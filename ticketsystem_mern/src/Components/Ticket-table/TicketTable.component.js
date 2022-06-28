import React from "react";
import { Table } from "react-bootstrap";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

const TicketTable = ({ mockTickets }) => {
  if (!mockTickets.length) {
  }
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th> # </th>
          <th> Subject </th>
          <th> Status </th>
          <th> Opened Date </th>
        </tr>
      </thead>
      <tbody>
        {mockTickets.length ? (
          mockTickets.map((el) => (
            <tr key={el.id}>
              <td> {el.id} </td>
              <td> 
              <Link to={`/ticket/${el.id}`}>
              {el.subject}
              </Link>
              </td>
              <td> {el.status} </td>
              <td> {el.addedAt} </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center">
              No Tickets Available
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TicketTable;

TicketTable.propTypes = {
  mockTickets: PropTypes.array.isRequired,
};
