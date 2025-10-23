/**
 * Servicios para los paneles de administración
 */

import { get, post, put, del, apiRequest } from './apiService';
import { 
  DEPT_ENDPOINTS, 
  AFFILIATION_ENDPOINTS, 
  SPECIALITY_ENDPOINTS,
  PATIENT_ENDPOINTS,
  MEDICAL_RECORDS_ENDPOINTS,
  AUDIT_ENDPOINTS,
  DOCUMENTS_ENDPOINTS,
  DIAGNOSIS_ENDPOINTS
} from './apiConfig';

/**
 * Servicio para gestión de departamentos
 */
export const departmentService = {
  /**
   * Obtener todos los departamentos
   * 
   * @returns {Promise<Object>} - Lista de departamentos
   */
  getAllDepartments: async () => {
    return await get(DEPT_ENDPOINTS.BASE);
  },

  /**
   * Obtener un departamento por ID
   * 
   * @param {string} id - ID del departamento
   * @returns {Promise<Object>} - Datos del departamento
   */
  getDepartmentById: async (id) => {
    return await get(DEPT_ENDPOINTS.GET_BY_ID(id));
  },

  /**
   * Crear un nuevo departamento
   * 
   * @param {Object} deptData - Datos del departamento a crear
   * @returns {Promise<Object>} - Departamento creado
   */
  createDepartment: async (deptData) => {
    return await post(DEPT_ENDPOINTS.BASE, deptData);
  },

  /**
   * Actualizar un departamento
   * 
   * @param {string} id - ID del departamento
   * @param {Object} deptData - Datos actualizados del departamento
   * @returns {Promise<Object>} - Departamento actualizado
   */
  updateDepartment: async (id, deptData) => {
    return await put(DEPT_ENDPOINTS.GET_BY_ID(id), deptData);
  },

  /**
   * Eliminar un departamento
   * 
   * @param {string} id - ID del departamento a eliminar
   * @returns {Promise<Object>} - Respuesta de la eliminación
   */
  deleteDepartment: async (id) => {
    return await del(DEPT_ENDPOINTS.GET_BY_ID(id));
  },
};

/**
 * Servicio para gestión de afiliaciones
 */
export const affiliationService = {
  /**
   * Obtener todas las afiliaciones
   * 
   * @returns {Promise<Object>} - Lista de afiliaciones
   */
  getAllAffiliations: async () => {
    return await get(AFFILIATION_ENDPOINTS.BASE);
  },

  /**
   * Obtener una afiliación por ID
   * 
   * @param {string} id - ID de la afiliación
   * @returns {Promise<Object>} - Datos de la afiliación
   */
  getAffiliationById: async (id) => {
    return await get(AFFILIATION_ENDPOINTS.GET_BY_ID(id));
  },

  /**
   * Crear una nueva afiliación
   * 
   * @param {Object} affData - Datos de la afiliación a crear
   * @returns {Promise<Object>} - Afiliación creada
   */
  createAffiliation: async (affData) => {
    return await post(AFFILIATION_ENDPOINTS.BASE, affData);
  },
};

/**
 * Servicio para gestión de especialidades
 */
export const specialityService = {
  /**
   * Obtener todas las especialidades
   * 
   * @returns {Promise<Object>} - Lista de especialidades
   */
  getAllSpecialities: async () => {
    return await get(SPECIALITY_ENDPOINTS.BASE);
  },

  /**
   * Obtener una especialidad por ID
   * 
   * @param {string} id - ID de la especialidad
   * @returns {Promise<Object>} - Datos de la especialidad
   */
  getSpecialityById: async (id) => {
    return await get(SPECIALITY_ENDPOINTS.GET_BY_ID(id));
  },

  /**
   * Crear una nueva especialidad
   * 
   * @param {Object} specData - Datos de la especialidad a crear
   * @returns {Promise<Object>} - Especialidad creada
   */
  createSpeciality: async (specData) => {
    return await post(SPECIALITY_ENDPOINTS.BASE, specData);
  },
};

/**
 * Servicio para gestión de pacientes
 */
