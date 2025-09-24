import { useNavigate } from "react-router-dom";
import "./DashboardAdmin.css";

 function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // eliminar token
    navigate("/login", { replace: true }); // redirigir al login
  };

  return (
    
    <div className="dashboard-container">
      <h1>Bienvenido al Dashboard</h1>
      
      <div className="button-group">
        <button className="register-button" onClick={() => navigate("/register-user")}>
          Registrar Usuario
        </button>
        <button onClick={handleLogout} className="logOut-button">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
