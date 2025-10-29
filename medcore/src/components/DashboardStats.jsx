import React from "react";
import "./DashboardStats.css";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const DashboardStats = () => {
  // Datos ficticios para la tendencia de citas
  const citasData = [
    { name: "Lun", citas: 12 },
    { name: "Mar", citas: 19 },
    { name: "Mié", citas: 9 },
    { name: "Jue", citas: 15 },
    { name: "Vie", citas: 10 },
    { name: "Sáb", citas: 17 },
    { name: "Dom", citas: 23 },
  ];

  // Datos ficticios para el estado de camas
  const ocupacion = 72; // Porcentaje ocupado
  const camasData = [
    { name: "Ocupadas", value: ocupacion },
    { name: "Disponibles", value: 100 - ocupacion },
  ];
  const COLORS = ["#e74c3c", "#2ecc71"];

  return (
    <div className="dashboard-charts" style={{
      display: "flex",
      gap: "20px",
      marginTop: "30px",
      justifyContent: "space-between"
    }}>
      {/* Gráfico de tendencia de citas */}
      <div className="chart-card" style={{
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{ marginBottom: "15px" }}>Tendencia de Citas (Últimos 7 Días)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={citasData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="citas" stroke="#007bff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de ocupación de camas */}
      <div className="chart-card" style={{
        width: "300px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        <h3>Estado de Ocupación de Camas</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={camasData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={180}
              endAngle={0}
              dataKey="value"
            >
              {camasData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>{ocupacion}%</div>
        <p style={{ color: "#555" }}>Ocupadas</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", fontSize: "12px" }}>
          <span style={{ color: "#e74c3c" }}>● Ocupadas</span>
          <span style={{ color: "#2ecc71" }}>● Disponibles</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
