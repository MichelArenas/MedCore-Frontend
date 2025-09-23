import { useNavigate } from "react-router-dom";
import "./DashboardAdmin.css";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Bienvenido al Dashboard</h1>
      <button className="dashboard-buttons" onClick={() => navigate("/register-user")}>
        Registrar Usuario
      </button>
    </div>
  );
}

export default Dashboard;
