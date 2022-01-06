import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

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

{/* <nav className="navbar navbar-expand-lg navbar-light">
      <NavLink className="navbar-brand" to="/">
        Record Shop
      </NavLink>

      <NavLink className="nav-link" to="/van">
        Van
      </NavLink>

      <NavLink className="nav-link" to="/ottawa">
        Ottawa
      </NavLink>

    </nav > */}



{/* <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Record Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <NavLink className="navbar-brand" to="/">Record Shop</NavLink>
            <NavDropdown title="Cities" id="basic-nav-dropdown">
              <NavDropdown.Item href="/van">Vancouver</NavDropdown.Item>
              <NavDropdown.Item href="/ottawa">Ottawa</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar> */}

/*     <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/">
        Record Shop
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/van">
              Vancouver
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/ottawa">
              Ottawa
              </NavLink>
            </li>
          </ul>
        </div>
      </nav> */