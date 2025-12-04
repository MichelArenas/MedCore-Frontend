import "./MedicationItem.css";

export default function MedicationItem({
  index,
  item,
  onUpdate,
  onDelete,
  medicationOptions,
  dosageOptions,
  frequencyOptions,
  durationOptions
}) {
  const handleChange = (e) => {
    onUpdate(index, { [e.target.name]: e.target.value });
  };

  return (
    <div className="medication-item">
      <h4>Medicamento #{index + 1}</h4>

      <div className="form-group">
        <label>Medicamento</label>
        <select
          name="medication"
          value={item.medication}
          onChange={handleChange}
        >
          <option value="">Seleccione</option>
          {medicationOptions.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Dosificación</label>
        <select
          name="dosage"
          value={item.dosage}
          onChange={handleChange}
        >
          <option value="">Seleccione</option>
          {dosageOptions.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Frecuencia</label>
        <select
          name="frequency"
          value={item.frequency}
          onChange={handleChange}
        >
          <option value="">Seleccione</option>
          {frequencyOptions.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Duración</label>
        <select
          name="duration"
          value={item.duration}
          onChange={handleChange}
        >
          <option value="">Seleccione</option>
          {durationOptions.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="form-group full">
        <label>Instrucciones</label>
        <textarea
          name="instructions"
          value={item.instructions}
          onChange={handleChange}
          placeholder="Indicaciones para este medicamento"
        />
      </div>

      <button
        type="button"
        className="btn danger"
        onClick={() => onDelete(index)}
      >
        Eliminar
      </button>
    </div>
  );
}
