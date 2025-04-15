import React from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRegisterMutation } from "../features/auth/authApi";
import { useNavigate, Link } from "react-router-dom";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [registerUser, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...registrationData } = data;
      const response = await registerUser(registrationData).unwrap();
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <Container className="auth-container">
      <div className="auth-form">
        <h2 className="text-center mb-4">Register</h2>
        {error && (
          <Alert variant="danger">
            {error.data?.message || "Registration failed"}
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
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              {...register("password")}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              isInvalid={!!errors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
            className="w-100"
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </Form>
        <div className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </Container>
  );
};

export default RegisterPage;
