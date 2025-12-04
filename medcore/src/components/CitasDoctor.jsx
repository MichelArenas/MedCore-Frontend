import React, { useEffect, useState, useCallback } from "react"
import axios from "axios"
import "./CitasDoctor.css"
import Swal from "sweetalert2"
import { queueService } from "../utils/adminService" // usamos el queueService

function DoctorAppointments() {
  const [citas, setCitas] = useState([])
  const [error, setError] = useState("")
  const token = localStorage.getItem("token")
  const doctorId = localStorage.getItem("userId") // O usa useParams si viene por URL

  //estos son para aplicar filtros
  const [filtroEstado, setFiltroEstado] = useState("TODOS")
  const [citasFiltradas, setCitasFiltradas] = useState([])
  // Nuevo estado para filtrar por fecha
const [filtroFecha, setFiltroFecha] = useState("");


  //paginacion
  const [paginaActual, setPaginaActual] = useState(1)
const elementosPorPagina = 10

const filtrarPorFecha = () => {
  if (!filtroFecha) {
    setCitasFiltradas(citas);
    return;
  }

  const filtradas = citas.filter((c) => {
    if (!c.appointmentDate) return false;

    const fecha = new Date(c.appointmentDate);

    if (isNaN(fecha)) {
      // Si la fecha viene en formato "23/2/2026"
      const partes = c.appointmentDate.split("/");
      if (partes.length === 3) {
        const [dia, mes, anio] = partes;
        const fechaFormateada = `${anio}-${mes.padStart(2,"0")}-${dia.padStart(2,"0")}`;
        return fechaFormateada === filtroFecha;
      }
      return false;
    }

    // Si la fecha viene bien en ISO
    const iso = fecha.toISOString().split("T")[0];

    return iso === filtroFecha;
  });

  setCitasFiltradas(filtradas);
  setPaginaActual(1);
};

const aplicarFiltros = () => {
  let filtradas = citas;

  // ---- FILTRO POR ESTADO ----
  if (filtroEstado !== "TODOS") {
    filtradas = filtradas.filter(c => c.status === filtroEstado);
  }

  // ---- FILTRO POR FECHA ----
  if (filtroFecha) {
    const fechaSeleccionada = new Date(filtroFecha).toDateString();

    filtradas = filtradas.filter(c => {
      const fechaCita = new Date(c.appointmentDate).toDateString();
      return fechaCita === fechaSeleccionada;
    });
  }

  setCitasFiltradas(filtradas);
  setPaginaActual(1);
};

  

  // 🔹 Cargar citas del doctor
  const loadCitas = useCallback(async () => {
    if (!doctorId) return
    try {
      const res = await axios.get(
        `http://localhost:3008/api/v1/appointments/doctor/${doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data =
        res.data.citas || res.data.data || res.data.appointments || []
      setCitas(
  Array.isArray(data)
    ? [...data].sort(
        (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
      )
    : []
)
setCitasFiltradas(
  Array.isArray(data)
    ? [...data].sort(
        (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
      )
    : []
)
 //cuando carguen las citas, tambien se cargan las filtradas
    } catch (err) {
      console.error(err)
      setError("Error al cargar las citas")
    }
  }, [doctorId, token])

  useEffect(() => {
    loadCitas()
  }, [loadCitas])

  useEffect(() => {
  const hoy = new Date().toISOString().split("T")[0];
  setFiltroFecha(hoy); // ⬅ fecha por defecto
}, []);

  // 🔹 Cancelar cita
  const handleCancel = async (id, ticketId) => {
    const { value: reason } = await Swal.fire({
      title: "Cancelar cita",
      input: "text",
      inputLabel: "Motivo de la cancelación",
      inputPlaceholder: "Escribe el motivo aquí...",
      showCancelButton: true,
      inputValidator: (value) => !value && "Debes ingresar un motivo",
    })
    if (!reason) return

    try {
      // Cancelamos la cita en el backend
      await axios.delete(`http://localhost:3008/api/v1/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { reason },
      })

      // Actualizamos la UI local
      setCitas(
        citas.map((c) => (c.id === id ? { ...c, status: "CANCELLED" } : c))
      )

      // 🔹 Remover de la cola si existe
      if (ticketId) {
        await queueService.leaveQueue(ticketId) // simulamos salida de la cola
      }

      Swal.fire({
        icon: "success",
        title: "Cita cancelada",
        text: "La cita se ha cancelado correctamente.",
      })
    } catch (err) {
      console.error(err)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cancelar la cita.",
      })
    }
  }

  const aplicarFiltro = () => { // funcion para aplicar el filtro
  if (filtroEstado === "TODOS") {
    setCitasFiltradas(citas)
  } else {
    setCitasFiltradas(
      citas.filter((c) => c.status === filtroEstado)
    )
  }
}

  const statusLabels = {
    PROGRAMADA: "SCHEDULED",
    CANCELADA: "CANCELLED",
    REAGENDADA: "RESCHEDULED",
    CONFIRMADA: "CONFIRMED",
  }

  // Calcular índices para paginación
