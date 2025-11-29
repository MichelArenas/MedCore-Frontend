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
        <h1 className="title-Medico">Bienvenido Medico</h1>

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
                <h4>Pacientes</h4>
                <p>Ver pacientes y documentos clínicos.</p>
              </div>
            </div>

            <div
              className="servicio-card"
              onClick={() => navigate("/cita-virtual")} // 👈 redirige
            >
              <i className="fas fa-video icono-servicio"></i>
              <h4>Cita virtual</h4>
              <p>Conéctate con tus pacientes.</p>
            </div>
            <div
              className="servicio-card"
              onClick={() => navigate("/citas-doctor")} // 
            >
              <i className="fa-solid fa-calendar icono-servicio"></i>
              <h4>Citas programadas</h4>
              <p>Mira o cancela las citas que tienes programadas.</p>
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
  
  )
}


export default DashboardMedico
