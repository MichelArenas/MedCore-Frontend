// src/domain/entities/Diagnostics.js
export class Diagnostics {
  constructor({
    id,
    patientId,
    doctorId,
    medicalRecordId,
    diseaseCode,
    diseaseName,
    type, // PRIMARY | SECONDARY
    title,
    description,
    diagnosis,
    treatment,
    observations,
    nextAppointment,
    state, // ACTIVE | ARCHIVED | DELETED
    createdAt,
    updatedAt,
    // documentos relacionados los ignoramos aquí en el dominio de este sprint
  }) {
    this.id = id;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.medicalRecordId = medicalRecordId;

    this.diseaseCode = diseaseCode;
    this.diseaseName = diseaseName;
    this.type = type; // string con el valor del enum DiagnosisType

    this.title = title;
    this.description = description;
    this.diagnosis = diagnosis;
    this.treatment = treatment;
    this.observations = observations ?? null;
    this.nextAppointment = nextAppointment
      ? new Date(nextAppointment)
      : null;

    this.state = state; // string con el valor de diagnosticState

    this.createdAt = createdAt ? new Date(createdAt) : null;
    this.updatedAt = updatedAt ? new Date(updatedAt) : null;
  }
}
