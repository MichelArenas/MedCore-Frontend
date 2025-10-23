import React, { useEffect, useState } from "react";
import "./DashboardDoctorList.css";
import Swal from "sweetalert2";

function DashboardDoctorsList() {
  const [doctores, setDoctores] = useState([]);
  const [busqueda, setBusqueda] = useState(""); // 🆕 Estado para búsqueda
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔄 Obtener lista de doctores
  const fetchDoctores = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3003/api/users/by-role?role=MEDICO", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener doctores");
      }

      const data = await response.json();
      setDoctores(data.users || []);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar los doctores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctores();
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
      setDoctores((prev) =>
        prev.map((doc) =>
          doc.id === userId ? { ...doc, status: newStatus } : doc
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
  const handleEditDoctor = async (doctor) => {
    const { value: formValues } = await Swal.fire({
      title: `Editar Médico`,
      html: `
        <input id="swal-fullname" class="swal2-input" placeholder="Nombre completo" value="${doctor.fullname || ''}">
        <input id="swal-email" class="swal2-input" placeholder="Correo electrónico" value="${doctor.email || ''}">
        <input id="swal-phone" class="swal2-input" placeholder="Teléfono" value="${doctor.phone || ''}">
        <input id="swal-address" class="swal2-input" placeholder="Dirección" value="${doctor.address || ''}">
        <input id="swal-city" class="swal2-input" placeholder="Ciudad" value="${doctor.city || ''}">
        <select id="swal-gender" class="swal2-select">
          <option value="">Seleccionar género</option>
          <option value="MASCULINO" ${doctor.gender === "MASCULINO" ? "selected" : ""}>Masculino</option>
          <option value="FEMENINO" ${doctor.gender === "FEMENINO" ? "selected" : ""}>Femenino</option>
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
    `http://localhost:3003/api/v1/users/doctors/${doctor.id}`,
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

  if (loading) return <p className="loading">Cargando doctores...</p>;
  if (error) return <p className="error">{error}</p>;

  // 🔍 Filtrar doctores según la búsqueda
  const doctoresFiltrados = doctores.filter((doc) =>
    doc.fullname?.toLowerCase().includes(busqueda.toLowerCase()) ||
    doc.id_number?.toString().includes(busqueda)
  );

  return (
    <div className="doctors-list-container">
      <div className="header-container">
      <h1 className="title"> Médicos Medcore</h1>

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

      <table className="doctors-table">
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
          {doctoresFiltrados.length > 0 ? (
            doctoresFiltrados.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.fullname}</td>
                <td>{doc.email}</td>
                <td>{doc.id_type}</td>
                <td>{doc.id_number}</td>
                <td>{doc.age}</td>
                <td>
                  <span
                    className={`status-badge ${
                      doc.status === "ACTIVE"
                        ? "status-active"
                        : doc.status === "DISABLED"
                        ? "status-disabled"
                        : "status-pending"
                    }`}
                  >
                    {doc.status}
                  </span>
                </td>
                <td className="actions">
                   <button
                    className="edit-btn"
                    onClick={() => handleEditDoctor(doc)}
                  >
                    Editar
                  </button>
                  <button
                    className={`toggle-btn ${
                      doc.status === "ACTIVE"
                        ? "btn-disable"
                        : "btn-enable"
                    }`}
                    onClick={() => handleToggleStatus(doc.id, doc.status)}
                    disabled={doc.status === "PENDING"}
                  >
                    {doc.status === "ACTIVE" ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No se encontraron doctores con ese nombre o documento.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardDoctorsList;
