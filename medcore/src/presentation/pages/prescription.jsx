import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./prescription.css";

export default function PrescriptionForm() {
  //const { medicalRecordId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { patientId, medicalRecordId } = useParams();


  const [form, setForm] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    medicationType: "",
  });

  const [loading, setLoading] = useState(false);

  const medicationOptions = ["Paracetamol", "Ibuprofeno", "Amoxicilina", "Metformina"];
  const dosageOptions = ["250mg", "500mg", "750mg", "1000mg"];
  const frequencyOptions = ["Cada 8 horas", "Cada 12 horas", "Diario", "Semanal"];
  const durationOptions = ["3 días", "5 días", "7 días", "10 días"];
  const medicationTypeOptions = ["Antibiótico", "Analgésico", "Antiinflamatorio", "Otros"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, generatePDF = false) => {
    e.preventDefault();

    if (!form.medication || !form.dosage || !form.frequency || !form.duration) {
      return Swal.fire("Error", "Todos los campos obligatorios deben llenarse", "error");
    }

    setLoading(true);

    try {
      const url = `http://localhost:3005/api/v1/prescriptions${generatePDF ? "?pdf=true" : ""}`;

      const body = { ...form, medicalRecordId, patientId }; // ⬅ CORREGIDO

      console.log("Enviando:", body);

      const res = await axios.post(url, body, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: generatePDF ? "arraybuffer" : "json",
      });

      if (generatePDF) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "prescripcion.pdf";
        link.click();
      }

      Swal.fire("Éxito", "Prescripción creada correctamente", "success");

      navigate(`/dashboard/medical-history/${patientId}`);

    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.response?.data?.message || "No se pudo crear la prescripción", "error");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="prescription-container">
      <h2>Crear Prescripción Médica</h2>

      <form className="prescription-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Medicamento *</label>
          <select name="medication" value={form.medication} onChange={handleChange} required>
            <option value="">Seleccione un medicamento</option>
            {medicationOptions.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Dosificación *</label>
          <select name="dosage" value={form.dosage} onChange={handleChange} required>
            <option value="">Seleccione dosificación</option>
            {dosageOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Frecuencia *</label>
          <select name="frequency" value={form.frequency} onChange={handleChange} required>
            <option value="">Seleccione frecuencia</option>
            {frequencyOptions.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Duración *</label>
          <select name="duration" value={form.duration} onChange={handleChange} required>
            <option value="">Seleccione duración</option>
            {durationOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Tipo de medicamento (opcional)</label>
          <select name="medicationType" value={form.medicationType} onChange={handleChange}>
            <option value="">Seleccione tipo</option>
            {medicationTypeOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="form-group full">
          <label>Instrucciones adicionales</label>
          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            placeholder="Indicaciones para el paciente"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Prescripción"}
          </button>

          <button type="button" className="btn secondary" disabled={loading}
            onClick={(e) => handleSubmit(e, true)}>
            {loading ? "Generando..." : "Guardar + PDF"}
          </button>

          <button type="button" className="btn" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
}
