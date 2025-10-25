import React from "react";
import Opiniones from "./LandingPageOpiniones";
import Footer from "./LandingPageFooter"
import { useNavigate } from "react-router-dom";
import "./LandinPage.css";
import logo from "../assets/logo.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const LandingPage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="landing-page">
      {/* Cabecera fija */}
      <header className="landing-header">
        <img src={logo} alt="MedCore Logo" className="header-logo" />
        <button onClick={goToLogin} className="header-button">
          Iniciar Sesión
        </button>
      </header>

      {/* Contenido principal */}
      <main className="landing-content">
        {/* Imagen principal */}
        <div className="landing-image-section">
          <img
            src="https://360radio.com.co/wp-content/uploads/2025/01/medicos-colombianos.jpg"
            alt="Equipo médico"
            className="landing-image"
          />
          <div className="overlay-text">
            <h2>Cuidamos tu salud con el corazón</h2>
          </div>
        </div>

        {/* Sección de servicios con carrusel */}
        <section className="our-services">
          <h2 className="services-title">Nuestros servicios</h2>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={25}
            slidesPerView={3}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop={true}
            breakpoints={{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            className="services-swiper"
          >
            <SwiperSlide>
              <div className="service-card">
                <i className="fas fa-stethoscope service-icon"></i>
                <h3>Consulta médica</h3>
                <p>Atención personalizada y seguimiento integral por profesionales expertos.</p>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="service-card">
                <i className="fas fa-syringe service-icon"></i>
                <h3>Vacunación</h3>
                <p>Protección segura y confiable con vacunas actualizadas para todas las edades.</p>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="service-card">
                <i className="fas fa-heartbeat service-icon"></i>
                <h3>Chequeos preventivos</h3>
                <p>Monitoreo regular para prevenir enfermedades y mantener tu bienestar.</p>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="service-card">
                <i className="fas fa-ambulance service-icon"></i>
                <h3>Emergencias</h3>
                <p>Respuesta inmediata ante situaciones críticas, con personal altamente capacitado.</p>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="service-card">
                <i className="fas fa-x-ray service-icon"></i>
                <h3>Diagnóstico por imágenes</h3>
                <p>Equipos modernos para resultados precisos en radiología y ecografías.</p>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="service-card">
                <i className="fas fa-user-nurse service-icon"></i>
                <h3>VideoConsultas</h3>
                <p>Consultas médicas desde la comodidad de tu hogar con personal especializado.</p>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>

        {/* Sección de porque escogernos */}
<div className="card-choise">
  <h2 className="choise-title">¿Porque escogernos?</h2>

  <div className="choise-container">
    <div className="choise-card">
      <i className="fa-solid fa-thumbs-up choise-icon"></i>
      <h3>Atención médica integral y personalizada</h3>
      <p>Nos enfocamos en cada paciente como un ser único. Nuestro equipo médico evalúa de forma individual cada caso, ofreciendo diagnósticos precisos y tratamientos adaptados a tus necesidades físicas y emocionales.</p>
    </div>

    <div className="choise-card">
      <i className="fa-solid fa-user-tie choise-icon"></i>
      <h3>Profesionales altamente calificados y tecnología de vanguardia</h3>
      <p>Contamos con especialistas reconocidos y equipamiento médico de última generación que garantizan procedimientos seguros, confiables y con los mejores resultados posibles.</p>
    </div>

    <div className="choise-card">
      <i className="fa-solid fa-shield-heart choise-icon"></i>
      <h3>Compromiso con el bienestar y la seguridad del paciente</h3>
      <p>Tu salud es nuestra prioridad. Mantenemos estrictos estándares de calidad, higiene y acompañamiento humano en cada etapa de tu atención, desde la admisión hasta la recuperación.</p>
    </div>
  </div>
</div>
<Opiniones />
<Footer/>


      </main>
    </div>
  );
};

export default LandingPage;
