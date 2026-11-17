import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";

// DUMMY DATA
const pieData = [
  { name: "Mini PC", value: 400 },
  { name: "Scanner", value: 300 },
  { name: "Monitor", value: 300 },
  { name: "Printer", value: 200 },
];

const COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
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

// HELPER
function getStatusBadge(status) {
  switch (status) {
    case "Dipakai":
      return "badge-info";

    case "Tersedia":
      return "badge-success";

    case "Rusak":
      return "badge-danger";

    default:
      return "badge-neutral";
  }
}

// DASHBOARD PAGE
export default function DashboardPage() {
  return (
    <div className="page-wrapper dashboard-page">
      <div className="page-container">
        {/* PAGE HEADER */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Dashboard Overview
            </h1>

            <p className="page-description">
              Ringkasan informasi dan kondisi aset DX AMS.
            </p>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="dashboard-chart-grid">
          {/* PIE CHART */}
          <section className="card dashboard-chart-card">
            <div className="card-header">
              <div>
                <h2 className="card-title">
                  Distribusi Kategori Device
                </h2>

                <p className="card-description">
                  Distribusi device berdasarkan kategori.
                </p>
              </div>
            </div>

            <div className="dashboard-chart">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow:
                        "0 4px 12px rgba(15, 23, 42, 0.08)",
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* BAR CHART */}
          <section className="card dashboard-chart-card">
            <div className="card-header">
              <div>
                <h2 className="card-title">
                  Status Device per Lokasi
                </h2>

                <p className="card-description">
                  Perbandingan status device di setiap line.
                </p>
              </div>
            </div>

            <div className="dashboard-chart">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={barData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 5,
                  }}
                  barGap={6}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#6b7280",
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#6b7280",
                      fontSize: 12,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow:
                        "0 4px 12px rgba(15, 23, 42, 0.08)",
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                  />

                  <Bar
                    dataKey="dipakai"
                    name="Dipakai"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="tersedia"
                    name="Tersedia"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="rusak"
                    name="Rusak"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* DEVICE TABLE */}
        <section className="card dashboard-table-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">
                Detail Informasi Device Terbaru
              </h2>

              <p className="card-description">
                Daftar contoh device dan status terakhirnya.
              </p>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID Asset</th>
                  <th>Kategori</th>
                  <th>Spesifikasi</th>
                  <th>Lokasi</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {deviceDetails.map((device) => (
                  <tr key={device.id}>
                    <td>
                      <span className="dashboard-asset-id">
                        {device.id}
                      </span>
                    </td>

                    <td>{device.category}</td>

                    <td>{device.spec}</td>

                    <td>{device.location}</td>

                    <td>
                      <span
                        className={`badge ${getStatusBadge(
                          device.status
                        )}`}
                      >
                        {device.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
