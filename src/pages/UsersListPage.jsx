import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Form,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../features/users/usersApis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuthErrorHandler } from "../app/useAuthErrorHandler";

const UsersListPage = () => {
  const { data, isLoading, error } = useGetUsersQuery();
  const allUsers = data?.users || [];
  useAuthErrorHandler(error);
  // Filter out admin users to only show regular users
  const users = allUsers.filter((user) => user.role !== "admin");

  const [deleteUser] = useDeleteUserMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
      } catch (err) {
        alert("Failed to delete the user");
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">{error.data?.message}</Alert>;

  return (
    <Container>
      <Row className="mb-4 align-items-center">
        <Col>
          <h2>Users</h2>
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/users/new" variant="primary">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add User
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Button
                  as={Link}
                  to={`/users/${user._id}/edit`}
                  variant="info"
                  size="sm"
                  className="me-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(user._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UsersListPage;
