import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./CalendarioCitas.css";

function CalendarioCitas() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fakeData = [
      {
        id: 1,
        title: "Cita con Dr. Ramírez",
        start: "2025-11-10T09:00:00",
        end: "2025-11-10T09:30:00",
        specialist: "Dr. Juan Ramírez",
        specialty: "Cardiología",
        location: "Consultorio 203",
        notes: "Chequeo rutinario y revisión de ECG.",
        estado: "Confirmada",
      },
      {
        id: 2,
        title: "Control general",
        start: "2025-11-12T15:00:00",
        end: "2025-11-12T15:30:00",
        specialist: "Dra. Valentina Torres",
        specialty: "Medicina General",
        location: "Consultorio 101",
        notes: "Revisión post tratamiento.",
        estado: "Pendiente",
      },
      {
        id: 3,
        title: "Examen de laboratorio",
        start: "2025-11-14T08:00:00",
        end: "2025-11-14T08:45:00",
        specialist: "Laboratorio Clínico",
        specialty: "Análisis de sangre",
        location: "Bloque B - Piso 1",
        notes: "Ayuno de 8 horas requerido.",
        estado: "Confirmada",
      },
    ];
    setEvents(fakeData);
  }, []);

  // Si quieres mantener eventClick (por si hay eventos visibles en otra vista)
  const handleEventClick = (clickInfo) => {
    // clickInfo.event.extendedProps contiene tus datos personalizados
    setSelectedEvent({
      title: clickInfo.event.title,
      ...clickInfo.event.extendedProps,
    });
  };

  // Nuevo: manejar click sobre la celda del día
  const handleDateClick = (info) => {
    // info.dateStr tiene formato 'YYYY-MM-DD'
    const dateStr = info.dateStr;

    // Busca eventos cuyo start caiga ese día (si usas ranges, puedes ampliar esta lógica)
    const dayEvents = events.filter((e) => {
      // Aseguramos comparar solo la fecha (antes del 'T')
      const eDate = e.start ? e.start.split("T")[0] : null;
      return eDate === dateStr;
    });

    if (dayEvents.length > 0) {
      // Abre modal con el primer evento del día (puedes mostrar una lista si hay varios)
      setSelectedEvent(dayEvents[0]);
    } else {
      // No hay citas ese día: opcionalmente cerrar modal o mostrar mensaje
      setSelectedEvent(null);
    }
  };

  const closeModal = () => setSelectedEvent(null);

  return (
    <div className="calendario-wrapper">
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          editable={false}
          selectable={false}
          eventClick={handleEventClick}
          dateClick={handleDateClick}          /* <= aquí */
          eventContent={() => null}             /* no muestra títulos dentro de la celda */
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          height="auto"
          dayCellDidMount={(info) => {
            // pinta el día si hay algún evento cuyo start coincide con esa fecha
            const dateStr = info.date.toISOString().split("T")[0];
            const hasEvent = events.some(
              (e) => e.start && e.start.split("T")[0] === dateStr
            );

            if (hasEvent) {
              // aplica un estilo visual indicando que hay cita
              info.el.style.backgroundColor = "rgba(20, 81, 250, 1)";
              info.el.style.border = "1px solid #007bff";
              info.el.style.borderRadius = "6px";
            } else {
              // limpia estilos si no hay evento (para renderizaciones posteriores)
              info.el.style.backgroundColor = "";
              info.el.style.border = "";
              info.el.style.borderRadius = "";
            }
          }}
        />

        {/* Modal de detalles */}
        {selectedEvent && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{selectedEvent.title}</h3>
              <p><strong>👨‍⚕️ Especialista:</strong> {selectedEvent.specialist}</p>
              <p><strong>🩺 Especialidad:</strong> {selectedEvent.specialty}</p>
              <p><strong>📍 Lugar:</strong> {selectedEvent.location}</p>
              <p><strong>🗓️ Notas:</strong> {selectedEvent.notes}</p>
              <p>
                <strong>📌 Estado:</strong>{" "}
                <span className={`estado ${selectedEvent.estado?.toLowerCase()}`}>
                  {selectedEvent.estado}
                </span>
              </p>
              <button onClick={closeModal}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarioCitas;
