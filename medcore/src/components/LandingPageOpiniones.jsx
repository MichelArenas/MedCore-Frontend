import React from "react";
import "./LandingPageOpiniones.css";

const Opiniones = () => {
  const testimonios = [
    {
      texto:
        "El equipo médico fue increíble. Desde que llegué, me sentí escuchada y cuidada. Los doctores son muy profesionales y atentos.",
      nombre: "Sarah L.",
      detalle: "Paciente de Cardiología",
      foto: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      texto:
        "Mi hijo recibió la mejor atención posible en pediatría. Las enfermeras fueron maravillosas y el hospital está impecable.",
      nombre: "Michael T.",
      detalle: "Padre de paciente pediátrico",
      foto: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      texto:
        "Estoy muy agradecida por la atención que recibí. Todo el personal fue amable y profesional. Recomiendo totalmente MedCore.",
      nombre: "Laura G.",
      detalle: "Paciente de psicología",
      foto: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];

  return (
    <section className="opiniones">
      <h2 className="titulo-opiniones">Lo que dicen nuestros pacientes</h2>

      <div className="opiniones-container">
        {testimonios.map((t, i) => (
          <div className="tarjeta-opinion" key={i}>
            <p className="texto-opinion">“{t.texto}”</p>
            <div className="paciente-info">
              <img src={t.foto} alt={t.nombre} className="foto-paciente" />
              <div>
                <h4>{t.nombre}</h4>
                <span>{t.detalle}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Opiniones;
