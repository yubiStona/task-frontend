import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import "../LandingPage.css"; // We'll create this CSS file next
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
const LandingPage = () => {
  const user = useSelector(selectCurrentUser);
  if (user && user.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  } else if (user) {
    return <Navigate to="/user-dashboard" replace />;
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="hero-text">
              <h1 className="hero-title">Organize Your Work & Life</h1>
              <p className="hero-subtitle">
                The ultimate task management solution for teams and individuals.
                Boost productivity and never miss a deadline again.
              </p>
              <div className="cta-buttons">
                <Button
                  as={Link}
                  to="/login"
                  variant="primary"
                  size="lg"
                  className="me-3"
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="outline-primary"
                  size="lg"
                >
                  Sign Up
                </Button>
              </div>
            </Col>
            <Col md={6} className="hero-image">
              <img
                src="https://illustrations.popsy.co/amber/task-list.svg"
                alt="Task management illustration"
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="features-section py-5">
        <Container>
          <h2 className="text-center mb-5">Why Choose Our Task Manager?</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body>
                  <div className="feature-icon mb-3">
                    <i className="fas fa-tasks fa-3x text-primary"></i>
                  </div>
                  <Card.Title>Intuitive Interface</Card.Title>
                  <Card.Text>
                    Simple, clean design that helps you focus on what matters
                    most - getting things done.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body>
                  <div className="feature-icon mb-3">
                    <i className="fas fa-users fa-3x text-primary"></i>
                  </div>
                  <Card.Title>Team Collaboration</Card.Title>
                  <Card.Text>
                    Assign tasks, set deadlines, and track progress across your
                    entire team.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body>
                  <div className="feature-icon mb-3">
                    <i className="fas fa-chart-line fa-3x text-primary"></i>
                  </div>
                  <Card.Title>Powerful Analytics</Card.Title>
                  <Card.Text>
                    Visual reports help you understand your productivity
                    patterns.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <blockquote className="blockquote">
                <p className="mb-4">
                  "This task manager has transformed how our team works. We've
                  seen a 40% increase in productivity since we started using
                  it."
                </p>
                <footer className="blockquote-footer">
                  Sarah Johnson, <cite>Project Manager at TechCorp</cite>
                </footer>
              </blockquote>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="final-cta py-5">
        <Container className="text-center">
          <h2 className="mb-4">Ready to Boost Your Productivity?</h2>
          <Button
            as={Link}
            to="/register"
            variant="primary"
            size="lg"
            className="me-3"
          >
            Get Started - It's Free
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;
