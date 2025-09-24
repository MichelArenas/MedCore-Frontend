import { useState } from "react";
import "./RegisterUser.css"; 

export default function RegisterUser() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // rol dinámico
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(""); // "success" o "error"

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullname || !email || !password || !role) {
      setMessage("Por favor complete todos los campos");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/api/v1/auth/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ fullname, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Usuario registrado correctamente ✅");
        setMessageType("success");
        setFullname("");
        setEmail("");
        setPassword("");
        setRole("");

      } else {
        setMessage(data.message || "Error al registrar usuario ❌");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error al conectar con el servidor");
      setMessageType("error");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Registrar Usuario</h2>

        <label>Nombre completo</label>
        <input
          type="text"
          placeholder="Nombre completo"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
 
        <label>Correo</label>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Contraseña</label>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Rol</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Seleccione un rol</option>
          <option value="PACIENTE">Paciente</option>
          <option value="MEDICO">Médico</option>
          <option value="ENFERMERO">Enfermero</option>
        </select>

        <button type="submit" className="register-btn">
          Registrar
        </button>

        {message && (
          <p className={`register-message ${messageType}`}>
            {message}
          </p>
        )}
      </form>
       {message && (
      <div className={`alert ${messageType}`}>
        {message}
      </div>
    )}
    </div>
  );
}
