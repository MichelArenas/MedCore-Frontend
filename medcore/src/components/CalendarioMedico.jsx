import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./CalendarioCitas.css";

function CalendarioMedico() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fakeData = [
      { id: 1, title: "Consulta Dr. Ramírez", start: "2025-11-10", end: "2025-11-10" },
      { id: 2, title: "Control general", start: "2025-11-12", end: "2025-11-12" },
    ];
    setEvents(fakeData);
  }, []);

  const handleDateClick = (info) => {
    const title = prompt("Nombre del evento / tarea médica:");
    if (title) {
      setEvents([...events, { id: Date.now(), title, start: info.dateStr, end: info.dateStr }]);
    }
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
  };

  const closeModal = () => setSelectedEvent(null);

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={true}          // 🔹 permite arrastrar eventos
        selectable={true}       // 🔹 permite click en celdas
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        height="auto"
      />

      {selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedEvent.title}</h3>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default CalendarioMedico;