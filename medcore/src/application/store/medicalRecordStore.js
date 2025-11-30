// src/application/store/medicalRecordStore.js
import { create } from "zustand";
import { MedicalRecordRepositoryImpl } from "../../infrastructure/repositories/MedicalRecordRepositoryImpl";
import { GetMedicalRecordByAppointmentUseCase } from "../usecases/GetMedicalRecordByAppointmentUseCase";

const repo = new MedicalRecordRepositoryImpl();
const getMedicalRecordByAppointmentUseCase =
  new GetMedicalRecordByAppointmentUseCase(repo);

export const useMedicalRecordStore = create((set) => ({
  record: null,
  loading: false,
  error: null,

  loadByAppointment: async (appointmentId) => {
    set({ loading: true, error: null });
    try {
      const record = await getMedicalRecordByAppointmentUseCase.execute(
        appointmentId
      );
      set({ record, loading: false });
    } catch (err) {
      console.error(err);
      set({
        error: err.message || "Error al obtener la historia médica",
        loading: false,
      });
    }
  },
}));
