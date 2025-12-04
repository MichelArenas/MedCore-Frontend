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
  DIAGNOSIS_ENDPOINTS,
  QUEUE_ENDPOINTS
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
  // IMPORTANTE: que 'list' apunte al endpoint correcto por paciente
  list: (patientId) => get(MEDICAL_RECORDS_ENDPOINTS.BY_PATIENT(patientId)),
  getById: (recordId) => get(MEDICAL_RECORDS_ENDPOINTS.GET_BY_ID(recordId)),
  create: (payload) => post(MEDICAL_RECORDS_ENDPOINTS.BASE, payload),
  update: (recordId, payload) => put(MEDICAL_RECORDS_ENDPOINTS.GET_BY_ID(recordId), payload),
  archive: (recordId) => del(MEDICAL_RECORDS_ENDPOINTS.GET_BY_ID(recordId)),
};


// --- Documents (adjuntos) ---
export const documentsService = {
  listByPatient: (patientId) => get(DOCUMENTS_ENDPOINTS.BY_PATIENT(patientId)),
  upload: async ({ file, patientId, medicalRecordId, diagnosticId, description, tags, category }) => {
    const fd = new FormData();
    fd.append("document", file);
    if (patientId) fd.append("patientId", patientId);
    if (medicalRecordId) fd.append("medicalRecordId", medicalRecordId);
    if (diagnosticId) fd.append("diagnosticId", diagnosticId);
    if (description) fd.append("description", description);
    if (tags) fd.append("tags", tags);
    if (category) fd.append("category", category);
    // Uso correcto de post (apiRequest requiere objeto con url, antes se enviaba mal)
    return post(DOCUMENTS_ENDPOINTS.UPLOAD, fd, { headers: {} });
  },
  downloadUrl: (id) => DOCUMENTS_ENDPOINTS.GET_BY_ID(id),
  // Nuevo método para obtener blob con autenticación
  downloadBlob: async (id) => {
    try {
      const token = localStorage.getItem('token');
      console.log('[downloadBlob] Fetching document:', DOCUMENTS_ENDPOINTS.GET_BY_ID(id));
      const response = await fetch(DOCUMENTS_ENDPOINTS.GET_BY_ID(id), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('[downloadBlob] Response status:', response.status);
      console.log('[downloadBlob] Response headers:', response.headers.get('content-type'));

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      console.log('[downloadBlob] Blob created:', blob.size, 'bytes, type:', blob.type);
      const objectUrl = URL.createObjectURL(blob);
      console.log('[downloadBlob] Object URL created:', objectUrl);
      return objectUrl;
    } catch (error) {
      console.error('Error downloading document blob:', error);
      throw error;
    }
  },
  remove: (id) => del(DOCUMENTS_ENDPOINTS.DELETE(id)),
};

// --- Diagnosis (crear) ---
export const diagnosisService = {
  // Si envías SIN archivos: JSON
  createForPatientJson: (patientId, payload) =>
    post(DIAGNOSIS_ENDPOINTS.CREATE_FOR_PATIENT(patientId), payload),

  // Si envías CON archivos: multipart (como en Postman)
  createForPatientFormData: async (patientId, {
    title, description, diagnosis, treatment, observations, nextAppointment, medicalRecordId, files,diseaseCode = []
  }) => {
    const fd = new FormData();
    if (title) fd.append("title", title);
    if (description) fd.append("description", description);
    if (diagnosis) fd.append("diagnosis", diagnosis);
    if (treatment) fd.append("treatment", treatment);
    if(diseaseCode) fd.append("diseaseCode", diseaseCode);
    if (observations) fd.append("observations", observations);
    if (nextAppointment) fd.append("nextAppointment", nextAppointment);
    if (medicalRecordId) fd.append("medicalRecordId", medicalRecordId);
    files.forEach(f => fd.append("documents", f)); // **clave** para múltiples archivos
    // Corrección: apiRequest antes se llamaba sin objeto de configuración adecuado
    return post(DIAGNOSIS_ENDPOINTS.CREATE_FOR_PATIENT(patientId), fd, { headers: {} });
  },
};

/**
 * Servicio para gestión de cola de espera
*/

export const queueService = {
  // Unirse a la cola de espera
  joinQueue: (payload) => post(QUEUE_ENDPOINTS.JOIN_QUEUE, payload),

  /**
   * Obtener la cola de un médico
   * doctorId: id del médico
   * options:
   *   - date: 'YYYY-MM-DD'  (opcional, por defecto hoy)
   *   - includeFinished: boolean (opcional, incluir COMPLETED/CANCELLED/NO_SHOW)
   */
  getQueueForDoctor: (doctorId, { date, includeFinished = false } = {}) =>
  apiRequest({
    method: "GET",
    url: QUEUE_ENDPOINTS.GET_QUEUE_MEDICO(doctorId),
    params: {
      ...(date ? { day: date } : {}),               // ← FIX FINAL
      ...(includeFinished ? { includeFinished: true } : {}),
    },
  }),

  

  // Llamar al siguiente paciente
  callNextPatient: (doctorId) => {
  console.log("🤖 Enviando POST a:", QUEUE_ENDPOINTS.POST_CALL_NEXT(doctorId));
  return post(QUEUE_ENDPOINTS.POST_CALL_NEXT(doctorId));
},

  // Completar la atención del paciente actual
  completeCurrentTicket: (ticketId) =>
    put(QUEUE_ENDPOINTS.PUT_COMPLETE_CURRENT(ticketId)),

  // Obtener la posición en la cola de un ticket
  getPositionInQueue: (ticketId) =>
    get(QUEUE_ENDPOINTS.GET_POSITION_IN_QUEUE(ticketId)),

   // Marcar NO SHOW
  markNoShow: (ticketId) =>
    put(QUEUE_ENDPOINTS.PUT_MARK_NO_SHOW(ticketId)),

  // Salir de la cola (solo front-end)
  leaveQueue: async (ticketId) => {
    console.log("[queueService] Simulando salir de la cola para:", ticketId);
    return { ok: true, ticketId };
  },

  // Verificar si la cola está llena (5 personas o más)
isQueueFull: async (doctorId) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Obtener cola actual del doctor
    const res = await queueService.getQueueForDoctor(doctorId, {
      date: today,
      includeFinished: false, // Solo pendientes
    });

    const queue = res?.data?.queue || res?.queue || [];

    // Cola llena si hay 5 o más personas esperando
    return queue.length >= 5;
  } catch (error) {
    console.error("[queueService] Error verificando cola llena", error);
    return false; // Por seguridad: si falla, asumimos NO está llena
  }
},

  

};

// --- Appointment Service ---
export const appointmentService = {
  // Listar citas de un doctor
  listByDoctor: (doctorId, { dateFrom, dateTo } = {}) =>
    apiRequest({
      method: 'GET',
      url: `/appointments/doctor/${doctorId}`,
      params: {
        ...(dateFrom ? { dateFrom } : {}),
        ...(dateTo ? { dateTo } : {})
      }
    }),

  // Cancelar una cita
  cancelAppointment: ({ id, reason }) => {
    const actorId = localStorage.getItem('userId');
    const actorRole = localStorage.getItem('role');
    return apiRequest({
      method: 'PUT',
      url: `/appointments/${id}`,
      body: { reason, actorId, actorRole }
    });
  }
};


