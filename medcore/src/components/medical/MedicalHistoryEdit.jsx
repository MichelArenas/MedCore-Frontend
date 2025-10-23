import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { medicalRecordsService } from "../../utils/adminService";
import "./medical.css";

export default function MedicalHistoryEdit() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [rec, setRec] = useState(null);

  useEffect(() => {
    (async () => {
      const r = await medicalRecordsService.getById(id);
      setRec(r.ok ? r.data?.data || r.data : null);
      setLoading(false);
    })();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    const r = await medicalRecordsService.update(id, payload);
    if (r.ok) window.location.href = `/dashboard/medical-history/${rec.patientId}`;
    else alert(r?.data?.message || "No se pudo actualizar");
  };

  if (loading) return <div className="skeleton-page" />;
  if (!rec) return <div className="error-page">Consulta no encontrada</div>;

  return (
    <div className="mh-container">
      <div className="section-header">
        <div><h2>Editar consulta</h2><p>{rec.date ? new Date(rec.date).toLocaleString() : ""}</p></div>
      </div>

      <section className="card-shell">
        <header className="card-head"><h3>Datos</h3></header>
        <div className="card-content">
          <form className="form-grid" onSubmit={onSubmit}>
            <label>Síntomas<input name="symptoms" defaultValue={rec.symptoms} /></label>
            <label>Diagnóstico<input name="diagnosis" defaultValue={rec.diagnosis} /></label>
            <label>Tratamiento<textarea name="treatment" rows="3" defaultValue={rec.treatment} /></label>
            <label>Notas<textarea name="notes" rows="3" defaultValue={rec.notes} /></label>

            <div className="form-actions">
              <button className="btn" type="submit">Guardar cambios</button>
              <Link className="btn secondary" to={`/dashboard/medical-history/${rec.patientId}`}>Volver</Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
