import React from "react";
import "./PrescriptionPreview.css";

function PrescriptionPreview({ prescription, onEdit, onConfirm }) {
  if (!prescription) {
    return <p>No hay datos para mostrar.</p>;
  }

  const items = prescription.items ?? []; // Asegura array

  return (
    <div className="prescription-preview-container">
      <h2 className="preview-title">Vista previa de la Prescripción</h2>

      <div className="preview-card">

        {/* ===================== */}
        {/* INFO PACIENTE & MÉDICO */}
        {/* ===================== */}
        <h3>Información del Paciente</h3>
        <p><strong>Paciente:</strong> {prescription.patientName}</p>
        <p><strong>ID Paciente:</strong> {prescription.patientId}</p>

        <h3>Información del Médico</h3>
        <p><strong>Médico:</strong> {prescription.doctorName}</p>
        <p><strong>ID Médico:</strong> {prescription.doctorId}</p>

        <h3>Datos de la Historia Clínica</h3>
        <p><strong>ID Historia:</strong> {prescription.medicalRecordId}</p>

        {/* ===================== */}
        {/* MEDICAMENTO PRINCIPAL */}
        {/* ===================== */}
        <h3>Medicamento Principal</h3>
        <p><strong>Medicamento:</strong> {prescription.medication}</p>
        <p><strong>Tipo:</strong> {prescription.medicationType || "No especificado"}</p>
        <p><strong>Dosificación:</strong> {prescription.dosage}</p>
        <p><strong>Frecuencia:</strong> {prescription.frequency}</p>
        <p><strong>Duración:</strong> {prescription.duration}</p>

        {prescription.instructions && (
          <p><strong>Instrucciones adicionales:</strong> {prescription.instructions}</p>
        )}

        {/* ========================== */}
        {/* LISTA DE ITEMS ADICIONALES */}
        {/* ========================== */}
        {items.length > 0 && (
          <>
            <h3>Medicamentos Adicionales</h3>
            <ul className="items-list">
              {items.map((item, index) => (
                <li key={index} className="item-entry">
                  <p><strong>Medicamento:</strong> {item.medication}</p>
                  <p><strong>Dosificación:</strong> {item.dosage}</p>
                  <p><strong>Frecuencia:</strong> {item.frequency}</p>
                  <p><strong>Duración:</strong> {item.duration}</p>
                  {item.instructions && (
                    <p><strong>Instrucciones:</strong> {item.instructions}</p>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        <h3>Fecha</h3>
        <p>{new Date().toLocaleDateString()}</p>

      </div>

      <div className="preview-actions">
        <button className="btn-edit" onClick={onEdit}>Editar</button>
        <button className="btn-confirm" onClick={onConfirm}>Confirmar y Generar PDF</button>
      </div>
    </div>
  );
}

export default PrescriptionPreview;
