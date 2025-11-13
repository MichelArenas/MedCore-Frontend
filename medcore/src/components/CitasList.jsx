import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CitasList.css";

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

  const user = JSON.parse(localStorage.getItem("user"));
  const patientId = user?.id;
  const token = localStorage.getItem("token");

  // 🔹 Cargar citas
  useEffect(() => {
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
  }, [patientId]);

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

  // 🔹 Confirmar cita
  const handleConfirm = async (appointmentId) => {
  try {
    await axios.patch(
      `http://localhost:3008/api/v1/appointments/status/${appointmentId}`,
      { status: "CONFIRMADA" }, // ✅ clave correcta
       { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Cita confirmada correctamente");
  } catch (error) {
    console.error("Error al confirmar cita:", error.response?.data || error);
    alert("No se pudo confirmar la cita");
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
      <h2 className="title">📅 Mis Citas</h2>

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
                  <td>{cita.doctorId}</td>
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
                    <button className="btn-icon btn-edit" onClick={() => handleEditClick(cita)} title="Editar">
                      ✏️
                    </button>
                    <button className="btn-icon btn-confirm" onClick={() => handleConfirm(cita.id)} title="Confirmar">
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
