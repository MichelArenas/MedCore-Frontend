import { useState } from "react";
import "./RegisterUser.css";
import { userService } from "../utils/userService";

export default function RegisterUser() {
  // Campos básicos
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // rol dinámico
  const [specialtyId, setSpecialtyId] = useState(""); // solo para médicos

  // Campos obligatorios según schema
  const [idNumber, setIdNumber] = useState("");
  const [idType, setIdType] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // Campos opcionales
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [bloodType, setBloodType] = useState("");

  // Contacto de emergencia
  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    phone: "",
    relationship: ""
  });

  // Mensajes
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  // Secciones del formulario
  const [activeSection, setActiveSection] = useState("basic");

  // Especialidades para médicos
  const specialties = [
    { id: "68f7fc6e37b1c8126c29e845", name: "Cardiología" },
    { id: "68f7fcb537b1c8126c29e846", name: "Cirujano General" },
    { id: "68f7fcda37b1c8126c29e847", name: "Dermatología" },
    { id: "68f7fcef37b1c8126c29e848", name: "Ginecólogo / Obstetra" },
    { id: "68f7fd1e37b1c8126c29e849", name: "Neumólogo" },
    { id: "68f7fd3437b1c8126c29e84a", name: "Oftalmólogo" },
    { id: "68f7fd4c37b1c8126c29e84b", name: "Pediatra" },
    { id: "68f7fd6237b1c8126c29e84c", name: "Psiquiatra" },
    { id: "68f7fd7b37b1c8126c29e84d", name: "Traumatólogo / Ortopedista" },
    { id: "68f7fda137b1c8126c29e84e", name: "Urólogo" }
  ];

  const handleEmergencyContactChange = (field, value) => {
    setEmergencyContact(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!fullname || !email || !password || !role || !idNumber || !idType || !dateOfBirth) {
      setMessage("Por favor complete todos los campos obligatorios");
      setMessageType("error");
      return;
    }

    // Si es médico, validar especialidad
    if (role === "MEDICO" && !specialtyId) {
      setMessage("Debe seleccionar una especialidad para el médico");
      setMessageType("error");
      return;
    }

    // Validar fecha de nacimiento
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    if (isNaN(birthDate.getTime())) {
      setMessage("La fecha de nacimiento no es válida");
      setMessageType("error");
      return;
    }

    // Calcular edad
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 0 || age > 100) {
      setMessage("La edad debe estar entre 0 y 100 años");
      setMessageType("error");
      return;
    }

    // Crear objeto para enviar al backend
    const userData = {
      fullname,
      email,
      password,
      role,
      id_number: idNumber,
      id_type: idType,
      date_of_birth: dateOfBirth,
      age,
      gender: gender || null,
      phone: phone || null,
      address: address || null,
      city: city || null,
      blood_type: bloodType || null,
      specialtyId: role === "MEDICO" ? specialtyId : null,
      emergencyContact: (emergencyContact.name && emergencyContact.phone) ? emergencyContact : null
    };

    try {
      const result = await userService.createUser(userData);

      if (result.ok) {
        setMessage("Usuario registrado correctamente ✅");
        setMessageType("success");
        // Limpiar campos
        setFullname(""); setEmail(""); setPassword(""); setRole(""); setSpecialtyId("");
        setIdNumber(""); setIdType(""); setDateOfBirth(""); setGender(""); setPhone(""); setAddress(""); setCity(""); setBloodType("");
        setEmergencyContact({ name: "", phone: "", relationship: "" });
        setActiveSection("basic");
      } else {
        setMessage(result.data?.message || "Error al registrar usuario ❌");
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

        {/* Navegación de secciones */}
        <div className="form-navigation">
          <button type="button" className={`nav-btn ${activeSection==='basic'?'active':''}`} onClick={()=>setActiveSection('basic')}>Información Básica</button>
          <button type="button" className={`nav-btn ${activeSection==='personal'?'active':''}`} onClick={()=>setActiveSection('personal')}>Datos Personales</button>
          <button type="button" className={`nav-btn ${activeSection==='contact'?'active':''}`} onClick={()=>setActiveSection('contact')}>Contacto</button>
        </div>

        {/* Sección 1: Información básica */}
        {activeSection === 'basic' && (
          <div className="form-section">
            <label>Nombre completo *</label>
            <input type="text" value={fullname} onChange={(e)=>setFullname(e.target.value)} required />

            <label>Correo *</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />

            <label>Contraseña *</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />

            <label>Rol *</label>
            <select value={role} onChange={(e)=>setRole(e.target.value)} required>
              <option value="">Seleccione un rol</option>
              <option value="PACIENTE">Paciente</option>
              <option value="MEDICO">Médico</option>
              <option value="ENFERMERO">Enfermero</option>
              {localStorage.getItem("role")==="ADMINISTRADOR" && <option value="ADMINISTRADOR">Administrador</option>}
            </select>

            {role === "MEDICO" && (
              <>
                <label>Especialidad *</label>
                <select value={specialtyId} onChange={(e)=>setSpecialtyId(e.target.value)} required>
                  <option value="">Seleccione una especialidad</option>
                  {specialties.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </>
            )}

            <div className="navigation-buttons">
              <button type="button" className="next-btn" onClick={()=>setActiveSection('personal')}>Siguiente</button>
            </div>
          </div>
        )}

        {/* Sección 2: Datos personales */}
        {activeSection==='personal' && (
          <div className="form-section">
            <label>Tipo de identificación *</label>
            <select value={idType} onChange={(e)=>setIdType(e.target.value)} required>
              <option value="">Seleccione un tipo</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="PP">Pasaporte</option>
              <option value="NIT">NIT</option>
            </select>

            <label>Número de identificación *</label>
            <input type="text" value={idNumber} onChange={(e)=>setIdNumber(e.target.value)} required />

            <label>Fecha de nacimiento *</label>
            <input type="date" value={dateOfBirth} onChange={(e)=>setDateOfBirth(e.target.value)} required />

            <label>Género</label>
            <select value={gender} onChange={(e)=>setGender(e.target.value)}>
              <option value="">Seleccione un género</option>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMENINO">Femenino</option>
              <option value="OTRO">Otro</option>
              <option value="NO_RESPONDE">Prefiero no responder</option>
            </select>

            <label>Tipo de sangre</label>
            <select value={bloodType} onChange={(e)=>setBloodType(e.target.value)}>
              <option value="">Seleccione un tipo</option>
              <option value="O_POSITIVE">O+</option>
              <option value="O_NEGATIVE">O-</option>
              <option value="A_POSITIVE">A+</option>
              <option value="A_NEGATIVE">A-</option>
              <option value="B_POSITIVE">B+</option>
              <option value="B_NEGATIVE">B-</option>
              <option value="AB_POSITIVE">AB+</option>
              <option value="AB_NEGATIVE">AB-</option>
            </select>

            <div className="navigation-buttons">
              <button type="button" className="prev-btn" onClick={()=>setActiveSection('basic')}>Anterior</button>
              <button type="button" className="next-btn" onClick={()=>setActiveSection('contact')}>Siguiente</button>
            </div>
          </div>
        )}

        {/* Sección 3: Contacto */}
        {activeSection==='contact' && (
          <div className="form-section">
            <label>Teléfono</label>
            <input type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} />

            <label>Dirección</label>
            <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)} />

            <label>Ciudad</label>
            <input type="text" value={city} onChange={(e)=>setCity(e.target.value)} />

            <h3>Contacto de emergencia</h3>
            <label>Nombre</label>
            <input type="text" value={emergencyContact.name} onChange={(e)=>handleEmergencyContactChange('name', e.target.value)} />
            <label>Teléfono</label>
            <input type="tel" value={emergencyContact.phone} onChange={(e)=>handleEmergencyContactChange('phone', e.target.value)} />
            <label>Relación/Parentesco</label>
            <input type="text" value={emergencyContact.relationship} onChange={(e)=>handleEmergencyContactChange('relationship', e.target.value)} />

            <div className="navigation-buttons">
              <button type="button" className="prev-btn" onClick={()=>setActiveSection('personal')}>Anterior</button>
              <button type="submit" className="register-btn">Registrar Usuario</button>
            </div>
          </div>
        )}

        {message && <p className={`register-message ${messageType}`}>{message}</p>}
      </form>
    </div>
  );
}
