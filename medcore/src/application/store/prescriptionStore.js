// src/application/store/prescriptionStore.js
import { create } from "zustand";
import { PrescriptionRepositoryImpl } from "../../infrastructure/repositories/PrescriptionRepositoryImpl";
import { CreatePrescriptionUseCase } from "../usecases/CreatePrescriptionUseCase";
import { GetPrescriptionsByPatientUseCase } from "../usecases/GetPrescriptionsByPatientUseCase";
import { GetPrescriptionByIdUseCase } from "../usecases/GetPrescriptionByIdUseCase";

const repo = new PrescriptionRepositoryImpl();
const createPrescriptionUseCase = new CreatePrescriptionUseCase(repo);
const getPrescriptionsByPatientUseCase =
  new GetPrescriptionsByPatientUseCase(repo);
const getPrescriptionByIdUseCase =
  new GetPrescriptionByIdUseCase(repo);

export const usePrescriptionStore = create((set) => ({
  list: [],
  current: null,
  loading: false,
  error: null,

  // Listar por paciente
  loadByPatient: async (patientId) => {
    set({ loading: true, error: null });
    try {
      const items = await getPrescriptionsByPatientUseCase.execute(patientId);
      set({ list: items, loading: false });
    } catch (err) {
      console.error(err);
      set({
        error: err.message || "Error al cargar prescripciones",
        loading: false,
      });
    }
  },

  // Obtener por ID
  loadById: async (id) => {
    set({ loading: true, error: null });
    try {
      const prescription = await getPrescriptionByIdUseCase.execute(id);
      set({ current: prescription, loading: false });
    } catch (err) {
      console.error(err);
      set({
        error: err.message || "Error al cargar la prescripción",
        loading: false,
      });
    }
  },

  // Crear
  create: async (payload) => {
    set({ loading: true, error: null });
    try {
      const created = await createPrescriptionUseCase.execute(payload);
      set((state) => ({
        list: [created, ...state.list],
        current: created,
        loading: false,
      }));
    } catch (err) {
      console.error(err);
      set({
        error: err.message || "Error al crear la prescripción",
        loading: false,
      });
    }
  },
}));
