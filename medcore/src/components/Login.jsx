import React from "react";
import "./Login.css";
import logo from "../assets/logo.png";
import doctor from "../assets/doctor.png";

function Login() {
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
       
          
          <form className="login-form">
            <label>Email</label>
            <input type="email" placeholder="Ingresa tu email" />

            <label>Password</label>
            <input type="password" placeholder="Ingresa tu contraseña" />

            <div className="checkbox">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Recordarme</label>
            </div>

            <button type="submit">Ingresar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
