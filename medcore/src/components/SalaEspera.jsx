import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./SalaEspera.css";

function SalaDeEspera() {
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState("");
  const [ticketInfo, setTicketInfo] = useState({});
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const patientId = user?.id;

  // Cargar citas confirmadas
  useEffect(() => {
    if (patientId) {
      axios
        .get(`http://localhost:3008/api/v1/appointments/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const data = res.data.citas || res.data.data || res.data.appointments || [];
          const confirmadas = (Array.isArray(data) ? data : []).filter(
            (cita) => cita.status === "CONFIRMED"
          );
          setCitas(confirmadas);
        })
        .catch(() => setError("Error al cargar las citas"));
    }
  }, [patientId, token]);

  // Unirse a la cola
  async function unirseACola(doctorId, appointmentId) {
    try {
      const res = await axios.post(
        "http://localhost:3008/api/v1/queue/join",
        { doctorId, appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data?.data;

      setTicketInfo((prev) => ({
        ...prev,
        [appointmentId]: data
      }));

      Swal.fire({
        icon: "success",
        title: "¡Te has unido a la cola!",
        html: `
          🎟️ Ticket: ${data.ticketNumber} <br/>
          📍 Posición: ${data.position} <br/>
          ⏳ Espera estimada: ${data.estimatedWaitTime} min
        `,
        confirmButtonText: "Ok"
      });
    } catch (error) {
      console.error("Error al unirse a la cola:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo unir a la cola. Intenta de nuevo."
      });
    }
  }

  // Formatear fecha
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    const fechaIso = fechaStr.replace(" ", "T");
    const fecha = new Date(fechaIso);
    if (isNaN(fecha)) return fechaStr;

    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(fecha);
  };

  return (
    <div className="sala-espera">
      <h2>🩺 Mis citas confirmadas</h2>
      {error && <p className="alerta">{error}</p>}
      {citas.length === 0 ? (
        <p>No tienes citas confirmadas.</p>
      ) : (
        <ul className="lista-citas">
          {citas.map((cita) => {
            const info = ticketInfo[cita.id];
            return (
              <li key={cita.id} className="card-cita">
                <div>
                  <h3>Doctor ID: {cita.doctorId}</h3>
                  <p>Especialidad: {cita.specialty?.nombre || "-"}</p>
                  <p>Fecha: {formatearFecha(cita.date)}</p>
                  {info && <p>Estado del turno: {info.status}</p>}
                </div>
                {!info ? (
                  <button
                    className="btn-join"
                    onClick={() => unirseACola(cita.doctorId, cita.id)}
                  >
                    Unirme a la cola
                  </button>
                ) : (
                  <div className="ticket-info">
                    <p>🎟️ Ticket #{info.ticketNumber}</p>
                    <p>📍 Posición: {info.position}</p>
                    <p>⏳ Espera estimada: {info.estimatedWaitTime} min</p>
                    {info.duplicate && <p className="alerta">Ya estás en la cola</p>}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SalaDeEspera;
