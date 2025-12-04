// src/domain/entities/MedicalRecord.js
export class MedicalRecord {
  constructor({
    id, patientId, physicianId, appointmentId, date, symptoms, diagnosis, treatment, notes, status, createdAt, updatedAt,
    // relaciones
    prescriptions = [],
    labResults = [],
    diagnostic = [],
  }) {
    this.id = id;
    this.patientId = patientId;
    this.physicianId = physicianId;
    this.appointmentId = appointmentId;

    this.date = date ? new Date(date) : null;

    this.symptoms = symptoms;
    this.diagnosis = diagnosis ?? null;
    this.treatment = treatment ?? null;
    this.notes = notes ?? null;
    this.status = status ?? "active";

    this.createdAt = createdAt ? new Date(createdAt) : null;
    this.updatedAt = updatedAt ? new Date(updatedAt) : null;

    // OJO: estas colecciones normalmente vendrán mapeadas por el repositorio
    this.prescriptions = prescriptions;
    this.labResults = labResults;
    this.diagnostic = diagnostic; // array de Diagnostics
  }
}
