import React, { useState } from "react";
import "./DashboardMedico.css";

function CheckList() {
  const [tareas, setTareas] = useState([
    { id: 1, text: "Revisar resultados de laboratorio", done: false },
    { id: 2, text: "Confirmar cita con cardiólogo", done: false },
  ]);

  const [newTarea, setNewTarea] = useState("");

  const toggleDone = (id) => {
    setTareas(tareas.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTarea = () => {
    if (newTarea.trim() === "") return;
    setTareas([...tareas, { id: Date.now(), text: newTarea, done: false }]);
    setNewTarea("");
  };

  const removeTarea = (id) => {
    setTareas(tareas.filter(t => t.id !== id));
  };

  return (
    <div className="tareas-list">
      <h3>Lista de tareas</h3>

      <ul>
        {tareas.map(t => (
          <li key={t.id} className={t.done ? "done" : ""}>
            <div className="tarea-contenido">
              <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id)} />
              <label>{t.text}</label>
            </div>
            <button onClick={() => removeTarea(t.id)}>🗑️</button>
          </li>
        ))}
      </ul>

      <div className="tareas-input">
        <input
          type="text"
          value={newTarea}
          onChange={(e) => setNewTarea(e.target.value)}
          placeholder="Escribe una nueva tarea..."
        />
        <button className="add-task" onClick={addTarea}>Agregar tarea</button>
      </div>
    </div>
  );
}

export default CheckList;
