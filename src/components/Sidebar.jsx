import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "../features/auth/authSlice";

const Sidebar = () => {
  const location = useLocation();
  const isAdmin = useSelector(selectIsAdmin);

  return (
    <Nav className="flex-column sidebar">
      <Nav.Link
        as={Link}
        to="/dashboard"
        active={location.pathname === "/dashboard"}
      >
        Dashboard
      </Nav.Link>
      {isAdmin && (
        <>
          <Nav.Link
            as={Link}
            to="/users"
            active={location.pathname.startsWith("/users")}
          >
            Users
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/tasks"
            active={location.pathname.startsWith("/tasks")}
          >
            Tasks
          </Nav.Link>
        </>
      )}
      <Nav.Link
        as={Link}
        to="/profile"
        active={location.pathname === "/profile"}
      >
        Profile
      </Nav.Link>
    </Nav>
  );
};

export default Sidebar;
