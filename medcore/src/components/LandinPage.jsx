import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandinPage.css";
import logo from "../assets/logo.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="landing-container">
      <div className="landing-card">
        {/* Logo */}
        <img src={logo} alt="MedCore Logo" className="landing-logo" />

        {/* Lema */}
        <p className="landing-subtitle">“Cuidamos tu vida con el corazón.”</p>

        {/* Botón */}
        <button onClick={goToLogin} className="landing-button">
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
