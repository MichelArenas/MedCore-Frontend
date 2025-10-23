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
      <h1 className="title"> Enfermeros Medcore</h1>

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
                    className="edit-btn"
                    onClick={() => handleEditNurses(enf)}
                  >
                    Editar
                  </button>
                  <button
                    className={`toggle-btn ${
                      enf.status === "ACTIVE"
                        ? "btn-disable"
                        : "btn-enable"
                    }`}
                    onClick={() => handleToggleStatus(enf.id, enf.status)}
                    disabled={enf.status === "PENDING"}
                  >
                    {enf.status === "ACTIVE" ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No se encontraron enfermeros con ese nombre o documento.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardEnfermerosList;
