import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const TicketTable = () => {
  // to mount UI with state that gets data from the db cia slice and reducers, we use useSelector ()
  const { searchTicketList, isLoading, error } = useSelector(
    (state) => state.tickets
  );
  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  if (error) {
    return <h3>{error}</h3>;
  }
  return (
    <Table responsive striped bordered hover>
      <thead>
        <tr >
          <th>#</th> 
          <th>Subject</th>
          <th>Status</th>
          <th>Opened Date</th>
        </tr>
      </thead>
      <tbody>
        {searchTicketList.length ? (
          searchTicketList.map((el) => (
            <tr key={el._id}>
              {/* ###TODO: ID ROW IS TOO BIG  */}
              <td>{el._id}</td>
              <td>
                <Link style={{ color:"black", fontWeight:"600", textDecoration:"none"}} to={`/ticket/${el._id}`}>{el.subject}</Link>
              </td>
              {/* ###TODO: MAKE THE TEST ON STATUS BE COLORFUL DOTS */}
              <td>{el.status}</td>
              <td>{el.openAt && new Date(el.openAt).toLocaleString()}</td>
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
