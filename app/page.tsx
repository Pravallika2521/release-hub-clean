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

  if (!data) return <h2 style={{textAlign:"center"}}>Loading...</h2>;

  const pieData = {
    labels: ["Closed", "Open", "Blocked"],
    datasets: [{
      data: [data.closed, data.open, data.blocked],
      backgroundColor: ["green", "orange", "red"],
    }]
  };

  return (
    <div style={styles.container}>

      {/* TITLE */}
      <h1 style={styles.title}>🚀 Release Intelligence Dashboard</h1>

      {/* METRICS */}
      <div style={styles.metrics}>
        <Metric label="Total" value={data.total} />
        <Metric label="Closed" value={data.closed} />
        <Metric label="Open" value={data.open} />
        <Metric label="Blocked" value={data.blocked} />
      </div>

      {/* STATUS */}
      <h2 style={{
        textAlign: "center",
        color: data.status.includes("NO") ? "red" : "green"
      }}>
        {data.status}
      </h2>

      {/* CHART */}
      <div style={styles.chartBox}>
        <Pie data={pieData} />
      </div>

      {/* TABLE */}
      <h3 style={{marginTop:30}}>Ticket Details</h3>

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
          ].map((t,i)=>(
            <tr key={i}>
              <td>{t.key}</td>
              <td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

/* ✅ Metric Card */
function Metric({label,value}:any){
  return (
    <div style={styles.card}>
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  )
}

/* ✅ Styles */

const styles:any = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: 20,
    fontFamily: "Arial"
  },
  title: {
    textAlign: "center",
    marginBottom: 20
  },
  metrics: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20
  },
  card: {
    flex: 1,
    margin: 5,
    padding: 15,
    border: "1px solid #ddd",
    borderRadius: 8,
    textAlign: "center",
    background: "#f9f9f9"
  },
  chartBox: {
    width: 300,
    margin: "20px auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  }
};
