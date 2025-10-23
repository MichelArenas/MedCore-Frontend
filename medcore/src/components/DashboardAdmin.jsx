import { useNavigate } from "react-router-dom"
import "./DashboardAdmin.css"
import Sidebar from "../components/Sidebar"
import { logout } from "../utils/authUtils"

function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")

      // Llamar al endpoint de logout
      await fetch("http://localhost:3002/api/v1/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      // Proceder con el logout en frontend
      logout() // Usar función centralizada
      navigate("/landing", { replace: true })
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      // En caso de error, limpiar de todas formas
      logout() // Usar función centralizada
      navigate("/landing", { replace: true })
    }
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar siempre visible */}

      <header className="dashboard-header">
        <div className="header-left">
          <Sidebar /> {/* Botón menú hamburguesa */}
        </div>
      </header>

      <div className="dashboard-content">
        <h1>Bienvenido Administrador</h1>
<div className="cards-container">
  {/* Tarjeta de doctores */}
  <div
    className="card card-doctors"
    onClick={() => navigate("/DashboardDoctorsList")}
  >
    <h2>Doctores</h2>
  </div>

  {/* Tarjeta de enfermeros */}
  <div
    className="card card-nurses"
    onClick={() => navigate("/DashboardNursesList")}
  >
    <h2>Enfermeros</h2>
  </div>


  {/* Tarjeta de pacientes */}
  <div
    className="card card-pacientes"
    onClick={() => navigate("/DashboardPatientsList")}
  >
    <h2>Pacientes</h2>
  </div>
</div>

       <div className="button-group">
  <button
    className="card-button"
    onClick={() => navigate("/register-user")}
  >
    Registrar Usuario
  </button>

  <button
    className="card-button"
    onClick={() => navigate("/bulk-import")}
  >
    Carga de Datos Masiva .CSV
  </button>

</div>

          <button onClick={handleLogout} className="logOut-button">
            Cerrar sesión
          </button>
        </div>
      </div>
    
  )
}

export default Dashboard
