import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./SolicitarCita.css";

function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return payload.userId || payload.sub || null;
  } catch (e) {
    console.error("Error decodificando token:", e);
    return null;
  }
}

function SolicitarCita() {
  const [doctores, setDoctores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("");
  const [doctorSeleccionado, setDoctorSeleccionado] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
  const [duracion, setDuracion] = useState(30);
  const [motivo, setMotivo] = useState("");
  const [notas, setNotas] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [patientId, setPatientId] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [patientError, setPatientError] = useState(null);
  // 🔄 Obtener especialidades (ORG / SPECIALTIES SERVICE)
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3004/api/v1/specialties", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        // Asumimos que data es un array de { id, name, ... }
        setEspecialidades(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al obtener especialidades:", err);
      }
    };
    fetchEspecialidades();
  }, []);

  // 🔄 Cuando cambie la especialidad → cargar doctores de esa especialidad
  useEffect(() => {
    const fetchDoctoresPorEspecialidad = async () => {
      if (!especialidadSeleccionada) {
        setDoctores([]);
        setDoctorSeleccionado("");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        // Buscar el objeto de especialidad para obtener el name
        const espec = especialidades.find(
          (e) => e.id === especialidadSeleccionada
        );
        const specialtyName = espec?.name;

        if (!specialtyName) {
          console.warn("No se encontró el nombre de la especialidad seleccionada");
          setDoctores([]);
          setDoctorSeleccionado("");
          return;
        }

        const url = `http://localhost:3003/api/v1/users/by-specialty?specialty=${encodeURIComponent(
          specialtyName
        )}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // getDoctorsBySpecialty devuelve { message, doctors, total, filters }
        const listaDoctores = Array.isArray(data.doctors) ? data.doctors : [];
        setDoctores(listaDoctores);
        setDoctorSeleccionado("");
        console.log('Especialidad', specialtyName, 'doctores', listaDoctores)
      } catch (err) {
        console.error("Error al obtener doctores por especialidad:", err);
        setDoctores([]);
        setDoctorSeleccionado("");
      }
    };

    fetchDoctoresPorEspecialidad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [especialidadSeleccionada, especialidades]);

  // 🕒 Cargar disponibilidad del doctor (horarios libres filtrados por citas ya confirmadas)
  useEffect(() => {
    const fetchDisponibilidad = async () => {
      if (!doctorSeleccionado || !fechaSeleccionada) return;
      try {
        const token = localStorage.getItem("token");

        // 1️⃣ Horarios disponibles por schedule
        const resDisponibilidad = await fetch(
          `http://localhost:3008/api/v1/schedules/available?doctorId=${doctorSeleccionado}&date=${fechaSeleccionada}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const dataDisponibilidad = await resDisponibilidad.json();
        const horariosDisponibles = Array.isArray(dataDisponibilidad)
          ? dataDisponibilidad
          : [];


          
        // 2️⃣ Citas del doctor en esa fecha (status CONFIRMED)
        const resCitas = await fetch(
          `http://localhost:3008/api/v1/appointments/range?doctorId=${doctorSeleccionado}&dateFrom=${fechaSeleccionada}&dateTo=${fechaSeleccionada}&status=CONFIRMED`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const dataCitas = await resCitas.json();

        const listaCitas = Array.isArray(dataCitas.data || dataCitas.appointments)
          ? dataCitas.data || dataCitas.appointments
          : [];

        const citasOcupadas = listaCitas.map((c) => {
          const date = new Date(c.appointmentDate || c.date);
          return date.toTimeString().substring(0, 5); // "HH:MM"
        });

        // 3️⃣ Filtrar horarios ocupados
        const horariosFiltrados = horariosDisponibles.filter(
          (h) => !citasOcupadas.includes(h.time)
        );

        console.log("🕒 Horarios filtrados:", horariosFiltrados);
        setHorarios(horariosFiltrados);
      } catch (err) {
        console.error("Error al obtener disponibilidad:", err);
      }
    };
    fetchDisponibilidad();
  }, [doctorSeleccionado, fechaSeleccionada]);

    // 🔎 Obtener patientId a partir del userId del token
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = getUserIdFromToken();

        if (!token || !userId) {
          setPatientError("No se pudo obtener el usuario autenticado");
          setLoadingPatient(false);
          return;
        }

        // 👇 Ajusta el puerto/base si tu medcore-user está en otro
       const res = await fetch(
  `http://localhost:3003/api/v1/users/patients/by-user/${userId}`,
  { headers: { Authorization: `Bearer ${token}` } }
);


        if (!res.ok) {
          const errData = await res.json();
          console.error("Error al obtener paciente:", errData);
          setPatientError(errData.message || "No se encontró el paciente");
          setLoadingPatient(false);
          return;
        }

      const data = await res.json();
console.log("🧍 Paciente cargado:", data);

// 1️⃣ Verifica dónde viene el paciente
const paciente = data.data || data.patient || data;

if (!paciente.id) {
  console.error("❌ No se encontró ID de paciente en la respuesta:", data);
  setPatientError("No se encontró el ID del paciente en la respuesta del servidor");
  return;
}

setPatientId(paciente.id);

        setLoadingPatient(false);
      } catch (err) {
        console.error("Error al obtener paciente:", err);
        setPatientError("Error al cargar la información del paciente");
        setLoadingPatient(false);
      }
    };

    fetchPatient();
  }, []);

  // 📅 Crear cita
  const handleCrearCita = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (loadingPatient){
        Swal.fire("⏳ Espera", "Estamos cargando la información del paciente", "info");
        return;
      }

      if (!patientId) {
        Swal.fire(
          "❌ Error",
          patientError || "No se encontró un paciente asociado al usuario",
          "error"
        );
        return;
      }

      if (!especialidadSeleccionada) {
        Swal.fire("⚠️ Atención", "Debes seleccionar una especialidad", "warning");
        return;
      }

      if (!doctorSeleccionado || !fechaSeleccionada || !horarioSeleccionado) {
        Swal.fire(
          "⚠️ Atención",
          "Debes seleccionar doctor, fecha y horario",
          "warning"
        );
        return;
      }

      const appointmentDate = new Date(
        `${fechaSeleccionada}T${horarioSeleccionado}:00`
      ).toISOString();

      const response = await fetch(
        `http://localhost:3008/api/v1/appointments/${patientId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorId: doctorSeleccionado,
            specialtyId: especialidadSeleccionada,
            appointmentDate,
            duration: duracion,
            reason: motivo || null,
            notes: notas || null,
          }),
        }
      );

      const result = await response.json();
      console.log("📅 Resultado cita:", result);

      if (!response.ok) {
        Swal.fire("❌ Error", result.message || "Error al crear cita", "error");
        return;
      }

      const doctorInfo = doctores.find((d) => d.id === doctorSeleccionado);
      const especInfo = especialidades.find(
        (e) => e.id === especialidadSeleccionada
      );

      Swal.fire({
        title: "✅ Cita creada con éxito",
        html: `
          <p><b>Especialidad:</b> ${especInfo?.name || "N/A"}</p>
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

      setMensaje(
        `✅ Cita creada con éxito para el ${fechaSeleccionada} a las ${horarioSeleccionado}`
      );
    } catch (error) {
      console.error("Error al crear cita:", error);
      Swal.fire(
        "❌ Error",
        "Ocurrió un problema al crear la cita",
        "error"
      );
    }
  };

  return (
    <div className="solicitar-cita-container">
      <h2> Solicitar Cita</h2>

      {/* 1️⃣ ESPECIALIDAD */}
      <div className="form-group">
        <label>Especialidad:</label>
        <select
          value={especialidadSeleccionada}
          onChange={(e) => {
            setEspecialidadSeleccionada(e.target.value);
            setDoctores([]);
            setDoctorSeleccionado("");
            setHorarios([]);
            setHorarioSeleccionado("");
          }}
        >
          <option value="">Selecciona una especialidad</option>
          {especialidades.map((esp) => (
            <option key={esp.id} value={esp.id}>
              {esp.name}
            </option>
          ))}
        </select>
      </div>

      {/* 2️⃣ DOCTOR */}
      <div className="form-group">
        <label>Doctor:</label>
        <select
          value={doctorSeleccionado}
          onChange={(e) => {
            setDoctorSeleccionado(e.target.value);
            setHorarios([]);
            setHorarioSeleccionado("");
          }}
          disabled={!especialidadSeleccionada}
        >
          <option value="">
            {especialidadSeleccionada
              ? "Selecciona un doctor"
              : "Selecciona primero una especialidad"}
          </option>
          {doctores.map((d) => (
            <option key={d.id} value={d.id}>
              {d.fullname || d.name}
            </option>
          ))}
        </select>
      </div>

      {/* 3️⃣ FECHA */}
      <div className="form-group">
        <label>Fecha:</label>
        <input
          type="date"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
        />
      </div>

      {/* 4️⃣ HORARIOS DISPONIBLES */}
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

      <button
        className="btn-crear"
        onClick={handleCrearCita}
        disabled={loadingPatient || !patientId}
      >
        {loadingPatient ? "Cargando paciente..." : "Crear Cita"}
      </button>

      {mensaje && <p className="mensaje-exito">{mensaje}</p>}
    </div>
  );
}

export default SolicitarCita;
