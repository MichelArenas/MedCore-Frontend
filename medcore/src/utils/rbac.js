// src/utils/rbac.js
export const ROLES = {
  ADMIN: "ADMINISTRADOR",
  DOCTOR: "MEDICO",
  NURSE_M: "ENFERMERO",
  NURSE_F: "ENFERMERA",
  PATIENT: "PACIENTE",
};

export const getCurrentUser = () => {
  // 1) intenta leer el objeto user
  const raw = localStorage.getItem("user");
  if (raw) {
    try { return JSON.parse(raw); } catch {}
  }

  // 2) fallback: arma uno con las claves sueltas que ya usas
  const role = localStorage.getItem("role");            // <-- tú ya guardas 'role'
  const patientId = localStorage.getItem("patientId")   // por si existe así
                  || localStorage.getItem("patient_id");// o de esta forma
  const fullname = localStorage.getItem("fullname");

  if (role) return { role, patientId, fullname };
  return null;
};

export const canSeeHistoryMenu = (user) =>
  !!user && ![ROLES.NURSE_M, ROLES.NURSE_F].includes(user.role);

export const canReadHistory = (user, patientId) => {
  if (!user) return false;
  if ([ROLES.DOCTOR, ROLES.ADMIN].includes(user.role)) return true;
  if (user.role === ROLES.PATIENT) {
    return String(user.patientId) === String(patientId);
  }
  return false;
};

export const canWriteHistory = (user) =>
  !!user && [ROLES.DOCTOR, ROLES.ADMIN].includes(user.role);
