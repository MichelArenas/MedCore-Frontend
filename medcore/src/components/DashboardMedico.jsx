import { useNavigate } from "react-router-dom"
import "./DashboardMedico.css"
import Sidebar from "./SidesbarMedico"
import logo from "../assets/logo.png"
import "@fortawesome/fontawesome-free/css/all.min.css"
import CalendarioMedico from "./CalendarioMedico"
import CheckList from "./CheckList"
import { logout } from "../utils/authUtils"

function DashboardMedico() {
  const navigate = useNavigate()
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

      <div className="tareas-section">
  <h1 className="servicios-title">Tus tareas</h1>

  <div className="tareas-calendario">
    {/* 🔹 Checklist a la derecha */}
    <div className="tareas-list">
      <CheckList />
    </div>
     {/* 🔹 Calendario pequeño a la izquierda */}
    <div className="tareas-calendar">
      <CalendarioMedico />
    </div>
  </div>
</div>

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
              onClick={() => navigate("/ver-citas")} // 
            >
              <i className="fa-solid fa-calendar icono-servicio"></i>
              <h4>Citas programadas</h4>
              <p>Mira o cancela las citas que tienes programadas.</p>
            </div>

             <div
              className="servicio-card"
              onClick={() => navigate("/ver-turnos")} //
            >
              <i className="fa-solid fa-clock icono-servicio"></i>
              <h4>Turnos de hoy</h4>
              <p>Llama a tu proximo paciente de hoy.</p>
            </div>

          </div>
        </div>
      </div>
  
  )
}

export default DashboardMedico
