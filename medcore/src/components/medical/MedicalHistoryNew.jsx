import { Link, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { medicalRecordsService, diagnosisService } from "../../utils/adminService";
import MiniUploader from "../uploader/MiniUploader";
import "./medical.css";

export default function MedicalHistoryNew() {
  const [sp] = useSearchParams();
  const patientId = sp.get("patientId");

  let filesSel = []; // los mantendremos en memoria local del componente

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    try {
      // 1) Crear HISTORIA MÉDICA
      const rec = await medicalRecordsService.create({
        patientId,
        symptoms: payload.symptoms,
        diagnosis: payload.diagnosisText,
        treatment: payload.treatment,
        notes: payload.notes,
      });

      if (!rec.ok) {
        Swal.fire({ icon:"error", title:"No se pudo crear la historia", text: rec?.data?.message || "Error" });
        return;
      }

      const medicalRecordId = rec.data?.data?.id || rec.data?.id;
      if (!medicalRecordId) {
        Swal.fire({ icon:"warning", title:"Historia creada sin ID", text:"El backend no devolvió el ID" });
        return;
      }

      // 2) Crear DIAGNÓSTICO (siempre) — usando datos de la historia clínica + campos adicionales
      const diagnosticData = {
        title: payload.title || payload.diagnosisText || "Diagnóstico General",
        description: payload.description || `Diagnóstico asociado a consulta del ${new Date().toLocaleDateString()}`,
        diagnosis: payload.diagnosisText || payload.diagnosis || "Diagnóstico no especificado",
        treatment: payload.treatment || "Tratamiento no especificado",
        observations: payload.observations || payload.notes || null,
        nextAppointment: payload.nextAppointment || null,
        medicalRecordId,
        files: filesSel || [],
      };

      const resDx = await diagnosisService.createForPatientFormData(patientId, diagnosticData);

      if (!resDx.ok) {
        Swal.fire({ icon:"warning", title:"Diagnóstico con errores", text: resDx?.data?.message || "Revisa los campos" });
      }

      Swal.fire({ icon:"success", title:"Consulta guardada", timer:1500, showConfirmButton:false });
      window.location.href = `/dashboard/medical-history/${patientId}`;
    } catch (err) {
      console.error(err);
      Swal.fire({ icon:"error", title:"Error inesperado", text:"Contacta al admin" });
    }
  };

  return (
    <div className="mh-container">
      <div className="section-header">
        <div><h2>Nueva consulta</h2><p>Paciente ID: {patientId}</p></div>
      </div>

      <section className="card-shell">
        <header className="card-head"><h3>Datos de la consulta</h3></header>
        <div className="card-content">
          <form className="form-grid" onSubmit={onSubmit}>
            <label>Síntomas<input name="symptoms" required /></label>
            <label>Diagnóstico (texto)<input name="diagnosisText" /></label>
            <label>Tratamiento<textarea name="treatment" rows="3" /></label>
            <label>Notas<textarea name="notes" rows="3" /></label>

            <header style={{gridColumn:'1/-1', fontWeight:700, color:'#0a66ff', marginTop:8}}>Diagnóstico vinculado</header>
            <label>Título<input name="title" /></label>
            <label>Descripción<textarea name="description" rows="3" /></label>
            <label>Observaciones<textarea name="observations" rows="3" /></label>
            <label>Próxima cita<input type="date" name="nextAppointment" /></label>

            {/* <<< Uploader compacto, multiarchivo >>> */}
            <div style={{gridColumn:'1/-1'}}>
              <MiniUploader
                label="Arrastra o selecciona documentos (PDF, JPG, PNG)"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={(arr)=>{ filesSel = arr; }}
              />
            </div>

            <div className="form-actions">
              <button className="btn" type="submit">Guardar</button>
              <Link className="btn secondary" to={`/dashboard/medical-history/${patientId}`}>Cancelar</Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
