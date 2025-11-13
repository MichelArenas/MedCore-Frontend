import { useNavigate } from "react-router-dom";
import "./DashboardMedico.css";
import Sidebar from "./Sidebar";
import logo from "../assets/logo.png";
import DoctorQueueList from "./queue/DoctorQueueList";

function DashboardMedico() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const doctorId = userId;
  return (
    <div className="dashboard-Medico-container">
      {/* 🔹 CABECERA */}
      <header className="dashboard-header-Medico">
        <div className="header-Medico-left">
          <img
            src={logo}
            alt="MedCore Logo"
            className="header-Medico-logo"
          />
        </div>
        <div className="header-Medico-right">
          <Sidebar />
        </div>
      </header>

      {/* 🔹 CONTENIDO PRINCIPAL */}
      <div className="dashboard-Medico-content">

        {/* 🔹 SECCIÓN: SALA DE TURNOS*/}
        <div className="queue-section">
          <div className="queue-section-header">
            <h3>Mi sala de espera de hoy</h3>
            <button
              className="btn-primario"
              onClick={() => navigate(`/doctor/${doctorId}/current`)}
            >
              Ver en pantalla completa
            </button>
          </div>

          {/* Versión compacta de la cola directamente en el dashboard */}
          <DoctorQueueList doctorId={doctorId} compact />
        </div>

        {/* 🔹 SECCIÓN: SERVICIOS MÁS UTILIZADOS */}
        <div className="servicios-section">
          <h3 className="servicios-title">Servicios más utilizados</h3>
          <div className="servicios-grid">
            <div
              className="servicio-card"
              onClick={() => navigate("/solicitar-cita")} // 👈 redirige
            >
              <i className="fas fa-calendar-check icono-servicio"></i>
              <h4>Solicitar o cancelar cita</h4>
              <p>Administra tus citas médicas de forma rápida y sencilla.</p>
            </div>

            <div
              className="servicio-card"
              onClick={() => navigate("/historia-clinica")} // 👈 redirige
            >
              <i className="fas fa-file-medical icono-servicio"></i>
              <h4>Mi historia clínica</h4>
              <p>Consulta tus antecedentes y resultados médicos.</p>
            </div>

            <div
              className="servicio-card"
              onClick={() => navigate("/cita-virtual")} // 👈 redirige
            >
              <i className="fas fa-video icono-servicio"></i>
              <h4>Cita virtual</h4>
              <p>Conéctate con tu especialista desde cualquier lugar.</p>
            </div>
             <div
              className="servicio-card"
              onClick={() => navigate("/ver-citas")} // 👈 redirige
            >
              <i className="fa-solid fa-calendar icono-servicio"></i>
              <h4>Ver mis citas</h4>
              <p>Mira las citas que tienes programadas.</p>
            </div>
           {/*CARD DE TURNOS DEL DOCTOR */}
            <div
              className="servicio-card"
              onClick={() => navigate(`/doctor/${doctorId}/current`)}
            >
              <i className="fa-solid fa-users-line icono-servicio"></i>
              <h4>Sala de espera</h4>
              <p>Gestiona la cola de pacientes y llama al siguiente.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardMedico;
