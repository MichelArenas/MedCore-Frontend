import { useState } from "react";

export default function RegisterUser() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // rol dinámico

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!fullname || !email || !password || !role) {
    alert("Por favor complete todos los campos");
    return;
  }

  try {
    const response = await fetch("http://localhost:3002/api/v1/auth/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // OJO: aquí deberías pasar también el token del ADMIN logueado
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        fullname,
        email,
        password,
        role,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Usuario registrado correctamente ✅");
      setFullname("");
      setEmail("");
      setPassword("");
      setRole("");
    } else {
      alert(data.message || "Error al registrar usuario ❌");
    }
  } catch (error) {
    console.error(error);
    alert("Error al conectar con el servidor");
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-[350px] p-4 border rounded-lg shadow"
    >
      <h2 className="text-lg font-semibold">Registrar Usuario</h2>

      <input
        type="text"
        placeholder="Nombre completo"
        value={fullname}
        onChange={(e) => setFullname(e.target.value)}
        className="border rounded p-2"
      />

      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded p-2"
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded p-2"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border rounded p-2"
      >
        <option value="">Seleccione un rol</option>
        <option value="PACIENTE">Paciente</option>
        <option value="MEDICO">Médico</option>
        <option value="ENFERMERO">Enfermero</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
      >
        Registrar
      </button>
    </form>
  );
}
