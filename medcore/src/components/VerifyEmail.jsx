import React, { useState } from "react";
import Swal from "sweetalert2";
import "./VerifyEmail.css";

function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // 🔹 Verificar cuenta
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3002/api/v1/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Cuenta verificada ✅",
          text: data.message || "Tu cuenta ha sido verificada correctamente",
          confirmButtonColor: "#007bff",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "No se pudo verificar la cuenta",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
        confirmButtonColor: "#d33",
      });
    }
  };

  // 🔹 Reenviar código
  const handleResend = async () => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Correo requerido",
        text: "Debes ingresar tu correo antes de reenviar el código",
        confirmButtonColor: "#f0ad4e",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/api/v1/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Código reenviado ✉️",
          text: data.message || "Se ha enviado un nuevo código a tu correo",
          confirmButtonColor: "#007bff",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "No se pudo reenviar el código",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="verify-container">
      <form className="verify-form" onSubmit={handleVerify}>
        <h2>Verificar Cuenta</h2>

        {/* Email */}
        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Código */}
        <label htmlFor="verificationCode">Código de verificación</label>
        <input
          id="verificationCode"
          type="text"
          placeholder="Ingresa el código recibido"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
        />

        {/* Botones */}
        <button type="submit" className="verify-btn">
          Verificar
        </button>
        <button
          type="button"
          className="verify-btn resend-btn"
          onClick={handleResend}
        >
          Reenviar código
        </button>
      </form>
    </div>
  );
}

export default VerifyEmail;
