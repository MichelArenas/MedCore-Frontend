import "./Login.css";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import doctor from "../assets/doctor.png";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "../App.css";
//import LoginButton from "./LoginButton";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [verificationType, setVerificationType] = useState(null); // "EMAIL" o "2FA"
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3002/api/v1/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requiresVerification) {
          // ✅ Primera fase: requiere verificación
          setRequiresVerification(true);
          setVerificationType(data.verificationType);

          Swal.fire({
            icon: "info",
            title: "Verificación requerida",
            text: data.message,
            confirmButtonColor: "#007bff",
          });
          
        } else {
          // ✅ Segunda fase: login exitoso
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.user.role);
          localStorage.setItem("fullname", data.user.fullname);

          Swal.fire({
            icon: "success",
            title: "Bienvenido!",
            text: "Login exitoso ✅",
            confirmButtonColor: "#007bff",
          });

          const role = data.user.role;
          if (role === "ADMIN") navigate("/DashboardAdmin");
          if (role === "MEDICO") navigate("/DashboardMedico");
          if (role === "PACIENTE") navigate("/DashboardPaciente");
          if (role === "ENFERMERO") navigate("/DashboardEnfermero");
        }
      } else {
        // Error en login
        if (data.requiresVerification) {
          setRequiresVerification(true);
          setVerificationType(data.verificationType);
        }
        setError(data.message || "Credenciales inválidas");
      }
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-panel">
        {/* Panel izquierdo */}
        <div className="left-panel">
          <div className="text-container">
            <h1 className="welcome-title">¡BIENVENIDOS!</h1>
            <p className="subtitle">
              Por favor ingresa tus datos para continuar
            </p>
          </div>
          <div className="image-container">
            <img src={doctor} alt="Doctor" className="doctor-img" />
          </div>
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
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={requiresVerification}
              />
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
