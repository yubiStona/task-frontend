import React from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
// import "./Layout.css";

const Layout = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <Container fluid className="content-container">
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default Layout;
