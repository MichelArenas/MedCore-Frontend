// src/application/usecases/GetPrescriptionsByPatientUseCase.js
export class GetPrescriptionsByPatientUseCase {
  constructor(prescriptionRepository) {
    this.prescriptionRepository = prescriptionRepository;
  }

  async execute(patientId) {
    if (!patientId) throw new Error("patientId es requerido");
    return this.prescriptionRepository.getByPatient(patientId);
  }
}