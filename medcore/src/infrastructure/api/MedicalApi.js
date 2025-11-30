import axios from 'axios';
import { FaPrescription } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_MEDICAL_RECORDS_URL || 'http://localhost:3005';

export const MedicalApi = {
  async health() {
    const res = await axios.get(`${BASE_URL}/api/v1//health`);
    return res.data;
  },
  // Obtener registro médico por appointmentId
  AppoinmentxMedicalRecord: async(appointmentID) => {
    const res = await axios.get(`${BASE_URL}/api/v1/medical-records/${appointmentID}`);
    return res.data;
  },
  // Crear prescripción
  prescription: async(payload)=> {
    const res = await axios.post(`${BASE_URL}/api/v1/prescriptions`, payload);
    return res.data;
  },

  // Listar prescripciones de un paciente
  prescriptionxparients: async(patientID) =>{
    const res = await axios.get(`${BASE_URL}/api/v1/prescriptions/patient/${patientID}`);
    return res.data;
  },

  // Obtener una prescripción por ID
  prescriptionId: async(prescriptionId) => {
    const res = await axios.get(`${BASE_URL}/api/v1/prescriptions/${prescriptionId}`);
    return res.data;
  },

  // Listar todas las prescripciones
  listPresciption: async() => {
    const res = await axios.get(`${BASE_URL}/api/v1/prescriptions`);
    return res.data;
  },

  // Descargar/obtener PDF de una prescripción
  pdfPrescription: async (prescriptionId) => {
    const res = await axios.get(`${BASE_URL}/api/v1/prescriptions/${prescriptionId}/pdf`);
    return res.data;
  },

  // Actualizar prescripción
  putPresciption: async(prescriptionId, payload) => {
    const res = await axios.put(`${BASE_URL}/api/v1/prescriptions/${prescriptionId}`, payload);
    return res.data;
  },

  // Eliminar prescripción
  deletePresciption: async(prescriptionId) => {
    const res = await axios.delete(`${BASE_URL}/api/v1/prescriptions/${prescriptionId}`);
    return res.data;
  },

  // Plantillas de órdenes médicas
  MedicalOrdersTemplate: async() => {
    const res = await axios.get(`${BASE_URL}/api/v1/medical-orders/templates`);
    return res.data;
  },

  // Listar órdenes de un paciente
  listMedicalOrders: async(patientId) => {
    const res = await axios.get(`${BASE_URL}/api/v1/medical-orders/patient/${patientId}`);
    return res.data;
  },

   // Crear orden de laboratorio
  laboratory: async(payload) => {
    const res = await axios.post(`${BASE_URL}/api/v1/medical-orders/laboratory`, payload);
    return res.data;
  },

  // Crear orden de radiología
  radiology: async (payload) => {
    const res = await axios.post(`${BASE_URL}/api/v1/medical-orders/radiology`, payload);
    return res.data;
  },

  // Obtener una orden médica por ID
  getMedicalOrder: async  (medicalOrderId) =>{
    const res = await axios.get(`${BASE_URL}/api/v1/medical-orders/${medicalOrderId}`);
    return res.data;
  }
};