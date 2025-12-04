import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./infoconsulta.css";

export default function DoctorConsultationView() {
  const { id } = useParams(); // ID de la cita
  const [appointment, setAppointment] = useState(null);
  const [patientId, setPatientId] = useState(null); // ✅ Estado separado para patientId
  const [medicalRecordId, setMedicalRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        // 1) Obtener la cita
        const res = await axios.get(
          `http://localhost:3008/api/v1/appointments/by-id/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Consulta cargada:", res.data);

        const data = res.data.data || res.data;

        const normalized = {
          ...data,
          patient: data.patientContact || {},
          doctor: data.doctorContact || {},
        };

        setAppointment(normalized);

        // 2) ✅ Obtener el patientId real desde el servicio de usuarios
        // Suponiendo que `data.patientId` es el userId
        const userId = data.patientId || normalized.patient.userId || normalized.patient.id;
        
        console.log("🔍 Buscando patientId con userId:", userId);

        if (userId) {
          try {
            const patientRes = await axios.get(
              `http://localhost:3003/api/v1/users/by-user/${userId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("✅ Paciente encontrado:", patientRes.data);

            // El patientId real está en la respuesta
            const realPatientId = patientRes.data.data?.id || patientRes.data.id;
            setPatientId(realPatientId);
            
            console.log("✅ PatientId final:", realPatientId);

          } catch (patientErr) {
            console.error("❌ Error obteniendo patientId:", patientErr);
            
            // ✅ Fallback: usar el userId directamente si la búsqueda falla
            console.log("⚠️ Usando userId como patientId (fallback)");
            setPatientId(userId);
          }
        } else {
          console.error("❌ No se encontró userId en la cita");
        }

      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo cargar la consulta", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id, token]);

  if (loading) return <p>Cargando información...</p>;
  if (!appointment) return <p>No se encontró la consulta.</p>;

  const fecha = new Date(appointment.appointmentDate);
  const patient = appointment.patient;
  const doctor = appointment.doctor;

  return (
    <div className="consultation-container">
      <h2>Consulta en curso</h2>

      <section className="consult-card">
        <header><h3>Información de la cita</h3></header>
        <div className="consult-details">
          <p><strong>Paciente:</strong> {patient.fullName || patient.name}</p>
          <p><strong>Identificación:</strong> {patient.identification || "-"}</p>
          <p><strong>Doctor:</strong> {doctor.fullName || doctor.name}</p>
          <p><strong>Motivo:</strong> {appointment.reason || "No especificado"}</p>
          <p><strong>Fecha:</strong> {fecha.toLocaleDateString()}</p>
          <p><strong>Hora:</strong> {fecha.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}</p>
          <p><strong>Estado:</strong> {appointment.status}</p>
          <p><strong>Notas:</strong> {appointment.notes || "—"}</p>
          
          {/* ✅ Debug info - eliminar en producción */}
          {process.env.NODE_ENV === 'development' && (
            <p style={{color: '#666', fontSize: '12px', marginTop: '10px'}}>
              <strong>Debug - PatientId:</strong> {patientId || 'Cargando...'}
            </p>
          )}
        </div>
      </section>

      <section className="consult-actions">
        {/* ✅ Deshabilitar botones hasta que tengamos patientId */}
        <Link 
          className={`btn ${!patientId ? 'disabled' : ''}`}
          to={patientId ? `/dashboard/documents/${patientId}` : '#'}
          onClick={(e) => !patientId && e.preventDefault()}
        >
          📄 Ver documentos del paciente
        </Link>

        <Link 
          className={`btn secondary ${!patientId ? 'disabled' : ''}`}
          to={patientId ? `/dashboard/medical-history/${patientId}` : '#'}
          onClick={(e) => !patientId && e.preventDefault()}
        >
          📘 Ver historia clínica
        </Link>

        <Link 
          className={`btn primary ${!patientId ? 'disabled' : ''}`}
          to={patientId ? `/dashboard/medical-history/new?patientId=${patientId}&appointmentId=${id}` : '#'}
          onClick={(e) => !patientId && e.preventDefault()}
        >
          ➕ Crear nueva historia clínica
        </Link>

        <Link 
          className={`btn primary ${!patientId ? 'disabled' : ''}`}
          to={patientId ? `/dashboard/prescription/${patientId}/${medicalRecordId}/new-prescription` : '#'}
          onClick={(e) => !patientId && e.preventDefault()}
        >
          ➕ Crear prescripción médica
        </Link>
      </section>
    </div>
  );
}