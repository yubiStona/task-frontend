import React from "react";
import { Container, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Container>
      <Alert variant="warning">
        <h4>404 - Page Not Found</h4>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">
          Go to Home
        </Link>
      </Alert>
    </Container>
  );
};

export default NotFoundPage;
