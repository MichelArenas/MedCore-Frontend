/**
 * Configuración centralizada para conexión a los microservicios
 * a través del API Gateway
 */

// Base del API (lee REACT_APP_API_BASE_URL o por defecto localhost:3001)
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
const API_QUEUE = process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:3008'; //TEMPORAL

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
// Endpoints para pacientes (según rutas actuales del gateway bajo /api/v1/users/patients)
export const PATIENT_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/users/patients`,
  GET_BY_ID: (id) => `${API_GATEWAY_URL}/api/v1/users/patients/${id}`,
  GET_MEDICAL_HISTORY: (id) => `${API_GATEWAY_URL}/api/v1/users/patients/${id}/medical-history`,
};

// Endpoints para auditoría
export const AUDIT_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/audit`,
  GET_BY_ENTITY: (entity, id) => `${API_GATEWAY_URL}/api/v1/audit/${entity}/${id}`,
};

// Endpoints para historial médico
export const MEDICAL_RECORDS_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/medical-records`,
  // listar historias de un paciente
  BY_PATIENT: (patientId) => `${API_GATEWAY_URL}/api/v1/medical-records/by-patient/${patientId}`,
  // obtener una historia por su id (recordId)
  GET_BY_ID: (recordId) => `${API_GATEWAY_URL}/api/v1/medical-records/${recordId}`,
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

//Gestion de cola
//Unirse a la cola de espera
export const QUEUE_ENDPOINTS = {
  JOIN_QUEUE: `${API_QUEUE}/api/v1/queue/join`,
  GET_QUEUE_MEDICO: (doctorid) => `${API_QUEUE}/api/v1/queue/doctor/${doctorid}/current`,
  POST_CALL_NEXT:(doctorid) => `${API_QUEUE}/api/v1/queue/doctor/${doctorid}/call-next`,
  PUT_COMPLETE_CURRENT:(ticketid) => `${API_QUEUE}/api/v1/queue/ticket/${ticketid}/complete`,
  GET_POSITION_IN_QUEUE:(ticketid) => `${API_QUEUE}/api/v1/queue/ticket/${ticketid}/position`,

   // Agrega esto:
  PUT_MARK_NO_SHOW: (ticketId) => `/queue/${ticketId}/no-show`,
  
  GET_POSITION_IN_QUEUE: (ticketId) => `/queue/${ticketId}/position`,

};