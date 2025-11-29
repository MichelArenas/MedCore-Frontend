import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./CitasList.css";
import Swal from "sweetalert2";
import { queueService } from "../utils/adminService"; // usamos el queueService

function DoctorAppointments() {
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const doctorId = localStorage.getItem("userId"); // O usa useParams si viene por URL
 

  // 🔹 Cargar citas del doctor
  const loadCitas = useCallback(async () => {
    if (!doctorId) return;
    try {
      const res = await axios.get(
        `http://localhost:3008/api/v1/appointments/doctor/${doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data.citas || res.data.data || res.data.appointments || [];
      setCitas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar las citas");
    }
  }, [doctorId, token]);



  useEffect(() => {
    loadCitas();
  }, [loadCitas]);

  // 🔹 Cancelar cita
  const handleCancel = async (id, ticketId) => {
    const { value: reason } = await Swal.fire({
      title: "Cancelar cita",
      input: "text",
      inputLabel: "Motivo de la cancelación",
      inputPlaceholder: "Escribe el motivo aquí...",
      showCancelButton: true,
      inputValidator: (value) => !value && "Debes ingresar un motivo",
    });
    if (!reason) return;

    try {
      // Cancelamos la cita en el backend
      await axios.delete(`http://localhost:3008/api/v1/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { reason },
      });

      // Actualizamos la UI local
      setCitas(citas.map(c => c.id === id ? { ...c, status: "CANCELLED" } : c));

      // 🔹 Remover de la cola si existe
      if (ticketId) {
        await queueService.leaveQueue(ticketId); // simulamos salida de la cola
      }

      Swal.fire({
        icon: "success",
        title: "Cita cancelada",
        text: "La cita se ha cancelado correctamente.",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cancelar la cita.",
      });
    }
  };

  const statusLabels = {
    PROGRAMADA: "SCHEDULED",
    CANCELADA: "CANCELLED",
    REAGENDADA: "RESCHEDULED",
    CONFIRMADA: "CONFIRMED",
  };

  return (
    <div className="appointments-container">
      <h2 className="title">📅 Citas de mis pacientes</h2>

      {error ? (
        <p className="error">{error}</p>
      ) : citas.length === 0 ? (
        <p className="no-data">No hay citas registradas para este doctor.</p>
      ) : (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Especialidad</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Duración</th>
              <th>Motivo</th>
              <th>Notas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => {
              const fecha = new Date(cita.appointmentDate);
              return (
                <tr key={cita.id}>
                  <td>{cita.patientName || cita.patientId}</td>
                  <td>{cita.specialtyId || "N/A"}</td>
                  <td>{fecha.toLocaleDateString()}</td>
                  <td>{fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                  <td>{cita.duration || "-"}</td>
                  <td>{cita.reason || "Sin motivo"}</td>
                  <td>{cita.notes || "-"}</td>
                  <td>
                    <span className={`status-badge status-${cita.status?.toLowerCase()}`}>
                      {statusLabels[cita.status] || cita.status}
                    </span>
                  </td>
                  <td className="actions">
                    {cita.status !== "CANCELLED" && (
                      <button
                        className="btn-icon btn-cancel"
                        onClick={() => handleCancel(cita.id, cita.ticketId)}
                        title="Cancelar"
                      >
                        ❌
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DoctorAppointments;
