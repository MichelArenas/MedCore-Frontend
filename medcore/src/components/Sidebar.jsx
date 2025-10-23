import React, { useState } from "react";
import { FaBars, FaTimes, FaCog, FaQuestionCircle, FaPhone, FaSignOutAlt, FaNotesMedical } from "react-icons/fa";
import "./Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../utils/authUtils";
import { getCurrentUser, canSeeHistoryMenu  } from "../utils/rbac"; 

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = getCurrentUser();

  const close = () => setIsOpen(false);

  const handleLogout = () => {
    logout(); // Usa la función centralizada de logout
    navigate("/"); // Redirige al landing page
  };

  const goToHistory = () => {
    // Cierra el panel antes de navegar
    close();

    if (user?.role === "PACIENTE" && user?.patientId) {
      navigate(`/dashboard/medical-history/${user.patientId}`);
      return;
    }

    // DOCTOR / ADMIN → ir al listado de pacientes
    navigate("/dashboard/pacientes?mode=consult");
  };

  const isHistoryActive = location.pathname.startsWith("/dashboard/medical-history") || location.pathname.startsWith("/dashboard/pacientes");

    return (
    <>
      {/* Botón hamburguesa (mobile) */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)} aria-label="Abrir menú">
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
        <h2 className="sidebar-title">Menú</h2>
        <ul className="sidebar-list">
          <li className="sidebar-item" onClick={() => { close(); navigate("/dashboard/configuracion"); }}>
            <FaCog className="icon" /> <span>Configuración</span>
          </li>

          <li className="sidebar-item" onClick={() => { close(); navigate("/dashboard/ayuda"); }}>
            <FaQuestionCircle className="icon" /> <span>Ayuda</span>
          </li>

          <li className="sidebar-item" onClick={() => { close(); navigate("/dashboard/contacto"); }}>
            <FaPhone className="icon" /> <span>Contáctanos</span>
          </li>

          {canSeeHistoryMenu(user) && (
            <li
              className={`sidebar-item ${isHistoryActive ? "active" : ""}`}
              onClick={goToHistory}
            >
              <FaNotesMedical className="icon" /> <span>Historia Clínica</span>
            </li>
          )}

          <li className="sidebar-item logout" onClick={handleLogout}>
            <FaSignOutAlt className="icon" /> <span>Cerrar sesión</span>
          </li>
        </ul>
      </aside>
    </>
  );
}

export default Sidebar;
