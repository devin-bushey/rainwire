import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { NavLink, Outlet } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Collapse } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const Navbarr = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const logOut = () => {
    toggle();
    localStorage.clear();
    window.location.reload();
    navigate('/');
  };

  const close = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <Navbar bg="transparent" expand="lg" style={{ position: 'sticky', top: 0, width: '100%' }}>
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

                {localStorage.getItem('encryptedSpotifyToken') && (
                  <NavLink onClick={logOut} className="nav-link" to="/">
                    Sign Out
                  </NavLink>
                )}

                {/* <NavLink onClick={toggle} className="nav-link" to="/van" style={{ textAlign: 'center' }}>
                  Vancouver
                </NavLink>
                <NavLink onClick={toggle} className="nav-link" to="/ottawa" style={{ textAlign: 'center' }}>
                  Ottawa
                </NavLink> */}
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
      <br />
      <Outlet />
    </>
  );
};

export default Navbarr;
