import { useNavigate } from "react-router-dom";
import "./DashboardAdmin.css";

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
      navigate("/login", { replace: true }); // redirigir al login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // En caso de error, eliminar token de todas formas
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  return (
    
    <div className="dashboard-container">
      <h1>Bienvenido al Dashboard</h1>
      
      <div className="button-group">
        <button className="register-button" onClick={() => navigate("/register-user")}>
          Registrar Usuario
        </button>
        <button className="register-button" onClick={() => navigate("/bulk-import")}>
          Carga de Datos Masiva .CSV
        </button>
        <button onClick={handleLogout} className="logOut-button">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
