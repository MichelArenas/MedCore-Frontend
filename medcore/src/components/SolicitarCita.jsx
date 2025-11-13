import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./SolicitarCita.css";

function SolicitarCita() {
  const [doctores, setDoctores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [doctorSeleccionado, setDoctorSeleccionado] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
  const [duracion, setDuracion] = useState(30);
  const [motivo, setMotivo] = useState("");
  const [notas, setNotas] = useState("");
  const [mensaje, setMensaje] = useState("");

  // 🔄 Obtener lista de doctores
  useEffect(() => {
    const fetchDoctores = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3003/api/users/by-role?role=MEDICO", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDoctores(data.users || data || []);
      } catch (err) {
        console.error("Error al obtener doctores:", err);
      }
    };
    fetchDoctores();
  }, []);

  // 🔄 Obtener especialidades
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3007/api/v1/specialties", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEspecialidades(data || []);
      } catch (err) {
        console.error("Error al obtener especialidades:", err);
      }
    };
    fetchEspecialidades();
  }, []);

  // 🕒 Cargar disponibilidad
  useEffect(() => {
    const fetchDisponibilidad = async () => {
      if (!doctorSeleccionado || !fechaSeleccionada) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:3008/api/v1/schedules/available?doctorId=${doctorSeleccionado}&date=${fechaSeleccionada}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        console.log("🕒 Disponibilidad del doctor:", data);
        setHorarios(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al obtener disponibilidad:", err);
      }
    };
    fetchDisponibilidad();
  }, [doctorSeleccionado, fechaSeleccionada]);

  // 📅 Crear cita
  const handleCrearCita = async () => {
    try {
      const token = localStorage.getItem("token");
      const patientId = localStorage.getItem("userId");

      if (!doctorSeleccionado || !fechaSeleccionada || !horarioSeleccionado) {
        Swal.fire("⚠️ Atención", "Debes seleccionar doctor, fecha y horario", "warning");
        return;
      }

      const appointmentDate = new Date(`${fechaSeleccionada}T${horarioSeleccionado}:00`).toISOString();

      const response = await fetch(`http://localhost:3008/api/v1/appointments/${patientId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: doctorSeleccionado,
          appointmentDate,
          duration: duracion,
          reason: motivo || null,
          notes: notas || null,
        }),
      });

      const result = await response.json();
      console.log("📅 Resultado cita:", result);

      if (!response.ok) {
        Swal.fire("❌ Error", result.message || "Error al crear cita", "error");
        return;
      }

      const doctorInfo = doctores.find((d) => d.id === doctorSeleccionado);
      Swal.fire({
        title: "✅ Cita creada con éxito",
        html: `
          <p><b>Doctor:</b> ${doctorInfo?.fullname || "Desconocido"}</p>
          <p><b>Fecha:</b> ${fechaSeleccionada}</p>
          <p><b>Hora:</b> ${horarioSeleccionado}</p>
          <p><b>Duración:</b> ${duracion} min</p>
          <p><b>Motivo:</b> ${motivo || "N/A"}</p>
        `,
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });

      setMensaje(`✅ Cita creada con éxito para el ${fechaSeleccionada} a las ${horarioSeleccionado}`);
    } catch (error) {
      console.error("Error al crear cita:", error);
      Swal.fire("❌ Error", "Ocurrió un problema al crear la cita", "error");
    }
  };


  useEffect(() => {
  const fetchDisponibilidad = async () => {
    if (!doctorSeleccionado || !fechaSeleccionada) return;
    try {
      const token = localStorage.getItem("token");

      //  Obtener horarios disponibles del doctor
      const resDisponibilidad = await fetch(
        `http://localhost:3008/api/v1/schedules/available?doctorId=${doctorSeleccionado}&date=${fechaSeleccionada}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const dataDisponibilidad = await resDisponibilidad.json();
      const horariosDisponibles = Array.isArray(dataDisponibilidad) ? dataDisponibilidad : [];

      // 2️ Obtener citas del doctor en esa fecha
      const resCitas = await fetch(
        `http://localhost:3008/api/v1/appointments/range?doctorId=${doctorSeleccionado}&dateFrom=${fechaSeleccionada}&dateTo=${fechaSeleccionada}&status=CONFIRMED`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const dataCitas = await resCitas.json();
      const citasOcupadas = Array.isArray(dataCitas.data || dataCitas.appointments) 
        ? (dataCitas.data || dataCitas.appointments).map(c => {
            const date = new Date(c.appointmentDate || c.date);
            return date.toTimeString().substring(0,5); // "HH:MM"
          })
        : [];

      // 3️⃣ Filtrar horarios ocupados
      const horariosFiltrados = horariosDisponibles.filter(h => !citasOcupadas.includes(h.time));

      console.log("🕒 Horarios filtrados:", horariosFiltrados);
      setHorarios(horariosFiltrados);
    } catch (err) {
      console.error("Error al obtener disponibilidad:", err);
    }
  };
  fetchDisponibilidad();
}, [doctorSeleccionado, fechaSeleccionada]);

  return (
    <div className="solicitar-cita-container">
      <h2> Solicitar Cita</h2>

      <div className="form-group">
        <label>Doctor:</label>
        <select
          value={doctorSeleccionado}
          onChange={(e) => {
            setDoctorSeleccionado(e.target.value);
            setHorarios([]);
            setHorarioSeleccionado("");
          }}
        >
          <option value="">Selecciona un doctor</option>
          {doctores.map((d) => (
            <option key={d.id} value={d.id}>
              {d.fullname || d.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Fecha:</label>
        <input
          type="date"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
        />
      </div>

      {horarios.length > 0 && (
        <div className="form-group">
          <label>Horario disponible:</label>
          <select
            value={horarioSeleccionado}
            onChange={(e) => setHorarioSeleccionado(e.target.value)}
          >
            <option value="">Selecciona un horario</option>
            {horarios.map((h, i) => (
              <option key={i} value={h.time}>
                {h.time}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label>Duración (minutos):</label>
        <input
          type="number"
          min="15"
          max="120"
          step="15"
          value={duracion}
          onChange={(e) => setDuracion(Number(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label>Motivo:</label>
        <input
          type="text"
          placeholder="Ej. Dolor de cabeza"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Notas adicionales:</label>
        <textarea
          rows="3"
          placeholder="Ej. Llevar resultados de laboratorio"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
        ></textarea>
      </div>

      <button className="btn-crear" onClick={handleCrearCita}>
        Crear Cita
      </button>
    </div>
  );
}

export default SolicitarCita;
