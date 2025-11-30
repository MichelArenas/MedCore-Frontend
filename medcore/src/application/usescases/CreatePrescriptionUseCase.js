// src/application/usecases/CreatePrescriptionUseCase.js
export class CreatePrescriptionUseCase {
  constructor(prescriptionRepository) {
    this.prescriptionRepository = prescriptionRepository;
  }

  async execute(payload) {
    // Podrías meter validaciones extra aquí si quieres
    return this.prescriptionRepository.create(payload);
  }
}
