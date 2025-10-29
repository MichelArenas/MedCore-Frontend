import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getCurrentUser, canSeeHistoryMenu } from "../utils/rbac";
import logo from "../assets/logo.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./DashboardAdmin.css";
import DashboardStats from "./DashboardStats"

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [counts, setCounts] = useState({
    medicos: 0,
    enfermeros: 0,
    pacientes: 0,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const close = () => setIsOpen(false);

  // 🔹 Obtener conteos dinámicos
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const roles = ["MEDICO", "ENFERMERO", "PACIENTE"];
        const results = await Promise.all(
          roles.map(async (role) => {
            const res = await fetch(
              `http://localhost:3001/api/v1/users/by-role?role=${role}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            const data = await res.json();
            return { role, total: data.total || 0 };
          })
        );

        const newCounts = {
          medicos: results.find((r) => r.role === "MEDICO")?.total || 0,
          enfermeros: results.find((r) => r.role === "ENFERMERO")?.total || 0,
          pacientes: results.find((r) => r.role === "PACIENTE")?.total || 0,
        };

        setCounts(newCounts);
      } catch (error) {
        console.error("Error cargando conteos:", error);
      }
    };

    fetchCounts();
  }, []);

  const goToHistory = () => {
    close();
    if (user?.role === "PACIENTE" && user?.patientId) {
      navigate(`/dashboard/medical-history/${user.patientId}`);
      return;
    }
    navigate("/dashboard/pacientes?mode=consult");
  };

  const isHistoryActive =
    location.pathname.startsWith("/dashboard/medical-history") ||
    location.pathname.startsWith("/dashboard/pacientes");

  return (
    <div className="dashboard-container">
      {/* 🔹 CABECERA */}
      <header className="dashboard-header-administrador">
        <div className="header-administrador-left">
          <img
            src={logo}
            alt="MedCore Logo"
            className="header-administrador-logo"
          />
        </div>

        <div className="header-administrador-right">
          <Sidebar />
        </div>
      </header>

      {/* 🔹 CONTENIDO PRINCIPAL */}
      <div className="dashboard-admin-content">
        <h1 className="title-admin">Bienvenido Administrador</h1>

      <h2 className="conteo-usuarios">Conteo de usuarios</h2>
        {/* 🔸 SECCIÓN DE ESTADÍSTICAS */}
        <div className="stats-container">
          <div className="stat-card">
            <i className="fas fa-user-md"></i>
            <h3>Total médicos</h3>
            <p>{counts.medicos}</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-user-nurse"></i>
            <h3>Total enfermeros</h3>
            <p>{counts.enfermeros}</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-users"></i>
            <h3>Total pacientes</h3>
            <p>{counts.pacientes}</p>
          </div>
        </div>

        <h2 className="acciones">Acciones rápidas</h2>

        <div className="button-group">
          {canSeeHistoryMenu(user) && (
            <button
              className={`card-button ${isHistoryActive ? "active" : ""}`}
              onClick={goToHistory}
            >
              <i className="fas fa-notes-medical"></i> Historia Clínica
            </button>
          )}

          <button
            className="card-button"
            onClick={() => navigate("/register-user")}
          >
            <i className="fas fa-user-plus"></i> Registrar Usuario
          </button>

          <button className="card-button" onClick={() => navigate("")}>
            <i className="fas fa-calendar-check"></i> Citas Médicas
          </button>

        </div>
        <h2 className="estadisticas">Tendencias y estadísticas</h2>
         <DashboardStats />
      </div>
    </div>
  );
}

export default Dashboard;
