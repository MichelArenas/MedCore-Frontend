import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 importamos para navegación
import Sidebar from "../components/SidesbarPaciente";
import logo from "../assets/logo.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./DashboardPaciente.css";
import CalendarioCitas from "./CalendarioCitas";

function DashboardPaciente() {
  const [user, setUser] = useState(null);
  const [citas, setCitas] = useState([]);
  const fullname = localStorage.getItem("fullname") || "Paciente";
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate(); // 👈 inicializamos el hook

   useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3003/api/v1/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error obteniendo datos del usuario:", error);
      }
    };
    fetchUser();

    // 🔹 Por ahora simulamos citas ficticias
    const citasFicticias = [
      {
        id: 1,
        fechaHora: "2025-11-09T08:30:00",
        doctor: "Dra. María López",
        tipo: "Cita presencial",
      },
      {
        id: 2,
        fechaHora: "2025-11-09T15:00:00",
        doctor: "Dr. Juan Martínez",
        tipo: "Cita virtual",
      },
    ];
    setCitas(citasFicticias);
  }, [userId]);


  return (
    <div className="dashboard-paciente-container">
      {/* 🔹 CABECERA */}
      <header className="dashboard-header-paciente">
        <div className="header-paciente-left">
          <img
            src={logo}
            alt="MedCore Logo"
            className="header-paciente-logo"
          />
        </div>
        <div className="header-paciente-right">
          <Sidebar />
        </div>
      </header>

      {/* 🔹 CONTENIDO PRINCIPAL */}
      <div className="dashboard-paciente-content">
        {/* 🔸 Card de nombre */}
        <div className="card-nombre-paciente">
          <img
            src={localStorage.getItem("profileImage") || "/default-avatar.png"}
            alt="Foto de perfil"
            className="foto-perfil"
          />
          <div className="nombre">
            <h2 className="titulo-nombre">Bienvenido(a)</h2>
            <p className="nombre-usuario">{fullname}</p>
          </div>
        </div>

        {/* 🔸 Info + Calendario */}
        <div className="contenedor-info">
          <div className="info-card">
            <h3>Mi información</h3>
            {user ? (
              <div className="info-grid">
                <div>
                  <p><strong>Nombre:</strong> {user.fullname}</p>
                  <p><strong>Edad:</strong> {user.age}</p>
                  <p><strong>Sexo:</strong> {user.gender}</p>
                </div>
                <div>
                  <p><strong>Celular:</strong> {user.phone}</p>
                  <p><strong>Correo:</strong> {user.email}</p>
                  <p><strong>Ciudad:</strong> {user.city}</p>
                </div>
              </div>
            ) : (
              <p>Cargando información...</p>
            )}
          </div>

          <div className="calendar-card">
            <CalendarioCitas />
          </div>
        </div>


          {/* 🔹 NUEVA CARD DE RECORDATORIOS */}
        <div className="recordatorios-card">
          <h3>Recordatorios de citas (próximas 24 horas)</h3>
          {citas.length > 0 ? (
            <ul className="lista-citas">
              {citas.map((cita) => (
                <li key={cita.id}>
                  <strong>{new Date(cita.fechaHora).toLocaleString()}</strong><br />
                  Doctor: {cita.doctor}<br />
                  Tipo: {cita.tipo}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes citas próximas.</p>
          )}
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
              <h4>Solicitar cita</h4>
              <p>Solicita tus citas médicas de forma rápida y sencilla.</p>
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
              onClick={() => navigate("/turno-virtual")} 
            >
              <i className="fa-solid fa-hourglass-half icono-servicio"></i>
              <h4>Sala de espera virtual</h4>
              <p>Pide tu turno y unete a la cola.</p>
            </div>
             <div
              className="servicio-card"
              onClick={() => navigate("/ver-citas")} 
            >
              <i className="fa-solid fa-calendar icono-servicio"></i>
              <h4>Ver mis citas</h4>
              <p>Mira o cancela las citas que tienes programadas .</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPaciente;
