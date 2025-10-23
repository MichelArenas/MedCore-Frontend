import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    gender: ""
  });

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

  // 🔹 Obtener datos del usuario por ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/users/${id}`);
        setUser(res.data);
        setFormData({
          fullname: res.data.fullname,
          email: res.data.email,
          phone: res.data.phone,
          address: res.data.address,
          city: res.data.city,
          gender: res.data.gender
        });
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo cargar la información del usuario", "error");
      }
    };
    fetchUser();
  }, [id]);

  // 🔹 Manejo de cambios
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        user.role.toUpperCase() === "MEDICO"
          ? `${API_BASE_URL}/api/v1/doctors/${id}`
          : `${API_BASE_URL}/api/v1/nurses/${id}`;

      await axios.put(endpoint, formData);
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "Usuario actualizado exitosamente",
        confirmButtonColor: "#3085d6",
      });
      navigate("/admin/lista-usuarios");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.response?.data?.message || "Error al actualizar", "error");
    }
  };

  if (!user) return <div className="text-center py-10">Cargando...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
          Editar {user.role.toLowerCase()}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullname"
            placeholder="Nombre completo"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            name="phone"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            name="address"
            placeholder="Dirección"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            name="city"
            placeholder="Ciudad"
            value={formData.city}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="">Seleccionar género</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Guardar cambios
          </button>
        </form>

        <button
          onClick={() => navigate("/admin/lista-usuarios")}
          className="w-full mt-3 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default EditUser;
