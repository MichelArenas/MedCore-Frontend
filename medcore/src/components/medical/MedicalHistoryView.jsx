// src/components/medical/MedicalHistoryView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  const [records, setRecords]   = useState([]);   // SIEMPRE un array
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        // Ajusta si tu endpoint es otro:
        const res = await fetch(`http://localhost:3005/api/v1/medical-records?patientId=${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.message || "Error al obtener historias");

        // 🔧 Normaliza SIEMPRE a []
        const list = normalizeRecords(json);
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

  if (!records.length) {
    return <p className="loading">Este paciente no tiene registros aún.</p>;
  }

  return (
    <div className="doctors-list-container">
      <h1 className="title">Historia clínica</h1>

      <table className="doctors-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Síntomas</th>
            <th>Diagnóstico</th>
            <th>Tratamiento</th>
            <th>Notas</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{new Date(r.date || r.createdAt).toLocaleString()}</td>
              <td>{r.symptoms}</td>
              <td>{r.diagnosis}</td>
              <td>{r.treatment}</td>
              <td>{r.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
