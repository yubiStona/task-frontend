import React from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useGetTasksQuery } from "../features/tasks/tasksApi";
// import TasksList from "../components/TasksList";

const ProfilePage = () => {
  const user = useSelector(selectCurrentUser);
  const { data: tasks = [], isLoading } = useGetTasksQuery({
    assignedTo: user?._id,
  });

  if (!user) return null;
  if (isLoading) return <div>Loading...</div>;

  const userTasks = tasks.filter(
    (task) => task.assignedTo === user._id || task.createdBy === user._id
  );

  return (
    <div>
      <h2 className="mb-4">Profile</h2>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{user.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {user.email}
          </Card.Subtitle>
          <Card.Text>Role: {user.role}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfilePage;
