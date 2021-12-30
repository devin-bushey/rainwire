import React from "react";

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";

// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";

// Here, we display our Navbar
const Navbar = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light">
        <NavLink className="navbar-brand" to="/">
          Record Shop
        </NavLink>

        <NavLink className="nav-link" to="/van">
          Van
        </NavLink>

        <NavLink className="nav-link" to="/ottawa">
          Ottawa
        </NavLink>
        
      </nav>
    </div>
  );
};

export default Navbar;