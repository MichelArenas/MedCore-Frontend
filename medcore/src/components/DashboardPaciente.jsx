import { useNavigate } from "react-router-dom";
import "./DashboardPaciente.css";

 function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // eliminar token
    localStorage.removeItem("fullname");
    localStorage.removeItem("role");
    navigate("/login", { replace: true }); // redirigir al login
  };

  const fullname = localStorage.getItem("fullname");

  return (
    
    <div className="dashboard-container">
      <h1>Bienvenido {fullname ? fullname : "Paciente"}</h1>
       <button onClick={handleLogout} className="logOut-button">
        Cerrar sesión
      </button>
    </div>
  );
}

export default Dashboard;
