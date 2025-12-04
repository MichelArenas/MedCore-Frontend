// src/application/usecases/GetMedicalRecordByAppointmentUseCase.js
export class GetMedicalRecordByAppointmentUseCase {
  constructor(medicalRecordRepository) {
    this.medicalRecordRepository = medicalRecordRepository;
  }

  async execute(appointmentId) {
    if (!appointmentId) throw new Error("appointmentId es requerido");
    return this.medicalRecordRepository.getByAppointmentId(appointmentId);
  }
}
