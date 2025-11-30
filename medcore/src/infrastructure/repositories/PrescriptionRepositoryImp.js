// src/infrastructure/repositories/PrescriptionRepositoryImpl.js
import { PrescriptionRepository } from "../../domain/repositories/PrescriptionRepository";
import { MedicalApi } from "../api/MedicalApi";
import { Prescription } from "../../domain/entities/Prescription";

export class PrescriptionRepositoryImpl extends PrescriptionRepository {
  async create(payload) {
    const raw = await MedicalApi.createPrescription(payload);
    // raw = { message, data: prescription }
    const data = raw.data;
    return new Prescription(data);
  }

  async getByPatient(patientId) {
    const raw = await MedicalApi.prescriptionsByPatient(patientId);
    // raw = { patientId, total, items }
    const items = raw.items || [];
    return items.map((p) => new Prescription(p));
  }

  async getById(id) {
    const raw = await MedicalApi.prescriptionById(id);
    // raw = { data: prescription }
    const data = raw.data;
    return new Prescription(data);
  }

  async listAll(filters = {}) {
    const raw = await MedicalApi.listPrescriptions(filters);
    // raw = { data: items, pagination }
    const items = raw.data || [];
    return {
      items: items.map((p) => new Prescription(p)),
      pagination: raw.pagination,
    };
  }

  async update(id, payload) {
    const raw = await MedicalApi.updatePrescription(id, payload);
    // raw = { message, data: updated }
    const data = raw.data;
    return new Prescription(data);
  }

  async delete(id) {
    const raw = await MedicalApi.deletePrescription(id);
    // raw = { message: "Prescripción eliminada correctamente" }
    return raw;
  }
}
