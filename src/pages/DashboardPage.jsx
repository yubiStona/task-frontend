import React from "react";
import { Row, Col } from "react-bootstrap";
import Card from "../components/Card";
import { useGetTasksQuery } from "../features/tasks/tasksApi";
import { useGetUsersQuery } from "../features/users/usersApis";
import { useAuthErrorHandler } from "../app/useAuthErrorHandler";

const DashboardPage = () => {
  const {
    data: tasks = [],
    isLoading: tasksLoading,
    error,
  } = useGetTasksQuery();
  const {
    data,
    isLoading: usersLoading,
    error: tasksError,
  } = useGetUsersQuery();
  const users = data?.users || [];

  useAuthErrorHandler(tasksError);

  if (tasksLoading || usersLoading) return <div>Loading...</div>;
  const todoTasks = tasks.filter((task) => task.status === "todo").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <Row className="mb-4">
        <Col md={4}>
          <Card
            title="Total Tasks"
            value={tasks.length}
            icon="tasks"
            variant="primary"
          />
        </Col>
        <Col md={4}>
          <Card
            title="To Do"
            value={todoTasks}
            icon="clock"
            variant="secondary"
          />
        </Col>
        <Col md={4}>
          <Card
            title="In Progress"
            value={inProgressTasks}
            icon="spinner"
            variant="warning"
          />
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card
            title="Completed"
            value={completedTasks}
            icon="check-circle"
            variant="success"
          />
        </Col>
        <Col md={4}>
          <Card
            title="Total Users"
            value={users.length}
            icon="users"
            variant="info"
          />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
