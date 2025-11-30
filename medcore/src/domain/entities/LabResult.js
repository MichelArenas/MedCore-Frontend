// src/domain/entities/LabResult.js
export class LabResult {
  constructor({
    id,
    medicalRecordId,
    testType,
    result,
    referenceRange,
    labName,
    testDate,
    resultDate,
    comments,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.medicalRecordId = medicalRecordId;

    this.testType = testType;
    this.result = result;
    this.referenceRange = referenceRange ?? null;
    this.labName = labName ?? null;

    this.testDate = testDate ? new Date(testDate) : null;
    this.resultDate = resultDate ? new Date(resultDate) : null;

    this.comments = comments ?? null;

    this.createdAt = createdAt ? new Date(createdAt) : null;
    this.updatedAt = updatedAt ? new Date(updatedAt) : null;
  }
}
