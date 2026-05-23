"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analyze")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <main style={{ padding: 40 }}>
      <h1>🛏️ Mattress Release Dashboard</h1>

      <p>Total Tickets: {data.total}</p>
      <p>Closed Tickets: {data.closed}</p>
      <p>Open Tickets: {data.open}</p>
      <p>Blocked Tickets: {data.blocked}</p>

      <h2>Status: {data.status}</h2>
      <p>{data.reason}</p>
    </main>
  );
}
