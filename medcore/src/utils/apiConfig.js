/**
 * Configuración centralizada para conexión a los microservicios
 * a través del API Gateway
 */

// Base del API (lee REACT_APP_API_BASE_URL o por defecto localhost:3001)
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Exporta la base por si otros módulos la necesitan
export const API_GATEWAY_URL = API_BASE;

// el resto de endpoints tal cual:
export const AUTH_ENDPOINTS = {
  SIGN_IN: `${API_GATEWAY_URL}/api/v1/auth/sign-in`,
  SIGN_UP: `${API_GATEWAY_URL}/api/v1/auth/sign-up`,
  VERIFY_EMAIL: `${API_GATEWAY_URL}/api/v1/auth/verify-email`,
};

// Endpoints para gestión de usuarios
export const USER_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/users`,
  GET_BY_ID: (id) => `${API_GATEWAY_URL}/api/v1/users/${id}`,
  ACTIVATE: (id) => `${API_GATEWAY_URL}/api/v1/users/${id}/activate`,
  DEACTIVATE: (id) => `${API_GATEWAY_URL}/api/v1/users/${id}/deactivate`,
  UPDATE_PASSWORD: (id) => `${API_GATEWAY_URL}/api/v1/users/${id}/password`,
};

// Endpoints para gestión de departamentos
export const DEPT_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/departments`,
  GET_BY_ID: (id) => `${API_GATEWAY_URL}/api/v1/departments/${id}`,
};

// Endpoints para gestión de afiliaciones
export const AFFILIATION_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/affiliations`,
  GET_BY_ID: (id) => `${API_GATEWAY_URL}/api/v1/affiliations/${id}`,
};

// Endpoints para gestión de especialidades
export const SPECIALITY_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/specialities`,
  GET_BY_ID: (id) => `${API_GATEWAY_URL}/api/v1/specialities/${id}`,
};

// Endpoints para gestión de pacientes
export const PATIENT_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/patients`,
  GET_BY_ID: (id) => `${API_GATEWAY_URL}/api/v1/patients/${id}`,
  GET_MEDICAL_HISTORY: (id) => `${API_GATEWAY_URL}/api/v1/patients/${id}/medical-history`,
};

// Endpoints para auditoría
export const AUDIT_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/audit`,
  GET_BY_ENTITY: (entity, id) => `${API_GATEWAY_URL}/api/v1/audit/${entity}/${id}`,
};

// Endpoints para historial médico
export const MEDICAL_RECORDS_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/medical-records`,
  GET_BY_ID: (id) => `${API_GATEWAY_URL}/api/v1/medical-records/${id}`,
  // tu back lista con filtros; si soporta ?patientId=:
  LIST: (patientId) =>
    patientId ? `${API_GATEWAY_URL}/api/v1/medical-records?patientId=${encodeURIComponent(patientId)}`
              : `${API_GATEWAY_URL}/api/v1/medical-records`,
};

// Documents (adjuntos)
export const DOCUMENTS_ENDPOINTS = {
  UPLOAD: `${API_GATEWAY_URL}/api/v1/documents/upload`,                 // POST multipart
  BY_PATIENT: (id) => `${API_GATEWAY_URL}/api/v1/documents/patient/${id}`, // GET
  GET_BY_ID: (id) => `${API_GATEWAY_URL}/api/v1/documents/${id}`,          // GET (descarga)
  DELETE: (id) => `${API_GATEWAY_URL}/api/v1/documents/${id}`,             // DELETE
};

// Diagnosis (crear para un paciente — multipart si subes archivos)
export const DIAGNOSIS_ENDPOINTS = {
  CREATE_FOR_PATIENT: (patientId) => `${API_GATEWAY_URL}/api/v1/diagnosis/${patientId}/diagnostics`,
};