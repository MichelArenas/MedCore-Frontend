import React, { useState, useEffect } from "react";

function LoginButton({ requiresVerification, verificationType }) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    // Revisar si ya estaba bloqueado antes (localStorage)
    const blockedUntil = localStorage.getItem("blockedUntil");
    if (blockedUntil) {
      const now = Date.now();
      if (now < blockedUntil) {
        setIsDisabled(true);
        setRemainingTime(Math.floor((blockedUntil - now) / 1000));
      } else {
        localStorage.removeItem("blockedUntil");
      }
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isDisabled && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setIsDisabled(false);
            localStorage.removeItem("blockedUntil");
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isDisabled, remainingTime]);

  const handleClick = () => {
    if (!isDisabled) {
      // Bloquear por 15 minutos
      const blockDuration = 15 * 60 * 1000; // 15 min en ms
      const blockedUntil = Date.now() + blockDuration;
      localStorage.setItem("blockedUntil", blockedUntil);
      setIsDisabled(true);
      setRemainingTime(blockDuration / 1000);

      // Aquí pones tu lógica de login o de verificación
      console.log("Procesando login...");
    }
  };

  return (
    <button
      type="submit"
      className="login-button"
      onClick={handleClick}
      disabled={isDisabled}
    >
      {isDisabled
        ? `Espera ${Math.floor(remainingTime / 60)}:${
            remainingTime % 60 < 10 ? "0" : ""
          }${remainingTime % 60}`
        : requiresVerification
        ? "Verificar Código"
        : "Ingresar"}
    </button>
  );
}

export default LoginButton;
