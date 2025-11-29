import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SalaEspera.css";

function SalaDeEspera() {
  const [turno, setTurno] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const ticketId = localStorage.getItem("ticketId");

  // 🔹 Mapa para mostrar nombres más amigables
  const estadoMap = {
    WAITING: "Esperando",
    CALLED: "Llamado",
    IN_PROGRESS: "En Atención",
    COMPLETED: "Completado",
    CONFIRMED: "Confirmado",
    NO_SHOW: "No se presentó",
    CANCELLED: "Cancelado",

  };

 
 const cargarTurno = async () => {
  try {
    if (!ticketId) {
      setTurno(null);
      setLoading(false);
      return;
    }

    const res = await axios.get(
      `http://localhost:3008/api/v1/queue/ticket/${ticketId}/position`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    let data = res.data?.data || null;

    //  Revisar estado de la cita asociada
    if (data?.appointmentId) {
      const apptRes = await axios.get(
        `http://localhost:3008/api/v1/appointments/${data.appointmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const cita = apptRes.data.data;

      if (cita?.status === "CANCELLED") {
        data = { ...data, status: "CANCELLED" }; // Forzamos cancelado
      }
    }

    setTurno(data);
    setLoading(false);
  } catch (error) {
    setTurno(null);
    setLoading(false);
    console.error("Error cargando turno:", error);
  }
};


  //  Salir de la cola
  
  const handleSalirCola = async () => {
  try {
    await axios.post(
      `http://localhost:3008/api/v1/queue/ticket/${ticketId}/exit`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🔹 Eliminar ticket del front
    localStorage.removeItem("ticketId");
    setTurno(null);

  } catch (error) {
    console.error("Error al salir de la cola", error);
  }
};

// SUSTENTACIÓN CANCELAR TURNO !!!!!!!!//

const cancelarTurno = async () => {
  const cancelar = window.confirm("Estas cancelando tu turno, ¿Estas seguro de realizar esta acción?")

  if (!cancelar) 
    return;  //aqui miro si la respuesta es diferente de cancelar, se devuelve

  try {
    await axios.delete(`http://localhost:3008/api/v1/queue/ticket/${ticketId}/cancel`, //aqui consume el endpoint cancel del backend
        {  headers: { Authorization:  `Bearer ${token}`,} //token del paciente
         });
    localStorage.removeItem("ticketId"); //con el local storage removemos el item del tiket
    setTurno(null);
   } catch (error) {
    console.error("error al cancelar el turno del paciente",error); //aqui capturo el error
    alert("Lo sentimos, no se pudo cancelar el turno")
  }}

//----------------------------------------------------------------------------------------------

  
  //  POLLING CADA 5 SEGUNDOS
  
  useEffect(() => {
    cargarTurno(); 

    const interval = setInterval(() => {
      cargarTurno();
    }, 5000);

    return () => clearInterval(interval);
  }, [cargarTurno]);

  
  //  Obtener estado final
  
  // Si appointmentStatus viene (CONFIRMED, IN_PROGRESS, COMPLETED)
  // se usa ese. Si no, se usa el estado del ticket.
 const estadoActual = (() => {
  const s = turno?.status;
  const a = turno?.appointmentStatus;

  // Usar CANCELLED si el doctor canceló
  if (s === "CANCELLED") return "CANCELLED";

  // Si status está definido y es uno de los estados "activos", usarlo
  if (s && ['CALLED', 'IN_PROGRESS', 'COMPLETED'].includes(s)) return s;

  // Si no, usar appointmentStatus si existe, si no usar status
  return a || s;
})();


  return (
    <div className="sala-container">
      <h2>Sala de Espera</h2>

      {loading && <p>Cargando tu turno...</p>}

      {!loading && !turno && (
        <p className="sin-turno">
          No tienes turno asignado. Confirma tu cita para entrar a la fila.
        </p>
      )}

    {turno && (
  <div className="turno-card">
    <h3>🎟️ Ticket #{turno.ticketNumber}</h3>

    <p>
      <strong>📍 Posición:</strong> {turno.position}
    </p>

    <p>
      <strong>📌 Estado actual:</strong>{" "}
      <span className={`estado-${estadoActual?.toLowerCase()}`}>
        {estadoMap[estadoActual]}
      </span>
    </p>

    <p>
      <strong>⏳ Tiempo estimado:</strong> {turno.estimatedWaitTime} minutos
    </p>



    <p className="mensaje">Por favor espera… te llamaremos pronto.</p>

    {/*  Mostrar botón si ya terminó */}
   {estadoActual === "COMPLETED" && (
  <button
    className="btn-salir-cola"
    onClick={handleSalirCola}
  >
    Salir de la Cola
  </button>
  )}

   {/*  aqui muestro el boton  */}

  {estadoActual !== "COMPLETED" && estadoActual !=="CANCELLED" && (
  <button className="btn-cancelar-turno" onClick={cancelarTurno}> Cancelar mi turno </button>
  )}

  {/*  muestra cancelado */}
   
{estadoActual === "CANCELLED" && (
  <p className="mensaje cancelado">
     CANCELADO.
  </p>
)}

  </div>
)}

    </div>
  );
}

export default SalaDeEspera;
