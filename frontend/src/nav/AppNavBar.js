import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import "./AppNavBar.css";
import UserContext from "../context/UserContext";

function AppNavBar() {

  const { currentUser, logout } = useContext(UserContext);
  return (
    <Navbar className="navbar-expand-md">
      <Nav >
        <NavItem className="m-3">
          <NavLink to='/' end>
            Home
          </NavLink>
        </NavItem>
        <NavItem className="m-3">
          <NavLink reloadDocument
            to='/search'
          >
            Search
          </NavLink>
        </NavItem>
        <NavItem className="m-3">
          <NavLink reloadDocument
            to='/trainer'
          >
            Train
          </NavLink>
        </NavItem>
        {currentUser ?
          <NavItem className="m-3">
            <NavLink reloadDocument
              to='/customize'
            >
              Customize
            </NavLink>
          </NavItem>
          :
          ""
        }
      </Nav>
      <Nav className="ml-auto">
        {currentUser ?
          <>
            <NavItem className="m-3">
              <NavLink to='/profile' >
                {currentUser.username}
              </NavLink>
            </NavItem>
            <NavItem className="m-3">
              <NavLink onClick={logout} >
                Logout
              </NavLink>
            </NavItem>
          </>
          :
          <>
            <NavItem className="m-3">
              <NavLink to='/register' >
                Register
              </NavLink>
            </NavItem>
            <NavItem className="m-3">
              <NavLink to='/login' >
                Login
              </NavLink>
            </NavItem>
          </>
        }

      </Nav>
    </Navbar>
  );

}

export default AppNavBar;