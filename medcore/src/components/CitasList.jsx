import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CitasList.css";
import Swal from "sweetalert2";

function MisCitas() {
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    duration: "",
    status: "SCHEDULED",
  }); 
  const [patientId, setPatientId] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [patientError, setPatientError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const token = localStorage.getItem("token");

  //Obtener patientId
  useEffect(() => {
    const fetchPatient = async () => {
      if (!userId || !token) {
        setPatientError("No se pudo obtener el usuario autenticado");
        setLoadingPatient(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:3003/api/v1/users/patients/by-user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("🧍 Paciente cargado:", res.data);
        setPatientId(res.data.id);              // 👈 AQUÍ va el patient.id
        setLoadingPatient(false);
      } catch (err) {
        console.error("Error al obtener paciente:", err.response?.data || err);
        setPatientError("No se encontró un paciente asociado a este usuario");
        setLoadingPatient(false);
      }
    };

    fetchPatient();
  }, [userId, token]);

  // 🔹 Cargar citas
  useEffect(() => {
    if(loadingPatient) return;
    if (patientId) {
      axios
        .get(`http://localhost:3008/api/v1/appointments/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const data =
            res.data.citas || res.data.data || res.data.appointments || [];
          setCitas(Array.isArray(data) ? data : []);
        })
        .catch(() => setError("Error al cargar las citas"));
    }
  }, [token, patientId]);

  // 🔹 Abrir modal de edición
  const handleEditClick = (cita) => {
    const fecha = new Date(cita.appointmentDate);
    setSelectedCita(cita);
    setFormData({
      appointmentDate: fecha.toISOString().split("T")[0],
      appointmentTime: fecha.toTimeString().substring(0, 5),
      reason: cita.reason || "",
      duration: cita.duration || "",
      status: cita.status || "SCHEDULED",
    });
    setShowModal(true);
  };
  

  // 🔹 Guardar cambios
  const handleSaveChanges = async () => {
    try {
      const fullDate = `${formData.appointmentDate}T${formData.appointmentTime}`;
      const newStatus =
        formData.appointmentDate !==
        new Date(selectedCita.appointmentDate).toISOString().split("T")[0]
          ? "RESCHEDULED"
          : formData.status;

      await axios.put(
        `http://localhost:3008/api/v1/appointments/${selectedCita.id}`,
        {
          appointmentDate: fullDate,
          reason: formData.reason,
          duration: formData.duration,
          status: newStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowModal(false);
      alert("✅ Cita actualizada correctamente");
      window.location.reload();
    } catch (err) {
      console.error("❌ Error al actualizar cita:", err);
      alert("Error al guardar los cambios");
    }
  };

  // 🔹 Cancelar cita
  const handleCancel = async (id) => {
    if (window.confirm("¿Deseas cancelar esta cita?")) {
      try {
        await axios.delete(`http://localhost:3008/api/v1/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCitas(citas.filter((c) => c.id !== id));
      } catch (err) {
        console.error(err);
        alert("Error al cancelar la cita");
      }
    }
  };


const handleConfirm = async (appointment) => {
  console.log("APPOINTMENT ENVIADO:", appointment);

  try {
    const token = localStorage.getItem("token");

    if (!appointment.doctorId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Esta cita no tiene doctor asignado. No se puede entrar a la cola.",
      });
      return;
    }

    const res = await axios.post(
      "http://localhost:3008/api/v1/queue/join",
      {
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = res.data?.data || res.data;

    console.log("📌 DATA RECIBIDA DEL JOINQUEUE:", data);

    // 🟢 Guardar ticketId
    if (data.ticketId) {
      localStorage.setItem("ticketId", data.ticketId);
      console.log("🔐 Ticket guardado:", data.ticketId);
    }

    Swal.fire({
      icon: "success",
      title: "¡Cita confirmada!",
      html: `
        <div style="text-align: left; font-size: 16px;">
          <p><b>Ticket:</b> ${data.ticketNumber ?? "N/A"}</p>
          <p><b>Posición actual:</b> ${data.position ?? "N/A"}</p>
          <p><b>Tiempo estimado:</b> ${data.estimatedWaitTime ?? 0} minutos</p>
        </div>
      `,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#3085d6",
    });

  } catch (err) {
    console.log("❌ Error al confirmar / entrar a la cola", err);
    console.log("ERROR API:", err.response?.data);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.response?.data?.error?.message || "No se pudo procesar la solicitud.",
    });
  }
};




  const statusLabels = {
   PROGRAMADA: 'SCHEDULED',
   CANCELADA: 'CANCELLED',
    REAGENDADA: 'RESCHEDULED',
    CONFIRMADA: 'CONFIRMED'
  };

  return (
    <div className="appointments-container">
      <h2 className="title">Mis Citas</h2>

      {error ? (
        <p className="error">{error}</p>
      ) : citas.length === 0 ? (
        <p className="no-data">No tienes citas registradas.</p>
      ) : (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Doctor ID</th>
              <th>Especialidad ID</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Duración (min)</th>
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
                  <td>{cita.doctorname 
                  || cita.doctorContact?.fullName}</td>
                  <td>{cita.specialty?.name ?? cita.specialtyId}</td>
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
                    <button className="btn-icon btn-edit" onClick={() => handleEditClick(cita)} title="Editar">
                      ✏️
                    </button>
                    <button className="btn-icon btn-confirm" onClick={() => handleConfirm(cita)} title="Confirmar">
                      ✅
                    </button>
                    <button className="btn-icon btn-cancel" onClick={() => handleCancel(cita.id)} title="Cancelar">
                      ❌
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* 🔹 Modal de edición */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>✏️ Editar Cita</h3>
            <div className="form-group">
              <label>Fecha:</label>
              <input
                type="date"
                value={formData.appointmentDate}
                onChange={(e) =>
                  setFormData({ ...formData, appointmentDate: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Hora:</label>
              <input
                type="time"
                value={formData.appointmentTime}
                onChange={(e) =>
                  setFormData({ ...formData, appointmentTime: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Duración (min):</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Motivo:</label>
              <textarea
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
              ></textarea>
            </div>
            <div className="modal-buttons">
              <button onClick={handleSaveChanges} className="btn-save">
                Guardar
              </button>
              <button onClick={() => setShowModal(false)} className="btn-close">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MisCitas;
