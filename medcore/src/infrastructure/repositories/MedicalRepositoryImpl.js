import { HealtRepository } from '../../domain/repositories/HealtRepositories';
import { MedicalApi } from '../api/MedicalApi';
import { Healt } from '../../domain/entities/Healt';
import { MedicalRecordRepository } from '../../domain/repositories/MedicalRecordRepository';
import { MedicalRecord } from '../../domain/entities/MedicalRecords';


export class MedicalRepositoryImpl extends HealtRepository {
  async getHealth() {
    const data = await MedicalApi.health();
    return new Healt(data);
  }
}


export class MedicalRecordRepositoryImpl extends MedicalRecordRepository {
  async getByAppointmentId(appointmentId) {
    const raw = await MedicalApi.AppoinmentxMedicalRecord(appointmentId);
    const recordData = raw.data ?? raw;
    return new MedicalRecord(recordData);
  }
}
