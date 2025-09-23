import { useState } from "react";
import "./RegisterUser.css";


function RegisterUser() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3002/api/v1/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Usuario registrado con éxito");
        setFormData({ fullname: "", email: "", password: "" });
      } else {
        setMessage(`❌ Error: ${data.message || "No se pudo registrar"}`);
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      setMessage("⚠️ Error de conexión con el servidor");
    }
  };

  return (
    <div className="register-container">
      <h2>Registrar Nuevo Usuario</h2>
      <form onSubmit={handleSubmit} className="register-form">

        <label>Nombre completo</label>
        <input
          type="text"
          name="fullname"
          placeholder="Ingrese el nombre completo"
          value={formData.fullname}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Ingrese el correo"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          placeholder="Ingrese la contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="register-btn">
          Registrar
        </button>
      </form>

      {message && <p className="register-message">{message}</p>}
    </div>
  );
}

export default RegisterUser;
