// src/infrastructure/repositories/MedicalOrderRepositoryImpl.js
import { MedicalOrderRepository } from "../../domain/repositories/MedicalOrderRepository";
import { MedicalApi } from "../api/MedicalApi";
import { MedicalOrder } from "../../domain/entities/MedicalOrder";

export class MedicalOrderRepositoryImpl extends MedicalOrderRepository {
  async getTemplates() {
    const raw = await MedicalApi.medicalOrdersTemplate();
    return raw;
  }

  async listByPatient(patientId) {
    const raw = await MedicalApi.listMedicalOrdersByPatient(patientId);
    const list = raw.data ?? raw;
    return list.map((item) => new MedicalOrder(item));
  }

  async createLaboratory(payload) {
    const raw = await MedicalApi.createLaboratoryOrder(payload);
    const data = raw.data ?? raw;
    return new MedicalOrder(data);
  }

  async createRadiology(payload) {
    const raw = await MedicalApi.createRadiologyOrder(payload);
    const data = raw.data ?? raw;
    return new MedicalOrder(data);
  }

  async getById(orderId) {
    const raw = await MedicalApi.getMedicalOrder(orderId);
    const data = raw.data ?? raw;
    return new MedicalOrder(data);
  }
}
