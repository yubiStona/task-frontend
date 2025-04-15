import React, { useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../features/tasks/tasksApi";
import { useGetUsersQuery } from "../features/users/usersApis";
const taskSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  status: yup
    .string()
    .oneOf(["todo", "in-progress", "completed"])
    .default("todo")
    .required("task status is required"),
  assignedTo: yup.string().required("Assigned user is required"),
});

const TaskFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: task, isLoading: taskLoading } = isEdit
    ? useGetTaskQuery(id)
    : { data: null, isLoading: false };
  const { data, isLoading: usersLoading } = useGetUsersQuery();
  const users = data?.users || [];

  const regularUser = users.filter((user) => user.role != "admin");

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(taskSchema),
  });

  useEffect(() => {
    if (isEdit && task) {
      reset({
        ...task,
        assignedTo: task.assignedTo?._id || "",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [isEdit, task, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateTask({ id, ...data }).unwrap();
      } else {
        await createTask({ ...data, status: "todo" }).unwrap();
      }
      navigate("/tasks");
    } catch (err) {
      console.error("Failed to save task:", err);
    }
  };

  if (taskLoading || usersLoading) return <div>Loading...</div>;

  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>{isEdit ? "Edit Task" : "Create Task"}</Card.Title>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                {...register("title")}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                {...register("description")}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  {isEdit ? (
                    // Show all status options for editing existing tasks
                    <Form.Select
                      {...register("status")}
                      isInvalid={!!errors.status}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </Form.Select>
                  ) : (
                    // For new tasks, only allow "todo" status
                    <Form.Control
                      type="text"
                      value="todo"
                      readOnly
                      className="bg-light"
                    />
                  )}
                  <Form.Control.Feedback type="invalid">
                    {errors.status?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Assigned To</Form.Label>
                  <Form.Select
                    {...register("assignedTo")}
                    isInvalid={!!errors.assignedTo}
                  >
                    <option value="">Select user</option>
                    {regularUser.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.assignedTo?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => navigate("/tasks")}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEdit ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TaskFormPage;
