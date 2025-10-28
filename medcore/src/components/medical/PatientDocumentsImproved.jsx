// src/components/medical/PatientDocumentsImproved.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { medicalRecordsService, documentsService } from "../../utils/adminService";
import { userService } from "../../utils/userService";
import "./PatientDocumentsImproved.css";

// Modal component for document viewing (reusing existing)
const DocumentModal = ({ document, onClose, onDownload, onDelete }) => {
  const [documentUrl, setDocumentUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isImage = document?.fileType && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(document.fileType.toLowerCase());
  const isPDF = document?.fileType?.toLowerCase() === 'pdf';

  useEffect(() => {
    const loadDocumentUrl = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = await documentsService.downloadBlob(document.id);
        setDocumentUrl(url);
      } catch (err) {
        console.error('Error loading document:', err);
        setError('Error al cargar el documento');
      } finally {
        setLoading(false);
      }
    };

    if (document?.id) {
      loadDocumentUrl();
    }

    // Cleanup: revoke object URL when component unmounts
    return () => {
      if (documentUrl) {
        URL.revokeObjectURL(documentUrl);
      }
    };
  }, [document?.id]);
  
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
              Descargar
            </button>
            <button 
              className="action-button delete-button" 
              onClick={handleDelete}
            >
              Eliminar
            </button>
            <button className="close-button" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
        <div className="modal-body">
          {loading && (
            <div className="loading-container">
              <p>Cargando documento...</p>
            </div>
          )}
          {error && (
            <div className="error-container">
              <p>{error}</p>
              <button 
                className="action-button download-button" 
                onClick={handleDownload}
              >
                Descargar archivo
              </button>
            </div>
          )}
          {!loading && !error && documentUrl && isPDF && (
            <div className="pdf-viewer-container">
              <div className="pdf-viewer-options">
                <p><strong>Vista previa del PDF:</strong> {document.filename}</p>
                <div className="pdf-actions">
                  <button 
                    className="action-button download-button" 
                    onClick={handleDownload}
                    style={{ marginRight: '10px' }}
                  >
                    Descargar PDF
                  </button>
                  <a 
                    href={documentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="action-button"
                    style={{ textDecoration: 'none', backgroundColor: '#007bff', color: 'white' }}
                  >
                    Abrir en nueva pestaña
                  </a>
                </div>
              </div>
              
              {/* Intentar iframe primero */}
              <iframe
                src={documentUrl}
                className="document-viewer"
                title={document.filename}
                style={{ width: '100%', border: '1px solid #ddd' }}
                onLoad={() => {}}
                onError={() => {}}
              />
              
              <div className="pdf-note">
                <p style={{ margin: 0 }}>
                  <strong>Nota:</strong> Si el PDF no se muestra arriba, usa "Abrir en nueva pestaña" o "Descargar PDF"
                </p>
              </div>
            </div>
          )}
          {!loading && !error && documentUrl && isImage && (
            <img
              src={documentUrl}
              alt={document.filename}
              className="image-viewer"
            />
          )}
          {!loading && !error && !isPDF && !isImage && (
            <div className="unsupported-file">
              <h3>Vista previa no disponible</h3>
              <p>Este tipo de archivo no se puede visualizar en el navegador.</p>
              <button 
                className="action-button download-button" 
                onClick={handleDownload}
              >
                Descargar archivo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function PatientDocumentsImproved() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  const [documents, setDocuments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Upload form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState('');
  const [selectedDiagnostic, setSelectedDiagnostic] = useState('');
  const [availableDiagnostics, setAvailableDiagnostics] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, [patientId]);

  const loadInitialData = async () => {
    await Promise.all([
      loadDocuments(),
      loadMedicalRecords(),
      loadPatientInfo()
    ]);
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      
      const response = await documentsService.listByPatient(patientId);
      
      if (!response.ok) {
        throw new Error(response.data?.message || "Error al cargar documentos");
      }

      // Múltiples formas de estructura de respuesta
      const documentsData = response.data?.items ||           // Backend devuelve { items, total, page, pageSize }
                           response.data?.documents || 
                           response.data?.data || 
                           response.data || 
                           [];
      
      setDocuments(Array.isArray(documentsData) ? documentsData : []);
    } catch (err) {
      console.error("Error loading documents:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMedicalRecords = async () => {
    try {
      const response = await medicalRecordsService.list(patientId);
      
      if (response.ok) {
        const recordsData = response.data?.data || response.data || [];
        setMedicalRecords(Array.isArray(recordsData) ? recordsData : []);
      }
    } catch (err) {
      console.error("Error loading medical records:", err);
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

  // Load diagnostics when medical record is selected
  const handleMedicalRecordChange = async (recordId) => {
    setSelectedMedicalRecord(recordId);
    setSelectedDiagnostic('');
    setAvailableDiagnostics([]);

    if (recordId) {
      try {
        // Fetch diagnostics for this medical record
        const response = await fetch(`http://localhost:3001/api/v1/diagnosis/medical-record/${recordId}`, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          const diagnostics = data.data || data.diagnostics || data || [];
          setAvailableDiagnostics(Array.isArray(diagnostics) ? diagnostics : []);
        }
      } catch (err) {
        console.error("Error loading diagnostics:", err);
      }
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!selectedMedicalRecord || !selectedDiagnostic) {
      await Swal.fire({
        icon: 'warning',
        title: 'Selección requerida',
        text: 'Debe seleccionar una historia clínica y un diagnóstico antes de subir documentos.'
      });
      return;
    }

    try {
      setUploading(true);
      
      const file = files[0];

      const response = await documentsService.upload({
        file,
        patientId,
        medicalRecordId: selectedMedicalRecord,
        diagnosticId: selectedDiagnostic,
        description: `Documento adjunto a diagnóstico`,
        category: 'DIAGNOSTIC_ATTACHMENT'
      });
      
      if (!response.ok) {
        throw new Error(response.data?.message || "Error al subir documento");
      }

      await Swal.fire({
        icon: 'success',
        title: '✅ Documento subido',
        text: 'El documento se subió correctamente.',
        timer: 2000
      });

      // Reset form and reload
      setShowUploadForm(false);
      setSelectedMedicalRecord('');
      setSelectedDiagnostic('');
      setAvailableDiagnostics([]);
      event.target.value = ''; // Clear file input
      await loadDocuments();

    } catch (err) {
      console.error("Error uploading document:", err);
      await Swal.fire({
        icon: 'error',
        title: 'Error al subir',
        text: err.message || 'Error al subir el documento'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadDocument = async (doc) => {
    try {
      // Usar el método con autenticación para descargar
      const blobUrl = await documentsService.downloadBlob(doc.id);
      
      // Crear elemento temporal para forzar descarga
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = doc.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar la URL del blob
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Error downloading document:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Error de descarga',
        text: 'No se pudo descargar el documento'
      });
    }
  };

  const handleDeleteDocument = async (document) => {
    const result = await Swal.fire({
      title: '¿Eliminar documento?',
      text: `¿Está seguro de eliminar "${document.filename}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await documentsService.remove(document.id);
        
        if (!response.ok) {
          throw new Error(response.data?.message || "Error al eliminar documento");
        }

        await Swal.fire({
          icon: 'success',
          title: 'Documento eliminado',
          text: 'El documento fue eliminado correctamente.',
          timer: 2000
        });

        setSelectedDocument(null);
        await loadDocuments();
      } catch (err) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'Error al eliminar el documento'
        });
      }
    }
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
    return (
      <div className="patient-documents">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando documentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-documents">
      {/* Header */}
      <div className="documents-header">
        <div className="header-content">
          <button 
            className="back-button" 
            onClick={() => navigate('/DashboardPatientsList')}
          >
            ← Volver a Pacientes
          </button>
          
          <div className="patient-info">
            <h1>Documentos del Paciente</h1>
            {patientInfo && (
              <p className="patient-name">
                {patientInfo.firstName} {patientInfo.lastName}
              </p>
            )}
          </div>

          <div className="header-actions">
            <button 
              className="history-button"
              onClick={() => navigate(`/dashboard/medical-history/${patientId}`)}
            >
              Ver Historia Clínica
            </button>
            <button 
              className="new-history-button"
              onClick={() => navigate(`/dashboard/medical-history/new?patientId=${patientId}`)}
            >
              + Nueva Historia
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Upload Section */}
      <div className="upload-section">
        <div className="upload-card">
          <h3>Subir Documentos</h3>
          
          {medicalRecords.length === 0 ? (
            <div className="no-records-message">
              <p>⚠️ Este paciente no tiene historias clínicas registradas.</p>
              <button 
                className="create-history-button"
                onClick={() => navigate(`/dashboard/medical-history/new?patientId=${patientId}`)}
              >
                Crear Primera Historia Clínica
              </button>
            </div>
          ) : (
            <>
              {!showUploadForm ? (
                <button 
                  className="show-upload-button"
                  onClick={() => setShowUploadForm(true)}
                >
                  Subir Nuevo Documento
                </button>
              ) : (
                <div className="upload-form">
                  <div className="form-group">
                    <label>Historia Clínica:</label>
                    <select 
                      value={selectedMedicalRecord}
                      onChange={(e) => handleMedicalRecordChange(e.target.value)}
                      required
                    >
                      <option value="">Seleccione una historia clínica</option>
                      {medicalRecords.map(record => (
                        <option key={record.id} value={record.id}>
                          {formatDate(record.date || record.createdAt)} - {record.diagnosis}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedMedicalRecord && (
                    <div className="form-group">
                      <label>Diagnóstico:</label>
                      <select 
                        value={selectedDiagnostic}
                        onChange={(e) => setSelectedDiagnostic(e.target.value)}
                        required
                      >
                        <option value="">Seleccione un diagnóstico</option>
                        {availableDiagnostics.map(diagnostic => (
                          <option key={diagnostic.id} value={diagnostic.id}>
                            {diagnostic.title} - {diagnostic.diagnosis}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Archivo:</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      disabled={uploading || !selectedMedicalRecord || !selectedDiagnostic}
                    />
                    <small>Formatos permitidos: PDF, JPG, PNG (máx. 10MB)</small>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button"
                      className="cancel-button"
                      onClick={() => {
                        setShowUploadForm(false);
                        setSelectedMedicalRecord('');
                        setSelectedDiagnostic('');
                        setAvailableDiagnostics([]);
                      }}
                    >
                      Cancelar
                    </button>
                  </div>

                  {uploading && (
                    <div className="uploading-message">
                      <div className="spinner small"></div>
                      <span>Subiendo documento...</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="documents-container">
        {documents.length === 0 ? (
          <div className="empty-documents">
            <div className="empty-icon">📄</div>
            <h3>No hay documentos</h3>
            <p>Este paciente no tiene documentos adjuntos.</p>
          </div>
        ) : (
          <div className="documents-grid">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="document-card"
                onClick={() => setSelectedDocument(doc)}
              >
                <div className="document-icon">
                  {doc.fileType?.toLowerCase() === 'pdf' ? '📄' : '🖼️'}
                </div>
                <div className="document-info">
                  <h4 className="document-name">{doc.filename}</h4>
                  <p className="document-date">{formatDate(doc.createdAt)}</p>
                  <p className="document-size">
                    {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Modal */}
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

export default PatientDocumentsImproved;