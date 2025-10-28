import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { medicalRecordsService } from "../../utils/adminService";
import Swal from "sweetalert2";
import "./medical.css";

export default function MedicalHistoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rec, setRec] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        console.log('[MedicalHistoryEdit] Loading record with ID:', id);
        const r = await medicalRecordsService.getById(id);
        console.log('[MedicalHistoryEdit] API Response:', r);
        setRec(r.ok ? r.data?.data || r.data : null);
      } catch (error) {
        console.error("Error loading medical record:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la historia clínica"
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (saving) return;
    
    setSaving(true);
    
    try {
      const fd = new FormData(e.currentTarget);
      const payload = Object.fromEntries(fd.entries());
      
      // Validación básica
      if (!payload.diagnosis?.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Campo requerido",
          text: "El diagnóstico es obligatorio"
        });
        setSaving(false);
        return;
      }
      
      const r = await medicalRecordsService.update(id, payload);
      
      if (r.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: "Historia clínica actualizada correctamente",
          timer: 1500,
          showConfirmButton: false
        });
        
        setTimeout(() => {
          navigate(`/dashboard/medical-history/${rec.patientId}`);
        }, 1500);
      } else {
        throw new Error(r?.data?.message || "No se pudo actualizar");
      }
    } catch (error) {
      console.error("Error updating medical record:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo actualizar la historia clínica"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="skeleton-page" />;
  if (!rec) return <div className="error-page">Consulta no encontrada</div>;

  return (
    <div className="mh-container">
      <div className="section-header">
        <div><h2>Editar consulta</h2><p>{rec.date ? new Date(rec.date).toLocaleString() : ""}</p></div>
      </div>

      <section className="card-shell">
        <header className="card-head">
          <h3>Editar Historia Clínica</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link 
              className="btn-icon btn-warning"
              to={`/dashboard/medical-history/${rec.patientId}`}
              title="Volver a la Historia"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </Link>
          </div>
        </header>
        <div className="card-content">
          <form className="form-grid" onSubmit={onSubmit}>
            <label>
              Síntomas *
              <textarea 
                name="symptoms" 
                rows="2" 
                defaultValue={rec.symptoms}
                placeholder="Describa los síntomas presentados por el paciente..."
                required
              />
            </label>
            
            <label>
              Diagnóstico *
              <input 
                name="diagnosis" 
                defaultValue={rec.diagnosis}
                placeholder="Diagnóstico principal..."
                required
              />
            </label>
            
            <label>
              Tratamiento
              <textarea 
                name="treatment" 
                rows="3" 
                defaultValue={rec.treatment}
                placeholder="Tratamiento prescrito, medicamentos, dosis..."
              />
            </label>
            
            <label>
              Notas adicionales
              <textarea 
                name="notes" 
                rows="3" 
                defaultValue={rec.notes}
                placeholder="Observaciones, seguimiento, recomendaciones..."
              />
            </label>

            <div className="form-actions">
              <button 
                className="btn" 
                type="submit" 
                disabled={saving}
                style={{ 
                  opacity: saving ? 0.7 : 1,
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <Link 
                className="btn secondary" 
                to={`/dashboard/medical-history/${rec.patientId}`}
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
