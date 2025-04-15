import React from "react";
import { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../features/users/usersApis";

const userSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  role: yup.string(),
  password: yup.string().when("$isEdit", {
    is: false,
    then: (schema) =>
      schema
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    otherwise: (schema) => schema,
  }),
});

const UserFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);

  const { data, isLoading } = isEdit
    ? useGetUserQuery(id)
    : { data: null, isLoading: false };

  const user = data?.user;

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: isEdit ? user : {},
    context: { isEdit },
  });

  // Use useEffect to set form values when user data is loaded
  useEffect(() => {
    if (isEdit && user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role || "user",
      });
    }
  }, [isEdit, user, reset]);

  const onSubmit = async (data) => {
    try {
      // Clear any previous errors
      setApiError(null);
      if (isEdit) {
        if (!data.password) {
          const { password, ...userWithoutPassword } = data;
          await updateUser({ id, ...userWithoutPassword }).unwrap();
        } else {
          await updateUser({ id, ...data }).unwrap();
        }
      } else {
        await createUser(data).unwrap();
      }
      navigate("/users");
    } catch (err) {
      // Set the error message from the API
      if (err.data?.message) {
        setApiError(err.data.message);
      } else {
        setApiError("An error occurred while saving the user");
      }
    }
  };

  if (isEdit && isLoading) return <div>Loading...</div>;

  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>{isEdit ? "Edit User" : "Create User"}</Card.Title>
          {/* Display API error if present */}
          {apiError && (
            <Alert variant="danger" className="mt-3 mb-4">
              {apiError}
            </Alert>
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                {...register("name")}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                {...register("email")}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>
            {/* New Password Field */}
            <Form.Group className="mb-3">
              <Form.Label>
                {isEdit ? "Password (leave blank to keep current)" : "Password"}
              </Form.Label>
              <Form.Control
                type="password"
                placeholder={isEdit ? "Enter new password" : "Enter password"}
                {...register("password")}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                value="User"
                disabled
                readOnly
                className="bg-light"
              />
              {/* Hidden field to ensure role is included in form data */}
              <Form.Control type="hidden" {...register("role")} value="user" />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => navigate("/users")}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEdit ? "Update User" : "Create User"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserFormPage;
