// src/domain/entities/MedicalOrder.js
export class MedicalOrder {
  constructor({
    id,
    patientId,
    doctorId,
    medicalRecordId,
    type, // LABORATORY | RADIOLOGY
    priority, // ROUTINE | URGENT | STAT
    status, // DRAFT | ORDERED | COMPLETED | CANCELLED
    notes,
    labTests,
    radiologyExams,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.medicalRecordId = medicalRecordId ?? null;

    this.type = type;
    this.priority = priority ?? "ROUTINE";
    this.status = status ?? "ORDERED";

    this.notes = notes ?? null;

    this.labTests = labTests ?? []; // array de strings
    this.radiologyExams = radiologyExams ?? []; // array de strings

    this.createdAt = createdAt ? new Date(createdAt) : null;
    this.updatedAt = updatedAt ? new Date(updatedAt) : null;
  }
}