const indexInicio = (paginaActual - 1) * elementosPorPagina;
const indexFin = indexInicio + elementosPorPagina;

// Obtener solo las 10 citas a mostrar
const citasPaginadas = citasFiltradas.slice(indexInicio, indexFin);

// Número total de páginas
const totalPaginas = Math.ceil(citasFiltradas.length / elementosPorPagina);


  return (

    <div className="appointments-container">
      <h2 className="title">Consultas programadas</h2>


  {/* Filtro a la derecha */}

  <div className="filtros">
  {/* FILTRO POR ESTADO */}
<div className="filter-contenedor">
  <label className="filter-label">Estado:</label>
  <select
    value={filtroEstado}
    onChange={(e) => setFiltroEstado(e.target.value)}
    className="filter-select"
  >
    <option value="TODOS">Todos</option>
    <option value="SCHEDULED">Programadas</option>
    <option value="CONFIRMED">Confirmadas</option>
    <option value="CANCELLED">Canceladas</option>
  </select>
</div>

{/* FILTRO POR FECHA */}
<div className="filter-contenedor">
  <label className="filter-label">Fecha:</label>
  <input
    type="date"
    value={filtroFecha}
    onChange={(e) => setFiltroFecha(e.target.value)}
    className="filter-select"
  />
</div>

<button className="btn-apply-filter" onClick={aplicarFiltros}>
  Aplicar
</button>

  </div>





        {error ? (
          <p className="error">{error}</p>
        ) : citas.length === 0 ? (
          <p className="no-data">No hay citas registradas para este doctor.</p>
        ) : (
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Paciente</th>
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
              {citasPaginadas.map((cita) => {
                const fecha = new Date(cita.appointmentDate)
                return (
                  <tr key={cita.id}>
                    <td>
                      {cita.patientName ||
                        cita.patientContact?.fullName ||
                        `Paciente #${(cita.patientId || "").slice(0, 6)}…`}
                    </td>
                    <td>{fecha.toLocaleDateString()}</td>
                    <td>
                      {fecha.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>{cita.duration || "-"}</td>
                    <td>{cita.reason || "Sin motivo"}</td>
                    <td>{cita.notes || "-"}</td>
                    <td>
                      <span
                        className={`status-badge status-${cita.status?.toLowerCase()}`}
                      >
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
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="#f15757ff"
                            stroke="white"
                            strokeWidth="2"
                          >
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="7" y1="7" x2="17" y2="17"/>
                              <line x1="17" y1="7" x2="7" y2="17"/>

                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          
        )}
        <div className="pagination">
    <button 
      disabled={paginaActual === 1}
      onClick={() => setPaginaActual(paginaActual - 1)}
    >
      Anterior
    </button>

    <span>Página {paginaActual} de {totalPaginas}</span>

    <button 
      disabled={paginaActual === totalPaginas}
      onClick={() => setPaginaActual(paginaActual + 1)}
    >
      Siguiente
    </button>
  </div>
        
      </div>
  
    )
}

export default DoctorAppointments
