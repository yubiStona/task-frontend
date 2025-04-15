import React from "react";
import { Card, Button, Row, Col, Alert, Badge } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import {
  useGetUserQuery,
  useGetUserTasksQuery,
} from "../features/users/usersApi";
import TasksList from "../components/TasksList";

const UserDetailsPage = () => {
  const { id } = useParams();
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useGetUserQuery(id);
  const { data: tasks = [], isLoading: tasksLoading } =
    useGetUserTasksQuery(id);

  if (userLoading) return <div>Loading user...</div>;
  if (userError) return <Alert variant="danger">{userError.message}</Alert>;

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2>User Details</h2>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/users" variant="secondary" className="me-2">
            Back to Users
          </Button>
          <Button as={Link} to={`/users/${id}/edit`} variant="primary">
            Edit User
          </Button>
        </Col>
      </Row>
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <Card.Title>{user.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {user.email}
              </Card.Subtitle>
              <Card.Text>
                <strong>Role:</strong> {user.role}
                <br />
                <strong>Status:</strong>{" "}
                {user.isActive ? (
                  <Badge bg="success">Active</Badge>
                ) : (
                  <Badge bg="secondary">Inactive</Badge>
                )}
              </Card.Text>
            </Col>
            <Col md={4} className="text-md-end">
              <div className="stat-box">
                <h3>{tasks.length}</h3>
                <p>Tasks Assigned</p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <h4 className="mb-3">Assigned Tasks</h4>
      {tasksLoading ? (
        <div>Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <Alert variant="info">No tasks assigned to this user.</Alert>
      ) : (
        <TasksList tasks={tasks} />
      )}
    </div>
  );
};

export default UserDetailsPage;
