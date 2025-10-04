import React, { useState } from "react";
import { FaBars, FaTimes, FaCog, FaQuestionCircle, FaPhone, FaSignOutAlt } from "react-icons/fa";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("fullname");
    navigate("/"); // Redirige al landing page
  };

  return (
    <>
      {/* Botón hamburguesa */}
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="sidebar-title">Menú</h2>
        <ul>
          <li>
            <FaCog className="icon" /> Configuración
          </li>
          <li>
            <FaQuestionCircle className="icon" /> Ayuda
          </li>
          <li>
            <FaPhone className="icon" /> Contáctanos
          </li>
          <li onClick={handleLogout} className="logout">
            <FaSignOutAlt className="icon" /> Cerrar sesión
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
