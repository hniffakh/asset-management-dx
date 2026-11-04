
import React, { useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useNavigate } from "react-router-dom";

// --- DUMMY DATA ---
const pieData = [
  { name: "Mini PC", value: 400 },
  { name: "Scanner", value: 300 },
  { name: "Monitor", value: 300 },
  { name: "Printer", value: 200 },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
];

const barData = [
  {
    name: "Line A",
    dipakai: 40,
    rusak: 24,
    tersedia: 24,
  },
  {
    name: "Line B",
    dipakai: 30,
    rusak: 13,
    tersedia: 22,
  },
  {
    name: "Line C",
    dipakai: 20,
    rusak: 8,
    tersedia: 29,
  },
];

const deviceDetails = [
  {
    id: "DEV-001",
    category: "Mini PC",
    spec: "T4 Pro",
    location: "Line A",
    status: "Dipakai",
  },
  {
    id: "DEV-002",
    category: "Scanner",
    spec: "Zebra DS2208",
    location: "Line B",
    status: "Tersedia",
  },
  {
    id: "DEV-003",
    category: "Monitor",
    spec: "Dell 24 Inch",
    location: "Line A",
    status: "Rusak",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  // State untuk masing-masing menu
  const [isMasterOpen, setIsMasterOpen] = useState(true);
  const [isPeminjamanOpen, setIsPeminjamanOpen] =
    useState(true);

  // --- LOGOUT ---
  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");

    navigate("/login", { replace: true });
  };

  // --- NAVIGASI MENU ---
  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "sans-serif",
        backgroundColor: "#f3f4f6",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: "250px",
          minWidth: "250px",
          backgroundColor: "#1f2937",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* LOGO */}
        <h2
          style={{
            marginBottom: "30px",
            fontSize: "20px",
            borderBottom: "1px solid #374151",
            paddingBottom: "10px",
          }}
        >
          DX AMS
        </h2>

        {/* MENU */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* DASHBOARD */}
          <div
            onClick={handleDashboard}
            style={{
              padding: "10px",
              backgroundColor: "#374151",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Dashboard
          </div>

          {/* MASTER DATA */}
          <div>
            <div
              onClick={() =>
                setIsMasterOpen(!isMasterOpen)
              }
              style={{
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Master Data</span>

              <span>
                {isMasterOpen ? "▼" : "▶"}
              </span>
            </div>

            {isMasterOpen && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "15px",
                  marginTop: "5px",
                  gap: "5px",
                  fontSize: "14px",
                  color: "#9ca3af",
                }}
              >
                <span onClick={() => navigate("/category")}
                style={{
                  cursor: "pointer",
                  padding: "5px",
                }}>
                Category
              </span>

                <span style={{ cursor: "pointer", padding: "5px" }}>
                  Device
                </span>

                <span style={{ cursor: "pointer", padding: "5px" }}>
                  Spec
                </span>

                <span style={{ cursor: "pointer", padding: "5px" }}>
                  Harga
                </span>

                <span style={{ cursor: "pointer", padding: "5px" }}>
                  Opoq
                </span>

                <span style={{ cursor: "pointer", padding: "5px" }}>
                  Location
                </span>
              </div>
            )}
          </div>

          {/* PEMINJAMAN ASET */}
          <div>
            <div
              onClick={() =>
                setIsPeminjamanOpen(!isPeminjamanOpen)
              }
              style={{
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Peminjaman Aset</span>

              <span>
                {isPeminjamanOpen ? "▼" : "▶"}
              </span>
            </div>

            {isPeminjamanOpen && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "15px",
                  marginTop: "5px",
                  gap: "5px",
                  fontSize: "14px",
                  color: "#9ca3af",
                }}
              >
                <span style={{ cursor: "pointer", padding: "5px" }}>
                  Replacement Request
                </span>

                <span style={{ cursor: "pointer", padding: "5px" }}>
                  Asset History
                </span>
              </div>
            )}
          </div>
        </div>

        {/* LOGOUT */}
        <div style={{ marginTop: "auto" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <h1
          style={{
            color: "#111827",
            marginBottom: "20px",
          }}
        >
          Dashboard Overview
        </h1>

        {/* CHART SECTION */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          {/* PIE CHART */}
          <div
            style={{
              flex: 1,
              minWidth: "300px",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "10px",
                color: "#4b5563",
              }}
            >
              Distribusi Kategori Device
            </h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[index % COLORS.length]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* BAR CHART */}
          <div
            style={{
              flex: 1,
              minWidth: "300px",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "10px",
                color: "#4b5563",
              }}
            >
              Status Device per Lokasi
            </h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="dipakai"
                  name="Dipakai"
                  fill="#8884d8"
                />

                <Bar
                  dataKey="tersedia"
                  name="Tersedia"
                  fill="#82ca9d"
                />

                <Bar
                  dataKey="rusak"
                  name="Rusak"
                  fill="#ff4d4f"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DEVICE TABLE */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            overflowX: "auto",
          }}
        >
          <h3
            style={{
              color: "#4b5563",
              marginBottom: "15px",
            }}
          >
            Detail Informasi Device Terbaru
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f3f4f6",
                  borderBottom: "2px solid #e5e7eb",
                }}
              >
                <th style={{ padding: "12px" }}>
                  ID Asset
                </th>

                <th style={{ padding: "12px" }}>
                  Kategori
                </th>

                <th style={{ padding: "12px" }}>
                  Spesifikasi
                </th>

                <th style={{ padding: "12px" }}>
                  Lokasi
                </th>

                <th style={{ padding: "12px" }}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {deviceDetails.map((device) => (
                <tr
                  key={device.id}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <td style={{ padding: "12px" }}>
                    {device.id}
                  </td>

                  <td style={{ padding: "12px" }}>
                    {device.category}
                  </td>

                  <td style={{ padding: "12px" }}>
                    {device.spec}
                  </td>

                  <td style={{ padding: "12px" }}>
                    {device.location}
                  </td>

                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        color: "white",

                        backgroundColor:
                          device.status === "Dipakai"
                            ? "#8884d8"
                            : device.status === "Tersedia"
                            ? "#82ca9d"
                            : "#ff4d4f",
                      }}
                    >
                      {device.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
