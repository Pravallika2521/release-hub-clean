"use client";

import { useEffect, useState } from "react";
import "chart.js/auto";
import { Pie } from "react-chartjs-2";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analyze")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <h2>Loading...</h2>;

  const total = data.total || 1;

  const percentClosed = Math.round((data.closed / total) * 100);
  const percentOpen = Math.round((data.open / total) * 100);
  const percentBlocked = Math.round((data.blocked / total) * 100);

  const pieData = {
    labels: ["Closed", "Open", "Blocked"],
    datasets: [
      {
        data: [percentClosed, percentOpen, percentBlocked],
        backgroundColor: ["green", "orange", "red"],
      },
    ],
  };

  return (
    <div style={styles.container}>

      <h1>🚀 Smart Release Dashboard</h1>

      {/* ✅ KPI CARDS */}
      <div style={styles.metrics}>
        <Card label="Total Tickets" value={data.total} />
        <Card label="Closed %" value={percentClosed + "%"} />
        <Card label="Open %" value={percentOpen + "%"} />
        <Card label="Blocked %" value={percentBlocked + "%"} />
      </div>

      {/* ✅ GO/NO‑GO STATUS */}
      <div style={styles.status}>
        <h2 style={{ color: data.status.includes("NO") ? "red" : "green" }}>
          {data.status}
        </h2>
        <p>{data.reason}</p>
      </div>

      {/* ✅ CHART */}
      <div style={styles.chart}>
        <Pie data={pieData} />
      </div>

