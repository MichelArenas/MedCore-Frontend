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
      <h1>Bienvenido Enfermero</h1>
       <button onClick={handleLogout} className="logOut-button">
        Cerrar sesión
      </button>
    </div>
  );
}

export default Dashboard;
