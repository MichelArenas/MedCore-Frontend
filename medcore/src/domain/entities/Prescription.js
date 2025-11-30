// src/domain/entities/Prescription.js
export class Prescription {
  constructor({
    id,
    medicalRecordId,
    doctorId,
    diagnosticId,
    patientId,
    medication,
    dosage,
    frequency,
    duration,
    instructions,
    prescriptionDate,
    expirationDate,
    createdAt,
    updatedAt,
    medicalRecord, 
  }) {
    this.id = id;
    this.medicalRecordId = medicalRecordId;
    this.doctorId = doctorId;
    this.diagnosticId = diagnosticId ?? null;
    this.patientId = patientId;

    this.medication = medication;
    this.dosage = dosage;
    this.frequency = frequency;
    this.duration = duration;
    this.instructions = instructions ?? null;

    this.prescriptionDate = prescriptionDate
      ? new Date(prescriptionDate)
      : null;
    this.expirationDate = expirationDate ? new Date(expirationDate) : null;

    this.createdAt = createdAt ? new Date(createdAt) : null;
    this.updatedAt = updatedAt ? new Date(updatedAt) : null;

    this.medicalRecord = medicalRecord || null;
  }
}