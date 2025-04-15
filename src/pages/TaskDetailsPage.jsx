import React from "react";
import { Card, Button, Row, Col, Alert, Badge } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useGetTaskQuery } from "../features/tasks/tasksApi";
import StatusBadge from "../components/StatusBadge";

const TaskDetailsPage = () => {
  const { id } = useParams();
  const { data: task, isLoading, error } = useGetTaskQuery(id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">{error.message}</Alert>;

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2>Task Details</h2>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/tasks" variant="secondary" className="me-2">
            Back to Tasks
          </Button>
          <Button as={Link} to={`/tasks/${id}/edit`} variant="primary">
            Edit Task
          </Button>
        </Col>
      </Row>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{task.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            <StatusBadge status={task.status} /> | Due:{" "}
            {new Date(task.dueDate).toLocaleDateString()}
          </Card.Subtitle>
          <Card.Text>{task.description}</Card.Text>
          <div className="task-meta">
            <div>
              <strong>Assigned To:</strong>{" "}
              {task.assignedTo?.name || "Unassigned"}
            </div>
            <div>
              <strong>Created By:</strong> {task.createdBy?.name}
            </div>
            <div>
              <strong>Created At:</strong>{" "}
              {new Date(task.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>Last Updated:</strong>{" "}
              {new Date(task.updatedAt).toLocaleString()}
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TaskDetailsPage;
