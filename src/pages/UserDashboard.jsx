// UserDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Toast,
} from "react-bootstrap";
import { useNavigate, Navigate } from "react-router-dom";
import "../UserDashboard.css";
import {
  useGetMyTasksQuery,
  useUpdateTaskStatusMutation,
} from "../features/tasks/tasksApi";
import { selectCurrentUser, logout } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const currentUser = useSelector(selectCurrentUser);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [user, setUser] = useState({
    name: currentUser?.name,
    email: currentUser?.email,
  });

  const { data: apiTasks, isLoading, error } = useGetMyTasksQuery();

  useEffect(() => {
    if (error && error.status === 404) {
      // Handle "No tasks found" as an empty array, not an error
      setTasks([]);
      setFilteredTasks([]);
    } else if (error && error.status === 401) {
      dispatch(logout());
      navigate("/login");
    }
  }, [error]);

  useEffect(() => {
    if (apiTasks) {
      // Transform API tasks to match your component's expected format
      const formattedTasks = apiTasks.map((task) => ({
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        assignedBy: {
          name: task.assignedBy?.name || "Admin",
        },
        createdAt: task.createdAt,
        completedAt: task.status === "completed" ? task.updatedAt : null,
      }));
      setTasks(formattedTasks);
      setFilteredTasks(formattedTasks);
    }
  }, [apiTasks]);

  // Filter tasks based on status
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredTasks(
        tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredTasks(
        tasks.filter(
          (task) =>
            task.status === activeFilter &&
            (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              task.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }
  }, [activeFilter, tasks, searchTerm]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const originalTask = tasks.find((task) => task.id === taskId);

      // Optimistically update the task status in the local state
      // Optimistically update the UI
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: newStatus,
                completedAt:
                  newStatus === "completed"
                    ? new Date().toISOString()
                    : task.completedAt,
              }
            : task
        )
      );

      await updateTaskStatus({ id: taskId, status: newStatus }).unwrap();
    } catch (err) {
      alert("Failed to update task status. Please try again.");
      // Revert the optimistic update on error
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? originalTask : task))
      );
    }

    // Show feedback to user in a real app
    setToastMessage(`task Status updated to ${newStatus}`);
    setShowToast(true);
  };

  const handleLogout = async () => {
    dispatch(logout());
    navigate("/login");
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "todo":
        return "secondary";
      case "in-progress":
        return "primary";
      case "completed":
        return "success";
      default:
        return "info";
    }
  };

  const toggleTaskDetails = (taskId) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(taskId);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboard-container">
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">TaskManager</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#" onClick={() => setActiveFilter("all")}>
                All Tasks
              </Nav.Link>
              <Nav.Link href="#" onClick={() => setActiveFilter("todo")}>
                To Do
              </Nav.Link>
              <Nav.Link href="#" onClick={() => setActiveFilter("in-progress")}>
                In-Progress
              </Nav.Link>
              <Nav.Link href="#" onClick={() => setActiveFilter("completed")}>
                Completed
              </Nav.Link>
            </Nav>
            <Toast
              onClose={() => setShowToast(false)}
              show={showToast}
              delay={3000}
              autohide
              style={{ position: "absolute", top: 20, right: 20 }}
            >
              <Toast.Header>
                <strong className="me-auto">Status Update</strong>
              </Toast.Header>
              <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search tasks..."
                className="me-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form>
            <Nav>
              <NavDropdown
                title={
                  <div className="d-inline">
                    <span className="ms-2 text-white">{user.name}</span>
                  </div>
                }
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Row className="mb-4">
          <Col>
            <h1>
              {activeFilter === "all"
                ? "All Tasks"
                : activeFilter === "todo"
                ? "To Do"
                : activeFilter === "in-progress"
                ? "In-Progress"
                : "Completed Tasks"}
            </h1>
          </Col>
        </Row>

        <div className="task-status-filters mb-4">
          <Button
            variant={activeFilter === "all" ? "primary" : "outline-primary"}
            className="me-2"
            onClick={() => setActiveFilter("all")}
          >
            All Tasks ({tasks.length})
          </Button>
          <Button
            variant={
              activeFilter === "todo" ? "secondary" : "outline-secondary"
            }
            className="me-2"
            onClick={() => setActiveFilter("todo")}
          >
            To Do ({tasks.filter((t) => t.status === "todo").length})
          </Button>
          <Button
            variant={
              activeFilter === "in-progress" ? "primary" : "outline-primary"
            }
            className="me-2"
            onClick={() => setActiveFilter("in-progress")}
          >
            In-Progress (
            {tasks.filter((t) => t.status === "in-progress").length})
          </Button>
          <Button
            variant={
              activeFilter === "completed" ? "success" : "outline-success"
            }
            onClick={() => setActiveFilter("completed")}
          >
            Completed ({tasks.filter((t) => t.status === "completed").length})
          </Button>
        </div>

        {isLoading && (
          <div className="text-center my-5">
            <h3>Loading tasks...</h3>
          </div>
        )}

        {/* Display error message (but keep layout intact) */}
        {error && error.status !== 404 && (
          <div className="text-center my-5 alert alert-danger">
            <p>
              {error.data?.message ||
                "An error occurred while loading your tasks."}
            </p>
          </div>
        )}

        {filteredTasks.length === 0 ? (
          <div className="text-center my-5">
            <h3>No tasks found</h3>
            <p>
              There are no tasks matching your current filter or search
              criteria.
            </p>
          </div>
        ) : (
          <Row className="task-card-container">
            {filteredTasks.map((task) => (
              <Col md={6} lg={4} className="mb-4" key={task.id}>
                <Card
                  className={`task-card ${
                    task.status === "completed" ? "completed-task" : ""
                  } ${expandedTaskId === task.id ? "expanded-card" : ""}`}
                >
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <Badge
                      bg={getStatusBadgeColor(task.status)}
                      className="text-uppercase"
                    >
                      {task.status}
                    </Badge>
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>{task.title}</Card.Title>

                    {expandedTaskId === task.id && (
                      <div className="task-expanded-content">
                        <Card.Text>{task.description}</Card.Text>

                        <div className="assigned-by mb-3">
                          <small className="text-muted">Assigned by:</small>
                          <div className="d-flex align-items-center mt-1">
                            <span>{task.assignedBy.name}</span>
                          </div>
                        </div>

                        <div className="task-dates mb-3">
                          <div>
                            <small className="text-muted">Created: </small>
                            {formatDate(task.createdAt)}
                          </div>
                          {task.status === "completed" && task.completedAt && (
                            <div>
                              <small className="text-muted">Completed: </small>
                              {formatDate(task.completedAt)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {expandedTaskId !== task.id && (
                      <div className="assigned-by-compact d-flex align-items-center">
                        <small className="text-muted me-2">Assigned by:</small>
                        <span className="small">{task.assignedBy.name}</span>
                      </div>
                    )}
                  </Card.Body>
                  <Card.Footer>
                    <div className="d-flex justify-content-between">
                      <Button
                        variant={
                          expandedTaskId === task.id
                            ? "outline-secondary"
                            : "outline-primary"
                        }
                        size="sm"
                        className="me-2"
                        onClick={() => toggleTaskDetails(task.id)}
                      >
                        {expandedTaskId === task.id
                          ? "Hide Details"
                          : "View Details"}
                      </Button>

                      {task.status === "todo" && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            handleStatusChange(task.id, "in-progress")
                          }
                        >
                          Start Task
                        </Button>
                      )}

                      {task.status === "in-progress" && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleStatusChange(task.id, "completed")
                          }
                        >
                          Complete Task
                        </Button>
                      )}

                      {/* Completed tasks now have no status change option */}
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default UserDashboard;
