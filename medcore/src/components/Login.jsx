import "./Login.css";
import logo from "../assets/logo.png";
import doctor from "../assets/doctor.png";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "../App.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
   const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3002/api/v1/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Aquí puedes guardar el token en localStorage si lo envía el backend
        localStorage.setItem("token", data.token);

        // Redirige al dashboard
        navigate("/dashboard");
      } else {
        setError(data.message || "Credenciales inválidas");
      }
    } catch (err) {
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
          <p className="subtitle">Por favor ingresa tus datos para continuar</p>
        </div>
        <div className="image-container">
          <img src={doctor} alt="Doctor" className="doctor-img" />
        </div>
      </div>

      {/* Panel derecho */}
      <div className="right-panel">
        <img src={logo} alt="MedCore Logo" className="logo" />

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* <div className="checkbox">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Recordarme</label>
          </div>*/}

          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>

        {/* Mostrar error si existe */}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  </div>
);

}

export default Login;
