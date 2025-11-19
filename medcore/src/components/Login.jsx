import "./Login.css";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import doctor from "../assets/doctor.png";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "../App.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authService } from "../utils/userService"; // Importamos el servicio de autenticación
//import LoginButton from "./LoginButton";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [verificationType, setVerificationType] = useState(null); // "EMAIL" o "2FA"
  const [showPassword, setShowPassword] = useState(false); // 👁️ para mostrar/ocultar password
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Usar el servicio de autenticación en lugar de fetch directo
      const result = await authService.login({ 
        email, 
        password, 
        verificationCode 
      });

      // ✅ VALIDACIÓN: Verificar que result existe
      if (!result) {
        throw new Error("No se recibió respuesta del servidor");
      }

      // Obtener datos de la respuesta
      const { ok, data } = result;

      // ✅ VALIDACIÓN: Verificar que data existe antes de acceder a sus propiedades
      if (ok && data) {
        if (data.requiresVerification) {
          // ✅ Primera fase: requiere verificación
          setRequiresVerification(true);
          setVerificationType(data.verificationType);

          Swal.fire({
            icon: "info",
            title: "Verificación requerida",
            text: data.message || "Se requiere verificación de código",
            confirmButtonColor: "#007bff",
          });
          
        } else {
          // ✅ Segunda fase: login exitoso
          // ✅ VALIDACIÓN: Verificar que user y token existen
          if (data.user && data.token) {
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            localStorage.setItem("profileImage", data.user.profileImage || "");
            localStorage.setItem("role", data.user.role || "");
            localStorage.setItem("fullname", data.user.fullname || "");
            localStorage.setItem("userId", data.user.id || "");

            Swal.fire({
              icon: "success",
              title: "Bienvenido!",
              text: "Login exitoso ✅",
              confirmButtonColor: "#007bff",
            });

            const role = data.user.role;
            if (role === "ADMINISTRADOR") navigate("/DashboardAdmin");
            else if (role === "MEDICO") navigate("/DashboardMedico");
            else if (role === "PACIENTE") navigate("/DashboardPaciente");
            else if (role === "ENFERMERO") navigate("/DashboardEnfermero");
            else navigate("/dashboard"); // Ruta por defecto
          } else {
            throw new Error("Datos de usuario o token no recibidos");
          }
        }
      } else {
        // Error en login
        // ✅ VALIDACIÓN SEGURA: Usar optional chaining
        if (data?.requiresVerification) {
          setRequiresVerification(true);
          setVerificationType(data.verificationType || "email");
        }
        setError(data?.message || "Credenciales inválidas");
      }
    } catch (err) {
      console.error("Error completo en login:", err);
      setError(err.message || "Error al conectar con el servidor");
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-panel">
        {/* Panel izquierdo */}
        <div className="left-panel">
         {/*  <div className="text-container">
            <h1 className="welcome-title">¡BIENVENIDOS!</h1>
            <p className="subtitle">
              Por favor ingresa tus datos para continuar
            </p>
          </div>
          <div className="image-container">
            <img src={doctor} alt="Doctor" className="doctor-img" />
          </div>*/}
           <img
            src="https://images.pexels.com/photos/12955896/pexels-photo-12955896.jpeg"
            alt="Doctor"
            className="doctor-image"
          />
        </div>

        {/* Panel derecho */}
        <div className="right-panel">
          <img src={logo} alt="MedCore Logo" className="logo" />

          <form className="login-form" onSubmit={handleLogin}>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={requiresVerification} // bloquear si ya pidió verificación
              />
            </div>

            {/* Password */}
            <div className="form-group ">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"} // 👈 alterna entre texto y password
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={requiresVerification}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />} {/* 👈 ojo abierto/cerrado */}
                </span>
              </div>
            </div>

            {/* Input SOLO si es 2FA */}
            {requiresVerification && verificationType === "2FA" && (
              <div className="form-group">
                <label htmlFor="verificationCode">Código de verificación</label>
                <input
                  id="verificationCode"
                  type="text"
                  placeholder="Ingresa el código enviado a tu correo"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Botón SOLO si es verificación de email */}
            {requiresVerification && verificationType === "EMAIL" && (
              <button
                type="button"
                onClick={() => navigate("/verify-email")}
                className="verify-button"
              >
                Verificar Cuenta
              </button>
            )}

            

            {/* Botón dinámico */}
            {(!requiresVerification || verificationType === "2FA") && (
              <button type="submit" className="login-button">
                {requiresVerification ? "Verificar Código" : "Ingresar"}
              </button>
            )}
          </form>

          {/* Mostrar error si existe */}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;