import React, { useState } from "react";
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Form,
  Alert,
  Card,
} from "react-bootstrap";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useGetTasksQuery,
  useDeleteTaskMutation,
} from "../features/tasks/tasksApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import StatusBadge from "../components/StatusBadge";
import { useAuthErrorHandler } from "../app/useAuthErrorHandler";

const TasksListPage = () => {
  const [filters, setFilters] = useState({
    status: "",
    searchTerm: "",
  });
  const { data, isLoading, error } = useGetTasksQuery(filters);
  const tasks = data || [];
  const [filteredTasks, setFilteredTasks] = useState([]);
  useAuthErrorHandler(error);
  const [deleteTask] = useDeleteTaskMutation();

  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      setFilteredTasks([]);
      return;
    }

    let result = [...tasks];

    // Filter by status
    if (filters.status) {
      result = result.filter((task) => task.status === filters.status);
    }

    if (filters.searchTerm) {
      const searchTermLower = filters.searchTerm.toLowerCase();
      result = result.filter((task) =>
        task.assignedTo?.name?.toLowerCase().includes(searchTermLower)
      );
    }

    // Default sort by name
    result.sort((a, b) => a.title.localeCompare(b.title));

    setFilteredTasks(result);
  }, [tasks, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id).unwrap();
      } catch (err) {
        alert("Failed to delete the task");
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Container>
      <Row className="mb-4 align-items-center">
        <Col>
          <h2>Tasks</h2>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/tasks/new" variant="primary">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Task
          </Button>
        </Col>
      </Row>
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Search assignee</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                  <Form.Control
                    type="text"
                    name="searchTerm"
                    placeholder="Enter assignee name..."
                    value={filters.searchTerm}
                    onChange={handleFilterChange}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {filteredTasks.length === 0 && !isLoading ? (
        <Alert variant="info">No match found for your search criteria</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description.substring(0, 50)}...</td>
                <td>
                  <StatusBadge status={task.status} />
                </td>
                <td>{task.assignedTo?.name || "Unassigned"}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/tasks/${task._id}/edit`}
                    variant="info"
                    size="sm"
                    className="me-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(task._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {error && <Alert variant="danger">{error.data?.message}</Alert>}
    </Container>
  );
};

export default TasksListPage;
