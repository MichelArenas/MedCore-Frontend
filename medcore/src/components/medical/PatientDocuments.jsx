// src/components/medical/PatientDocuments.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { documentService } from "../../utils/documentService";
import { userService } from "../../utils/userService";
import { medicalRecordsService } from "../../utils/adminService";
import "./PatientDocuments.css";

// Modal component for document viewing
const DocumentModal = ({ document, onClose, onDownload, onDelete }) => {
  const isImage = document?.fileType && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(document.fileType.toLowerCase());
  const isPDF = document?.fileType?.toLowerCase() === 'pdf';
  
  const handleDownload = () => {
    onDownload(document);
  };

  const handleDelete = () => {
    onDelete(document);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="document-modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{document?.filename}</h3>
          <div className="modal-actions">
            <button 
              className="action-button download-button" 
              onClick={handleDownload}
            >
              📥 Descargar
            </button>
            <button 
              className="action-button delete-button" 
              onClick={handleDelete}
            >
              🗑️ Eliminar
            </button>
            <button className="close-button" onClick={onClose}>
              ✕ Cerrar
            </button>
          </div>
        </div>
        <div className="modal-body">
          {isPDF && (
            <iframe
              src={documentService.getDocumentViewUrl(document.id)}
              className="document-viewer"
              title={document.filename}
            />
          )}
          {isImage && (
            <img
              src={documentService.getDocumentViewUrl(document.id)}
              alt={document.filename}
              className="image-viewer"
            />
          )}
          {!isPDF && !isImage && (
            <div className="unsupported-file">
              <h3>Vista previa no disponible</h3>
              <p>Este tipo de archivo no se puede visualizar en el navegador.</p>
              <button 
                className="action-button download-button" 
                onClick={handleDownload}
              >
                📥 Descargar para abrir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main component
function PatientDocuments() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  const [documents, setDocuments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedMedicalRecordId, setSelectedMedicalRecordId] = useState("");
  const [diagnostics, setDiagnostics] = useState([]);
  const [selectedDiagnosticId, setSelectedDiagnosticId] = useState("");
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Load documents and patient info
  useEffect(() => {
    loadDocuments();
    loadPatientInfo();
    loadMedicalRecords();
  }, [patientId]);

  useEffect(() => {
    if (selectedMedicalRecordId) {
      loadDiagnosticsForMedicalRecord(selectedMedicalRecordId);
    } else {
      setDiagnostics([]);
      setSelectedDiagnosticId("");
    }
  }, [selectedMedicalRecordId]);
  const loadMedicalRecords = async () => {
    try {
      const res = await medicalRecordsService.list(patientId);
      if (res.ok) {
        const items = res.data?.items || res.data?.data || res.data || [];
        setMedicalRecords(Array.isArray(items) ? items : []);
        // Auto-seleccionar el primero si existe
        if (items.length > 0) {
          setSelectedMedicalRecordId(items[0].id);
        }
      }
    } catch (err) {
      console.error("Error cargando historias clínicas para documentos:", err);
    }
  };

  const loadDiagnosticsForMedicalRecord = async (medicalRecordId) => {
    try {
      // Endpoint backend: /api/v1/diagnosis/medical-record/:medicalRecordId
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'}/api/v1/diagnosis/medical-record/${medicalRecordId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let data = [];
      if (res.ok) {
        const json = await res.json();
        data = json.data || [];
      }
      setDiagnostics(Array.isArray(data) ? data : []);
      // Auto-seleccionar el primero si existe
      if (data.length > 0) {
        setSelectedDiagnosticId(data[0].id);
      } else {
        setSelectedDiagnosticId("");
      }
    } catch (err) {
      console.error("Error cargando diagnósticos:", err);
      setDiagnostics([]);
      setSelectedDiagnosticId("");
    }
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getPatientDocuments(patientId);
      
      if (!response.ok) {
        throw new Error(response.data?.message || "Error al cargar documentos");
      }

      console.log("Response structure in PatientDocuments.jsx:", response);
      const documentsData = response.data?.items || response.data?.documents || response.data?.data || response.data || [];
      setDocuments(Array.isArray(documentsData) ? documentsData : []);
    } catch (err) {
      console.error("Error loading documents:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPatientInfo = async () => {
    try {
      // Assuming we can get patient info by getUserById or similar
      const response = await userService.getUserById(patientId);
      if (response.ok) {
        setPatientInfo(response.data);
      }
    } catch (err) {
      console.error("Error loading patient info:", err);
      // Don't set error state for this, as documents are more important
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      
      // Note: Backend only accepts one file at a time
      const file = files[0]; // Solo tomar el primer archivo
      
      if (!file) {
        throw new Error('No se seleccionó ningún archivo');
      }
      
      if (!selectedMedicalRecordId) {
        throw new Error('Seleccione una historia clínica para asociar el documento');
      }
      if (!selectedDiagnosticId) {
        throw new Error('La historia clínica seleccionada no tiene diagnósticos. Cree un diagnóstico antes de subir documentos.');
      }

      const formData = new FormData();
      formData.append('patientId', patientId);
      formData.append('medicalRecordId', selectedMedicalRecordId);
      formData.append('diagnosticId', selectedDiagnosticId);
      formData.append('document', file); // El backend espera 'document'

      const response = await documentService.uploadDocument(formData);
      
      if (!response.ok) {
        throw new Error(response.data?.message || "Error al subir documentos");
      }

      await Swal.fire({
        icon: 'success',
        title: '✅ Documento subido',
        text: 'El documento se subió correctamente.',
        timer: 2000,
        showConfirmButton: false
      });

      // Reload documents
      await loadDocuments();
      
      // Clear file input
      event.target.value = '';
      
    } catch (err) {
      console.error("Error uploading documents:", err);
      Swal.fire({
        icon: 'error',
        title: '❌ Error al subir',
        text: err.message,
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
  };

  const handleDownloadDocument = async (document) => {
    try {
      await documentService.downloadDocument(document.id, document.filename);
      
      Swal.fire({
        icon: 'success',
        title: '📥 Descarga iniciada',
        text: 'El documento se está descargando.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error("Error downloading document:", err);
      Swal.fire({
        icon: 'error',
        title: '❌ Error al descargar',
        text: 'No se pudo descargar el documento.',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleDeleteDocument = async (document) => {
    const result = await Swal.fire({
      title: '¿Eliminar documento?',
      text: `¿Estás seguro de que quieres eliminar "${document.filename}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await documentService.deleteDocument(document.id);
        
        if (!response.ok) {
          throw new Error(response.data?.message || "Error al eliminar documento");
        }

        await Swal.fire({
          icon: 'success',
          title: '✅ Documento eliminado',
          text: 'El documento se eliminó correctamente.',
          timer: 1500,
          showConfirmButton: false
        });

        // Close modal if this document was being viewed
        if (selectedDocument?.id === document.id) {
          setSelectedDocument(null);
        }

        // Reload documents
        await loadDocuments();
        
      } catch (err) {
        console.error("Error deleting document:", err);
        Swal.fire({
          icon: 'error',
          title: '❌ Error al eliminar',
          text: err.message,
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const getDocumentIcon = (fileType) => {
    const type = fileType?.toLowerCase() || '';
    
    if (type === 'pdf') return { icon: '📄', class: 'pdf' };
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(type)) return { icon: '🖼️', class: 'image' };
    if (['doc', 'docx'].includes(type)) return { icon: '📝', class: 'doc' };
    if (['xls', 'xlsx'].includes(type)) return { icon: '📊', class: 'doc' };
    
    return { icon: '📎', class: 'default' };
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Cargando documentos...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h3>Error al cargar documentos</h3>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="upload-button">
          ← Volver
        </button>
      </div>
    );
  }

  return (
    <div className="documents-container">
      <div className="documents-header">
        <div>
          <h1 className="documents-title">Documentos Médicos</h1>
          {patientInfo && (
            <p className="patient-info">
              Paciente: {patientInfo.fullname} - {patientInfo.email}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate(-1)} className="upload-button" style={{ background: '#6b7280' }}>
            ← Volver
          </button>
          <label className="upload-button" style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}>
            {uploading ? '⏳ Subiendo...' : '📤 Subir Documentos'}
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.webp"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {/* Selector de Historia Clínica y Diagnóstico */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ minWidth: '240px' }}>
          <label style={{ fontWeight: '600', display: 'block', marginBottom: '4px' }}>Historia Clínica</label>
          <select
            value={selectedMedicalRecordId}
            onChange={(e) => setSelectedMedicalRecordId(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="">-- Seleccione --</option>
            {medicalRecords.map(r => (
              <option key={r.id} value={r.id}>{new Date(r.date || r.createdAt).toLocaleDateString('es-ES')} - {r.diagnosis || 'Sin diagnóstico'}</option>
            ))}
          </select>
        </div>
        <div style={{ minWidth: '240px' }}>
          <label style={{ fontWeight: '600', display: 'block', marginBottom: '4px' }}>Diagnóstico</label>
          <select
            value={selectedDiagnosticId}
            onChange={(e) => setSelectedDiagnosticId(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
            disabled={!selectedMedicalRecordId || diagnostics.length === 0}
          >
            <option value="">{diagnostics.length === 0 ? 'No hay diagnósticos' : '-- Seleccione --'}</option>
            {diagnostics.map(d => (
              <option key={d.id} value={d.id}>{d.title || d.diagnosis || 'Diagnóstico'}</option>
            ))}
          </select>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="empty-state">
          <h3>No hay documentos</h3>
          <p>Este paciente no tiene documentos médicos cargados.</p>
          <label className="upload-button">
            📤 Subir primer documento
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.webp"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      ) : (
        <div className="documents-grid">
          {documents.map((document) => {
            const { icon, class: iconClass } = getDocumentIcon(document.fileType);
            
            return (
              <div key={document.id} className="document-card">
                <div className={`document-icon ${iconClass}`}>
                  {icon}
                </div>
                <div className="document-name">{document.filename}</div>
                <div className="document-meta">
                  Tamaño: {formatFileSize(document.fileSize || 0)}
                </div>
                <div className="document-meta">
                  Subido: {formatDate(document.createdAt)}
                </div>
                {document.description && (
                  <div className="document-meta">
                    {document.description}
                  </div>
                )}
                
                <div className="document-actions">
                  <button 
                    className="action-button view-button"
                    onClick={() => handleViewDocument(document)}
                  >
                    👁️ Ver
                  </button>
                  <button 
                    className="action-button download-button"
                    onClick={() => handleDownloadDocument(document)}
                  >
                    📥 Descargar
                  </button>
                  <button 
                    className="action-button delete-button"
                    onClick={() => handleDeleteDocument(document)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedDocument && (
        <DocumentModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onDownload={handleDownloadDocument}
          onDelete={handleDeleteDocument}
        />
      )}
    </div>
  );
}

export default PatientDocuments;