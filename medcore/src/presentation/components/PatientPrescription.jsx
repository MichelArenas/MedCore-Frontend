// src/components/PatientPrescriptions.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import "./PatientPrescriptions.css";
import Swal from "sweetalert2";

function PatientPrescriptions() {
  const { patientId } = useParams();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("PatientId recibido en params:", patientId);
    fetchPatientInfo();
    fetchPrescriptions();
  }, [patientId]);

  const fetchPatientInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3003/api/v1/users/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setPatientInfo(data);
    } catch (err) {
      console.error("Error cargando info del paciente:", err);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Llamando a API con patientId:", patientId);
      
      const response = await fetch(
        `http://localhost:3005/api/v1/prescriptions/patient/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Respuesta de prescripciones:", data);
      
      setPrescriptions(data.items || []);
    } catch (err) {
      console.error("Error cargando prescripciones:", err);
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "Error al cargar prescripciones",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (prescription) => {
    Swal.fire({
      title: "Detalles de la Prescripción",
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Fecha:</strong> ${new Date(prescription.prescriptionDate).toLocaleDateString()}</p>
          <p><strong>Medicamentos:</strong> ${prescription.medications || "N/A"}</p>
          <p><strong>Dosis:</strong> ${prescription.dosage || "N/A"}</p>
          <p><strong>Frecuencia:</strong> ${prescription.frequency || "N/A"}</p>
          <p><strong>Duración:</strong> ${prescription.duration || "N/A"}</p>
          ${prescription.notes ? `<p><strong>Notas:</strong> ${prescription.notes}</p>` : ""}
        </div>
      `,
      width: 600,
      confirmButtonText: "Cerrar",
    });
  };

  if (loading) {
    return (
      <div className="prescriptions-container">
        <p className="loading">Cargando prescripciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prescriptions-container">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="prescriptions-container">
      <div className="header-section">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        
        <div className="patient-info-header">
          <h1>Prescripciones Médicas</h1>
          {patientInfo && (
            <div className="patient-summary">
              <p><strong>Paciente:</strong> {patientInfo.fullname}</p>
              <p><strong>Documento:</strong> {patientInfo.id_number}</p>
            </div>
          )}
        </div>
      </div>

      {prescriptions.length === 0 ? (
        <div className="no-data">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/>
            <path d="M14 8H8m6 4H8"/>
          </svg>
          <p>No se encontraron prescripciones para este paciente</p>
        </div>
      ) : (
        <div className="prescriptions-grid">
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="prescription-card">
              <div className="card-header">
                <div className="prescription-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/>
                    <path d="M14 8H8m6 4H8"/>
                  </svg>
                </div>
                <span className="prescription-date">
                  {new Date(prescription.prescriptionDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="card-body">
                <div className="info-row">
                  <strong>Medicamentos:</strong>
                  <span>{prescription.medications || "No especificado"}</span>
                </div>
                
                <div className="info-row">
                  <strong>Dosis:</strong>
                  <span>{prescription.dosage || "No especificado"}</span>
                </div>
                
                <div className="info-row">
                  <strong>Frecuencia:</strong>
                  <span>{prescription.frequency || "No especificado"}</span>
                </div>
                
                <div className="info-row">
                  <strong>Duración:</strong>
                  <span>{prescription.duration || "No especificado"}</span>
                </div>

                {prescription.notes && (
                  <div className="notes-section">
                    <strong>Notas:</strong>
                    <p>{prescription.notes}</p>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <button
                  className="btn-details"
                  onClick={() => handleViewDetails(prescription)}
                >
                  Ver Detalles Completos
                </button>
                
                {prescription.medicalRecord && (
                  <button
                    className="btn-history"
                    onClick={() => navigate(`/dashboard/medical-history/${patientId}`)}
                  >
                    Ver Historia Clínica
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="prescriptions-summary">
        <p>Total de prescripciones: <strong>{prescriptions.length}</strong></p>
      </div>
    </div>
  );
}

export default PatientPrescriptions;