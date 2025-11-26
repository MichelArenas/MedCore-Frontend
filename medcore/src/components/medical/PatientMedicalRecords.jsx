// src/components/medical/PatientMedicalRecords.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import medicalRecordService from '../../services/medicalRecordService';
// Ajuste: userService está en utils y es un named export
import { userService } from '../../utils/userService';
import './PatientMedicalRecords.css';

function PatientMedicalRecords() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    symptoms: '',
    diagnosis: '',
    treatment: '',
    notes: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMedicalRecords();
    loadPatientInfo();
  }, [patientId]);

  const loadMedicalRecords = async () => {
    try {
      setLoading(true);
      const response = await medicalRecordService.getPatientMedicalRecords(patientId);
      
      if (!response.ok) {
        throw new Error(response.data?.message || "Error al cargar historias clínicas");
      }

      // El servicio devuelve un objeto { items: [...], total, patientId }
      const payload = response.data || {};
      const items = Array.isArray(payload) ? payload : (payload.items || []);
      setMedicalRecords(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Error loading medical records:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPatientInfo = async () => {
    try {
      const response = await userService.getUserById(patientId);
      if (response.ok) {
        setPatientInfo(response.data);
      }
    } catch (err) {
      console.error("Error loading patient info:", err);
    }
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    
    if (!formData.symptoms.trim() || !formData.diagnosis.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Los campos Síntomas y Diagnóstico son obligatorios.'
      });
      return;
    }

    try {
      setSaving(true);
      
      const recordData = {
        patientId,
        symptoms: formData.symptoms,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment || '',
        notes: formData.notes || ''
      };

      const response = await medicalRecordService.createMedicalRecord(recordData);
      
      if (!response.ok) {
        throw new Error(response.data?.message || "Error al crear historia clínica");
      }

      await Swal.fire({
        icon: 'success',
        title: '✅ Historia clínica creada',
        text: 'La historia clínica se creó correctamente.',
        timer: 2000
      });

      // Resetear formulario y recargar lista
      setFormData({
        symptoms: '',
        diagnosis: '',
        treatment: '',
        notes: ''
      });
      setShowCreateForm(false);
      await loadMedicalRecords();

    } catch (err) {
      console.error("Error creating medical record:", err);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Error al crear la historia clínica'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleViewDiagnostics = (recordId) => {
    navigate(`/dashboard/medical-records/${recordId}/diagnostics`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="patient-medical-records">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando historias clínicas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-medical-records">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <button 
            className="back-button" 
            onClick={() => navigate('/dashboard/patients')}
          >
            ← Volver a Pacientes
          </button>
          
          <div className="patient-info">
            <h1>Historias Clínicas</h1>
            {patientInfo && (
              <p className="patient-name">
                Paciente: {patientInfo.firstName} {patientInfo.lastName}
              </p>
            )}
          </div>

          <button 
            className="create-button"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancelar' : '+ Nueva Historia Clínica'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Formulario de creación */}
      {showCreateForm && (
        <div className="create-form-container">
          <div className="create-form-card">
            <h3>Nueva Historia Clínica</h3>
            <form onSubmit={handleCreateRecord}>
              <div className="form-group">
                <label htmlFor="symptoms">Síntomas *</label>
                <textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                  placeholder="Describa los síntomas presentados por el paciente..."
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="diagnosis">Diagnóstico *</label>
                <textarea
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                  placeholder="Diagnóstico médico..."
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="treatment">Tratamiento</label>
                <textarea
                  id="treatment"
                  value={formData.treatment}
                  onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                  placeholder="Plan de tratamiento recomendado..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notas adicionales</label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Notas adicionales, observaciones..."
                  rows="3"
                />
              </div>

              <div className="form-buttons">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Crear Historia Clínica'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de historias clínicas */}
      <div className="records-container">
        {medicalRecords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No hay historias clínicas</h3>
            <p>Este paciente no tiene historias clínicas registradas.</p>
            <button 
              className="create-first-button"
              onClick={() => setShowCreateForm(true)}
            >
              Crear primera historia clínica
            </button>
          </div>
        ) : (
          <div className="records-grid">
            {medicalRecords.map((record) => (
              <div key={record.id} className="record-card">
                <div className="record-header">
                  <div className="record-date">
                    {formatDate(record.date || record.createdAt)}
                  </div>
                  <div className={`record-status ${record.status}`}>
                    {record.status === 'active' ? 'Activa' : 'Archivada'}
                  </div>
                </div>

                <div className="record-content">
                  <div className="record-field">
                    <strong>Síntomas:</strong>
                    <p>{record.symptoms}</p>
                  </div>

                  <div className="record-field">
                    <strong>Diagnóstico:</strong>
                    <p>{record.diagnosis}</p>
                  </div>

                  {record.treatment && (
                    <div className="record-field">
                      <strong>Tratamiento:</strong>
                      <p>{record.treatment}</p>
                    </div>
                  )}

                  {record.notes && (
                    <div className="record-field">
                      <strong>Notas:</strong>
                      <p>{record.notes}</p>
                    </div>
                  )}
                </div>

                <div className="record-actions">
                  <button 
                    className="diagnostics-button"
                    onClick={() => handleViewDiagnostics(record.id)}
                  >
                    Ver Diagnósticos ({record.diagnostic?.length || 0})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientMedicalRecords;