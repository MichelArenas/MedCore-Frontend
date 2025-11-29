import { useNavigate } from "react-router-dom";
import "./DashboardMedico.css";
import Sidebar from "./SidesbarMedico";
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
          <img src={logo} alt="MedCore Logo" className="header-Medico-logo" />
        </div>
        <div className="header-Medico-right">
          <Sidebar />
        </div>
      </header>

      {/* 🔹 CONTENIDO PRINCIPAL */}
      <div className="dashboard-Medico-content">
        <h1 className="title-Medico">Bienvenido Enfermero</h1>
        </div>

        {/* 🔹 SECCIÓN: SERVICIOS MÁS UTILIZADOS */}

        <div className="servicios-section">
          <h3 className="servicios-title">Acciones rapidas</h3>
          <div className="servicios-grid">
            <div
              className="servicio-card"
              onClick={() => navigate("/dashboard/pacientes?mode=consult")}
              style={{ cursor: "pointer" }} // indica que es clickeable
            >
              <div className="icon-wrapper">
                <i className="fa-solid fa-user icono-servicio"></i>
              </div>
              <div className="card-content">
                <h4>Pacientes programados</h4>
                <p>Ver pacientes.</p>
              </div>
            </div>

            <div
              className="servicio-card"
              onClick={() => navigate("/cita-virtual")} // 👈 redirige
            >
              <i className="fas fa-tasks icono-servicio"></i>
              <h4>Tareas</h4>
              <p>Mira tus tareas de hoy.</p>
            </div>
            <div
              className="servicio-card"
              onClick={() => navigate("/citas-doctor")} // 
            >
              <i className="fas fa-notes-medical icono-servicio"></i>
              <h4>Ver historia clinica</h4>
              <p>Mira la historia clinica de los pacientes.</p>
            </div>
           {/*CARD DE TURNOS DEL DOCTOR */}
            <div
              className="servicio-card"
              onClick={() => navigate(`/doctor/${doctorId}/current`)}
            >
              <i className="fa-solid fa-calendar fa-users-line icono-servicio"></i>
              <h4>Ver mis turnos</h4>
              <p>Mira tus turnos programados</p>
            </div>
          </div>
        </div>
      </div>
  
  )
}


export default DashboardMedico
