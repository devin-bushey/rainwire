import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Collapse } from 'reactstrap';

const Navbarr = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const close = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <Navbar bg="transparent" expand="lg" style={{ position: 'fixed', top: 0, width: '100%' }}>
        <Container>
          <NavLink
            className="navbar-brand"
            to="/"
            onClick={close}
            style={{
              textAlign: 'center',
              borderRadius: '10px',
              background: 'hsl(43, 97%, 80%)',
              padding: '3px 10px 3px 10px',
            }}
          >
            Record Shop
          </NavLink>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            style={{ background: 'hsl(176, 52%, 80%)', opacity: 1 }}
            onClick={toggle}
          />
          <Collapse isOpen={isOpen} navbar={true} style={{ margin: 10 }}>
            <Nav className="me-auto" style={{ background: 'white', opacity: 1 }}>
              <NavLink onClick={toggle} className="nav-link" to="/vic">
                Victoria
              </NavLink>
              <NavLink onClick={toggle} className="nav-link" to="/van" style={{ textAlign: 'center' }}>
                Vancouver
              </NavLink>
              <NavLink onClick={toggle} className="nav-link" to="/ottawa" style={{ textAlign: 'center' }}>
                Ottawa
              </NavLink>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navbarr;
