// src/components/queue/DoctorQueueList.jsx
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./DoctorQueueList.css";
import { queueService } from "../../utils/adminService";

const STATUS_CONFIG = {
  WAITING: {
    label: "En espera",
    chipClass: "queue-chip queue-chip-waiting",
    dotClass: "queue-chip-dot queue-chip-dot-yellow",
  },
  CALLED: {
    label: "Llamado",
    chipClass: "queue-chip queue-chip-neutral",
    dotClass: "queue-chip-dot queue-chip-dot-neutral",
  },
  IN_PROGRESS: {
    label: "En consulta",
    chipClass: "queue-chip queue-chip-waiting",
    dotClass: "queue-chip-dot queue-chip-dot-yellow",
  },
  COMPLETED: {
    label: "Atendido",
    chipClass: "queue-chip queue-chip-done",
    dotClass: "queue-chip-dot queue-chip-dot-done",
  },
};

function DoctorQueueList() {
  const params = useParams();

  // doctorId puede venir de la URL o de localStorage (userid del doctor)
  const doctorId =
    params.doctorId || params.id || localStorage.getItem("userid") || null;

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [queueData, setQueueData] = useState({
    doctorId: null,
    averageServiceMinutes: 0,
    size: 0,
    queue: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  console.log("La fecha seleccionada es =", date);

  const loadQueue = useCallback(async () => {
    if (!doctorId) {
      console.warn("[DoctorQueueList] Sin doctorId, no se consulta la cola");
      return;
    }
    try {
      setLoading(true);
      setError("");

      const raw = await queueService.getQueueForDoctor(doctorId,{
        date,
        includeFinished: true,
      });
      console.log("[DoctorQueueList] raw desde queueService:", raw);

      // Formas posibles:
      // 1) raw = { doctorId, averageServiceMinutes, size, queue }
      // 2) raw = { data: { doctorId, averageServiceMinutes, size, queue } }
      // 3) raw = { data: { data: { ... } } }
      const payload = raw?.data?.data || raw?.data || raw;
      console.log("[DoctorQueueList] payload normalizado:", payload);

      const nextState = {
        doctorId: payload.doctorId,
        averageServiceMinutes: payload.averageServiceMinutes || 0,
        size: payload.size || (payload.queue ? payload.queue.length : 0) || 0,
        queue: payload.queue || [],
      };
      console.log("[DoctorQueueList] nextState que se va a guardar:", nextState);

      setQueueData(nextState);
    } catch (err) {
      console.error("[DoctorQueueList] Error cargando cola:", err);
      setError(
        err?.message || "Error al cargar la cola de espera del médico."
      );
    } finally {
      setLoading(false);
    }
  }, [doctorId, date]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  useEffect(() => {
    console.log("[DoctorQueueList] queueData actualizado:", queueData);
  }, [queueData]);

  const handleCallNext = async () => {
    try {
      if (!doctorId) return;
      console.log("[DoctorQueueList] Llamar siguiente para doctor:", doctorId);
      const resp = await queueService.callNextPatient(doctorId);
      console.log("[DoctorQueueList] Respuesta callNextPatient:", resp);
      await loadQueue();
    } catch (err) {
      console.error("[DoctorQueueList] Error al llamar siguiente:", err);
      setError(err?.message || "No se pudo llamar al siguiente paciente.");
    }
  };

    const handleCompleteTicket = async (ticketId) => {
      try {
        if (!ticketId) return;
        console.log("[DoctorQueueList] Completar ticket:", ticketId);
        const resp = await queueService.completeCurrentTicket(ticketId);
        console.log("[DoctorQueueList] Respuesta completeTicket:", resp);
        await loadQueue();
      } catch (err) {
        console.error("[DoctorQueueList] Error al completar ticket:", err);
        setError(err?.message || "No se pudo completar el ticket.");
      }
};


  return (
    <div className="queue-page">
      <div className="queue-main">
        <div className="queue-card">
          {/* Encabezado de la tarjeta */}
          <div className="queue-header">
            <div className="queue-header-left">
              <h2 className="queue-title">Lista de Espera</h2>

              <div className="queue-date-row">
                {/* IMPORTANTE: en React es className, no class */}
                <i className="fa fa-calendar" aria-hidden="true"></i>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="queue-date-input"
                />
              </div>

              {/* Info de promedio (opcional) */}
              {queueData.averageServiceMinutes > 0 && (
                <small style={{ color: "#64748b", marginTop: "0.25rem" }}>
                  Promedio de atención:{" "}
                  <strong>{queueData.averageServiceMinutes} min</strong>
                  {" · "}
                  Pacientes en cola: <strong>{queueData.size}</strong>
                </small>
              )}
            </div>

            <button className="queue-call-btn" onClick={handleCallNext}>
              <span className="text">Llamar siguiente</span>
              <svg
                className="arrow"
                viewBox="0 0 448 512"
                height="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
              </svg>
            </button>
          </div>

          {/* Mensajes de carga / error */}
          {loading && (
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Cargando cola de espera...
            </p>
          )}
          {error && (
            <p style={{ color: "#b91c1c", fontSize: "0.9rem" }}>{error}</p>
          )}

          {/* Lista de pacientes */}
          <div className="queue-list-wrapper">
            {queueData.queue.length === 0 && !loading ? (
              <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
                No hay pacientes en la cola de espera para hoy.
              </p>
            ) : (
              <ul className="queue-list">
                {queueData.queue.map((ticket, index) => {
                  const isFirst = index === 0;
                  const config =
                    STATUS_CONFIG[ticket.status] || STATUS_CONFIG.WAITING;

                  return (
                    <li
                      key={ticket.id}
                      className={
                        ticket.status === "COMPLETED"
                          ? "queue-item queue-item-done"
                          : "queue-item"
                      }
                    >
                      <div className="queue-item-inner">
                        {/* Número de turno */}
                        <div
                          className={
                            "queue-number " +
                            (isFirst ? "queue-number-primary" : "")
                          }
                        >
                          {String(ticket.ticketNumber).padStart(2, "0")}
                        </div>

                        {/* Nombre del paciente (placeholder) + tiempo espera */}
                        <div className="queue-patient">
                          <p
                            className={
                              "queue-patient-name " +
                              (isFirst ? "queue-patient-name-active" : "")
                            }
                          >
                            Paciente #{ticket.patientId.slice(0, 6)}…
                          </p>
                        {/* ⬅️ NUEVO: tiempo que lleva esperando */}
                          {typeof ticket.waitingMinutes === "number" && (
                            <p className="queue-waiting-time">
                              Lleva{" "}
                              <strong>{ticket.waitingMinutes} min</strong>{" "}
                              esperando
                            </p>
                          )}  
                        </div>

                        {/* Estado */}
                        <div className="queue-status">
                          <span className={config.chipClass}>
                            <span className={config.dotClass} />
                            {config.label}
                          </span>
                        </div>
                        {/* Acciones (marcar como atendido) */}
                        <div className="queue-actions">
                          {(
                            ticket.status === "CALLED" ||
                            ticket.status === "IN_PROGRESS" ||
                            (ticket.status === "WAITING" && index === 0)
                            ) && (
                            <button
                              type="button"
                              className="queue-complete-btn"
                              onClick={() => handleCompleteTicket(ticket.id)}
                            >
                              Marcar atendido
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorQueueList;
