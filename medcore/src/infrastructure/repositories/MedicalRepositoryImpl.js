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