export const patientService = {
  /**
   * Obtener todos los pacientes
   * 
   * @returns {Promise<Object>} - Lista de pacientes
   */
  getAllPatients: async () => {
    return await get(PATIENT_ENDPOINTS.BASE);
  },

  /**
   * Obtener un paciente por ID
   * 
   * @param {string} id - ID del paciente
   * @returns {Promise<Object>} - Datos del paciente
   */
  getPatientById: async (id) => {
    return await get(PATIENT_ENDPOINTS.GET_BY_ID(id));
  },

  /**
   * Obtener historial médico de un paciente
   * 
   * @param {string} id - ID del paciente
   * @returns {Promise<Object>} - Historial médico del paciente
   */
  getPatientMedicalHistory: async (id) => {
    return await get(PATIENT_ENDPOINTS.GET_MEDICAL_HISTORY(id));
  },
};

/**
 * Servicio para gestión de auditoría
 */
export const auditService = {
  /**
   * Obtener registros de auditoría
   * 
   * @returns {Promise<Object>} - Lista de registros de auditoría
   */
  getAllAuditRecords: async () => {
    return await get(AUDIT_ENDPOINTS.BASE);
  },

  /**
   * Obtener registros de auditoría por entidad
   * 
   * @param {string} entity - Tipo de entidad (User, Patient, etc.)
   * @param {string} id - ID de la entidad
   * @returns {Promise<Object>} - Lista de registros de auditoría para la entidad
   */
  getAuditRecordsByEntity: async (entity, id) => {
    return await get(AUDIT_ENDPOINTS.GET_BY_ENTITY(entity, id));
  },
};

// --- Medical Records ---
export const medicalRecordsService = {
  list: (patientId) => get(MEDICAL_RECORDS_ENDPOINTS.LIST(patientId)),
  getById: (id) => get(MEDICAL_RECORDS_ENDPOINTS.GET_BY_ID(id)),
  create: (payload) => post(MEDICAL_RECORDS_ENDPOINTS.BASE, payload),
  update: (id, payload) => put(MEDICAL_RECORDS_ENDPOINTS.GET_BY_ID(id), payload),
  archive: (id) => del(MEDICAL_RECORDS_ENDPOINTS.GET_BY_ID(id)),
};

// --- Documents (adjuntos) ---
export const documentsService = {
  listByPatient: (patientId) => get(DOCUMENTS_ENDPOINTS.BY_PATIENT(patientId)),
  upload: async ({ file, patientId, encounterId, diagnosisId, description, tags, category }) => {
    const fd = new FormData();
    fd.append("document", file);
    if (patientId) fd.append("patientId", patientId);
    if (encounterId) fd.append("encounterId", encounterId);
    if (diagnosisId) fd.append("diagnosisId", diagnosisId);
    if (description) fd.append("description", description);
    if (tags) fd.append("tags", tags);
    if (category) fd.append("category", category);

    return apiRequest(DOCUMENTS_ENDPOINTS.UPLOAD, {
      method: "POST",
      headers: {},
      body: fd,
    });
  },
  downloadUrl: (id) => DOCUMENTS_ENDPOINTS.GET_BY_ID(id), // <- FIX
  remove: (id) => del(DOCUMENTS_ENDPOINTS.DELETE(id)),
};

// --- Diagnosis (crear) ---
export const diagnosisService = {
  // Si envías SIN archivos: JSON
  createForPatientJson: (patientId, payload) =>
    post(DIAGNOSIS_ENDPOINTS.CREATE_FOR_PATIENT(patientId), payload),

  // Si envías CON archivos: multipart (como en Postman)
  createForPatientFormData: async (patientId, {
    title, description, diagnosis, treatment, observations, nextAppointment, medicalRecordId, files = []
  }) => {
    const fd = new FormData();
    if (title) fd.append("title", title);
    if (description) fd.append("description", description);
    if (diagnosis) fd.append("diagnosis", diagnosis);
    if (treatment) fd.append("treatment", treatment);
    if (observations) fd.append("observations", observations);
    if (nextAppointment) fd.append("nextAppointment", nextAppointment);
    if (medicalRecordId) fd.append("medicalRecordId", medicalRecordId);
    files.forEach(f => fd.append("documents", f)); // **clave** para múltiples archivos

    return apiRequest(DIAGNOSIS_ENDPOINTS.CREATE_FOR_PATIENT(patientId), {
      method: "POST",
      headers: {},
      body: fd,
    });
  },
};


