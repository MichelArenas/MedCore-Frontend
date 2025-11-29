import React, { useEffect } from 'react';
import { useMedicalStore } from '../../application/store/medicalStore';

export const HealthCheck = () => {
  const { health, loading, error, checkHealth } = useMedicalStore();

  useEffect(() => {
    // Llamamos al health apenas se monta el componente
    checkHealth();
  }, [checkHealth]);

  if (loading) return <p>Verificando servicio de historias médicas...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!health) return <p>Sin datos de health todavía.</p>;

  return (
    <div>
      <h2>Health – Medical Records Service</h2>
      <p><b>ok:</b> {health.ok ? 'true' : 'false'}</p>
      <p><b>service:</b> {health.service}</p>
      <p><b>port:</b> {health.port}</p>
      <p><b>timestamp:</b> {health.ts}</p>
    </div>
  );
};
