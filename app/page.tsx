"use client";

import { useEffect, useState } from "react";
import "chart.js/auto";
import { Pie, Bar } from "react-chartjs-2";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analyze")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <h2>Loading...</h2>;

  const pieData = {
    labels: ["Closed", "Open", "Blocked"],
    datasets: [
      {
        data: [data.closed, data.open, data.blocked],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
      },
    ],
  };

  const barData = {
    labels: ["Total", "Closed", "Open", "Blocked"],
    datasets: [
      {
        label: "Tickets",
        data: [data.total, data.closed, data.open, data.blocked],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>🚀 Smart Release Intelligence Hub</h1>

      {/* ✅ Cards */}
      <div style={styles.cards}>
        <Card label="Total" value={data.total} color="#3b82f6" />
        <Card label="Closed" value={data.closed} color="#22c55e" />
        <Card label="Open" value={data.open} color="#f59e0b" />
        <Card label="Blocked" value={data.blocked} color="#ef4444" />
      </div>

      {/* ✅ Status */}
      <div style={styles.statusBox}>
        <h2 style={{
          color: data.status.includes("NO") ? "#ef4444" : "#22c55e"
        }}>
          {data.status}
        </h2>
        <p>{data.reason}</p>
      </div>

      {/* ✅ Charts */}
      <div style={styles.charts}>
        <div style={styles.chartBox}>
          <h3>Issue Distribution</h3>
          <Pie data={pieData} />
        </div>

        <div style={styles.chartBox}>
          <h3>Ticket Overview</h3>
          <Bar data={barData} />
        </div>
      </div>

      {/* ✅ Table */}
      <h3 style={{ marginTop: 40 }}>Ticket Data</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Key</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {[
            { key: "RH-30", status: "In Review" },
            { key: "RH-28", status: "Done" },
            { key: "RH-25", status: "Blocked" },
            { key: "RH-21", status: "In Progress" }
          ].map((t, i) => (
            <tr key={i}>
              <td>{t.key}</td>
              <td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

/* ✅ Card Component */
function Card({ label, value, color }: any) {
  return (
    <div style={{ ...styles.card, borderTop: `5px solid ${color}` }}>
      <h3>{label}</h3>
      <p style={{ fontSize: 24, fontWeight: "bold" }}>{value}</p>
    </div>
  );
}

/* ✅ Styles */
const styles: any = {
  container: {
    padding: 30,
    fontFamily: "Arial",
    background: "linear-gradient(to right, #eef2ff, #f8fafc)",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
  },
  cards: {
    display: "flex",
    gap: 20,
    justifyContent: "center",
  },
  card: {
    padding: 20,
    borderRadius: 10,
    width: 120,
    background: "white",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  statusBox: {
    textAlign: "center",
    marginTop: 30,
  },
  charts: {
    display: "flex",
    justifyContent: "center",
    gap: 50,
    marginTop: 40,
  },
  chartBox: {
    width: 350,
    background: "white",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  table: {
    width: "50%",
    margin: "20px auto",
    borderCollapse: "collapse",
    background: "white",
  },
};
