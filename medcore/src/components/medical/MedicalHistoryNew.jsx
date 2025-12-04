import { Link, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { medicalRecordsService, diagnosisService } from "../../utils/adminService";
import MiniUploader from "../uploader/MiniUploader";
import "./medical.css";
import { useState, useEffect } from "react";
import ClinicalNotes from "../../presentation/components/clinicalNotes";
import axios from "axios";

export default function MedicalHistoryNew() {
  const [sp] = useSearchParams();
  const patientId = sp.get("patientId");
  const appointmentId = sp.get("appointmentId");
  const token = localStorage.getItem("token");

  console.log("🔍 URL Params:", { patientId, appointmentId });

  const [notesRich, setNotesRich] = useState("");
  const [medicalRecordId, setMedicalRecordId] = useState(null);
  
  // ✅ Estado para el catálogo de enfermedades
  const [diseases, setDiseases] = useState([]);
  const [loadingDiseases, setLoadingDiseases] = useState(true);
  const [searchDisease, setSearchDisease] = useState("");
  

  const [formData, setFormData] = useState({
    symptoms: "",
    diseaseCode: "", // ✅ Código de la enfermedad seleccionada
    treatment: "",
    title: "",
    description: "",
    observations: "",
    nextAppointment: "",
  });

  let filesSel = [];

  // ✅ Cargar catálogo de enfermedades al montar
  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        setLoadingDiseases(true);
        const res = await axios.get(
          "http://localhost:3005/api/v1/diseases?isActive=true&limit=50",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("✅ Enfermedades cargadas:", res.data);
        setDiseases(res.data.items || []);
      } catch (error) {
        console.error("❌ Error cargando enfermedades:", error);
        Swal.fire({
          icon: "warning",
          title: "Advertencia",
          text: "No se pudo cargar el catálogo de enfermedades",
        });
      } finally {
        setLoadingDiseases(false);
      }
    };

    fetchDiseases();
  }, [token]);

  // ✅ Buscar enfermedades en tiempo real
  useEffect(() => {
    if (searchDisease.trim() === "") {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/v1/diseases?q=${encodeURIComponent(searchDisease)}&isActive=true&limit=20`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDiseases(res.data.items || []);
      } catch (error) {
        console.error("Error buscando enfermedades:", error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchDisease, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validar que se haya seleccionado una enfermedad
    if (!formData.diseaseCode) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes seleccionar un diagnóstico del catálogo",
      });
    }

    try {
      // ✅ Construir payload dinámicamente
      const payload = {
        patientId,
        symptoms: formData.symptoms,
        diagnosis: formData.description || "", // opcional
        treatment: formData.treatment,
        notes: notesRich,
      };

      // Solo agregar appointmentId si existe
      if (appointmentId && appointmentId !== "undefined") {
        payload.appointmentId = appointmentId;
      }

      console.log("📤 Enviando payload:", payload);

      // 1) Crear HISTORIA CLÍNICA
      const rec = await medicalRecordsService.create(payload);

      if (!rec.ok) {
        Swal.fire({
          icon: "error",
          title: "No se pudo crear la historia",
          text: rec?.data?.message || "Error",
        });
        return;
      }

      const id = rec.data?.data?.id || rec.data?.id;
      setMedicalRecordId(id);

      console.log("✅ Historia clínica creada con ID:", id);

      // 2) Crear DIAGNÓSTICO
      const selectedDisease = diseases.find(d => d.code === formData.diseaseCode);

      const diagnosticData = {
        title: formData.title || selectedDisease?.name || "Diagnóstico General",
        description: formData.description || `Diagnóstico: ${selectedDisease?.name}`,
        diagnosis: `${selectedDisease?.code} - ${selectedDisease?.name}`,
        treatment: formData.treatment || "Tratamiento no especificado",
        observations: formData.observations,
        nextAppointment: formData.nextAppointment || null,
        medicalRecordId: id,
        diseaseCode: formData.diseaseCode, // ✅ Enviar el código
        type: "PRIMARY", // ✅ Marcar como diagnóstico principal
        files: filesSel || [],
      };

      console.log("📤 Enviando diagnóstico:", diagnosticData);

      const resDx = await diagnosisService.createForPatientFormData(
        patientId,
        diagnosticData
      );

      if (!resDx.ok) {
        Swal.fire({
          icon: "warning",
          title: "Diagnóstico con errores",
          text: resDx?.data?.message || "Revisa los campos",
        });
        return;
      }

      console.log("✅ Diagnóstico creado:", resDx.data);

      Swal.fire({
        icon: "success",
        title: "Consulta guardada",
        text: "Ahora puedes agregar una prescripción",
        timer: 2000,
        showConfirmButton: false,
      });

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: err.response?.data?.message || "Contacta al admin",
      });
    }
  };

  return (
    <div className="mh-container">
      <div className="section-header">
        <h2>Nueva consulta</h2>
        <p>Paciente ID: {patientId}</p>
        {appointmentId && (
          <p style={{ fontSize: "14px", color: "#666" }}>
            Cita ID: {appointmentId}
          </p>
        )}
      </div>

      <section className="card-shell">
        <header className="card-head">
          <h3>Historia clínica</h3>
        </header>

        <div className="card-content">
          <form className="form-grid" onSubmit={onSubmit}>
            <label>
              Síntomas *
              <textarea
                name="symptoms"
                required
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Describe los síntomas del paciente"
                rows="3"
              />
            </label>

            {/* ✅ NUEVO: Selector de diagnóstico desde catálogo */}
            <label>
              Diagnóstico (Catálogo CIE-10) *
              <input
                type="text"
                placeholder="Buscar enfermedad..."
                value={searchDisease}
                onChange={(e) => setSearchDisease(e.target.value)}
                style={{ marginBottom: "8px" }}
              />
              <select
                name="diseaseCode"
                required
                value={formData.diseaseCode}
                onChange={handleChange}
                disabled={loadingDiseases}
              >
                <option value="">
                  {loadingDiseases ? "Cargando..." : "Seleccione un diagnóstico"}
                </option>
                {diseases.map((disease) => (
                  <option key={disease.code} value={disease.code}>
                    {disease.code} - {disease.name}
                  </option>
                ))}
              </select>
              {diseases.length === 0 && !loadingDiseases && searchDisease && (
                <small style={{ color: "#666", display: "block", marginTop: "4px" }}>
                  No se encontraron resultados para "{searchDisease}"
                </small>
              )}
            </label>

            <label>
              Tratamiento *
              <textarea
                name="treatment"
                required
                rows="3"
                value={formData.treatment}
                onChange={handleChange}
                placeholder="Describe el tratamiento recomendado"
              />
            </label>

            <div style={{ gridColumn: "1/-1" }}>
              <ClinicalNotes value={notesRich} onChange={setNotesRich} />
            </div>

            <header
              style={{
                gridColumn: "1/-1",
                fontWeight: 700,
                color: "#0a66ff",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              Información adicional del diagnóstico
            </header>

            <label>
              Título personalizado
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Opcional - Se usará el nombre de la enfermedad por defecto"
              />
            </label>

            <label>
              Descripción adicional
              <textarea
                name="description"
                rows="2"
                value={formData.description}
                onChange={handleChange}
                placeholder="Información adicional sobre el diagnóstico"
              />
            </label>

            <label>
              Observaciones
              <textarea
                name="observations"
                rows="2"
                value={formData.observations}
                onChange={handleChange}
                placeholder="Observaciones clínicas"
              />
            </label>

            <label>
              Próxima cita
              <input
                type="date"
                name="nextAppointment"
                value={formData.nextAppointment}
                onChange={handleChange}
              />
            </label>

            <div style={{ gridColumn: "1/-1" }}>
              <MiniUploader
                label="Añadir archivos (PDF, JPG, PNG)"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={(arr) => {
                  filesSel = arr;
                }}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn primary">
                💾 Guardar consulta
              </button>

              <Link
                className="btn secondary"
                to={`/dashboard/medical-history/${patientId}`}
              >
                Cancelar
              </Link>

              {medicalRecordId && (
             <Link
  className="btn success"
  to={`/dashboard/prescription/${patientId}/${medicalRecordId}/new`}
>
  💊 Agregar prescripción
</Link>

              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}