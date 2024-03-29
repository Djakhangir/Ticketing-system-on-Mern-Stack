import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import logo from "../../../Assets/img/Logo.png";
import { LinkContainer } from "react-router-bootstrap";
import { useHistory } from "react-router-dom";
import { userLogout } from "../../../Api/userApi";
import "./Header.css";

export const Headers = () => {
  const history = useHistory();

  const logMeOut = () => {
    sessionStorage.removeItem("accessJWT");
    localStorage.removeItem('buildingmgmSite');
    userLogout();
    history.push("/");
  };

  return (
    <Navbar collapseOnSelect fixed fluid bg="dark" data-bs-theme="dark" expand="md">
      <Navbar.Brand >
        <img src={logo} alt="logo" width="50px" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto" >
          {/* <Link to="/dashboard">Dashboard</Link>
          <Link to="/tickets">Tickets</Link>
          <Link to="">Logout</Link> */}
          <LinkContainer to="/dashboard">
            <Nav.Link>Dashboard</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/tickets">
            <Nav.Link>Tickets</Nav.Link>
          </LinkContainer>
          <Nav.Link onClick={logMeOut}>Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
