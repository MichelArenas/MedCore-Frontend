// src/application/usecases/GetPrescriptionByIdUseCase.js
export class GetPrescriptionByIdUseCase {
  constructor(prescriptionRepository) {
    this.prescriptionRepository = prescriptionRepository;
  }

  async execute(id) {
    if (!id) throw new Error("id es requerido");
    return this.prescriptionRepository.getById(id);
  }
}