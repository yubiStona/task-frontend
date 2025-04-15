import React from "react";
import { Card as BootstrapCard } from "react-bootstrap";

const Card = ({ title, value, icon, variant = "primary" }) => {
  return (
    <BootstrapCard className="stat-card">
      <BootstrapCard.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-2">{title}</h6>
            <h3>{value}</h3>
          </div>
          <div className={`icon-circle bg-${variant}`}>
            <i className={`fas fa-${icon} text-white`}></i>
          </div>
        </div>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
};

export default Card;
