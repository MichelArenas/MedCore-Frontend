import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./prescription.css";
import PrescriptionPreview from "../components/PrescriptionPreview";
import MedicationItem from "../components/MedicationItem";


export default function PrescriptionForm() {
  //const { medicalRecordId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { patientId, medicalRecordId } = useParams();
  const [previewMode, setPreviewMode] = useState(false);
const [savedPrescription, setSavedPrescription] = useState(null);
const [items, setItems] = useState([]);




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

  const addItem = () => {
  setItems([
    ...items,
    {
      medication: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: ""
    }
  ]);
};

const updateItem = (index, updated) => {
  const newItems = [...items];
  newItems[index] = { ...newItems[index], ...updated };
  setItems(newItems);
};

const removeItem = (index) => {
  setItems(items.filter((_, i) => i !== index));
};


  const handleSubmit = async (e, generatePDF = false) => {
  e.preventDefault();

  if (!form.medication || !form.dosage || !form.frequency || !form.duration) {
    return Swal.fire("Error", "Todos los campos obligatorios deben llenarse", "error");
  }

  setLoading(true);

  try {
    const url = `http://localhost:3005/api/v1/prescriptions${generatePDF ? "?pdf=true" : ""}`;

   const body = {
  ...form,
  medicalRecordId,
  patientId,
  items
};


    const res = await axios.post(url, body, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: generatePDF ? "arraybuffer" : "json",
    });

    const saved = res.data.data ?? res.data;

setSavedPrescription({
  ...saved,
  patientName: saved.patient?.name ?? "Nombre no disponible",
  doctorName: saved.doctor?.name ?? "Médico no disponible",
  doctorId: saved.physicianId,
});


    //  Si solo se guardó, activar vista previa
    if (!generatePDF) {
      console.log("RESPUESTA DEL BACKEND:", res.data);
      setSavedPrescription(res.data.data ?? res.data);
      setPreviewMode(true);
      setLoading(false);
      return;
    }

    // Si viene en modo generar PDF
    const blob = new Blob([res.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "prescripcion.pdf";
    link.click();

    Swal.fire("Éxito", "PDF generado correctamente", "success");

    navigate(`/dashboard/medical-history/${patientId}`);

  } catch (error) {
    console.error(error);
    Swal.fire("Error", error.response?.data?.message || "No se pudo crear la prescripción", "error");
  } finally {
    setLoading(false);
  }
};

if (previewMode && savedPrescription) {
  return (
    <PrescriptionPreview
  prescription={savedPrescription}
  onEdit={() => setPreviewMode(false)}
  onConfirm={() => handleSubmit(new Event("submit"), true)}
/>

  );
}

  
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

        <h3>Medicamentos adicionales</h3>

<div className="items-container">
  {items.map((item, index) => (
    <MedicationItem
      key={index}
      index={index}
      item={item}
      onUpdate={updateItem}
      onDelete={removeItem}
      medicationOptions={medicationOptions}
      dosageOptions={dosageOptions}
      frequencyOptions={frequencyOptions}
      durationOptions={durationOptions}
    />
  ))}
</div>

<button type="button" className="btn secondary" onClick={addItem}>
  + Agregar Medicamento
</button>


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
