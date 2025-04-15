import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import {
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
} from "../features/tasks/tasksApi";
import StatusBadge from "../components/StatusBadge";
// import TasksList from "../components/TasksList";

const HomePage = () => {
  const user = useSelector(selectCurrentUser);
  const { data: tasks = [], isLoading } = useGetTasksQuery({
    assignedTo: user?._id,
  });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus({ id: taskId, status: newStatus }).unwrap();
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>My Tasks</h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="stats-card">
            <Card.Body>
              <Card.Title>Total Tasks</Card.Title>
              <h3>{tasks.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stats-card">
            <Card.Title>In Progress</Card.Title>
            <h3>
              {tasks.filter((task) => task.status === "in-progress").length}
            </h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stats-card">
            <Card.Title>Completed</Card.Title>
            <h3>
              {tasks.filter((task) => task.status === "completed").length}
            </h3>
          </Card>
        </Col>
      </Row>

      {/* <TasksList 
        tasks={tasks} 
        onStatusChange={handleStatusChange}
        showActions={true}
      /> */}
    </Container>
  );
};

export default HomePage;
