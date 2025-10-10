import { useNavigate } from "react-router-dom";
import "./DashboardAdmin.css";
import Sidebar from "./Sidebar";
import { logout } from "../utils/authUtils";

 function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Llamar al endpoint de logout
      await fetch("http://localhost:3002/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      // Proceder con el logout en frontend
      logout(); // Usar función centralizada
      navigate("/landing", { replace: true }); // redirigir al landing
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // En caso de error, eliminar token de todas formas
      logout(); // Usar función centralizada
      navigate("/landing", { replace: true });
    }
  };

  return (
    
    <div className="dashboard-container">
        <header className="dashboard-header">
        <div className="header-left">
          <Sidebar /> {/* Botón menú hamburguesa */}
        </div>
      </header>
      <h1>Bienvenido Enfermero</h1>
       <button onClick={handleLogout} className="logOut-button">
        Cerrar sesión
      </button>
    </div>
  );
}

export default Dashboard;
