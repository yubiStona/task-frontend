import React from "react";
import { Badge } from "react-bootstrap";

const statusColors = {
  todo: "secondary",
  "in-progress": "warning",
  completed: "success",
};

const StatusBadge = ({ status }) => {
  return <Badge bg={statusColors[status]}>{status}</Badge>;
};

export default StatusBadge;
