"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/analyze")
      .then((res) => res.json())
      .then(setData);

    fetch("/api/sync/jira")
      .then((res) => res.json())
      .then(() => {
        fetch("/api/analyze")
          .then((res) => res.json())
          .then(setData);
      });
  }, []);

  if (!data) return <p>Loading...</p>;

  // ✅ Pie Chart
  const pieData = {
    labels: ["Closed", "Open", "Blocked"],
    datasets: [
      {
        data: [data.closed, data.open, data.blocked],
        backgroundColor: ["green", "orange", "red"],
      },
    ],
  };

  // ✅ Bar Chart
  const barData = {
    labels: ["Total", "Closed", "Open", "Blocked"],
    datasets: [
      {
        label: "Tickets",
        data: [data.total, data.closed, data.open, data.blocked],
        backgroundColor: "blue",
      },
    ],
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>🚀 Smart Release Intelligence Hub</h1>

      {/* ✅ Metrics */}
      <div style={{ display: "flex", gap: 20 }}>
        <div>Total: {data.total}</div>
        <div>Closed: {data.closed}</div>
        <div>Open: {data.open}</div>
        <div>Blocked: {data.blocked}</div>
      </div>

      {/* ✅ Status */}
      <h2 style={{ color: data.status.includes("NO") ? "red" : "green" }}>
        {data.status}
      </h2>
      <p>{data.reason}</p>

      {/* ✅ Charts */}
      <div style={{ display: "flex", gap: 50, marginTop: 40 }}>
        <div style={{ width: 300 }}>
          <h3>Pie Chart</h3>
          <Pie data={pieData} />
        </div>

        <div style={{ width: 400 }}>
          <h3>Bar Chart</h3>
          <Bar data={barData} />
        </div>
      </div>

      {/* ✅ Table */}
      <h3 style={{ marginTop: 40 }}>Ticket Table</h3>
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Key</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {[
            { key: "RH-1", status: "Done" },
            { key: "RH-2", status: "Done" },
            { key: "RH-3", status: "In Progress" },
            { key: "RH-4", status: "Blocked" },
          ].map((t, i) => (
            <tr key={i}>
              <td>{t.key}</td>
              <td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ HIGH LEVEL FLOW (ARCHITECTURE VIEW) */}
      <h3 style={{ marginTop: 50 }}>Architecture Flow</h3>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={box}>Jira Data</div>
        ➡️
        <div style={box}>APIs (Next.js)</div>
        ➡️
        <div style={box}>MongoDB</div>
        ➡️
        <div style={box}>Analysis Logic</div>
        ➡️
        <div style={box}>Dashboard</div>
      </div>
    </main>
  );
}

const box = {
  padding: 20,
  border: "1px solid black",
  borderRadius: 8,
  background: "#f5f5f5",
};
