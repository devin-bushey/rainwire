import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from 'react-bootstrap';

const Navbarr = () => {

  return (

    <div style={{marginBottom: "2rem"}}>
    <Navbar bg="light" expand="lg">
      <Container>
        <NavLink className="navbar-brand" to="/">Record Shop</NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <NavLink className="nav-link" to="/vic" style={{ textAlign: 'center' }}>
              Victoria
            </NavLink>
            <NavLink className="nav-link" to="/van" style={{ textAlign: 'center' }}>
              Vancouver
            </NavLink>
            <NavLink className="nav-link" to="/ottawa" style={{ textAlign: 'center' }}>
              Ottawa
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>

  );
};

export default Navbarr;
