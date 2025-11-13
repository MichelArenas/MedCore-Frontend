import React, { useState } from "react";
import { FaBars, FaTimes, FaUser, FaNotesMedical, FaCalendarCheck, FaSignOutAlt, FaCalendar, FaVideo, FaClock, FaBell } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../utils/authUtils";
import { getCurrentUser } from "../utils/rbac"; 
import "./Sidebar.css";

function SidebarPatient() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const close = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/"); // redirige al login o landing
  };

  const goToHistory = () => {
    close();
    if (user?.patientId) {
      navigate(`/dashboard/medical-history/${user.patientId}`);
    }
  };

  const goToAppointments = () => {
    close();
    navigate("/ver-citas");
  };

  const goToProfile = () => {
    close();
    navigate("/dashboard/profile");
  };

  const goToSoliciteAppoiments = () => {
    close();
    navigate ("/solicitar-cita")
  };

   const goToVirtualAppoiments = () => {
    close();
    navigate ("/dashboard/viewAppoiments")
  };

   const goToTurns = () => {
    close();
    navigate ("/turns")
  };

   const goToNotifications = () => {
    close();
    navigate ("/dashboard/notifications")
  };


  const isHistoryActive = location.pathname.includes("/dashboard/medical-history");
  const isAppointmentsActive = location.pathname.includes("/dashboard/appointments");
  const isProfileActive = location.pathname.includes("/dashboard/profile");

  return (
    <>
      {/* Botón hamburguesa para pantallas pequeñas */}
      <button
        className="hamburger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir menú"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar principal */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
        <h2 className="sidebar-title">Mi Panel</h2>
        <ul className="sidebar-list">

          <li
            className={`sidebar-item ${isProfileActive ? "active" : ""}`}
            onClick={goToNotifications}
          >
            <FaBell className="icon" />
            <span>Notificaciones</span>
          </li>


          <li
            className={`sidebar-item ${isHistoryActive ? "active" : ""}`}
            onClick={goToHistory}
          >
            <FaNotesMedical className="icon" />
            <span>Historia Médica</span>
          </li>

          <li
            className={`sidebar-item ${isProfileActive ? "active" : ""}`}
            onClick={goToSoliciteAppoiments}
          >
            <FaCalendarCheck className="icon" />
            <span>Solicitar o cancelar cita</span>
          </li>

          <li
            className={`sidebar-item ${isProfileActive ? "active" : ""}`}
            onClick={goToVirtualAppoiments}
          >
            <FaVideo className="icon" />
            <span>Citas virtuales</span>
          </li>

          <li
            className={`sidebar-item ${isProfileActive ? "active" : ""}`}
            onClick={goToTurns}
          >
            <FaClock className="icon" />
            <span>Ver mis turnos</span>
          </li>



          <li
            className={`sidebar-item ${isAppointmentsActive ? "active" : ""}`}
            onClick={goToAppointments}
          >
            <FaCalendar className="icon" />
            <span>Ver Citas</span>
          </li>
          

          <li
            className={`sidebar-item ${isProfileActive ? "active" : ""}`}
            onClick={goToProfile}
          >
            <FaUser className="icon" />
            <span>Mi Perfil</span>
          </li>


          <li className="sidebar-item logout" onClick={handleLogout}>
            <FaSignOutAlt className="icon" />
            <span>Cerrar sesión</span>
          </li>
        </ul>
      </aside>
    </>
  );
}

export default SidebarPatient;
