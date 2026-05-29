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
    datasets: [{
      data: [data.closed, data.open, data.blocked],
      backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
    }],
  };

  const barData = {
    labels: ["Total", "Closed", "Open", "Blocked"],
    datasets: [{
      label: "Tickets",
      data: [data.total, data.closed, data.open, data.blocked],
      backgroundColor: "#3b82f6",
    }],
  };

  return (
    <main className="container">

      <h1 className="title">🚀 Release Intelligence Dashboard</h1>

      {/* KPI Section */}
      <div className="grid kpi">
        <KPI label="Total Tickets" value={data.total} />
        <KPI label="Closed" value={data.closed} />
        <KPI label="Open" value={data.open} />
        <KPI label="Blocked" value={data.blocked} />
      </div>

      {/* Status */}
      <div className="status">
        <h2 className={data.status.includes("NO") ? "no" : "yes"}>
          {data.status}
        </h2>
        <p>{data.reason}</p>
      </div>

      {/* Charts */}
      <div className="grid charts">
        <div className="card">
          <h3>Issue Distribution</h3>
          <Pie data={pieData} />
        </div>

        <div className="card">
          <h3>Tickets Overview</h3>
          <Bar data={barData} />
        </div>
      </div>

      {/* Table */}
      <div className="card tableCard">
        <h3>Ticket Details</h3>
        <table>
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
      </div>

    </main>
  );
}

/* KPI Component */
function KPI({ label, value }: any) {
  return (
    <div className="kpiCard">
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  );
}
