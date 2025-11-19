// src/components/queue/DoctorQueueList.jsx
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./DoctorQueueList.css";
import { queueService } from "../../utils/adminService";

//
// CONFIGURACIÓN DE ESTADOS VISUALES
//
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
  NO_SHOW: {
    label: "No se presentó",
    chipClass: "queue-chip queue-chip-cancel",
    dotClass: "queue-chip-dot queue-chip-dot-cancel",
  },
};

function DoctorQueueList() {
  const params = useParams();

  // doctorId puede venir por URL o localStorage
  const doctorId =
    params.doctorId || params.id || localStorage.getItem("userId") || null;

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [queueData, setQueueData] = useState({
    doctorId: null,
    averageServiceMinutes: 0,
    size: 0,
    queue: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //
  // CARGAR COLA DEL DOCTOR
  //
  const loadQueue = useCallback(async () => {
    if (!doctorId) {
      console.warn("[DoctorQueueList] Sin doctorId, no se consulta la cola");
      return;
    }
    try {
      setLoading(true);
      setError("");

      const raw = await queueService.getQueueForDoctor(doctorId, {
        date,
        includeFinished: true,
      });

      const payload = raw?.data?.data || raw?.data || raw;

      const nextState = {
        doctorId: payload.doctorId,
        averageServiceMinutes: payload.averageServiceMinutes || 0,
        size: payload.size || (payload.queue ? payload.queue.length : 0),
        queue: payload.queue || [],
      };

      setQueueData(nextState);
    } catch (err) {
      console.error("[DoctorQueueList] Error cargando cola:", err);
      setError("Error al cargar la cola de espera del médico.");
    } finally {
      setLoading(false);
    }
  }, [doctorId, date]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  //
  // ACCIONES: Llamar, Completar, No-show
  //
  const handleCallNext = async () => {
    try {
      const resp = await queueService.callNextPatient(doctorId);
      console.log("[DoctorQueueList] callNext:", resp);
      await loadQueue();
    } catch (err) {
      console.error("[DoctorQueueList] Error al llamar siguiente:", err);
      setError("No se pudo llamar al siguiente paciente.");
    }
  };

  const handleCompleteTicket = async (ticketId) => {
    try {
      const resp = await queueService.completeCurrentTicket(ticketId);
      console.log("[DoctorQueueList] completeTicket:", resp);
      await loadQueue();
    } catch (err) {
      console.error("[DoctorQueueList] Error completando ticket:", err);
      setError("No se pudo completar el ticket.");
    }
  };

  const handleNoShow = async (ticketId) => {
    try {
      const resp = await queueService.markNoShow(ticketId);
      console.log("[DoctorQueueList] noShow:", resp);
      await loadQueue();
    } catch (err) {
      console.error("[DoctorQueueList] Error no-show:", err);
      setError("No se pudo marcar como no presentado.");
    }
  };

  //
  // RENDER
  //
  return (
    <div className="queue-page">
      <div className="queue-main">
        <div className="queue-card">
          {/* Header */}
          <div className="queue-header">
            <div>
              <h2 className="queue-title">Lista de Espera</h2>

              {/* Fecha */}
              <div className="queue-date-row">
                <i className="fa fa-calendar" aria-hidden="true"></i>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="queue-date-input"
                />
              </div>

              {queueData.averageServiceMinutes > 0 && (
                <small className="queue-info">
                  Promedio atención:{" "}
                  <strong>{queueData.averageServiceMinutes} min</strong> ·
                  Pacientes: <strong>{queueData.size}</strong>
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
                <path d="M438.6 278.6c12.5-12.5..."></path>
              </svg>
            </button>
          </div>

          {/* Loading / Error */}
          {loading && <p className="queue-loading">Cargando cola...</p>}
          {error && <p className="queue-error">{error}</p>}

          {/* Lista */}
          <div className="queue-list-wrapper">
            {queueData.queue.length === 0 && !loading ? (
              <p className="queue-empty">
                No hay pacientes en la cola de espera hoy.
              </p>
            ) : (
              <ul className="queue-list">
                {queueData.queue.map((ticket, index) => {
                  const isFirst = index === 0;
                  const state = STATUS_CONFIG[ticket.status];

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

                        {/* Número */}
                        <div
                          className={
                            "queue-number " +
                            (isFirst ? "queue-number-primary" : "")
                          }
                        >
                          {String(ticket.ticketNumber).padStart(2, "0")}
                        </div>

                        {/* Paciente */}
                        <div className="queue-patient">
                          <p
                            className={
                              "queue-patient-name " +
                              (isFirst ? "queue-patient-name-active" : "")
                            }
                          >
                            Paciente #{ticket.patientId.slice(0, 6)}…
                          </p>

                          {typeof ticket.estimatedWaitTime === "number" && (
                            <p className="queue-waiting-time">
                              Lleva{" "}
                              <strong>{ticket.estimatedWaitTime} min</strong>{" "}
                              esperando
                            </p>
                          )}
                        </div>

                        {/* Estado */}
                        <div className="queue-status">
                          <span className={state.chipClass}>
                            <span className={state.dotClass} />
                            {state.label}
                          </span>
                        </div>

                        {/* Botones */}
                        <div className="queue-actions">

                          {/* Marcar atendido */}
                          {(ticket.status === "CALLED" ||
                            ticket.status === "IN_PROGRESS" ||
                            (ticket.status === "WAITING" && isFirst)) && (
                            <button
                              className="queue-complete-btn"
                              onClick={() => handleCompleteTicket(ticket.id)}
                            >
                              Atendido
                            </button>
                          )}

                          {/* No se presentó 
                          {(ticket.status === "WAITING" ||
                            ticket.status === "CALLED") && (
                            <button
                              className="queue-noshow-btn"
                              onClick={() => handleNoShow(ticket.id)}
                            >
                              No se presentó
                            </button>
                          )}*/}
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
