import React, { useEffect, useState } from "react";
import "./DashboardNursesList.css";
import Swal from "sweetalert2";

function DashboardEnfermerosList() {
  const [enfermeros, setEnfermeros] = useState([]);
  const [busqueda, setBusqueda] = useState(""); // 🆕 Estado para búsqueda
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔄 Obtener lista de enfermeros
  const fetchEnfermeros = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3003/api/users/by-role?role=ENFERMERO", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener enfermeros");
      }

      const data = await response.json();
      setEnfermeros(data.users || []);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar los enfermeros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnfermeros();
  }, []);

  // 🧩 Función para cambiar estado (toggle)
  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "DISABLE" : "ACTIVE";

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3003/api/v1/users/${userId}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "warning",
          title: "⚠️ Acción no permitida",
          text: data.message || "No se pudo cambiar el estado del usuario.",
          confirmButtonColor: "#d33",
          confirmButtonText: "Entendido",
        });
        return;
      }

      // ✅ Actualización exitosa
      setEnfermeros((prev) =>
        prev.map((enf) =>
          enf.id === userId ? { ...enf, status: newStatus } : enf
        )
      );

      Swal.fire({
        icon: "success",
        title: "✅ Estado actualizado",
        text: `El usuario ha sido ${newStatus === "ACTIVE" ? "activado" : "deshabilitado"} correctamente.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "💥 Error inesperado",
        text: "Ocurrió un problema al intentar actualizar el estado del usuario.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleDeleteNurses = async (userId, email) => {
    const result = await Swal.fire({
      title: `¿Eliminar enfermero?`,
      text: `Se eliminará completamente el enfermero con correo: ${email}`,
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
  
      // Eliminar del estado local
      setEnfermeros(prev => prev.filter(enf => enf.id !== userId));
  
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
  
  

  // ✏️ Editar médico
    const handleEditNurses = async (nurse) => {
      const { value: formValues } = await Swal.fire({
        title: `Editar Enfermero`,
        html: `
          <input id="swal-fullname" class="swal2-input" placeholder="Nombre completo" value="${nurse.fullname || ''}">
          <input id="swal-email" class="swal2-input" placeholder="Correo electrónico" value="${nurse.email || ''}">
          <input id="swal-phone" class="swal2-input" placeholder="Teléfono" value="${nurse.phone || ''}">
          <input id="swal-address" class="swal2-input" placeholder="Dirección" value="${nurse.address || ''}">
          <input id="swal-city" class="swal2-input" placeholder="Ciudad" value="${nurse.city || ''}">
          <select id="swal-gender" class="swal2-select">
            <option value="">Seleccionar género</option>
            <option value="MASCULINO" ${nurse.gender === "MASCULINO" ? "selected" : ""}>Masculino</option>
            <option value="FEMENINO" ${nurse.gender === "FEMENINO" ? "selected" : ""}>Femenino</option>
          </select>
        `,
        confirmButtonText: "Guardar cambios",
        confirmButtonColor: "#2563eb",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#6b7280",
        focusConfirm: false,
        preConfirm: () => {
          return {
            fullname: document.getElementById("swal-fullname").value,
            email: document.getElementById("swal-email").value,
            phone: document.getElementById("swal-phone").value,
            address: document.getElementById("swal-address").value,
            city: document.getElementById("swal-city").value,
            gender: document.getElementById("swal-gender").value,
          };
        },
      });
        if (formValues) {
       try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3003/api/v1/users/nurses/${nurse.id}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
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
        text: data.message || "Ocurrió un error al actualizar el usuario.",
        confirmButtonColor: "#d33",
        confirmButtonText: "Entendido",
      });
      return;
    }
          Swal.fire({
            icon: "success",
            title: "✅ Médico actualizado",
            text: "Los cambios se guardaron correctamente.",
            showConfirmButton: false,
            timer: 2000,
          });
  
         // fetchDoctores(); // 🔄 Recargar lista
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error al actualizar",
            text: "No se pudieron guardar los cambios.",
            confirmButtonColor:"rgba(0, 89, 255, 0.47)"
          });
        }
      }
    };

  if (loading) return <p className="loading">Cargando enfermeros...</p>;
  if (error) return <p className="error">{error}</p>;

  // 🔍 Filtrar enfermeros según la búsqueda
  const enfermerosFiltrados = enfermeros.filter((enf) =>
    enf.fullname?.toLowerCase().includes(busqueda.toLowerCase()) ||
    enf.id_number?.toString().includes(busqueda)
  );

  return (
    <div className="nurses-list-container">
      <div className="header-container">
        <h1 className="title" > Enfermeros Medcore</h1>

        {/* 🔍 Input de búsqueda */}
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

      <table className="nurses-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Tipo de Documento</th>
            <th>Número de Documento</th>
            <th>Edad</th>
           
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {enfermerosFiltrados.length > 0 ? (
            enfermerosFiltrados.map((enf) => (
              <tr key={enf.id}>
                <td>{enf.fullname}</td>
                <td>{enf.email}</td>
                <td>{enf.id_type}</td>
                <td>{enf.id_number}</td>
                <td>{enf.age}</td>
               
                <td>
                  <span
                    className={`status-badge ${
                      enf.status === "ACTIVE"
                        ? "status-active"
                        : enf.status === "DISABLED"
                        ? "status-disabled"
                        : "status-pending"
                    }`}
                  >
                    {enf.status}
                  </span>
                </td>
                <td className="actions">
                  <button
                    className="btn-icon btn-editar"
                    onClick={() => handleEditNurses(enf)}
                    title="Editar enfermero"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>

                  <button
          className={`btn-icon btn-toggle ${enf.status === "ACTIVE" ? "btn-danger" : "btn-success"}`}
          onClick={() => handleToggleStatus(enf.id, enf.status)}
          disabled={enf.status === "PENDING"}
          title={enf.status === "ACTIVE" ? "Desactivar Enfermero" : "Activar Enfermero"}
        >
          {enf.status === "ACTIVE" ? (
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
                    className="btn-icon delete-btn"
                    onClick={() => handleDeleteNurses(enf.id, enf.email)}
                    title="Eliminar Enfermero"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6 18.333 19.333c-.083.833-.75 1.667-1.667 1.667H8.334c-.917 0-1.583-.833-1.667-1.667L5 6" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">
                No se encontraron doctores con ese nombre o documento.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DashboardEnfermerosList
