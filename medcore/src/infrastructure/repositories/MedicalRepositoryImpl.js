import { HealtRepository } from '../../domain/repositories/HealtRepositories';
import { MedicalApi } from '../api/MedicalApi';
import { Healt } from '../../domain/entities/Healt';

export class MedicalRepositoryImpl extends HealtRepository {
  async getHealth() {
    const data = await MedicalApi.health();
    // data = { ok, ts, service, port }
    return new Healt(data);
  }
}

export class MedicalRecordRepositoryImpl extends MedicalRecordRepository {
  async getByAppointmentId(appointmentId) {
    const raw = await MedicalApi.appointmentMedicalRecord(appointmentId);

    // Por si tu backend a veces envía { data: {...} } y otras directamente {...}
    const recordData = raw.data ?? raw;

    return new MedicalRecord(recordData);
  }
}
