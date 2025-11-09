import React, { useState, useEffect } from "react";
import "./PerfilPaciente.css";

function PerfilPaciente() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("/default-avatar.png");
  const [isLoading, setIsLoading] = useState(false);

  const DEFAULT_IMAGE = "http://localhost:3003/uploads/profile-pictures/default-avatar.png";

  // --- Cargar imagen persistente del usuario ---
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setPreview(`${savedImage}?v=${Date.now()}`);
    } else {
      setPreview(DEFAULT_IMAGE);
    }
  }, []);

  // --- Manejo de cambio de imagen ---
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5MB.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile)); // Vista previa inmediata
  };

  // --- Subir imagen al backend ---
  const handleUpload = async () => {
    if (!file) {
      alert("Por favor selecciona una imagen primero.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("profileImage", file);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3003/api/v1/users/profile-image", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Imagen actualizada correctamente");
        localStorage.setItem("profileImage", data.profileImage);
        setPreview(`${data.profileImage}?v=${Date.now()}`);
      } else {
        alert(`⚠️ Error: ${data.message || data.error}`);
      }
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
      setFile(null);
    }
  };

  // --- Borrar foto (volver a la imagen por defecto) ---
  const handleDeletePhoto = () => {
    if (window.confirm("¿Deseas eliminar tu foto de perfil?")) {
      localStorage.setItem("profileImage", DEFAULT_IMAGE);
      setPreview(`${DEFAULT_IMAGE}?v=${Date.now()}`);
      setFile(null);
    }
  };

  return (
    <div className="perfil-container">
      <h2 className="perfil-title">Mi Perfil</h2>

      <div className="perfil-card">
        <div className="perfil-foto-section">
          <div className="foto-wrapper">
            <img
              src={preview || DEFAULT_IMAGE}
              alt="Foto de perfil"
              className="perfil-foto"
              onError={(e) => (e.target.src = DEFAULT_IMAGE)}
            />
          </div>

          <div className="perfil-actions">
            <label htmlFor="fileInput" className="btn btn-secondary">
              📷 Seleccionar imagen
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoading}
              style={{ display: "none" }}
            />

            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={!file || isLoading}
            >
              {isLoading ? "Subiendo..." : "💾 Guardar"}
            </button>

            <button
              className="btn btn-danger"
              onClick={handleDeletePhoto}
              disabled={isLoading}
            >
              🗑️ Borrar foto
            </button>
          </div>

          {file && (
            <p className="file-info">
              Imagen seleccionada: <strong>{file.name}</strong> (
              {(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PerfilPaciente;
