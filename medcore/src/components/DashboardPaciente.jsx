import { useNavigate } from "react-router-dom";
import "./DashboardPaciente.css";
import Sidebar from "./Sidebar";

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
      localStorage.removeItem("token"); // eliminar token
      localStorage.removeItem("fullname");
      localStorage.removeItem("role");
      navigate("/landing", { replace: true }); // redirigir al landing
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // En caso de error, eliminar token de todas formas
      localStorage.removeItem("token");
      localStorage.removeItem("fullname");
      localStorage.removeItem("role");
      navigate("/landing", { replace: true });
    }
  };

  const fullname = localStorage.getItem("fullname");

  return (
    
    <div className="dashboard-container">
       <header className="dashboard-header">
        <div className="header-left">
          <Sidebar /> {/* Botón menú hamburguesa */}
        </div>
      </header>
      <h1>Bienvenido {fullname ? fullname : "Paciente"}</h1>
       <button onClick={handleLogout} className="logOut-button">
        Cerrar sesión
      </button>
    </div>
  );
}

export default Dashboard;
