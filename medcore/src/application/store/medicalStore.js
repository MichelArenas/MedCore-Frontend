import { create } from 'zustand';
import { MedicalRepositoryImpl } from '../../infrastructure/repositories/MedicalRepositoryImpl';
import { GetHealtUseCase } from '../usescases/GetHealtUseCase';

const repo = new MedicalRepositoryImpl();
const getHealtUseCase = new GetHealtUseCase(repo);

export const useMedicalStore = create((set) => ({
  health: null,
  loading: false,
  error: null,

  checkHealth: async () => {
    set({ loading: true, error: null });
    try {
      const healt = await getHealtUseCase.execute();
      set({ health: healt, loading: false });
    } catch (err) {
      console.error(err);
      set({
        error: err.message || 'Error al consultar health',
        loading: false,
      });
    }
  },
}));
