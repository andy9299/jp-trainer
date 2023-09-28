import React from "react";
import { Nav, NavItem, Navbar } from "reactstrap";
import { NavLink } from "react-router-dom";
import "./AppNavBar.css";
function AppNavBar() {

  return (
    <Navbar expand="md" >
      <NavLink end to="/" className="navbar-brand">
        JP Trainer
      </NavLink>
      <Nav className="ml-auto">
        <NavItem >
          <NavLink to="/login" className="me-2">
            Login
          </NavLink>
        </NavItem>
        <NavItem >
          <NavLink to="/register" className="me-2">
            Register
          </NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  );

}

export default AppNavBar;