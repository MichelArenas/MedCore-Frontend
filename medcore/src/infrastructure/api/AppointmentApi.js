import axios from 'axios';

const BASE_URL = process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:3008';

export const AppointmentApi = {
    queueDoctor: async(doctorId) => {
    const res = await axios.get(`${BASE_URL}/queue/doctor/${doctorId}/current`);
    return res.data;
  },
    queuestart: async(ticketId) => {
    const res = await axios.get(`${BASE_URL}/queue/ticket/${ticketId}/start`);
    return res.data;
  },
  queueDoctorConfirmed: async(doctorId) => {
    const res = await axios.get(`${BASE_URL}/queue/doctor/${doctorId}/confirmed`);
    return res.data;
  },
};