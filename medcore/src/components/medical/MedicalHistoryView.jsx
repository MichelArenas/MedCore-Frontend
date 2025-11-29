// src/components/medical/MedicalHistoryView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./medical.css";
import medicalRecordService  from "../../services/medicalRecordService";

function normalizeRecords(payload) {
  // Acepta varias formas de respuesta y siempre devuelve un array
  if (Array.isArray(payload)) return payload;
  if (!payload) return [];
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.records)) return payload.records;
  if (Array.isArray(payload.items)) return payload.items;
  if (payload.data && typeof payload.data === "object" && payload.data.id) return [payload.data];
  if (payload.id) return [payload]; // por si el backend devolvió 1 objeto
  return [];
}

export default function MedicalHistoryView() {
  const { patientId } = useParams();
  console.log('[MHV] route patientId =', patientId);
  const navigate = useNavigate();
  const [records, setRecords]   = useState([]);   // SIEMPRE un array
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        console.log('[MHV] fetching records for', patientId);
        const res = await medicalRecordService.getPatientMedicalRecords(patientId);
        console.log('[MHV] raw response =', res);
        if (!res.ok) throw new Error(res.data?.message || 'Error cargando historias');
        const payload = res.data || {};
        console.log('[MHV] backend data payload =', payload);
        const list = payload.items || normalizeRecords(payload);
        console.log('[MHV] normalized records =', list);
        setRecords(list);
      } catch (e) {
        console.error(e);
        setError(e.message || "Error al cargar historia");
      } finally {
        setLoading(false);
      }
    })();
  }, [patientId]);

  if (loading) return <p className="loading">Cargando historia...</p>;
  if (error)   return <p className="error">{error}</p>;

  const handleEditClick = (record) => {
    Swal.fire({
      title: '¿Editar historia clínica?',
      html: `
        <div style="text-align: left; margin: 15px 0;">
          <p><strong>Fecha:</strong> ${new Date(record.date || record.createdAt).toLocaleString()}</p>
          <p><strong>Diagnóstico:</strong> ${record.diagnosis}</p>
          <p style="color: #6b7280;">Esta acción te permitirá modificar los datos de esta consulta médica.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, editar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/dashboard/medical-history/${record.id}/edit`);
      }
    });
  };

  if (!records.length) {
    return <p className="loading">Este paciente no tiene registros aún.</p>;
  }

  return (
    <div className="doctors-list-container">
      <div className="header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="title">Historia clínica</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => navigate(`/dashboard/documents/${patientId}`)}
            className="btn-icon btn-info"
            title="Ver Documentos"
            style={{ background: '#10b981' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13,2 13,9 20,9"/>
            </svg>
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="btn"
          >
            ← Volver
          </button>
        </div>
      </div>

      <table className="doctors-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Diagnóstico</th>
            <th>Síntomas</th>
            <th>Tratamiento</th>
            <th>Notas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{new Date(r.date || r.createdAt).toLocaleString()}</td>
              <td>
                <span style={{ color: '#5a6c7d', fontSize: '14px' }}>
                  {r.diagnosis}
                </span>
              </td>
              <td>{r.symptoms}</td>
              <td>{r.treatment}</td>
              <td>{r.notes}</td>
              <td>
                <button 
                  className="btn-icon btn-warning"
                  onClick={() => handleEditClick(r)}
                  title="Editar Historia Clínica"
                  style={{ marginRight: '8px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
