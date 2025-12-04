// src/components/DashboardPatientsList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./DashboardPatientsList.css";
import Swal from "sweetalert2";

function DashboardPatientsList() {
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sp] = useSearchParams();
  const mode = sp.get("mode") || "admin";
  const navigate = useNavigate();
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const userId = localStorage.getItem("userId");

  const fetchPacientes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3003/api/v1/users/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al obtener pacientes");

      const data = await response.json();
      console.log("Respuesta de pacientes:", data);
      
      const raw = Array.isArray(data) ? data : data.patients || data.users || [];
      console.log("Pacientes encontrados:", raw.length);
      
      const list = raw.map((p) => {
        if (p.user) {
          return {
            id: p.userId || p.id || p._id,
            patientId: p.id,
            fullname: p.user.fullname || "",
            email: p.user.email || "",
            id_type: p.documentType || "",
            id_number: p.documentNumber || "",
            age: p.age || p.user.age || "",
            gender: p.gender || p.user.gender || "",
            phone: p.phone || p.user.phone || "",
            address: p.address || p.user.address || "",
            city: p.city || p.user.city || "",
            status: p.status || p.user.status || "",
            _original: p,
          };
        }
        console.log('[PatientsList] normalizados =', list.map(p => ({
          patientId: p.patientId, userId: p.userId, fullname: p.fullname
        })));

        return {
          id: p.id || p._id,
          patientId: p.id,
          fullname: p.fullname || "",
          email: p.email || "",
          id_type: p.id_type || "",
          id_number: p.id_number || "",
          age: p.age || "",
          gender: p.gender || "",
          phone: p.phone || "",
          address: p.address || "",
          city: p.city || "",
          status: p.status || "",
          _original: p,
        };
      });
      console.log("Pacientes normalizados:", list);

      setPacientes(list);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los pacientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "DISABLE" : "ACTIVE";
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3003/api/v1/users/${userId}/toggle-status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        Swal.fire({
          icon: "warning",
          title: "⚠️ Acción no permitida",
          text: data.message || "No se pudo cambiar el estado del usuario.",
        });
        return;
      }

      setPacientes((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, status: newStatus } : p))
      );

      Swal.fire({
        icon: "success",
        title: "✅ Estado actualizado",
        showConfirmButton: false,
        timer: 1800,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "💥 Error inesperado",
        text: "Ocurrió un problema al actualizar el estado.",
      });
    }
  };

  const handleDeletePatient = async (userId, email) => {
    const result = await Swal.fire({
      title: `¿Eliminar paciente?`,
      text: `Se eliminará completamente el paciente con correo: ${email}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3003/api/v1/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al eliminar paciente");

      setPacientes(prev => prev.filter(p => p.id !== userId));

      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: data.message,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
    }
  };

  const handleEditPatient = async (patient) => {
    console.log("Paciente a editar:", patient);

    const { value: formValues } = await Swal.fire({
      title: `Editar Paciente`,
      html: `
        <input id="swal-fullname" class="swal2-input" placeholder="Nombre completo" value="${patient.fullname || ''}">
        <input id="swal-email" class="swal2-input" placeholder="Correo electrónico" value="${patient.email || ''}">
        <input id="swal-phone" class="swal2-input" placeholder="Teléfono" value="${patient.phone || ''}">
        <input id="swal-address" class="swal2-input" placeholder="Dirección" value="${patient.address || ''}">
        <input id="swal-city" class="swal2-input" placeholder="Ciudad" value="${patient.city || ''}">
        <select id="swal-gender" class="swal2-select">
          <option value="">Seleccionar género</option>
          <option value="MASCULINO" ${patient.gender === "MASCULINO" ? "selected" : ""}>Masculino</option>
          <option value="FEMENINO" ${patient.gender === "FEMENINO" ? "selected" : ""}>Femenino</option>
          <option value="OTRO" ${patient.gender === "OTRO" ? "selected" : ""}>Otro</option>
        </select>
      `,
      confirmButtonText: "Guardar cambios",
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => ({
        fullname: document.getElementById("swal-fullname").value,
        email: document.getElementById("swal-email").value,
        phone: document.getElementById("swal-phone").value,
        address: document.getElementById("swal-address").value,
        city: document.getElementById("swal-city").value,
        gender: document.getElementById("swal-gender").value,
      }),
    });

    if (!formValues) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3003/api/v1/users/patients/${patient.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        Swal.fire({
          icon: "warning",
          title: "⚠️ No se pudo actualizar",
          text: data.message || "Ocurrió un error al actualizar.",
        });
        return;
      }

      setPacientes((prev) =>
        prev.map((p) => (p.id === patient.id ? { ...p, ...formValues } : p))
      );

      Swal.fire({
        icon: "success",
        title: "✅ Paciente actualizado",
        showConfirmButton: false,
        timer: 1800,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: "No se pudieron guardar los cambios.",
      });
    }
  };

  const handleShowPatientInfo = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3003/api/v1/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setPatientInfo(data);
      setShowInfo(true);
    } catch (err) {
      console.error("Error cargando info paciente", err);
    }
  };

  if (loading) return <p className="loading">Cargando pacientes...</p>;
  if (error) return <p className="error">{error}</p>;

  const pacientesFiltrados = pacientes.filter(
    (p) =>
      (p.fullname || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.id_number || "").toString().includes(busqueda)
  );

  const fetchPatientInfo = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3003/api/v1/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPatientInfo(data);
      setShowInfo(true);
    } catch (error) {
      console.error("Error al obtener información del paciente:", error);
    }
  };

  // Acciones por fila según modo
  const renderActions = (p) => {
    if (mode === "consult") {
      const userId = p.id;
      const infoModal = showInfo && patientInfo ? (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-btn" onClick={() => setShowInfo(false)}>X</button>

            <h3>Información del Paciente</h3>
            <div className="info-grid">
              <div>
                <p><strong>Nombre:</strong> {patientInfo.fullname}</p>
                <p><strong>Edad:</strong> {patientInfo.age}</p>
                <p><strong>Sexo:</strong> {patientInfo.gender}</p>
              </div>

              <div>
                <p><strong>Correo:</strong> {patientInfo.email}</p>
                <p><strong>Celular:</strong> {patientInfo.phone}</p>
                <p><strong>Ciudad:</strong> {patientInfo.city}</p>
              </div>

              <div>
                <p><strong>Direccion:</strong> {patientInfo.address}</p>
                <p><strong>Estado:</strong> {patientInfo.status}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null;

      return (
        <div className="actions">
          <button 
            className="btn-icon btn-primary" 
            onClick={() => userId && navigate(`/dashboard/medical-history/${userId}`)}
            title="Ver Historia Clínica"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </button>
          
          <button 
            className="btn-icon btn-secondary" 
            onClick={() => userId && navigate(`/dashboard/medical-history/new?patientId=${userId}`)}
            title="Nueva Historia Clínica"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          
          <button 
            className="btn-icon btn-info" 
            onClick={() => userId && navigate(`/dashboard/documents/${userId}`)}
            title="Ver Documentos"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13,2 13,9 20,9"/>
            </svg>
          </button>

          {/* NUEVO BOTÓN: Ver Prescripciones */}
          <button 
            className="btn-icon btn-success" 
            onClick={() => {
              console.log('ID enviado a prescripciones:', userId);
              userId && navigate(`/dashboard/prescriptions/${userId}`);
            }}
            title="Ver Prescripciones"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/>
              <path d="M14 8H8m6 4H8"/>
            </svg>
          </button>

          <button
            className="btn-icon btn-info"
            onClick={() => handleShowPatientInfo(p.id)}
            title="Ver Información del Paciente"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="8" />
            </svg>
          </button>

          {infoModal}
        </div>
      );
    }

    // modo admin
    return (
      <div className="actions">
        <button 
          className="btn-icon btn-warning" 
          onClick={() => handleEditPatient(p)}
          title="Editar Paciente"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>

        <button
          className="btn-icon delete-btn"
          onClick={() => handleDeletePatient(p.id, p.email)}
          title="Eliminar Paciente"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6 18.333 19.333c-.083.833-.75 1.667-1.667 1.667H8.334c-.917 0-1.583-.833-1.667-1.667L5 6"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>

        <button 
          className="btn-icon btn-primary" 
          onClick={() => navigate(`/dashboard/medical-history/${p.id}`)}
          title="Ver Historia Clínica"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </button>
        
        <button 
          className="btn-icon btn-info" 
          onClick={() => navigate(`/dashboard/documents/${p.id}`)}
          title="Ver Documentos"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
            <polyline points="13,2 13,9 20,9"/>
          </svg>
        </button>

        {/* NUEVO BOTÓN: Ver Prescripciones */}
        <button 
          className="btn-icon btn-success" 
          onClick={() => {
            console.log('ID enviado a prescripciones (admin):', p.id);
            navigate(`/dashboard/prescriptions/${p.id}`);
          }}
          title="Ver Prescripciones"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/>
            <path d="M14 8H8m6 4H8"/>
          </svg>
        </button>
        
        <button
          className={`btn-icon btn-toggle ${p.status === "ACTIVE" ? "btn-danger" : "btn-success"}`}
          onClick={() => handleToggleStatus(p.id, p.status)}
          disabled={p.status === "PENDING"}
          title={p.status === "ACTIVE" ? "Desactivar Paciente" : "Activar Paciente"}
        >
          {p.status === "ACTIVE" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="9,12 12,15 22,4"/>
            </svg>
          )}
        </button>

        <button
          className="btn-icon btn-warning"
          onClick={() => userId && fetchPatientInfo(userId)}
          title="Ver Información del Paciente"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="7" r="4"/>
            <path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="patients-list-container">
      <div className="header-container">
        <h1 className="title" style={{ color: "blue" }}>
          {mode === "consult" ? "Selecciona un paciente" : "Pacientes Medcore"}
        </h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <table className="doctors-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Tipo de Documento</th>
            <th>Número de Documento</th>
            <th>Edad</th>
            {mode !== "consult" && <th>Estado</th>}
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {pacientesFiltrados.length > 0 ? (
            pacientesFiltrados.map((p) => (
              <tr key={p.id}>
                <td>{p.fullname}</td>
                <td>{p.email}</td>
                <td>{p.id_type}</td>
                <td>{p.id_number}</td>
                <td>{p.age}</td>
                {mode !== "consult" && (
                  <td>
                    <span
                      className={`status-badge ${
                        p.status === "ACTIVE"
                          ? "status-active"
                          : p.status === "DISABLED" || p.status === "DISABLE"
                          ? "status-disabled"
                          : "status-pending"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                )}
                <td>{renderActions(p)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={mode !== "consult" ? 7 : 6}>
                No se encontraron pacientes con ese nombre o documento.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Información del Paciente</h3>

            {patientInfo ? (
              <div className="info-grid">
                <div>
                  <p><strong>Nombre:</strong> {patientInfo.fullname}</p>
                  <p><strong>Edad:</strong> {patientInfo.age}</p>
                  <p><strong>Sexo:</strong> {patientInfo.gender}</p>
                </div>
                <div>
                  <p><strong>Celular:</strong> {patientInfo.phone}</p>
                  <p><strong>Correo:</strong> {patientInfo.email}</p>
                  <p><strong>Ciudad:</strong> {patientInfo.city}</p>

                  <div>
                    <p><strong>Dirección:</strong> {patientInfo.address}</p>
                    <p><strong>Estado:</strong> 
                      <span
                        className={`status-badge ${
                          patientInfo.status === "ACTIVE"
                            ? "status-active"
                            : patientInfo.status === "DISABLED" || patientInfo.status === "DISABLE"
                            ? "status-disabled"
                            : "status-pending"
                        }`}
                      >
                        {patientInfo.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p>Cargando información...</p>
            )}

            <button className="close-btn" onClick={() => setShowInfo(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPatientsList;